/* Autovinci — Vehicle JSON-LD Structured Data for SEO */

"use client";

import type { Vehicle } from "@/lib/types";

interface VehicleJsonLdProps {
  vehicle: Vehicle;
}

export function VehicleJsonLd({ vehicle }: VehicleJsonLdProps) {
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://autovinci.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicle.name,
    model: vehicle.name,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.km.replace(/[^0-9]/g, ""),
      unitCode: "KMT",
    },
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    vehicleEngine: {
      "@type": "EngineSpecification",
      name: vehicle.engine,
    },
    offers: {
      "@type": "Offer",
      price: vehicle.priceNumeric,
      priceCurrency: "INR",
      availability:
        vehicle.status === "available"
          ? "https://schema.org/InStock"
          : vehicle.status === "reserved"
          ? "https://schema.org/LimitedAvailability"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/showcase/${vehicle.id}`,
      seller: {
        "@type": "AutoDealer",
        name: "Autovinci",
        url: SITE_URL,
      },
    },
    image: vehicle.image,
    url: `${SITE_URL}/showcase/${vehicle.id}`,
    itemCondition: "https://schema.org/UsedCondition",
    vehicleIdentificationNumber: vehicle.id,
    numberOfForwardGears: vehicle.transmission === "Automatic" ? undefined : 5,
    driveWheelConfiguration: "FWD",
    bodyType: vehicle.category.toUpperCase(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
