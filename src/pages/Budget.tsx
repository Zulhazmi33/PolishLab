import { useEffect, useState } from "react";
import Grid from "../components/ui/Grid";
import { analyzeBudget } from "../gemini";

interface Budget_type {
    date: string;
    expense: number;
    reason: string;
}
interface Location_type {
    state: string;
    district: number;
}
const Budget: React.FC = () => {
    // ------------------------------------------ 1) general ------------------------------------------
        const [location, setLocation] = useState<Location_type[]>([]);
        const [loading, setLoading] = useState(true);
        const aiCache = new Map<string, string>(); // cache

        // ai analysis
        const [aiAnalysis, setAiAnalysis] = useState("");
        const [aiLoading, setAiLoading] = useState(false);


    // ------------------------------------------ 2) budget ------------------------------------------
        const [budget, setBudget] = useState<Budget_type[]>([]);
        const [monthlyAllowance, setMonthlyAllowance] = useState<string>('0');
        const [monthlyBudget_expected, setMonthlyBudget_expected] = useState<string>('0');
        // const [monthlyBudget_reality, setMonthlyBudget_reality] = useState<string>('0');
        
        // fetch budget
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
                    .slice(0, 10) // only first 5 rows
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
   

    // ------------------------------------------ 3) location ------------------------------------------
        const [selectedState, setSelectedState] = useState("");
        const [selectedDistrict, setSelectedDistrict] = useState("");
        const total = budget.reduce((sum, row) => sum + Number(row.expense), 0);

        // Derived values from location data
        const states = [...new Set(location.map((l) => l.state))];
        const districts = location
            .filter((l) => l.state === selectedState)
            .map((l) => l.district);

        // fetch location
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const res = await fetch(
                        "https://docs.google.com/spreadsheets/d/1mVKdROPMHmgVX95vn7PDlaNf0UNWdpVTJHDzFKvizLU/gviz/tq?tqx=out:json&sheet=Location"
                    );

                    const text = await res.text();
                    const jsonString = text.substring(
                        text.indexOf("{"),
                        text.lastIndexOf("}") + 1
                    );

                    const data = JSON.parse(jsonString);

                    // fix state cell that dont have data. 
                    // Use data from above cell that have data on 'state'
                    let lastState = "";
                    const formatted = data.table.rows.map((row: any) => {
                        const currentState = String(row.c?.[0]?.v || "").trim();

                        if (currentState) {
                            lastState = currentState;
                        }

                        return {
                            state: lastState,
                            district: String(row.c?.[1]?.v || "").trim(),
                        };
                    });

                    // Optional: remove header row
                    const cleaned = formatted.filter(
                        (item: {state:string, district:string}) => item.state !== "State"
                    );

                    // console.log("formatted =", cleaned);
                    setLocation(cleaned);

                } catch (err) {
                    alert("❌ Quota reached");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, []);


    // ------------------------------------------ 4) tone ------------------------------------------
        // type Tone = "professional" | "simple";
        const [tone, setTone] = useState('professional')


    // ------------------------------------------ 5) copy result ------------------------------------------
        const [copied, setCopied] = useState(false);
        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(aiAnalysis);

                setCopied(true);

                setTimeout(() => {
                setCopied(false);
            }, 2000);
            } catch (err) {
                console.error("Copy failed:", err);
            }
        };

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
                            {/* a) + b) + c) + d) + e) */}
                            <div>
                                <p className="text-sm font-medium text-primary mb-2">AI financial advisor</p>
                                <p className="text-xs text-muted">Get personalised spending insights for: </p><br/>

                                <ul className="space-y-2 list-none p-0 m-0">

                                    {/* a) Location */}
                                    <li className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-muted text-xs leading-none">•</span>
                                        <p className="text-xs text-muted">Location</p>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); }}
                                            className="text-xs text-primary bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <option value="" disabled>state</option>
                                            {states.map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        {selectedState && (
                                            <>
                                                <span className="text-xs text-muted">/</span>
                                                <select
                                                    value={selectedDistrict}
                                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                                    className="text-xs text-primary bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary cursor-pointer hover:border-primary transition-colors"
                                                >
                                                    <option value="" disabled>district</option>
                                                    {districts.map((district) => (
                                                        <option key={district} value={district}>{district}</option>
                                                    ))}
                                                </select>
                                            </>
                                        )}
                                        <span className="text-xs text-muted">, Malaysia</span>
                                    </li>

                                    {/* b) Monthly allowance */}
                                    <li className="flex items-center gap-1.5">
                                        <span className="text-muted text-xs leading-none">•</span>
                                        <p className="text-xs text-muted">Monthly allowance</p>
                                        <span className="text-xs text-muted">RM</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={monthlyAllowance}
                                            onChange={(e) => setMonthlyAllowance(e.target.value)}
                                            className="text-xs text-primary bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary transition-colors w-20 placeholder:text-muted"
                                        />
                                    </li>

                                    {/* c) Expected budget */}
                                    <li className="flex items-center gap-1.5">
                                        <span className="text-muted text-xs leading-none">•</span>
                                        <p className="text-xs text-muted">Expected budget</p>
                                        <span className="text-xs text-muted">RM</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={monthlyBudget_expected}
                                            onChange={(e) => setMonthlyBudget_expected(e.target.value)}
                                            className="text-xs text-primary bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary transition-colors w-20 placeholder:text-muted"
                                        />
                                    </li>

                                    {/* d) Actual expense */}
                                    <li className="flex items-center gap-1.5">
                                        <span className="text-muted text-xs leading-none">•</span>
                                        <p className="text-xs text-muted">Actual expense</p>
                                        <span className="text-xs text-muted">RM</span>
                                        <input
                                            type="number"
                                            value={total}
                                            disabled
                                            className="text-xs text-primary bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary transition-colors w-20 placeholder:text-muted"
                                        />
                                    </li>


                                    {/* e) Type of prompt */}
                                    <li className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-muted text-xs leading-none">•</span>
                                        <p className="text-xs text-muted">Type of advise</p>
                                        <select
                                            value={tone}
                                            onChange={(e) => { setTone(e.target.value) }}
                                            className="text-xs text-primary bg-transparent border-b border-dashed border-muted focus:outline-none focus:border-primary cursor-pointer hover:border-primary transition-colors"
                                        >
                                            <option value="professional">Professional</option>
                                            <option value="simple">Simple</option>
                                          
                                        </select>
                                    </li>

                                </ul>
                            </div>

                            {/* f) Submit */}
                            <button
                                className="flex items-center gap-2 text-sm font-medium text-primary bg-body border border-border rounded-lg px-4 py-2 cursor-pointer hover:bg-selected disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                disabled={
                                    aiLoading ||
                                    budget.length === 0 ||
                                    !selectedState ||
                                    !selectedDistrict ||
                                    monthlyAllowance === '0' ||
                                    monthlyBudget_expected === '0'
                                }
                                onClick={async () => {
                                    // cache it to reduce cost
                                    const cacheKey = `${selectedState}-${selectedDistrict}-${monthlyAllowance}-${monthlyBudget_expected}-${total}-${tone}${JSON.stringify(budget)}`;
                                    if (aiCache.has(cacheKey)) {
                                        setAiAnalysis(aiCache.get(cacheKey)!);
                                        return;
                                    }
                                    setAiLoading(true);
                                    setAiAnalysis("");
                                    try {
                                        const result = await analyzeBudget(budget, selectedState, selectedDistrict, Number(monthlyAllowance), Number(monthlyBudget_expected), Number(total), tone);
                                        setAiAnalysis(result);
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setAiLoading(false);
                                    }
                                }}
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

                        {/* g) Result */}
                        {aiAnalysis && (
                            <div className="mt-4 pt-4 border-t-2 border-muted">

                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                                        Analysis
                                    </p>

                           
                                    <button
                                        onClick={handleCopy}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-white transition cursor-pointer"
                                    >
                                        {copied ? "✓ Copied" : "Copy"}
                                    </button>
                                </div>

                                <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">
                                {aiAnalysis}
                                </p>

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
    if (!val) 
        return "";

    if (typeof val === "string" && !val.startsWith("Date(")) 
        return val;

    const match = /Date\((\d+),(\d+),(\d+)\)/.exec(val);
    if (!match) 
        return "";

    const year = Number(match[1]);
    const month = Number(match[2]) + 1;
    const day = Number(match[3]);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};