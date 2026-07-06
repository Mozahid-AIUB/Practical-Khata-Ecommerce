"use client";

import { Atom, FlaskConical, Dna, Calculator, Monitor, Sprout, Layers, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product, Subject } from "@/lib/mock-data";

/** per-subject cover palette: soft tint + deep ink, one icon each */
const COVERS: Record<Subject, { bg: string; fg: string; Icon: typeof Atom }> = {
  physics: { bg: "#e3edfa", fg: "#1d4f9e", Icon: Atom },
  chemistry: { bg: "#ede8fa", fg: "#5b3ba8", Icon: FlaskConical },
  biology: { bg: "#e2f3e7", fg: "#1e7a43", Icon: Dna },
  math: { bg: "#fdf0d9", fg: "#9a6410", Icon: Calculator },
  ict: { bg: "#def2f5", fg: "#0f6b7d", Icon: Monitor },
  agriculture: { bg: "#eef3da", fg: "#5c7a1c", Icon: Sprout },
  bundle: { bg: "#fbe4e2", fg: "#b23a34", Icon: Layers },
  assignment: { bg: "#e9ecf1", fg: "#3d4756", Icon: PenLine },
};

/**
 * Product "photo" drawn as a khata cover: subject tint, ruled lines,
 * red margin, subject icon and an SSC/HSC level chip. Consistent across
 * the whole catalogue — no stock photos.
 */
export function SubjectCover({ product }: { product: Product }) {
  const t = useTranslations("product");
  const { bg, fg, Icon } = COVERS[product.subject];

  return (
    <div
      className="khata-rules relative flex aspect-square w-full items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      {/* red margin line */}
      <span aria-hidden className="absolute inset-y-0 left-5 w-px bg-accent-500/50" />

      {product.level && (
        <span
          className="absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: fg }}
        >
          {t(product.level)}
        </span>
      )}

      <Icon
        aria-hidden
        className="h-14 w-14 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        strokeWidth={1.5}
        style={{ color: fg }}
      />
    </div>
  );
}
