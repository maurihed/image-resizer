"use client";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-10 py-8">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Client-side album tool
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Resize photos for prints and albums without leaving the browser
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted sm:text-lg">
          Upload a photo, frame it with album presets or a custom crop,
          fine-tune position and zoom on a Konva canvas, then download
          everything as a ZIP at the original quality.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/upload" size="lg" className="px-8">
            Start resizing
          </Button>
          <Button href="/queue" size="lg" variant="secondary">
            Open queue
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-3">
        {[
          {
            title: "Default fit",
            body: "Album presets with smart cover/contain so small photos stay centered with transparent padding.",
          },
          {
            title: "Custom crop",
            body: "Drag the crop frame or type exact pixels. Pan and zoom the photo for precise placement.",
          },
          {
            title: "Batch ZIP",
            body: "Stage exports in IndexedDB and download one file or a full ZIP when you are done.",
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-border bg-panel p-5 text-left"
          >
            <h2 className="text-base font-semibold text-foreground">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {card.body}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
