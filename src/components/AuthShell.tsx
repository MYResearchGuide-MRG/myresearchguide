/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// Shared centered-card layout for the auth pages, matching the site's
// black / zinc-900 / rounded-3xl aesthetic (see ResearcherGrid).
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden !text-white flex items-center justify-center !px-4 !py-16">
      <div className="!absolute !inset-0 !bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="!relative !w-full !max-w-md">
        <div className="!text-center !mb-8">
          <Link
            href="/"
            className="!inline-block !text-2xl !font-bold !tracking-tighter !text-white !no-underline"
          >
            MYResearchGuide
          </Link>
          <p className="!text-xs !uppercase !tracking-[0.2em] !text-zinc-500 !mt-1">
            Member portal
          </p>
        </div>

        <div className="!bg-zinc-900/50 !rounded-3xl !border !border-zinc-800 !p-8 !shadow-2xl !shadow-black/60">
          <h1 className="!text-4xl !font-bold !tracking-tighter !mb-1">{title}</h1>
          {subtitle ? (
            <p className="!text-sm !text-zinc-500 !mb-6">{subtitle}</p>
          ) : null}
          {children}
        </div>

        <p className="!text-center !text-xs !text-zinc-600 !mt-6">
          <Link href="/" className="!text-zinc-500 hover:!text-white !no-underline !transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}

export const inputClass =
  "!w-full !bg-zinc-950 !text-zinc-100 !border !border-zinc-800 !rounded-xl !px-4 !py-3 !text-sm !outline-none focus:!border-white/40 !transition-colors !placeholder-zinc-600";

export const primaryBtnClass =
  "!w-full !bg-white !text-black !rounded-xl !py-3 !text-sm !font-bold !transition-colors hover:!bg-zinc-200 disabled:!opacity-50 disabled:!cursor-not-allowed !cursor-pointer";
