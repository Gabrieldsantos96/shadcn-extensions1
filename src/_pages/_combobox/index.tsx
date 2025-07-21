"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ComboboxWithForm,
  comboboxWithFormCode,
} from "@/src/_pages/_combobox/with-form";
import { useTranslations } from "next-intl";
import { searchUsers } from "@/src/utils/api-utils";
import { CustomCombobox } from "@/src/components/extensions/custom-combobox";
import { CodeViewer } from "@/src/components/code-view";
import { Label } from "@/src/components/ui/label";
import { useState } from "react";

const customComboboxCode = `export const searchUsers = async (
  searchTerm: string,
  page: number,
  pageSize: number
): Promise<SearchResponse<ComboBoxItemType>> => {
  try {
    const start = (page - 1) * pageSize;
    let paginatedQueryString = \`_start=\${encodeURIComponent(
      start
    )}&_limit=\${encodeURIComponent(pageSize)}\`;
    if (searchTerm) {
      paginatedQueryString += \`&name_like=\${encodeURIComponent(searchTerm)}\`;
    }

    let countQuery = "";
    if (searchTerm) {
      countQuery = \`?name_like=\${encodeURIComponent(searchTerm)}\`;
    }

    const [paginatedResponse, fullResponse] = await Promise.all([
      fetch(\`http://localhost:4000/users?\${paginatedQueryString}\`),
      fetch(\`http://localhost:4000/users?\${countQuery}\`),
    ]);

    const paginatedData = await paginatedResponse.json().then((s) =>
      s.map((s: User) => ({
        label: s.name,
        value: s.id,
      }))
    );

    const totalItems = await fullResponse.json().then((s) => s.length);

    return {
      data: paginatedData,
      hasMore: start + pageSize < totalItems,
      total: totalItems,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      hasMore: false,
      total: 0,
    };
  }
};

function Example() {
  const [selected, setSelected] = useState<string>("");

  return (
  <CustomCombobox
  value={selected}
  className="max-w-[320px]"
  asyncSearchFn={searchUsers}
  onSelect={(s) => setSelected(s)}
  />
  )
}
`;

const customComboboxComponentCode = `"use client";

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

const CustomCombobox = React.forwardRef<
  { reset: () => void },
  ComboboxWithPaginationProps
>(
  (
    {
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
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const queryKey = React.useId();

    React.useImperativeHandle(ref, () => ({
      reset: () => {
        setSearchTerm("");
        onSelect?.("");
      },
    }));

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
      if (value && Array.isArray(data)) {
        const label = data.find((s) => s.value === value)?.label;
        if (label) {
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
      onSelect?.(item.value);
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
                      key={\`\${escapeKeyValue(item.value)}-\${index}\`}
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
);

CustomCombobox.displayName = "CustomCombobox";

export { CustomCombobox };
`;

export function ComboboxPage() {
  const tCombobox = useTranslations("combobox");
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{tCombobox("title")}</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {tCombobox("subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{tCombobox("examples.pagination.title")}</CardTitle>
            <CardDescription>
              {tCombobox("examples.pagination.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-6 flex flex-col gap-2">
                <Label>Selecione: </Label>
                <CustomCombobox
                  value={selected}
                  className="max-w-[320px]"
                  asyncSearchFn={searchUsers}
                  onSelect={(s) => setSelected(s)}
                />
              </TabsContent>
              <TabsContent value="code" className="mt-6">
                <CodeViewer code={customComboboxComponentCode} language="tsx" />
                <CodeViewer code={customComboboxCode} language="tsx" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{tCombobox("examples.form.title")}</CardTitle>
            <CardDescription>
              {tCombobox("examples.form.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-6">
                <ComboboxWithForm />
              </TabsContent>
              <TabsContent value="code" className="mt-6">
                <CodeViewer code={customComboboxComponentCode} language="tsx" />
                <CodeViewer code={comboboxWithFormCode} language="tsx" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{tCombobox("api.reference")}</CardTitle>
            <CardDescription>{tCombobox("api.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{tCombobox("api.props")}</h4>
                <div className="grid gap-2 text-sm">
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">asyncSearchFn</span>
                    <span className="text-muted-foreground">Function</span>
                    <span>{tCombobox("api.asyncSearchFn")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">queryKey</span>
                    <span className="text-muted-foreground">string</span>
                    <span>{tCombobox("api.queryKey")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">onSelect</span>
                    <span className="text-muted-foreground">Function</span>
                    <span>{tCombobox("api.onSelect")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">initialValue</span>
                    <span className="text-muted-foreground">
                      ComboBoxItemType
                    </span>
                    <span>{tCombobox("api.initialValue")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">placeholder</span>
                    <span className="text-muted-foreground">string</span>
                    <span>{tCombobox("api.placeholder")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">searchPlaceholder</span>
                    <span className="text-muted-foreground">string</span>
                    <span>{tCombobox("api.searchPlaceholder")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">pageSize</span>
                    <span className="text-muted-foreground">number</span>
                    <span>{tCombobox("api.pageSize")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <span className="font-mono">shouldCloseOnSelect</span>
                    <span className="text-muted-foreground">boolean</span>
                    <span>{tCombobox("api.shouldCloseOnSelect")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <span className="font-mono">popoverWidth</span>
                    <span className="text-muted-foreground">string</span>
                    <span>{tCombobox("api.popoverWidth")}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-mono text-sm font-medium">
                      ComboBoxItemType
                    </h5>
                    <div className="bg-muted p-3 rounded-md mt-1">
                      <pre className="text-xs">
                        {`{
  value: string;
  label: string;
}`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-mono text-sm font-medium">
                      SearchResponse
                    </h5>
                    <div className="bg-muted p-3 rounded-md mt-1">
                      <pre className="text-xs">
                        {`{
  options: ComboBoxItemType[];
  total: number;
  skip: number;
  limit: number;
  data?: unknown[];
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
