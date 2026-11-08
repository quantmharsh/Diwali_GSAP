type DiyaProps = {
  className?: string;
  lit?: boolean;
  size?: "small" | "medium" | "large";
};

export function Diya({ className = "", lit = true, size = "medium" }: DiyaProps) {
  return (
    <svg
      aria-hidden="true"
      className={`diya diya--${size} ${lit ? "diya--lit" : ""} ${className}`}
      viewBox="0 0 180 140"
      fill="none"
    >
      <ellipse className="diya__halo" cx="90" cy="82" rx="58" ry="49" />
      <path className="diya__flame" d="M90 16c-15 21-18 33-8 45-13-8-18-18-14-30-21 24-12 49 11 55 8 2 14 2 22 0 23-6 32-31 11-55 4 12-1 22-14 30 10-12 7-24-8-45Z" />
      <path className="diya__wick" d="M90 66c-7 12-7 19 0 24 7-5 7-12 0-24Z" />
      <path className="diya__bowl" d="M25 89c38 13 92 13 130 0-5 26-25 39-65 43-40-4-60-17-65-43Z" />
      <path className="diya__rim" d="M25 89c38 13 92 13 130 0" />
      <path className="diya__detail" d="M47 107c26 10 60 10 86 0" />
      <circle className="diya__gem" cx="90" cy="116" r="3" />
    </svg>
  );
}
