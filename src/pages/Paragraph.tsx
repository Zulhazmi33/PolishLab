import { useState } from "react";
import Grid from "../components/ui/Grid";
import { rewriteText } from "../gemini";

const Paragraph: React.FC = () => {
    type Tone = "professional" | "formal" | "friendly" | "job_application";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [tone, setTone] = useState<Tone>("professional");

// me want job software engineer no experience but fast learner

    const handleRewrite = async () => {
        setLoading(true);
        setOutput("");
        try {
            const result = await rewriteText(input, tone);
            // console.log('result = ',result)
            setOutput(result);
            setLoading(false);
        }
        catch(error) {
            console.log('error = ',error)
            // console.log('error = ',error.response?.message)
            // alert('❌ '+error.response?.message)
        }
    };
    

    return (
        <>
            <Grid>
                <div className="max-w-2xl mx-auto">

                    {/* 1) Header */}
                    <div className="mb-8">
                        <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-2">
                            AI-Powered
                        </p>
                        <h1 className="text-3xl font-bold text-primty dark:text-accent">
                            Professional Text Corrector
                        </h1>
                        <p className="mt-2 text-sm text-muted">
                            Paste your text and choose a tone to improve it instantly.
                        </p>
                    </div>

                    {/* 2) Card */}
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">

                        {/* a) Textarea */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                                Your Text
                            </label>
                            <textarea
                                rows={6}
                                className="w-full rounded-xl border border-border bgbody text-primary dark:text-white placeholder:text-muted p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary"
                                placeholder="Paste your resume or text here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>

                        {/* b) Tone selector + Button row */}
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                            <div className="flex-1">
                                <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                                    Tone
                                </label>
                                <select
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value as Tone)}
                                    className="w-full rounded-xl border border-border bgbody text-primary dark:text-white text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                                >
                                    <option value="professional">Professional</option>
                                    <option value="formal">Formal</option>
                                    <option value="friendly">Friendly</option>
                                    <option value="job_application">Job Application</option>
                                </select>
                            </div>

                            <div className="sm:pt-6">
                                <button
                                    onClick={handleRewrite}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-secondary hover:bg-accent text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Rewriting…
                                    </span>
                                    ) : "Improve Text"}
                                </button>
                            </div>
                        </div>
                    </div>  

                    {/* Output */}
                    {output && (
                        <div className="mt-6 bg-selected border border-border rounded-2xl p-6">
                            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
                                Result
                            </p>
                            <pre className="text-sm text-primary dark:text-white whitespace-pre-wrap leading-relaxed font-sans">
                                {output}
                            </pre>
                        </div>
                    )}

                </div>
            </Grid>
        </>
    )
}

export default Paragraph;