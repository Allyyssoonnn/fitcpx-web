"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { XIcon } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
   value: string;
   label: string;
   disable?: boolean;
   /** fixed option that can't be removed. */
   fixed?: boolean;
   /** Group the options by providing key. */
   [key: string]: string | boolean | undefined;
}
interface GroupOption {
   [key: string]: Option[];
}

interface MultipleSelectorProps {
   value?: Option[];
   defaultOptions?: Option[];
   options?: Option[];
   placeholder?: string;
   loadingIndicator?: React.ReactNode;
   emptyIndicator?: React.ReactNode;
   delay?: number;
   triggerSearchOnFocus?: boolean;
   onSearch?: (value: string) => Promise<Option[]>;
   onSearchSync?: (value: string) => Option[];
   onChange?: (options: Option[]) => void;
   maxSelected?: number;
   onMaxSelected?: (maxLimit: number) => void;
   hidePlaceholderWhenSelected?: boolean;
   disabled?: boolean;
   groupBy?: string;
   className?: string;
   badgeClassName?: string;
   selectFirstItem?: boolean;
   creatable?: boolean;
   commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
   inputProps?: Omit<
      React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
      "value" | "placeholder" | "disabled"
   >;
   hideClearAllButton?: boolean;
}

export interface MultipleSelectorRef {
   selectedValue: Option[];
   input: HTMLInputElement;
   focus: () => void;
   reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
   const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

   useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
      return () => {
         clearTimeout(timer);
      };
   }, [value, delay]);

   return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
   if (options.length === 0) {
      return {};
   }
   if (!groupBy) {
      return {
         "": options,
      };
   }

   const groupOption: GroupOption = {};
   options.forEach((option) => {
      const key = (option[groupBy] as string) || "";
      if (!groupOption[key]) {
         groupOption[key] = [];
      }
      groupOption[key].push(option);
   });
   return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
   const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

   for (const [key, value] of Object.entries(cloneOption)) {
      cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
   }
   return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
   for (const [, value] of Object.entries(groupOption)) {
      if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
         return true;
      }
   }
   return false;
}

const CommandEmpty = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
   const render = useCommandState((state) => state.filtered.count === 0);
   if (!render) return null;
   return (
      <div className={cn("px-2 py-4 text-center text-sm", className)} cmdk-empty="" role="presentation" {...props} />
   );
};

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = ({
   value,
   onChange,
   placeholder,
   defaultOptions: arrayDefaultOptions = [],
   options: arrayOptions,
   delay,
   onSearch,
   onSearchSync,
   loadingIndicator,
   emptyIndicator,
   maxSelected = Number.MAX_SAFE_INTEGER,
   onMaxSelected,
   hidePlaceholderWhenSelected,
   disabled,
   groupBy,
   className,
   badgeClassName,
   selectFirstItem = true,
   creatable = false,
   triggerSearchOnFocus = false,
   commandProps,
   inputProps,
   hideClearAllButton = false,
}: MultipleSelectorProps) => {
   const inputRef = React.useRef<HTMLInputElement>(null);
   const [open, setOpen] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const dropdownRef = React.useRef<HTMLDivElement>(null);

   const [selected, setSelected] = React.useState<Option[]>(value || []);
   const [options, setOptions] = React.useState<GroupOption>(transToGroupOption(arrayDefaultOptions, groupBy));
   const [inputValue, setInputValue] = React.useState("");
   const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

   // --- FIX PARA ANDROID: Lógica de fechar ao clicar fora ---
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
         if (!open) return;

         const target = event.target as Node;
         const isInsideDropdown = dropdownRef.current?.contains(target);
         const isInsideInput = inputRef.current?.contains(target);

         // Se clicou fora do dropdown E fora do input
         if (!isInsideDropdown && !isInsideInput) {
            setOpen(false);
            inputRef.current?.blur(); // Tira o foco para fechar teclado mobile
         }
      };

      if (open) {
         // O segredo está aqui: ouvir 'touchstart' além de 'mousedown'
         document.addEventListener("mousedown", handleClickOutside);
         document.addEventListener("touchstart", handleClickOutside);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("touchstart", handleClickOutside);
      };
   }, [open]);
   // ---------------------------------------------------------

   const handleUnselect = React.useCallback(
      (option: Option) => {
         const newOptions = selected.filter((s) => s.value !== option.value);
         setSelected(newOptions);
         onChange?.(newOptions);
      },
      [onChange, selected]
   );

   const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
         const input = inputRef.current;
         if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
               if (input.value === "" && selected.length > 0) {
                  const lastSelectOption = selected[selected.length - 1];
                  if (!lastSelectOption.fixed) {
                     handleUnselect(selected[selected.length - 1]);
                  }
               }
            }
            if (e.key === "Escape") {
               input.blur();
               setOpen(false); // Garante fechamento no Esc
            }
         }
      },
      [handleUnselect, selected]
   );

   useEffect(() => {
      if (value) {
         setSelected(value);
      }
   }, [value]);

   useEffect(() => {
      if (!arrayOptions || onSearch) {
         return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
         setOptions(newOption);
      }
   }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

   useEffect(() => {
      const doSearchSync = () => {
         const res = onSearchSync?.(debouncedSearchTerm);
         setOptions(transToGroupOption(res || [], groupBy));
      };

      const exec = async () => {
         if (!onSearchSync || !open) return;

         if (triggerSearchOnFocus) {
            doSearchSync();
         }

         if (debouncedSearchTerm) {
            doSearchSync();
         }
      };

      void exec();
   }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

   useEffect(() => {
      const doSearch = async () => {
         setIsLoading(true);
         const res = await onSearch?.(debouncedSearchTerm);
         setOptions(transToGroupOption(res || [], groupBy));
         setIsLoading(false);
      };

      const exec = async () => {
         if (!onSearch || !open) return;

         if (triggerSearchOnFocus) {
            await doSearch();
         }

         if (debouncedSearchTerm) {
            await doSearch();
         }
      };

      void exec();
   }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

   const CreatableItem = () => {
      if (!creatable) return undefined;
      if (
         isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
         selected.find((s) => s.value === inputValue)
      ) {
         return undefined;
      }

      const Item = (
         <CommandItem
            value={inputValue}
            className="cursor-pointer"
            onMouseDown={(e) => {
               e.preventDefault();
               e.stopPropagation();
            }}
            onSelect={(value: string) => {
               if (selected.length >= maxSelected) {
                  onMaxSelected?.(selected.length);
                  return;
               }
               setInputValue("");
               const newOptions = [...selected, { value, label: value }];
               setSelected(newOptions);
               onChange?.(newOptions);
            }}
         >
            {`Create "${inputValue}"`}
         </CommandItem>
      );

      if (!onSearch && inputValue.length > 0) {
         return Item;
      }

      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
         return Item;
      }

      return undefined;
   };

   const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      if (onSearch && !creatable && Object.keys(options).length === 0) {
         return (
            <CommandItem value="-" disabled>
               {emptyIndicator}
            </CommandItem>
         );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
   }, [creatable, emptyIndicator, onSearch, options]);

   const selectables = React.useMemo<GroupOption>(() => removePickedOption(options, selected), [options, selected]);

   const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
         return commandProps.filter;
      }

      if (creatable) {
         return (value: string, search: string) => {
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
         };
      }
      return (value: string, search: string) => {
         const normalize = (str: string) =>
            str
               .normalize("NFD")
               .replace(/[\u0300-\u036f]/g, "")
               .toLowerCase();

         return normalize(value).includes(normalize(search)) ? 1 : -1;
      };
   }, [creatable, commandProps?.filter]);

   return (
      <Command
         ref={dropdownRef}
         {...commandProps}
         onKeyDown={(e) => {
            handleKeyDown(e);
            commandProps?.onKeyDown?.(e);
         }}
         className={cn("h-auto overflow-visible bg-transparent", commandProps?.className)}
         shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch}
         filter={commandFilter()}
      >
         <div
            className={cn(
               "border-input focus-within:border-ring focus-within:ring-ring/50 relative min-h-[38px] rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px]",
               {
                  "p-1": selected.length !== 0,
                  "cursor-text": !disabled && selected.length !== 0,
               },
               !hideClearAllButton && "pe-9",
               className
            )}
            onClick={() => {
               if (disabled) return;
               inputRef?.current?.focus();
            }}
         >
            <div className="flex flex-wrap gap-1">
               {selected.map((option) => {
                  return (
                     <div
                        key={option.value}
                        className={cn(
                           "animate-fadeIn bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 pl-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-2",
                           badgeClassName
                        )}
                        data-fixed={option.fixed}
                        data-disabled={disabled || undefined}
                     >
                        {option.label}
                        <button
                           className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 handleUnselect(option);
                              }
                           }}
                           onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                           }}
                           onClick={() => handleUnselect(option)}
                        >
                           <XIcon size={14} />
                        </button>
                     </div>
                  );
               })}
               <CommandPrimitive.Input
                  {...inputProps}
                  ref={inputRef}
                  value={inputValue}
                  disabled={disabled}
                  onValueChange={(value) => {
                     setInputValue(value);
                     inputProps?.onValueChange?.(value);
                  }}
                  onBlur={(event) => {
                     // Removemos a lógica de fechar no onBlur aqui, pois o useEffect do 'touchstart' cuida disso de forma mais segura no Android
                     inputProps?.onBlur?.(event);
                  }}
                  onFocus={(event) => {
                     setOpen(true);
                     if (triggerSearchOnFocus) {
                        onSearch?.(debouncedSearchTerm);
                     }
                     inputProps?.onFocus?.(event);
                  }}
                  placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? "" : placeholder}
                  className={cn(
                     "placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-none disabled:cursor-not-allowed",
                     {
                        "w-full": hidePlaceholderWhenSelected,
                        "px-3 py-2": selected.length === 0,
                        "ml-1": selected.length !== 0,
                     },
                     inputProps?.className
                  )}
               />
               <button
                  type="button"
                  onClick={() => {
                     setSelected(selected.filter((s) => s.fixed));
                     onChange?.(selected.filter((s) => s.fixed));
                  }}
                  className={cn(
                     "text-muted-foreground/80 hover:text-foreground absolute end-0 top-0 flex size-9 items-center justify-center rounded-md border border-transparent outline-none",
                     (hideClearAllButton ||
                        disabled ||
                        selected.length < 1 ||
                        selected.filter((s) => s.fixed).length === selected.length) &&
                        "hidden"
                  )}
               >
                  <XIcon size={16} />
               </button>
            </div>
         </div>
         <div className="relative">
            {open && (
               <div
                  className={cn(
                     "border-input absolute top-2 z-10 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
                  )}
               >
                  <CommandList
                     className="max-h-[300px] overflow-auto"
                     // Garante que o scroll no mobile não feche o menu acidentalmente se a lógica de blur existisse
                     onTouchStart={(e) => e.stopPropagation()}
                  >
                     {isLoading ? (
                        <>{loadingIndicator}</>
                     ) : (
                        <>
                           {EmptyItem()}
                           {CreatableItem()}
                           {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                           {Object.entries(selectables).map(([key, dropdowns]) => (
                              <CommandGroup key={key} heading={key}>
                                 {dropdowns.map((option) => (
                                    <CommandItem
                                       key={option.value}
                                       value={option.value}
                                       disabled={option.disable}
                                       onMouseDown={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                       }}
                                       onSelect={() => {
                                          if (selected.length >= maxSelected) {
                                             onMaxSelected?.(selected.length);
                                             return;
                                          }
                                          setInputValue("");
                                          const newOptions = [...selected, option];
                                          setSelected(newOptions);
                                          onChange?.(newOptions);
                                          // Mantém aberto para selecionar múltiplos? Normalmente sim.
                                       }}
                                       className="cursor-pointer"
                                    >
                                       {option.label}
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                           ))}
                        </>
                     )}
                  </CommandList>
               </div>
            )}
         </div>
      </Command>
   );
};

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
