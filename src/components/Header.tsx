export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-paper border-b border-line safe-top px-[18px] pb-3">
      <div className="flex items-center gap-2.5 mb-0.5">
        <div className="w-[30px] h-[30px] rounded-lg bg-ink flex items-center justify-center shrink-0">
          <svg width="17" height="17" viewBox="0 0 100 100" fill="none">
            <path
              d="M15 50h15l8-15 12 30 8-15h15"
              stroke="#E8A23D"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="font-display font-bold text-[19px] tracking-tight">Interchange</div>
      </div>
      <div className="text-[11px] text-ink-soft tracking-wider uppercase ml-10 -mt-1">
        Parts cross-reference for repair techs
      </div>
    </header>
  );
}
