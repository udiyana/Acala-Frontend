import AnimatedSection from "./AnimatedSection";

type MenuCategory = {
  id: string;
  name: string;
  items: {
    name: string;
    description: string;
    price: string;
    isMarketPrice?: boolean;
  }[];
};

const menuGroups = [
  {
    id: "appetizer",
    name: "Appetizer",
    matchers: ["appetizer", "starter", "soup", "salad", "vegetarian", "side"],
  },
  {
    id: "main-course",
    name: "Main Course",
    matchers: [
      "breakfast",
      "light",
      "seafood",
      "pizza",
      "pasta",
      "grill",
      "main",
      "burger",
      "sandwich",
      "meal",
    ],
  },
  {
    id: "dessert",
    name: "Dessert",
    matchers: ["dessert", "gelato", "sweet"],
  },
  {
    id: "drink",
    name: "Drink",
    matchers: [
      "wine",
      "drink",
      "cocktail",
      "mocktail",
      "shake",
      "juice",
      "smoothie",
      "beverage",
      "brew",
      "coffee",
      "beer",
      "water",
      "soda",
    ],
  },
];

function groupMenu(fullMenu: MenuCategory[]) {
  const grouped = menuGroups.map((group) => ({
    ...group,
    categories: [] as MenuCategory[],
  }));

  fullMenu.forEach((category) => {
    const haystack = `${category.id} ${category.name}`.toLowerCase();
    const match = grouped.find((group) => group.matchers.some((matcher) => haystack.includes(matcher)));
    if (match) {
      match.categories.push(category);
    } else {
      grouped[1].categories.push(category);
    }
  });

  return grouped.filter((group) => group.categories.length > 0);
}

type BranchMenuSectionProps = {
  eyebrow?: string;
  fullMenu: MenuCategory[];
  intro?: string;
  title?: string;
};

export default function BranchMenuSection({
  eyebrow = "Our Menu",
  fullMenu,
  intro = "Appetizer, main course, dessert, and drink selections are grouped for easier browsing.",
  title = "Menu by Category",
}: BranchMenuSectionProps) {
  const groupedMenu = groupMenu(fullMenu);

  return (
    <section className="section bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <span className="badge badge-primary mb-3">{eyebrow}</span>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-neutral-800)" }}
          >
            {title}
          </h2>
          <p className="apple-body mx-auto">{intro}</p>
        </AnimatedSection>

        <div className="space-y-12">
          {groupedMenu.map((group) => (
            <AnimatedSection key={group.id}>
              <div
                className="p-6 sm:p-8"
                style={{ background: "var(--color-surface-warm)", borderRadius: "var(--radius-md)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                  <div>
                    <p className="apple-label mb-2">{group.name}</p>
                    <h3
                      className="font-heading font-bold text-3xl"
                      style={{ color: "var(--color-neutral-900)" }}
                    >
                      {group.name}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
                    {group.categories.reduce((total, category) => total + category.items.length, 0)} items
                  </p>
                </div>

                <div className="space-y-10">
                  {group.categories.map((category) => (
                    <div key={category.id}>
                      <h4
                        className="font-heading font-bold text-xl mb-5 pb-2"
                        style={{ color: "var(--color-neutral-800)", borderBottom: "1px solid var(--color-neutral-200)" }}
                      >
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {category.items.map((item) => (
                          <div key={`${category.id}-${item.name}`} className="flex flex-col">
                            <div className="flex justify-between items-baseline gap-4 mb-1">
                              <h5 className="font-semibold text-base" style={{ color: "var(--color-neutral-800)" }}>
                                {item.name}
                              </h5>
                              <span className="font-medium text-sm flex-shrink-0" style={{ color: "var(--color-primary)" }}>
                                {item.isMarketPrice ? item.price : `Rp ${item.price}`}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--color-neutral-500)" }}>
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
