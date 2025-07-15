// DialogSearch.tsx
import React from "react";
import {
  Button,
  CommandDialog,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  Input,
  Separator,
} from "@/components";
import { Loader2, XCircle, Search, CornerDownLeft } from "lucide-react";
// DialogSearch.tsx (stateless)
interface DialogSearchProps<T> {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  term: string;
  onTermChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  options: T[];
  isLoading: boolean;
  hasUserTyped: boolean;
  searchError: Error | string | null;
  label?: string;
  disabled?: boolean;
  buttonIcon?: React.ReactNode;
  buttonClassName?: string;
  placeholder?: string;
  current?: T | null;
  onSelect: (option: T) => void;
  groupLabel?: (options: T[]) => string;
  groupOptions?: (
    options: T[]
  ) => Array<{ label: React.ReactNode; items: T[] }>;
  children: (option: T, current: T | null) => React.ReactNode;
}

export function DialogSearch<T>({
  open,
  onOpenChange,
  term,
  onTermChange,
  onKeyDown,
  options,
  isLoading,
  hasUserTyped,
  searchError,
  label = "Selecionar...",
  disabled,
  buttonIcon,
  buttonClassName,
  placeholder = "Digite para buscar...",
  current,
  onSelect,
  groupLabel,
  groupOptions,
  children,
}: DialogSearchProps<T>) {
  const safeCurrent = current ?? null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={`w-full justify-between group hover:border-primary/50 transition-colors text-sm sm:text-base ${
          buttonClassName || ""
        }`}
        onClick={() => !disabled && onOpenChange(true)}
        disabled={disabled}
        title={label}
      >
        <span className="truncate">{label}</span>
        {buttonIcon}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        showCloseButton={false}
        className="border-2 sm:border-4 border-input min-h-[80vh] md:min-h-[50vh]"
      >
        <div className="relative m-2 sm:m-3">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            autoFocus
            placeholder={placeholder}
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="text-sm sm:text-base bg-input pl-8 focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-col h-full ">
          <div className="flex-1 overflow-hidden">
            <CommandList className="min-h-[80vh] overflow-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 py-8 sm:py-10 text-xs sm:text-sm text-muted-foreground">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span>Buscando...</span>
                </div>
              ) : searchError ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 sm:py-10 text-xs sm:text-sm text-muted-foreground">
                  <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
                  <div className="font-semibold text-destructive">
                    Erro ao buscar
                  </div>
                  <div className="text-xs text-muted-foreground/70">
                    {typeof searchError === "string"
                      ? searchError
                      : searchError?.message}
                  </div>
                </div>
              ) : options.length > 0 ? (
                groupOptions ? (
                  // Renderiza múltiplos grupos
                  <>
                    {groupOptions(options).map((group, groupIdx) => (
                      <CommandGroup key={groupIdx} heading={group.label}>
                        {group.items.map((opt, idx) => (
                          <CommandItem
                            key={`${groupIdx}-${idx}`}
                            onSelect={() => {
                              onSelect(opt);
                              onOpenChange(false);
                            }}
                            className="flex justify-between p-0 items-start cursor-pointer relative hover:bg-accent/50 data-[selected=true]:border"
                          >
                            {children(opt, safeCurrent)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </>
                ) : (
                  // Renderiza um único grupo (comportamento original)
                  <CommandGroup
                    heading={
                      groupLabel
                        ? groupLabel(options)
                        : `${options.length} encontrado(s)`
                    }
                  >
                    {options.map((opt, idx) => (
                      <CommandItem
                        key={idx}
                        onSelect={() => {
                          onSelect(opt);
                          onOpenChange(false);
                        }}
                        className="flex justify-between p-0 items-start cursor-pointer relative hover:bg-accent/50 data-[selected=true]:border"
                      >
                        {children(opt, safeCurrent)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              ) : (
                <CommandEmpty>
                  <div className="text-center py-4 sm:py-6">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {term.trim().length < 2
                        ? "Digite pelo menos 2 caracteres para buscar"
                        : hasUserTyped
                        ? "Nenhum resultado encontrado"
                        : "Digite para buscar"}
                    </div>
                    {hasUserTyped && term.trim().length >= 2 && (
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Tente outros critérios.
                      </div>
                    )}
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </div>
          <div className="bg-border border-t border-border flex justify-start gap-2 items-center w-full h-10 sm:h-12 p-2 flex-shrink-0">
            <div className="flex gap-1 sm:gap-2">
              <Button
                className="size-5 sm:size-6 rounded-sm bg-background flex gap-1 sm:gap-2"
                onClick={() => onOpenChange(false)}
              >
                <span className="text-xs text-foreground">esc</span>
              </Button>
              <span className="text-xs sm:text-sm">Cancelar</span>
            </div>
            <Separator orientation="vertical" className="h-4 sm:h-6" />
            <div className="flex gap-1 sm:gap-2">
              <Button
                className="text-foreground size-5 sm:size-6 rounded-sm bg-background flex gap-1 sm:gap-2"
                onClick={() => onOpenChange(false)}
              >
                <CornerDownLeft className="h-2 w-2" />
              </Button>
              <span className="text-xs sm:text-sm">Selecionar</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
}
