export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl md:text-7xl font-heading text-primary tracking-widest">
          LEGEND
        </h1>
        <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar" />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-text-muted font-body">
          Preparing the realm...
        </p>
      </div>
    </div>
  );
}
