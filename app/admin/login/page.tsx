import type { Metadata } from "next";
import { adminPasswordConfigured } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = adminPasswordConfigured();

  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16"
    >
      <p className="font-mono text-label uppercase text-pen">Site editor</p>
      <h1 className="mt-5 text-h2">Sign in</h1>
      <p className="mt-4 text-small text-ink-soft">
        This area edits the live site. Only the site owner should have the password.
      </p>

      {configured ? (
        <LoginForm next={next ?? ""} />
      ) : (
        <div className="mt-8 rounded-sheet border border-pen/30 bg-pen/5 p-5">
          <p className="text-small text-ink">
            No admin password is set yet, so signing in is disabled.
          </p>
          <p className="mt-3 text-small text-ink-soft">
            Generate one, then put the printed value in <code>.env.local</code> as{" "}
            <code>ADMIN_PASSWORD_HASH</code> and restart:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-sheet bg-ink px-4 py-3 font-mono text-micro text-paper">
            npm run admin:password
          </pre>
        </div>
      )}
    </main>
  );
}
