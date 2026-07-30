import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6 max-w-lg">
        <h1 className="text-8xl font-heading text-primary mb-4">404</h1>
        <p className="text-xl text-text-secondary font-subheading mb-2">
          Realm not found
        </p>
        <p className="text-sm text-text-muted font-body mb-8">
          The region you&apos;re looking for doesn&apos;t exist on our maps.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading uppercase tracking-wider rounded-sm px-6 py-3 text-lg bg-primary text-background hover:bg-primary-hover transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
