'use client';

export default function ClientBackdrop() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(207,210,218,0.10),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(126,34,206,0.18),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(37,99,235,0.14),transparent_60%)] animate-pulse-slow" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%,transparent_78%,rgba(255,255,255,0.03))]" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute inset-0 opacity-18 lux-orb">
        <div
          className="absolute inset-0 animate-float bg-[radial-gradient(circle_at_30%_20%,rgba(214,178,106,0.10),transparent_55%),radial-gradient(circle_at_78%_22%,rgba(126,34,206,0.14),transparent_58%),radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.10),transparent_60%)]"
          style={{ animationDuration: '14s' }}
        />
      </div>
      <div className="absolute inset-0 opacity-14 lux-orb">
        <div
          className="absolute inset-0 animate-float bg-[radial-gradient(circle_at_16%_70%,rgba(207,210,218,0.10),transparent_58%),radial-gradient(circle_at_90%_58%,rgba(214,178,106,0.08),transparent_60%)]"
          style={{ animationDuration: '18s' }}
        />
      </div>
    </div>
  );
}
