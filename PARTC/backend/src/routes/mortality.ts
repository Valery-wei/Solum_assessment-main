import { Router } from "express";
import { z } from "zod";
import { getAnalysis, getSummary, getTable } from "../services/mortality.service.js";

const router = Router();

const querySchema = z.object({
  year: z.coerce.number().int().optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  facilityName: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  states: z.union([z.string(), z.array(z.string())]).optional()
});

function parseStates(input: unknown): string[] | undefined {
  if (!input) return undefined;
  if (Array.isArray(input)) return input;
  return String(input).split(",").map((s) => s.trim()).filter(Boolean);
}

router.get("/summary", async (req, res, next) => {
  try {
    const q = querySchema.parse(req.query);
    const result = await getSummary({ ...q, states: parseStates(q.states) });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/table", async (req, res, next) => {
  try {
    const q = querySchema.parse(req.query);
    const result = await getTable({ ...q, states: parseStates(q.states) });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/analysis", async (req, res, next) => {
  try {
    const q = querySchema.parse(req.query);
    const result = await getAnalysis({ ...q, states: parseStates(q.states) });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;