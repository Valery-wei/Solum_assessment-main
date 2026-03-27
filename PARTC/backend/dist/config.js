import dotenv from "dotenv";
import path from "node:path";
dotenv.config();
export const config = {
    port: Number(process.env.PORT || 4000),
    cmsBaseUrl: process.env.CMS_BASE_URL || "https://data.cms.gov/resource/ynj2-r877.json",
    cmsAppToken: process.env.CMS_APP_TOKEN || "",
    defaultFetchLimit: Number(process.env.CMS_FETCH_LIMIT || 50000),
    csvPath: process.env.CMS_CSV_PATH ||
        path.resolve(process.cwd(), "..", "Complications_and_Deaths-Hospital.csv"),
};
