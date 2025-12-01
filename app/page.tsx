import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-50">
      <div className="rounded-2xl border border-neutral-800 px-8 py-6 shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
          Sherry Liu
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          New website under construction :)
        </h1>
      </div>
    </main>
  );
}
