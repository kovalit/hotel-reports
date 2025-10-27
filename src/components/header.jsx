export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">W</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Wawelberg Hotel</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">Администратор</p>
          <p className="text-xs text-muted-foreground">admin@wawelberg.com</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <span className="text-sm font-semibold text-primary-foreground">АД</span>
        </div>
      </div>
    </header>
  )
}
