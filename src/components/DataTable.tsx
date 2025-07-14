"use client";

import type React from "react";
import { useMemo, useState, useEffect } from "react";
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

export const DataTable: React.FC<DataTableProps> = ({
  produto,
  percentuais: percentuaisProp,
  onPercentuaisChange,
}) => {
  const [percentuais, setPercentuais] = useState(() =>
    Object.fromEntries(taxas.map((t) => [t.key, t.valor]))
  );

  // Inicializa percentuais quando um produto é selecionado
  useEffect(() => {
    if (produto) {
      const novosPercentuais = {
        custo: produto.custoTotal,
        frete: 5.0, // Valores padrão para as taxas
        fixas: 3.0,
        comissao: 2.5,
        ir: 1.5,
        icms: 4.0,
        pis: 1.0,
        financeiro: 2.0,
        lucro: 15.0,
      };
      setPercentuais(novosPercentuais);
    }
  }, [produto]);

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

  const handlePercentualChange = (key: string, value: number) => {
    setPercentuais((prev) => ({ ...prev, [key]: value }));
  };

  const rows = useMemo(() => {
    let base = percentuais.custo || 0;
    const valores: Record<string, number> = { custo: base };

    taxas.forEach((taxa) => {
      if (taxa.key !== "custo") {
        valores[taxa.key] = base * (percentuais[taxa.key] / 100);
        if (taxa.key !== "lucro") base += valores[taxa.key];
      }
    });

    return taxas.map((taxa, index) => ({
      ...taxa,
      percentual: taxa.key === "custo" ? "-" : percentuais[taxa.key],
      valor: taxa.key === "custo" ? percentuais.custo : valores[taxa.key],
      neon: index % 2 === 0,
    }));
  }, [percentuais]);

  if (!produto) {
    return (
      <div className="w-full py-8 text-center text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Selecione um produto para calcular o markup</p>
      </div>
    );
  }

  return (
    <>
      <Card className="p-0 bg-popover">
        <CardContent className="p-0">
          <div className="space-y-0.5">
            {rows.map((row, index) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.key}
                  className={`
                    border-l-4 border-primary p-3 bg-transparent hover:bg-primary/10 transition-colors
                    ${index === 0 ? "rounded-t-lg" : ""}
                    ${index === rows.length - 1 ? "rounded-b-lg" : ""}
                    ${
                      row.neon
                        ? "bg-[linear-gradient(90deg,hsl(var(--primary)/0.08)_0%,hsl(var(--primary)/0.12)_100%)] shadow-[0_0_6px_0_hsl(var(--primary)/0.12)]"
                        : "bg-[linear-gradient(90deg,hsl(var(--muted)/0.08)_0%,hsl(var(--muted)/0.12)_100%)] shadow-[0_0_6px_0_hsl(var(--muted)/0.12)]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Icon + Name */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`p-1.5 rounded-full ${getIconStyles(
                          row.variant
                        )} flex-shrink-0 bg-primary/10 text-foreground`}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5" />}
                      </div>
                      <span className="font-medium text-foreground text-sm truncate">
                        {row.nome}
                      </span>
                    </div>

                    {/* Right: Input + Value */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Percentage Input */}
                      <div className="flex items-center gap-1">
                        {row.key !== "custo" && row.editavel ? (
                          <>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              className="w-14 h-8 text-xs text-center bg-background/50 border-border/50 text-foreground focus:border-primary focus:ring-primary/20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none [&::-moz-number-spin-up-button]:appearance-none [&::-moz-number-spin-down-button]:appearance-none"
                              style={{
                                WebkitAppearance: "none",
                                MozAppearance: "textfield",
                              }}
                              value={row.percentual}
                              onChange={(e) =>
                                handlePercentualChange(
                                  row.key,
                                  Number(e.target.value)
                                )
                              }
                            />
                            <Percent className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          </>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-1 bg-primary/10 text-primary dark:text-sky-400 h-8 flex items-center justify-center"
                          >
                            {row.key === "custo" ? "Base" : "Fixo"}
                          </Badge>
                        )}
                      </div>

                      {/* Value */}
                      <div className="text-right min-w-[70px]">
                        <div className="font-semibold text-foreground text-sm">
                          {formatCurrency(Number(row.valor))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
