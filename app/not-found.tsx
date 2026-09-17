import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1 flex items-center justify-center bg-[var(--cl-bg)]">
        <div className="text-center px-6 py-20">
          <p className="text-sm font-medium text-[var(--cl-teal)]">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--cl-navy)]">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-2 text-slate-500">It may have moved, or the link may be incorrect.</p>
          <div className="mt-6">
            <LinkButton href="/">Back to home</LinkButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
