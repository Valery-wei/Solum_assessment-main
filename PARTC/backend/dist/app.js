import cors from "cors";
import express from "express";
import mortalityRouter from "./routes/mortality.js";
export const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api/mortality", mortalityRouter);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        message: err instanceof Error ? err.message : "Internal server error"
    });
});
