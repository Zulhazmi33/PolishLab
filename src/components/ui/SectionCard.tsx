interface Props {
  title: string;
  content: string;
  enableAi?: boolean;
  onImprove?: () => void;
}

const SectionCard = ({
  title,
  content,
  enableAi = false,
  onImprove,
}: Props) => {
  return (
    <div className="border border-border rounded-xl p-4 mb-4 bg-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium uppercase tracking-wide text-black">
          {title}
        </h3>

        {enableAi && (
          <button
            onClick={onImprove}
            className="text-xs px-3 py-1 rounded-lg bg-black text-white"
          >
            Improve with AI
          </button>
        )}
      </div>
      
      <ul className="text-sm text-black space-y-5">
        {formatBullets(content).length > 0 ? (
          formatBullets(content).map((line, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-black">•</span>
              <span>{line}</span>
            </li>
          ))
        ) : (
          <span className="italic text-muted">Not found</span>
        )}
      </ul>
    </div>
  );
};

export default SectionCard;

const formatBullets = (text: string) => {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};