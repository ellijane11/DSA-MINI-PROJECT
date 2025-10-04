"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DriverJoinRideRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/driver/rides');
  }, [router]);
  return null;
}
