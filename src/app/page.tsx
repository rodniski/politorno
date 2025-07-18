"use client";

import { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { DataTable } from "@/components";
import { ProductDialogSearch } from "@/components/ProductCommandDialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package } from "lucide-react";
import { Produto, produtos } from "@/lib/products";
import { ModeToggle } from "@/lib/theme";
import { formatCurrency } from "@/lib";

// Lazy loading do componente pesado de background
const BackgroundBeams = lazy(() =>
  import("@/components/ui/background-beams").then((module) => ({
    default: module.BackgroundBeams,
  }))
);

// Componente de loading para o background
const BackgroundLoader = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20" />
);

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [percentuais, setPercentuais] = useState<Record<string, number>>({});

  // Memoização do callback para evitar re-renders desnecessários
  const handleProductChange = useCallback((product: Produto) => {
    setSelectedProduct(product);
  }, []);

  const handlePercentuaisChange = useCallback(
    (newPercentuais: Record<string, number>) => {
      setPercentuais(newPercentuais);
    },
    []
  );

  // Otimização do cálculo de preço de venda com useMemo mais eficiente
  const { precoVenda, markup } = useMemo(() => {
    if (!selectedProduct || !percentuais.custo || percentuais.custo <= 0) {
      return { precoVenda: 0, markup: 0 };
    }

    const base = percentuais.custo;
    let subtotal = base;

    // Calcula despesas em uma única iteração
    Object.entries(percentuais).forEach(([key, value]) => {
      if (key !== "custo" && key !== "lucro" && value > 0) {
        const valor = base * (value / 100);
        subtotal += valor;
      }
    });

    // Aplica lucro sobre o subtotal
    const lucro =
      percentuais.lucro && percentuais.lucro > 0
        ? subtotal * (percentuais.lucro / 100)
        : 0;

    const precoFinal = subtotal + lucro;
    const markupCalculado = (precoFinal / base - 1) * 100;

    return {
      precoVenda: precoFinal,
      markup: markupCalculado,
    };
  }, [selectedProduct, percentuais]);

  // Memoização do resumo de preço
  const priceSummary = useMemo(() => {
    if (!selectedProduct) return null;

    return (
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-0 w-full backdrop-blur-sm">
        <CardContent className="px-3 sm:px-4 py-3 sm:py-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">
              Preço de Venda
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-2xl font-bold">
              {formatCurrency(precoVenda)}
            </div>
            <div className="text-xs opacity-80">
              Markup: {markup.toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [selectedProduct, precoVenda, markup]);

  return (
    <div className="min-h-screen relative overflow-auto">
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto space-y-3 sm:space-y-4">
          <Card className="shadow-lg shadow-primary/20 border-0 bg-popover/95 backdrop-blur-sm relative z-10">
            <CardHeader className="flex flex-col items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between gap-2 text-sm sm:text-base w-full">
                <div className="flex items-center justify-start gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Calculadora de Markup - Politorno</span>
                </div>
                <ModeToggle />
              </CardTitle>
              <ProductDialogSearch
                produtos={produtos}
                value={selectedProduct}
                onChange={handleProductChange}
              />
            </CardHeader>
            <CardContent className="p-2 sm:p-3">
              <DataTable
                produto={selectedProduct}
                percentuais={percentuais}
                onPercentuaisChange={handlePercentuaisChange}
              />
            </CardContent>
            <CardFooter className="p-4 sm:p-6 pt-0">{priceSummary}</CardFooter>
          </Card>
        </div>
      </div>
      <Suspense fallback={<BackgroundLoader />}>
        <BackgroundBeams className="absolute inset-0 opacity-50" />
      </Suspense>
    </div>
  );
}
