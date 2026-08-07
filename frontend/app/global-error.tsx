'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h2 className="text-xl font-bold mb-4">Application Error</h2>
          <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
