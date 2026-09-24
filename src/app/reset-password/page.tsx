import { Suspense } from "react";
import ResetForm from "./ResetForm";

export const metadata = {
  title: "Reset password | MYResearchGuide",
};

// Server wrapper: passes the ?code= / ?token_hash= params from the reset
// email link to the client form (implicit-flow links carry tokens in the URL
// hash, which the browser client picks up itself — no params needed).
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string }>;
}) {
  const { code, token_hash: tokenHash, type } = await searchParams;

  const hashIsRecovery = !tokenHash || type === "recovery";

  return (
    <Suspense>
      {hashIsRecovery ? (
        <ResetForm code={code} tokenHash={tokenHash} />
      ) : (
        <div className="min-h-screen bg-black flex items-center justify-center !text-white !px-4">
          <div className="!bg-zinc-900/50 !rounded-3xl !border !border-zinc-800 !p-8 !max-w-md !w-full !text-center">
            <h1 className="!text-2xl !font-bold !mb-2">Invalid link</h1>
            <p className="!text-sm !text-zinc-400">
              This link isn&apos;t a password reset link. Request a new one from
              the forgot-password page.
            </p>
          </div>
        </div>
      )}
    </Suspense>
  );
}
