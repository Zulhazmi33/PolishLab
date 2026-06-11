import { useEffect, useState } from "react";
import Grid from "../components/ui/Grid";
import { analyzeBudget } from "../gemini";

interface Budget_type {
    date: string;
    expense: number;
    reason: string;
}

const Budget: React.FC = () => {
    const [budget, setBudget] = useState<Budget_type[]>([]);
    const [loading, setLoading] = useState(true);

    // ai anlysis
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "https://docs.google.com/spreadsheets/d/1mVKdROPMHmgVX95vn7PDlaNf0UNWdpVTJHDzFKvizLU/gviz/tq?tqx=out:json&sheet=Budget"
                );
                const text = await res.text();
                const jsonString = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
                const data = JSON.parse(jsonString);

                const formatted = data.table.rows
                .slice(0, 5) // only first 5 rows
                .map((row: any) => ({
                    date: parseGvizDate(row.c[0]?.v),
                    expense: Number(row.c[1]?.v || 0).toFixed(2),
                    reason: String(row.c[2]?.v || ""),
                }));
                setBudget(formatted);
            } catch (err) {
                alert('❌ Quota reached')
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const total = budget.reduce((sum, row) => sum + Number(row.expense), 0);

    return (
        <Grid>
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 0", fontFamily: "var(--font-sans)" }}>

                {/* 1) Header */}
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <h2 className="text-xl font-medium text-primary m-0">Budget tracker</h2>
                    </div>
                    <p className="text-sm text-muted mb-6">
                        Expenses pulled live from Google Sheets.
                    </p>
                </div>
                {/* 2) AI advisor */}
                    <div className="bg-surface border border-border rounded-xl p-5 mb-4">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div>
                                <p className="text-sm font-medium text-primary mb-0.5">AI financial advisor</p>
                                <p className="text-xs text-muted">Get personalised spending insights for Kuala Lumpur, Malaysia.</p>
                            </div>
                            <button
                                className="flex items-center gap-2 text-sm font-medium text-primary bg-body border border-border rounded-lg px-4 py-2 cursor-pointer hover:bg-[color:var(--color-selected)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                onClick={async () => {
                                    setAiLoading(true);
                                    setAiAnalysis("");
                                    try {
                                        const result = await analyzeBudget(budget, "Kuala Lumpur, Malaysia");
                                        setAiAnalysis(result);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setAiLoading(false);
                                    }
                                }}
                                disabled={aiLoading || budget.length === 0}
                            >
                                {aiLoading ? (
                                    <>
                                        <span className="inline-block w-3.5 h-3.5 border-2 border-muted border-t-transparent rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>✦ Get advice</>
                                )}
                            </button>
                        </div>

                        {aiAnalysis && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted mb-2">Analysis</p>
                                <p className="text-sm leading-relaxed text-primary whitespace-pre-wrap">{aiAnalysis}</p>
                            </div>
                        )}
                    </div>

                {/* 3) Summary cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-body border border-border rounded-xl p-4">
                            <p className="text-xs text-muted uppercase tracking-wide mb-1">Total spent</p>
                            <p className="text-2xl font-medium text-primary">
                                RM {total.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-body border border-border rounded-xl p-4">
                            <p className="text-xs text-muted uppercase tracking-wide mb-1">Entries</p>
                            <p className="text-2xl font-medium text-primary">
                                {budget.length}
                            </p>
                        </div>
                    </div>

                {/* 4) Table */}
                    <div className="bg-surface border border-border rounded-xl overflow-hidden">

                        {/* Desktop table — hidden on small screens */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-body">
                                        <th className="text-left text-xs font-medium uppercase tracking-wide text-muted px-5 py-3">Date</th>
                                        <th className="text-left text-xs font-medium uppercase tracking-wide text-muted px-5 py-3">Reason</th>
                                        <th className="text-right text-xs font-medium uppercase tracking-wide text-muted px-5 py-3">Amount (RM)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-sm text-muted py-10 italic">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : budget.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center text-sm text-muted py-10 italic">
                                                No entries found.
                                            </td>
                                        </tr>
                                    ) : (
                                        budget.map((row, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-border last:border-0 hover:bg-selected transition-colors"
                                            >
                                                <td className="px-5 py-3 text-muted whitespace-nowrap">{row.date}</td>
                                                <td className="px-5 py-3 text-primary">{row.reason}</td>
                                                <td className="px-5 py-3 text-right font-medium text-primary tabular-nums whitespace-nowrap">
                                                    {Number(row.expense).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {!loading && budget.length > 0 && (
                                    <tfoot>
                                        <tr className="border-t-2 border-border bg-body">
                                            <td colSpan={2} className="px-5 py-3 text-sm font-medium text-muted">Total</td>
                                            <td className="px-5 py-3 text-right text-sm font-medium text-primary tabular-nums">
                                                {total.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        {/* Mobile card list — shown only on small screens */}
                        <div className="block sm:hidden divide-y divide-border">
                            {loading ? (
                                <p className="text-center text-sm text-muted py-10 italic">Loading...</p>
                            ) : budget.length === 0 ? (
                                <p className="text-center text-sm text-muted py-10 italic">No entries found.</p>
                            ) : (
                                budget.map((row, i) => (
                                    <div key={i} className="flex items-start justify-between gap-3 px-4 py-3">
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="text-sm text-primary truncate">{row.reason}</span>
                                            <span className="text-xs text-muted">{row.date}</span>
                                        </div>
                                        <span className="text-sm font-medium text-primary tabular-nums whitespace-nowrap">
                                            RM {Number(row.expense).toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            )}
                            {!loading && budget.length > 0 && (
                                <div className="flex items-center justify-between px-4 py-3 bg-primary">
                                    <span className="text-sm font-medium text-title">Total</span>
                                    <span className="text-sm font-medium text-title tabular-nums">RM {total.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                    </div>
            </div>
        </Grid>
    );
};

export default Budget;

const parseGvizDate = (val: string) => {
    if (!val) return "";
    if (typeof val === "string" && !val.startsWith("Date(")) return val;
    const match = /Date\((\d+),(\d+),(\d+)\)/.exec(val);
    if (!match) return "";
    const year = Number(match[1]);
    const month = Number(match[2]) + 1;
    const day = Number(match[3]);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};