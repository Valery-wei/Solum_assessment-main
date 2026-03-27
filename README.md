# Solum Assessment

This repository contains three independent parts: `PARTA`, `PARTB`, and `PARTC`.  
Each part is a different type of task and can be run on its own.

---

## Repository layout

- `PARTA/` — Data analysis (BMW sales dataset)
- `PARTB/` — Algorithm problem (tree input processing)
- `PARTC/` — Full-stack app (CMS mortality analytics)

---

## PARTA (data analysis)

### Contents

- Script: `PARTA/PARTA.py`
- Data: `PARTA/bmw_global_sales_2018_2025.csv`
- Write-up: `PARTA/BMW_analysis_Answer.txt`
- Regression summaries (generated when you run the script):
  - `PARTA/units_summary.txt`
  - `PARTA/revenue_summary.txt`

### Dependencies

Python 3.10+ recommended.

```bash
pip install pandas numpy statsmodels
```

### Run

```bash
cd PARTA
python3 PARTA.py
```

---

## PARTB (algorithm)

### Contents

- Code: `PARTB/PARTB.py`
- Sample input: `PARTB/input.txt`

### Run

```bash
cd PARTB
python3 PARTB.py < input.txt
```

---

## PARTC (full stack — CMS mortality analytics)

### Contents

- Frontend: `PARTC/frontend` (React + TypeScript + Recharts)
- Backend: `PARTC/backend` (Node.js + Express + TypeScript)
- Dataset: `PARTC/Complications_and_Deaths-Hospital.csv`
- Design notes: `PARTC/Design_Notes.txt`

### Features (high level)

- Summary, table, and analysis API endpoints
- Filtering (year, month, state, multi-state, ZIP, facility name)
- Multi-state comparison vs national average
- CSV export for the current filter set
- Outlier highlighting and basic caching

### Backend

```bash
cd PARTC/backend
npm install
npm run dev
```

Default URL: `http://localhost:4000`

### Frontend

```bash
cd PARTC/frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

### Build / checks

Backend:

```bash
cd PARTC/backend
npm run build
```

Frontend:

```bash
cd PARTC/frontend
npm run typecheck
npm run build
```

---

## Notes

- The three parts are independent; you do not need to run them together.
- For PARTC API details and design decisions, see `PARTC/Design_Notes.txt`.
