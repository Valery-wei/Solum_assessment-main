import { apiGet, buildApiUrl } from "./client";
import type { AnalysisResponse, FilterOptionsResponse, Filters, SummaryResponse, TableResponse } from "../types";

export const getSummary = (filters: Filters) => apiGet<SummaryResponse>("/mortality/summary", filters);
export const getTable = (filters: Filters) => apiGet<TableResponse>("/mortality/table", filters);
export const getAnalysis = (filters: Filters) => apiGet<AnalysisResponse>("/mortality/analysis", filters);
export const getFilterOptions = (filters: Filters) => apiGet<FilterOptionsResponse>("/mortality/options", filters);
export const getExportUrl = (filters: Filters) => buildApiUrl("/mortality/export.csv", filters);