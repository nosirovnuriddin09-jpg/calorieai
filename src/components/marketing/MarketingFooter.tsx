export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex items-center justify-between flex-wrap gap-4 border-t border-black/[0.04]">
      <div className="flex items-center gap-2.5">
        <span className="h-7 w-7 rounded-xl bg-foreground flex items-center justify-center text-background font-semibold text-xs">
          M
        </span>
        <span className="text-sm font-medium">MuseFit</span>
        <span className="text-xs text-muted ml-2">© {year}</span>
      </div>
      <div className="flex items-center gap-5 text-xs text-muted">
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Terms
        </a>
      </div>
    </footer>
  );
}
