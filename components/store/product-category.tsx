import { Button } from '@/components/ui/button';

import type { StoreConfig } from '@/@types/store';
import type {
  ProductFilters as ProductFiltersType,
  ProductCategory as ProductCategoryType,
} from '@/@types/product';

export default function ProductCategory({
  storeConfig,
  filters,
  category,
  setFilters,
}: {
  storeConfig?: StoreConfig;
  category: ProductCategoryType;
  filters: ProductFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ProductFiltersType>>;
}) {
  return (
    <Button
      key={category.id}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300`}
      variant="secondary"
      style={{
        backgroundColor:
          filters.category === category.id
            ? storeConfig?.theme_color || '#0070F3'
            : storeConfig?.background_color || '#FFFFFF',
        color: storeConfig?.text_color || '#000000',
        borderColor: storeConfig?.border_color || '#E5E5EB',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
      onClick={() => {
        setFilters((prev) => ({
          ...prev,
          category: prev.category === category.id ? '' : category.id,
        }));
      }}
    >
      {category.title}
    </Button>
  );
}
