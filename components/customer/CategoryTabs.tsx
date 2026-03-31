"use client";

import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
};

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect
}: {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="hide-scrollbar sticky top-0 z-20 -mx-4 overflow-x-auto border-y border-app-border bg-app-bg/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-xl md:border">
      <ul className="flex min-w-max gap-2">
        {categories.map((category) => {
          const active = category.id === activeCategory;
          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelect(category.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  active
                    ? "border-app-primary bg-app-primary/20 text-app-primary"
                    : "border-app-border text-app-text-muted hover:text-app-text"
                )}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
