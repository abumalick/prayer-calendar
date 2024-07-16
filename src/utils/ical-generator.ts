import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";
import { format, subMonths } from "date-fns";
import Calendar from "./Calendar";

const generateEventIdCreator = (
  date: string,
  latitude: number,
  longitude: number,
  method: string,
) => {
  const hashString = `${method}${latitude}${longitude}${date}`;
  return (prayerName: string) => {
    return btoa(hashString + prayerName);
  };
};

export function isCalculationMethod(
  method: string,
): method is keyof typeof CalculationMethod {
  return method in CalculationMethod;
}

export function createPrayerTimesICal({
  name,
  latitude,
  longitude,
  calculationMethod,
  startDate = subMonths(new Date(), 1),
  daysCount = 365 + 31,
  url,
  includeMiddleOfTheNight = false,
  includeLastThirdOfTheNight = false,
}: {
  name: string;
  latitude: number;
  longitude: number;
  calculationMethod: keyof typeof CalculationMethod;
  startDate?: Date;
  daysCount?: number;
  url: string;
  includeMiddleOfTheNight?: boolean;
  includeLastThirdOfTheNight?: boolean;
}) {
  const calendar = new Calendar(
    "-//awqaate.com///Awqaat Salat Calendar 1.0//EN",
    btoa(url),
    name,
    url,
  );
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod[calculationMethod]();
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i,
    );
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const createEventId = generateEventIdCreator(
      format(date, "yyyy-MM-dd"),
      latitude,
      longitude,
      calculationMethod,
    );
    const timestamp = new Date();
    calendar.addEvent({
      uid: createEventId("Fajr"),
      summary: "Fajr",
      timestamp,
      dateStart: prayerTimes.fajr,
      durationMinutes: 30,
    });
    calendar.addEvent({
      uid: createEventId("Dhuhr"),
      summary: "Dhuhr",
      timestamp,
      dateStart: prayerTimes.dhuhr,
      durationMinutes: 30,
    });
    calendar.addEvent({
      uid: createEventId("Asr"),
      summary: "Asr",
      timestamp,
      dateStart: prayerTimes.asr,
      durationMinutes: 30,
    });
    calendar.addEvent({
      uid: createEventId("Maghrib"),
      summary: "Maghrib",
      timestamp,
      dateStart: prayerTimes.maghrib,
      durationMinutes: 30,
    });
    calendar.addEvent({
      uid: createEventId("Isha"),
      summary: "Isha",
      timestamp,
      dateStart: prayerTimes.isha,
      durationMinutes: 30,
    });
    if (includeMiddleOfTheNight || includeLastThirdOfTheNight) {
      const sunnahTimes = new SunnahTimes(prayerTimes);
      if (includeLastThirdOfTheNight)
        calendar.addEvent({
          uid: createEventId("midnight"),
          summary: "Middle of the night",
          timestamp,
          dateStart: sunnahTimes.middleOfTheNight,
          durationMinutes: 5,
        });
      if (includeLastThirdOfTheNight)
        calendar.addEvent({
          uid: createEventId("lastThird"),
          summary: "Last third of the night starts",
          timestamp,
          dateStart: sunnahTimes.lastThirdOfTheNight,
          durationMinutes: 5,
        });
    }
  }

  return calendar.toString();
}
