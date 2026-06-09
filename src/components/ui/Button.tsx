interface ButtonProps {
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string
}

export default function Button({ label, onClick, className }: ButtonProps) {
  return (
    <div className={`pt-3 ${className}`}>
        <button onClick={onClick} className="py-3 w-full rounded-2xl bg-secondary text-white text-sm font-medium transition-all cursor-pointer">
          {label}
        </button>
    </div>
  );
}