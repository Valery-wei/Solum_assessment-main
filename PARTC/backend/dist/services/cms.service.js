import { config } from "../config.js";
import { readFile } from "node:fs/promises";
function parseCsvLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === "\"") {
            const next = line[i + 1];
            if (inQuotes && next === "\"") {
                current += "\"";
                i += 1;
            }
            else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (char === "," && !inQuotes) {
            values.push(current);
            current = "";
            continue;
        }
        current += char;
    }
    values.push(current);
    return values;
}
function toRawRow(values) {
    return {
        facility_id: values[0],
        facility_name: values[1],
        address: values[2],
        city_town: values[3],
        state: values[4],
        zip_code: values[5],
        county_parish: values[6],
        telephone_number: values[7],
        measure_id: values[8],
        measure_name: values[9],
        compared_to_national: values[10],
        denominator: values[11],
        score: values[12],
        lower_estimate: values[13],
        higher_estimate: values[14],
        start_date: values[16],
        end_date: values[17],
    };
}
async function fetchFromCsv() {
    const csv = await readFile(config.csvPath, "utf8");
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1)
        return [];
    return lines.slice(1).map((line) => toRawRow(parseCsvLine(line)));
}
export async function fetchCmsRows() {
    try {
        return await fetchFromCsv();
    }
    catch {
        // Fallback to CMS API when local CSV is unavailable.
    }
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
    const headers = {};
    if (config.cmsAppToken)
        headers["X-App-Token"] = config.cmsAppToken;
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
        throw new Error(`CMS request failed: ${res.status}`);
    }
    return (await res.json());
}
