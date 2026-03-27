import { apiGet } from "./client";
import type { AnalysisResponse, Filters, SummaryResponse } from "../types";

export const getSummary = (filters: Filters) => apiGet<SummaryResponse>("/mortality/summary", filters);
export const getTable = (filters: Filters) => apiGet("/mortality/table", filters);
export const getAnalysis = (filters: Filters) => apiGet<AnalysisResponse>("/mortality/analysis", filters);