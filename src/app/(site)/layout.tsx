import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site-chrome";
import { getAllCategories, getProductSearchIndex } from "@/lib/store";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [categories, searchIndex] = await Promise.all([
    getAllCategories(),
    getProductSearchIndex()
  ]);

  return (
    <SiteChrome categories={categories} searchIndex={searchIndex}>
      {children}
    </SiteChrome>
  );
}
