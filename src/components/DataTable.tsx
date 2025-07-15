"use client";

import type React from "react";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import { Input, Card, CardContent, Badge } from "@/components";
import { Package, Percent } from "lucide-react";
import { getIconStyles, taxas, formatCurrency } from "@/lib";

interface Produto {
  custoTotal: number;
  nome?: string;
}

interface DataTableProps {
  produto: Produto | null;
  percentuais?: Record<string, number>;
  onPercentuaisChange?: (percentuais: Record<string, number>) => void;
}

interface TableRowProps {
  row: {
    key: string;
    icon?: React.ElementType;
    nome?: string;
    percentual: string | number;
    valor: number;
    neon: boolean;
    editavel?: boolean;
    variant?: string;
  };
  index: number;
  onPercentualChange: (key: string, value: number) => void;
}

// Componente de linha memoizado para evitar re-renders desnecessários
const TableRow = memo<TableRowProps & { disabled?: boolean }>(
  ({ row, index, onPercentualChange, disabled }) => {
    const Icon = row.icon;

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onPercentualChange(row.key, Number(e.target.value));
      },
      [row.key, onPercentualChange]
    );

    return (
      <div
        className={`
        border-l-4 border-primary p-2 sm:p-3 bg-transparent hover:bg-primary/10 transition-colors
        ${index === 0 ? "rounded-t-lg" : ""}
        ${index === 9 ? "rounded-b-lg" : ""}
        ${
          row.neon
            ? "bg-[linear-gradient(90deg,hsl(var(--primary)/0.08)_0%,hsl(var(--primary)/0.12)_100%)] shadow-[0_0_6px_0_hsl(var(--primary)/0.12)]"
            : "bg-[linear-gradient(90deg,hsl(var(--muted)/0.08)_0%,hsl(var(--muted)/0.12)_100%)] shadow-[0_0_6px_0_hsl(var(--muted)/0.12)]"
        }
      `}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Icon + Name */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <div
              className={`p-1 sm:p-1.5 rounded-full ${getIconStyles(
                row.variant || ""
              )} flex-shrink-0 bg-primary/10 text-foreground`}
            >
              {Icon && <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
            </div>
            <span className="font-medium text-foreground text-xs sm:text-sm truncate">
              {row.nome}
            </span>
          </div>

          {/* Right: Input + Value */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Percentage Input */}
            <div className="flex items-center gap-1">
              {row.key !== "custo" && row.editavel ? (
                <>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-12 sm:w-14 h-7 sm:h-8 text-xs text-center bg-background/50 border-border/50 text-foreground focus:border-primary focus:ring-primary/20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none [&::-moz-number-spin-up-button]:appearance-none [&::-moz-number-spin-down-button]:appearance-none"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                    value={row.percentual}
                    onChange={handleInputChange}
                    disabled={disabled}
                  />
                  <Percent className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground flex-shrink-0" />
                </>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary dark:text-sky-400 h-7 sm:h-8 flex items-center justify-center"
                >
                  {row.key === "custo" ? "Base" : "Fixo"}
                </Badge>
              )}
            </div>

            {/* Value */}
            <div className="text-right min-w-[60px] sm:min-w-[70px]">
              <div className="font-semibold text-foreground text-xs sm:text-sm">
                {formatCurrency(Number(row.valor))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TableRow.displayName = "TableRow";

// Componente de loading memoizado
const LoadingState = memo(() => (
  <div className="w-full py-6 sm:py-8 text-center text-muted-foreground">
    <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
    <p className="text-xs sm:text-sm">
      Selecione um produto para calcular o markup
    </p>
  </div>
));

LoadingState.displayName = "LoadingState";

export const DataTable: React.FC<DataTableProps> = memo(
  ({ produto, percentuais: percentuaisProp, onPercentuaisChange }) => {
    // Se não houver produto, usar percentuais zerados
    const percentuaisVazios = useMemo(
      () => ({
        custo: 0,
        frete: 0,
        fixas: 0,
        comissao: 0,
        ir: 0,
        icms: 0,
        pis: 0,
        financeiro: 0,
        lucro: 0,
      }),
      []
    );

    const [percentuais, setPercentuais] = useState(() =>
      produto
        ? Object.fromEntries(taxas.map((t) => [t.key, t.valor]))
        : percentuaisVazios
    );

    // Atualiza percentuais quando produto muda
    useEffect(() => {
      if (produto) {
        const novosPercentuais = {
          custo: produto.custoTotal,
          frete: 5.0,
          fixas: 3.0,
          comissao: 2.5,
          ir: 1.5,
          icms: 4.0,
          pis: 1.0,
          financeiro: 2.0,
          lucro: 15.0,
        };
        setPercentuais(novosPercentuais);
      } else {
        setPercentuais(percentuaisVazios);
      }
    }, [produto, percentuaisVazios]);

    // Sincroniza com percentuais externos se fornecidos
    useEffect(() => {
      if (percentuaisProp && Object.keys(percentuaisProp).length > 0) {
        setPercentuais(percentuaisProp);
      }
    }, [percentuaisProp]);

    // Notifica mudanças nos percentuais
    useEffect(() => {
      if (onPercentuaisChange) {
        onPercentuaisChange(percentuais);
      }
    }, [percentuais, onPercentuaisChange]);

    const handlePercentualChange = useCallback((key: string, value: number) => {
      setPercentuais((prev) => ({ ...prev, [key]: value }));
    }, []);

    const rows = useMemo(() => {
      let base = percentuais.custo || 0;
      const valores: Record<string, number> = { custo: base };

      taxas.forEach((taxa) => {
        if (taxa.key !== "custo") {
          valores[taxa.key] = base * ((percentuais as Record<string, number>)[taxa.key] / 100);
          if (taxa.key !== "lucro") base += valores[taxa.key];
        }
      });

      return taxas.map((taxa, index) => ({
        ...taxa,
        percentual: taxa.key === "custo" ? "-" : (percentuais as Record<string, number>)[taxa.key],
        valor: taxa.key === "custo" ? percentuais.custo : valores[taxa.key],
        neon: index % 2 === 0,
      }));
    }, [percentuais]);

    return (
      <div>
        {!produto && (
          <div className="w-full py-2 text-center text-muted-foreground text-xs mb-2">
            Selecione um produto para calcular o markup
          </div>
        )}
        <Card className="p-0 bg-popover">
          <CardContent className="p-0">
            <div className="space-y-0.5">
              {rows.map((row, index) => (
                <TableRow
                  key={row.key}
                  row={row}
                  index={index}
                  onPercentualChange={handlePercentualChange}
                  disabled={!produto}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";

export function DataTableSkeleton() {
  return (
    <div className="w-full">
      <div className="space-y-1">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-10 sm:h-12 bg-muted/60 animate-pulse rounded-lg w-full"
          />
        ))}
      </div>
    </div>
  );
}
