import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Check, ListFilterPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const handleSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({
        ...prev,
        search: value,
      }));
    }, 300),
    []
  );

  const productFilters = [
    {
      name: 'Newest',
      value: 'created_at-desc',
      icon: '🆕',
    },
    {
      name: 'Oldest',
      value: 'created_at-asc',
      icon: '🕰️',
    },
    {
      name: 'Most Popular',
      value: 'popular',
      icon: '🔥',
    },
    {
      name: 'Price: Low to High',
      value: 'price-asc',
      icon: '💲',
    },
    {
      name: 'Price: High to Low',
      value: 'price-desc',
      icon: '💰',
    },
  ];

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
          {!storeConfig?.show_hero_search && (
            <>
              <h3 className="font-semibold text-xs mb-2">
                Find Your Perfect Products
              </h3>

              <Input
                type="text"
                placeholder="Search by name or description"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full mb-4"
              />
            </>
          )}

          <div>
            <h4 className="font-semibold text-xs mb-2">Sort By</h4>
            <ul className="space-y-1">
              {productFilters.map((filter) => (
                <li key={filter.value}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left text-sm"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: filter.value,
                      }));
                    }}
                  >
                    <span className="mr-2">{filter.icon}</span>
                    {filter.name}

                    <Check
                      className={`ml-auto size-4 ${
                        filter.value === filters.sortBy
                          ? 'text-blue-500'
                          : 'hidden'
                      }`}
                    />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
