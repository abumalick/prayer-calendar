import { CalculationMethod } from "adhan";
import {
  createPrayerTimesICal,
  isCalculationMethod,
} from "~/utils/ical-generator";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const latitude = Number(url.searchParams.get("latitude"));
  const longitude = Number(url.searchParams.get("longitude"));
  const method = url.searchParams.get("method");
  const name = url.searchParams.get("name") || "Prayer times";
  const includeMiddleOfTheNight =
    url.searchParams.get("includeMiddleOfTheNight") === "1";
  const includeLastThirdOfTheNight =
    url.searchParams.get("includeLastThirdOfTheNight") === "1";

  if (!latitude || !longitude)
    return new Response(
      "Missing required query params, we need latitude longitude",
      {
        status: 400,
      },
    );

  if (!method || !isCalculationMethod(method))
    return new Response(
      `Missing required query params, method should be one of ${Object.keys(
        CalculationMethod,
      ).join(", ")}`,
      {
        status: 400,
      },
    );

  const ical = createPrayerTimesICal({
    name: name,
    latitude: Number(latitude),
    longitude: Number(longitude),
    calculationMethod: method,
    url: url.href,
    includeMiddleOfTheNight,
    includeLastThirdOfTheNight,
  });

  return new Response(ical, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar",
    },
  });
};
