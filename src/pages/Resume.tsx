import { useState, useRef, useCallback } from "react";
import Grid from "../components/ui/Grid";
import { pdfToText } from "../util/pdfToText";
import { parseResumeLocally } from "../util/resumeParser";
import SectionCard from "../components/ui/SectionCard";

const Resume: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<any>(null);
  
  const applyFile = (f: File) => {
    if (f.type === "application/pdf") setFile(f);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) applyFile(dropped);
  }, []);

  const handleParse = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const text = await pdfToText(file);
      const sections = parseResumeLocally(text);

      // console.log('RAW PDF TEXT = ',text);
      // console.log("SECTIONS = ", sections);

      setResume(sections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <Grid>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 0", fontFamily: "var(--font-sans)" }}>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-muted text-xl">◈</span>
            <h2 className="text-xl font-medium text-primary m-0">AI resume reader</h2>
          </div>
          <p className="text-sm text-muted mb-6">
            Upload a PDF resume and get a structured breakdown of its contents.
          </p>
        </div>

        {/* Drop zone */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) applyFile(e.target.files[0]); }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "rounded-xl border-2 border-dashed p-10 text-center cursor-pointer mb-3 transition-colors",
              dragging
                ? "border-secondary bg-selected"
                : file
                ? "border-secondary bg-selected"
                : "border-border bg-body",
            ].join(" ")}
          >
            <div className="text-3xl text-muted mb-3">↑</div>
            <p className="text-sm font-medium text-primary mb-1">
              {file ? "PDF ready" : "Drop your PDF here"}
            </p>
            <p className="text-xs text-muted mb-4">or click to browse</p>
            <button
              className="text-sm text-primary bg-surface border border-border rounded-lg px-4 py-1.5 cursor-pointer hover:bg-selected transition-colors"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              Choose file
            </button>
          </div>
        </div>

        {/* File pill */}
        <div>
          {file && (
            <div className="flex items-center gap-2.5 bg-surface border border-border rounded-lg px-3 py-2.5 mb-4">
              <span className="text-sm text-red-500">PDF</span>
              <span className="text-sm text-primary flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted">{formatSize(file.size)}</span>
              <button
                className="text-muted hover:text-primary ml-1 transition-colors"
                onClick={() => setFile(null)}
                aria-label="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Parse button */}
        <div>
          <button
            onClick={handleParse}
            disabled={!file || loading}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary bg-surface border border-border rounded-lg px-5 py-2.5 mb-6 transition-colors hover:bg-selected disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Analyzing..." : "Review resume"}
          </button>
        </div>

        {/* Output */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted mb-2.5">
            Structured output
          </label>
          {resume && (
            <>
              <SectionCard
                title="Work Experience"
                content={resume.experience}
                enableAi
              />

              <SectionCard
                title="Education"
                content={resume.education}
                enableAi
              />

              <SectionCard
                title="Skills"
                content={resume.skills}
                enableAi
              />

              <SectionCard
                title="Projects"
                content={resume.projects}
                enableAi
              />

              <SectionCard
                title="Certifications"
                content={resume.certifications}
                enableAi
              />
            </>
          )}
        </div>

      </div>
    </Grid>
  );
};

export default Resume;