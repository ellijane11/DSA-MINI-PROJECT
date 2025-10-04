// Simple localStorage-backed request manager for demo/demo-only sync between pages
export type RideRequest = {
    id: string;
    fromId?: string;
    fromName?: string;
    toType: "driver" | "passenger";
    type: "ride" | "parcel";
    // route key is pickup|destination|date
    route?: string;
    // detailed fields
    pickup?: string;
    destination?: string;
    date?: string;
    time?: string;
    seats?: number;
    vehicleType?: string;
    // per-request state
    status: "pending" | "accepted" | "rejected";
    joinedBy?: string[];
    ignoredBy?: string[];
    createdAt: string;
};

const STORAGE_KEY = "ride_requests_v1";

function readAll(): RideRequest[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as RideRequest[]) : [];
    } catch (e) {
        return [];
    }
}

function writeAll(list: RideRequest[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        // ignore
    }
}

export function addRequest(data: Omit<RideRequest, "id" | "status" | "createdAt">) {
    const list = readAll();
    const r: RideRequest = {
        ...data,
        id: `req_${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
    list.push(r);
    writeAll(list);
    return r;
}

export function getAllRequests() {
    return readAll();
}


export function getPendingForDrivers(routeKey?: string, viewerId?: string) {
    // routeKey is formatted pickup|destination|date; for matching we will compare pickup and date
    let desiredPickup: string | undefined;
    let desiredDate: string | undefined;
    if (routeKey) {
        const parts = routeKey.split("|");
        desiredPickup = parts[0] || undefined;
        desiredDate = parts[2] || undefined;
    }

    return readAll().filter((r) => {
        if (r.toType !== "driver") return false;
        if (r.status !== "pending") return false;
        if (desiredPickup && desiredDate) {
            if (!r.pickup || !r.date) return false;
            if (r.pickup.toLowerCase().trim() !== desiredPickup.toLowerCase().trim()) return false;
            if (r.date !== desiredDate) return false;
        }
        if (viewerId && r.fromId === viewerId) return false; // don't show your own requests
        if (viewerId && Array.isArray(r.ignoredBy) && r.ignoredBy.includes(viewerId)) return false; // viewer ignored
        return true;
    });
}

// viewerId: optional current viewer (used to exclude requests from the viewer, and to filter out ignored ones)
export function getPendingForPassengers(routeKey?: string, viewerId?: string) {
    // routeKey is formatted pickup|destination|date; for matching we will compare pickup and date
    let desiredPickup: string | undefined;
    let desiredDate: string | undefined;
    if (routeKey) {
        const parts = routeKey.split("|");
        desiredPickup = parts[0] || undefined;
        desiredDate = parts[2] || undefined;
    }

    return readAll().filter((r) => {
        if (r.toType !== "passenger") return false;
        if (r.status !== "pending") return false;
        // if route filter supplied, match by pickup and date (so stops downstream still qualify)
        if (desiredPickup && desiredDate) {
            if (!r.pickup || !r.date) return false;
            if (r.pickup.toLowerCase().trim() !== desiredPickup.toLowerCase().trim()) return false;
            if (r.date !== desiredDate) return false;
        }
        if (viewerId && r.fromId === viewerId) return false; // don't show your own requests
        if (viewerId && Array.isArray(r.ignoredBy) && r.ignoredBy.includes(viewerId)) return false; // viewer ignored
        return true;
    });
}

export function joinRequest(id: string, userId: string) {
    const list = readAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const existing = list[idx].joinedBy || [];
    if (!existing.includes(userId)) existing.push(userId);
    list[idx] = { ...list[idx], joinedBy: existing };
    writeAll(list);
    return list[idx];
}

export function ignoreRequest(id: string, userId: string) {
    const list = readAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const existing = list[idx].ignoredBy || [];
    if (!existing.includes(userId)) existing.push(userId);
    list[idx] = { ...list[idx], ignoredBy: existing };
    writeAll(list);
    return list[idx];
}

export function updateRequestStatus(id: string, status: RideRequest["status"]) {
    const list = readAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], status };
    writeAll(list);
    return list[idx];
}
