'use client';

export default function ClientStudiosBackdrop() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
      <div
        className={[
          'absolute -top-64 -left-64',
          'h-[620px] w-[620px] rounded-full blur-3xl',
          'opacity-20',
          'bg-[radial-gradient(circle_at_30%_30%,rgba(126,34,206,0.55),transparent_62%)]',
          'animate-float motion-reduce:animate-none',
        ].join(' ')}
        style={{ animationDuration: '16s' }}
      />
      <div
        className={[
          'absolute -bottom-72 -right-72',
          'h-[760px] w-[760px] rounded-full blur-3xl',
          'opacity-18',
          'bg-[radial-gradient(circle_at_70%_70%,rgba(37,99,235,0.48),transparent_60%)]',
          'animate-float motion-reduce:animate-none',
        ].join(' ')}
        style={{ animationDuration: '20s' }}
      />

      <div
        className={[
          'absolute inset-0',
          'opacity-[0.10] mix-blend-screen',
          'bg-[linear-gradient(120deg,rgba(126,34,206,0.22),rgba(37,99,235,0.18),rgba(214,178,106,0.12),rgba(126,34,206,0.22))]',
          'animate-gradient motion-reduce:animate-none',
        ].join(' ')}
      />
    </div>
  );
}

