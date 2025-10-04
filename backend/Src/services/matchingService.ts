import { MinHeap } from '../utils/priorityQueue';
import { User } from '../models/User';

type DriverInfo = { id: string; lat: number; lng: number; distance?: number };

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const toRad = (x: number) => x * Math.PI / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest K drivers to a pickup location (lat,lng)
export async function findNearestDrivers(pickupLat: number, pickupLng: number, k = 5) : Promise<DriverInfo[]> {
  // Demo approach: query drivers from DB (naive) and compute distances; in production use spatial index
  const drivers = await User.find({ role: 'driver' }).lean();
  const heap = new MinHeap<DriverInfo>((d) => d.distance || 0);
  for (const d of drivers) {
    const coords = (d.location && d.location.coordinates) || [0,0];
    const lng = coords[0];
    const lat = coords[1];
    const dist = haversineDistance(pickupLat, pickupLng, lat, lng);
    heap.push({ id: d._id.toString(), lat, lng, distance: dist });
  }
  const out: DriverInfo[] = [];
  while (out.length < k && heap.size() > 0) {
    const n = heap.pop();
    if (n) out.push(n);
  }
  return out;
}

