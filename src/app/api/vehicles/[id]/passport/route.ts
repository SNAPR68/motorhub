import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generatePassport } from "@/lib/vehicle-passport";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vehicle = await db.vehicle.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        year: true,
        km: true,
        fuel: true,
        owner: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const kmNum = vehicle.km ? Number(String(vehicle.km).replace(/\D/g, "")) : 0;

    const passport = generatePassport({
      vehicleId: vehicle.id,
      year: vehicle.year ?? 2020,
      km: kmNum,
      owner: vehicle.owner ?? "1st Owner",
      name: vehicle.name,
      fuel: vehicle.fuel ?? "Petrol",
    });

    return NextResponse.json({ passport }, { status: 200 });
  } catch (err) {
    console.error("[passport]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
