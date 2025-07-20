"use client";

import * as React from "react";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  useInfiniteScroll,
  SearchResponse,
} from "@/src/hooks/use-infinite-scroll";

export type ComboBoxItemType = {
  label: string;
  value: string;
};

export interface ComboboxWithPaginationProps
  extends Pick<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "disabled"
  > {
  value: string;
  asyncSearchFn: (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => Promise<SearchResponse<ComboBoxItemType>>;
  onSelect?: (item: string) => void;
  pageSize?: number;
  side?: "top" | "bottom" | "left" | "right";
  shouldCloseOnSelect?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  loadingMoreMessage?: string;
  allLoadedMessage?: string;
}

export function CustomCombobox({
  className,
  disabled = false,
  asyncSearchFn,
  value,
  onSelect,
  pageSize = 10,
  side = "bottom",
  shouldCloseOnSelect = true,
  placeholder = "Selecione um item...",
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum item encontrado.",
  loadingMessage = "Carregando items...",
  errorMessage = "Algo deu errado",
  loadingMoreMessage = "Carregando mais items...",
  allLoadedMessage = "✓ Todos os items foram carregados",
}: ComboboxWithPaginationProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const queryKey = React.useId();
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    lastElementRef,
  } = useInfiniteScroll<ComboBoxItemType>({
    queryKey: queryKey,
    searchTerm,
    asyncSearchFn,
    pageSize,
  });

  const displayName = React.useMemo(() => {
    let option: string = placeholder;

    if (!!value && Array.isArray(data)) {
      const label = data.find((s) => s.value === value)?.label;
      if (!!label) {
        option = label;
      }
    }
    return option;
  }, [placeholder, value, data]);

  function handleSearch(query: string) {
    setSearchTerm(query);
    refetch();
  }

  function handleSelect(item: ComboBoxItemType) {
    !!onSelect && onSelect(item.value);
    shouldCloseOnSelect && setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled || isLoading}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between bg-transparent w-full", className)}
        >
          <span className="truncate text-left">{displayName}</span>
          {isLoading ? (
            <Loader2 className="ml-2 size-4 shrink-0 animate-spin opacity-70" />
          ) : (
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side={side}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onValueChange={handleSearch}
          />
          <CommandList className="max-h-[18rem] overflow-y-auto">
            {isLoading && Array.isArray(data) && !data.length ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">{loadingMessage}</span>
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-destructive">{errorMessage}</div>
            ) : !data.length ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {data.map((item, index) => (
                  <CommandItem
                    key={`${item.value}-${index}`}
                    ref={index === data.length - 1 ? lastElementRef : undefined}
                    value={item.value}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2 p-2"
                  >
                    {item.label}
                  </CommandItem>
                ))}
                {hasNextPage && isFetchingNextPage && (
                  <div className="flex items-center justify-center p-3 border-t">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs text-muted-foreground ml-2">
                      {loadingMoreMessage}
                    </span>
                  </div>
                )}
                {!hasNextPage && data.length > 0 && (
                  <div className="flex items-center justify-center p-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      {allLoadedMessage} ({data.length})
                    </span>
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
