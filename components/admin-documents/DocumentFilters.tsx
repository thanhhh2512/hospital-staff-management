import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Category {
  id: string;
  name: string;
}

interface DocumentFiltersProps {
  categories: Category[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function DocumentFilters({
  categories,
  activeTab,
  onTabChange,
}: DocumentFiltersProps) {
  return (
    <TabsList className="mb-4 flex flex-wrap">
      {categories.map((category) => (
        <TabsTrigger
          key={category.id}
          value={category.id}
          onClick={() => onTabChange(category.id)}
        >
          {category.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
