import { useEffect, useRef, useState } from "react";
import Grid from "../components/ui/Grid";
import { matchFAQWithGemini } from "../gemini";

const Chatbot:React.FC = () => {

    interface Question_type {
        question: string,
        answer: string
    }

    // #region 1) --> general
        const [loading, setLoading] = useState(true);
        const [input, setInput] = useState("");
        const [trivia, setTrivia] = useState<Question_type[]>([]);
    // #endregion

        
    // #region 2) -->  useEffect
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const res = await fetch(
                        "https://docs.google.com/spreadsheets/d/1mVKdROPMHmgVX95vn7PDlaNf0UNWdpVTJHDzFKvizLU/gviz/tq?tqx=out:json&sheet=Chatbot"
                    );

                    const text = await res.text();
                    const jsonString = text.substring(
                        text.indexOf("{"),
                        text.lastIndexOf("}") + 1
                    );

                    const data = JSON.parse(jsonString);
                    let lastAnswer = "";

                    const formatted = data.table.rows
                        .slice(1, 7) // start from row 1 (skip header), take only up to row 6
                        .map((row: any) => {
                            const q = row.c[1]?.v;
                            const a = row.c[2]?.v;

                            // if empty, reuse previous value
                            if (a !== undefined && a !== null && a !== "") 
                                lastAnswer = String(a);

                            return {
                                question: q,
                                answer: lastAnswer,
                            };
                        });

                    console.log("data =", formatted);
                    setTrivia(formatted);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }, []);
    // #endregion


    // #region 3) --> chat
        // a) initialize
        const bottomRef = useRef(null);
        const textareaRef = useRef(null);
        const formatTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const [messages, setMessages] = useState([
            { role: "ai", text: "Hi there! Ask me anything and I'll find the best answer for you.", time: formatTime() },
        ]);

        // b) useEffect
        useEffect(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages, loading]);

        // c) handle/method
        const handleSend = async () => {
            if (!input.trim() || loading) return;

            setInput("");
            const question = input.trim();
            if (textareaRef.current) textareaRef.current.style.height = "auto";

            setMessages((prev) => [...prev, { role: "user", text: question, time: formatTime() }]);
            setLoading(true);

            try {
                const resultId = await matchFAQWithGemini(question, trivia);

                // const resultId = -1;
                const answer =
                    resultId == -1
                    ? "Sorry, no match found."
                    : trivia[resultId].answer;

                setMessages((prev) => [...prev, { role: "ai", text: answer, time: formatTime() }]);
            } catch (error) {
                console.log("error =", error);
                setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again.", time: formatTime() }]);
            } finally {
                setLoading(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            }
        };
        const handleInput = (e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
        };
    // #endregion


    return (
        <>
            <Grid>
                <div className="w-full flex justify-center px-4">
                    <div className="flex flex-col h-150 max-w-lg bg-white dark:bg-gray-900 border border-border rounded-2xl overflow-hidden">

                        {/* 1) Header */}
                        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                            <span className="text-secondary">💬</span>
                            <span className="text-sm font-medium text-primary dark:text-white">FAQ Assistant</span>
                        </div>

                        {/* 2) Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                            {messages.map((msg, i) =>
                            msg.role === "user" ? (
                                <div key={i} className="flex justify-end">
                                    <div>
                                        <div className="bg-secondary text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed max-w-[75%] ml-auto">
                                        {msg.text}
                                        </div>
                                        <p className="text-xs text-muted mt-1 text-right">{msg.time}</p>
                                    </div>
                                </div>
                            ) : (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300 flex-shrink-0">
                                        AI
                                    </div>
                                    <div>
                                        <div className="bg-gray-100 dark:bg-gray-800 text-primary dark:text-white px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed max-w-[75%] border border-border">
                                        {msg.text}
                                        </div>
                                        <p className="text-xs text-muted mt-1">{msg.time}</p>
                                    </div>
                                </div>
                            )
                            )}

                            {/* Typing indicator */}
                            {loading && (
                            <div className="flex items-start gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300 flex-shrink-0">
                                AI
                                </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* 3) Input row */}
                        <div className="border-t border-border px-3 py-2.5 flex items-end gap-2 bg-white dark:bg-gray-900">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                placeholder="Type your question…"
                                className="flex-1 resize-none rounded-xl border border-border bg-gray-100 dark:bg-gray-800 text-primary dark:text-white placeholder:text-muted text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[40px] max-h-[120px] disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="w-9 h-9 rounded-full bg-secondary hover:bg-accent flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </Grid>
        </>
    )
}

export default Chatbot;