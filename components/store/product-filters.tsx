import { ListFilterPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

import type { StoreConfig } from '@/@types/store';
import type { ProductFilters as ProductFiltersType } from '@/@types/product';

export default function ProductFilters({
  storeConfig,
  filters,
  setFilters,
}: {
  storeConfig?: StoreConfig;
  filters: ProductFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<ProductFiltersType>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-2 hover:bg-gray-400/10 transition-colors"
          aria-label="Filter Products"
        >
          <ListFilterPlus
            style={{ color: storeConfig?.text_color }}
            className="size-5 md:size-6"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64"
        style={{
          backgroundColor: storeConfig?.background_color || '#FFFFFF',
          color: storeConfig?.text_color || '#000000',
          borderColor: storeConfig?.border_color || '#E5E5EB',
        }}
      >
        <div>
          <h3 className="font-semibold text-xs mb-2">
            Find Your Perfect Products
          </h3>

          <Input type="text" placeholder="Search by name or description" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
