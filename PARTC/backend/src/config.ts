import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  cmsBaseUrl: process.env.CMS_BASE_URL || "https://data.cms.gov/resource/ynj2-r877.json",
  cmsAppToken: process.env.CMS_APP_TOKEN || "",
  defaultFetchLimit: Number(process.env.CMS_FETCH_LIMIT || 50000)
};