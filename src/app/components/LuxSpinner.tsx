type LuxSpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeClasses: Record<NonNullable<LuxSpinnerProps["size"]>, string> = {
  sm: "h-8 w-8 border-[3px]",
  md: "h-12 w-12 border-4",
  lg: "h-16 w-16 border-[5px]",
};

export default function LuxSpinner({
  size = "md",
  label = "Loading...",
  className = "",
}: LuxSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={[
          "animate-spin motion-reduce:animate-none rounded-full border-white/15 border-t-[color:var(--lux-accent-purple)] border-r-[color:var(--lux-accent-blue)]",
          sizeClasses[size],
        ].join(" ")}
        style={{ animationDuration: "1.1s" }}
      />
      {label ? (
        <div className="text-sm text-white/70 font-special-regular">{label}</div>
      ) : null}
      <span className="sr-only">{label || "Loading"}</span>
    </div>
  );
}

