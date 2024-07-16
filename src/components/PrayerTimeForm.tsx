import * as React from "react";

import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import useStoredState from "~/hooks/useStoredState";

interface PrayerTimeFormProps {}

const METHODS = (
  Object.keys(CalculationMethod) as Array<keyof typeof CalculationMethod>
).filter((method) => method !== "Tehran" && method !== "Other");
const FIRST_METHOD = METHODS[0];
if (!FIRST_METHOD) throw new Error("No methods found");
const roundString = (num: string) =>
  (Math.round(Number(num) * 10000) / 10000).toString();
const formatTime = (date: Date) => {
  return format(date, "HH:mm");
};

const url = window.location.href;

const PrayerTimeForm: React.FC<PrayerTimeFormProps> = () => {
  const [data, setData] = useStoredState("prayer-times-ics-form", {
    latitude: "",
    longitude: "",
    method: FIRST_METHOD,
    calendarName: "",
    includeMiddleOfTheNight: false,
    includeLastThirdOfTheNight: false,
  });

  const resultUrl = useMemo(() => {
    if (!data.latitude || !data.longitude) return "";
    const _url = new URL(url);
    if (data.calendarName) _url.searchParams.set("name", data.calendarName);
    _url.searchParams.set("latitude", roundString(data.latitude));
    _url.searchParams.set("longitude", roundString(data.longitude));
    _url.searchParams.set("method", data.method);
    if (data.includeMiddleOfTheNight) {
      _url.searchParams.set("includeMiddleOfTheNight", "1");
    }
    if (data.includeLastThirdOfTheNight) {
      _url.searchParams.set("includeLastThirdOfTheNight", "1");
    }
    _url.protocol = "https";
    _url.pathname = "/ical";
    return _url.toString();
  }, [
    data.calendarName,
    data.includeLastThirdOfTheNight,
    data.includeMiddleOfTheNight,
    data.latitude,
    data.longitude,
    data.method,
    url,
  ]);

  const handleChangeGenerator = useCallback(
    (key: keyof typeof data) =>
      (
        event:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLSelectElement>,
      ) => {
        const value =
          "checked" in event.target ? event.target.checked : event.target.value;
        setData((data) => ({
          ...data,
          [key]: value,
        }));
      },
    [setData],
  );

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData((data) => ({
          ...data,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },
      (error) => {
        console.log({ error });
        alert(error);
      },
    );
  }, [setData]);

  const { generatedPrayerTimes, generatedSunnahTime } = useMemo(() => {
    if (!data.latitude || !data.longitude)
      return { generatedPrayerTimes: null, generatedSunnahTime: null };
    const coordinates = new Coordinates(
      Number(data.latitude),
      Number(data.longitude),
    );
    const prayerTimes = new PrayerTimes(
      coordinates,
      new Date(),
      CalculationMethod[data.method](),
    );
    const sunnahTimes = new SunnahTimes(prayerTimes);
    return {
      generatedPrayerTimes: prayerTimes,
      generatedSunnahTime: sunnahTimes,
    };
  }, [data.latitude, data.longitude, data.method]);

  return (
    <>
      <div className="flex" style={{ gap: 16 }}>
        <div>
          <fieldset>
            <h3>Your location</h3>
            <label
              style={{
                display: "block",
              }}
            >
              Latitude
              <input
                type="number"
                placeholder="0.00"
                value={data.latitude}
                onChange={handleChangeGenerator("latitude")}
              />
            </label>
            <label
              style={{
                marginTop: 8,
                display: "block",
              }}
            >
              Longitude
              <input
                type="number"
                placeholder="0.00"
                value={data.longitude}
                onChange={handleChangeGenerator("longitude")}
              />
            </label>
          </fieldset>
          <button type="submit" onClick={getLocation}>
            Get your location
          </button>

          <h3>Calculation Method</h3>
          <select
            name="method"
            value={data.method}
            onChange={handleChangeGenerator("method")}
          >
            {METHODS.map((method) => {
              return (
                <option key={method} value={method}>
                  {method}
                </option>
              );
            })}
          </select>
          {/* <label
            style={{
              marginTop: 8,
              display: 'block',
            }}
          >
            Calendar name
            <input
              type="text"
              onChange={handleChangeGenerator('calendarName')}
              value={data.calendarName}
            />
          </label> */}
          <div>
            <label>
              <input
                type="checkbox"
                onChange={handleChangeGenerator("includeMiddleOfTheNight")}
                checked={data.includeMiddleOfTheNight}
              />
              <span className="checkable">Include Middle of the night</span>
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                onChange={handleChangeGenerator("includeLastThirdOfTheNight")}
                checked={data.includeLastThirdOfTheNight}
              />
              <span className="checkable">Include Last third of the night</span>
            </label>
          </div>
        </div>
        {generatedPrayerTimes ? (
          <table className="primary">
            <thead>
              <tr>
                <th>Today Prayers</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fajr</td>
                <td>{formatTime(generatedPrayerTimes.fajr)}</td>
              </tr>
              <tr>
                <td>Dhuhr</td>
                <td>{formatTime(generatedPrayerTimes.dhuhr)}</td>
              </tr>
              <tr>
                <td>Asr</td>
                <td>{formatTime(generatedPrayerTimes.asr)}</td>
              </tr>
              <tr>
                <td>Maghrib</td>
                <td>{formatTime(generatedPrayerTimes.maghrib)}</td>
              </tr>
              <tr>
                <td>Isha</td>
                <td>{formatTime(generatedPrayerTimes.isha)}</td>
              </tr>
              {!!data.includeMiddleOfTheNight && (
                <tr>
                  <td>Middle of the night</td>
                  <td>{formatTime(generatedSunnahTime.middleOfTheNight)}</td>
                </tr>
              )}
              {!!data.includeLastThirdOfTheNight && (
                <tr>
                  <td>Last third of the night</td>
                  <td>{formatTime(generatedSunnahTime.lastThirdOfTheNight)}</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div />
        )}
      </div>
      {resultUrl ? (
        <>
          <h3>
            Copy this link and add it to your third party calendars in google
            calendar
          </h3>
          <code>{resultUrl}</code>
        </>
      ) : (
        <div>Fill the form to generate the calendar url</div>
      )}
    </>
  );
};
PrayerTimeForm.displayName = "PrayerTimeForm";
export default PrayerTimeForm;
