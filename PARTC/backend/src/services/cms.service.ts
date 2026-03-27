import { config } from "../config.js";
import { RawCmsRow } from "../types.js";

export async function fetchCmsRows(): Promise<RawCmsRow[]> {
  const url = new URL(config.cmsBaseUrl);
  url.searchParams.set("$limit", String(config.defaultFetchLimit));
  url.searchParams.set("$select", [
    "facility_id",
    "facility_name",
    "address",
    "city_town",
    "state",
    "zip_code",
    "county_parish",
    "telephone_number",
    "measure_id",
    "measure_name",
    "compared_to_national",
    "denominator",
    "score",
    "lower_estimate",
    "higher_estimate",
    "start_date",
    "end_date"
  ].join(","));

  const headers: Record<string, string> = {};
  if (config.cmsAppToken) headers["X-App-Token"] = config.cmsAppToken;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`CMS request failed: ${res.status}`);
  }

  return (await res.json()) as RawCmsRow[];
}