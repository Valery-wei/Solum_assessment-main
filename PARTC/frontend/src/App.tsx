import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import SummaryPage from "./pages/SummaryPage";
import AnalysisPage from "./pages/AnalysisPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">CMS</h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/">Summary</Link>
            <Link to="/analysis">Analysis</Link>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<SummaryPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}