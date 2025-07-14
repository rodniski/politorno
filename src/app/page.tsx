"use client";

import { useState, useMemo } from "react";
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
import { Calculator, DollarSign, Package } from "lucide-react";
import { Produto, produtos } from "@/lib/products";
import { ModeToggle } from "@/lib/theme";
import { formatCurrency } from "@/lib";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [percentuais, setPercentuais] = useState<Record<string, number>>({});

  // Calcula o preço de venda baseado nos percentuais
  const precoVenda = useMemo(() => {
    if (!selectedProduct || !percentuais.custo) return 0;

    let base = percentuais.custo;
    let subtotal = base;

    // Adiciona todas as despesas (exceto lucro)
    Object.entries(percentuais).forEach(([key, value]) => {
      if (key !== "custo" && key !== "lucro" && value > 0) {
        subtotal += base * (value / 100);
      }
    });

    // Aplica o lucro sobre o subtotal
    if (percentuais.lucro && percentuais.lucro > 0) {
      subtotal += subtotal * (percentuais.lucro / 100);
    }

    return subtotal;
  }, [selectedProduct, percentuais]);

  return (
    <div className="h-screen relative overflow-auto">
      <div className="absolute top-5 right-5 z-20">
        <ModeToggle />
      </div>
      <div className="p-10">
        <div className="max-w-lg mx-auto space-y-4">
          <Card className="shadow-lg shadow-primary/20 border-0 bg-popover/95 backdrop-blur-sm relative z-10">
            <CardHeader className="flex flex-col items-center justify-between gap-4">
              <CardTitle className="flex items-center justify-between gap-2 text-base w-full">
                <div className="flex items-center justify-start gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Calculadora de Markup - Politorno
                </div>
                {selectedProduct && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    R$ {selectedProduct.custoTotal.toFixed(2)}
                  </Badge>
                )}
              </CardTitle>
              <ProductDialogSearch
                produtos={produtos}
                value={selectedProduct}
                onChange={setSelectedProduct}
              />
            </CardHeader>
            <CardContent>
              <DataTable
                produto={selectedProduct}
                percentuais={percentuais}
                onPercentuaisChange={setPercentuais}
              />
            </CardContent>
            <CardFooter>
              {/* Compact Price Summary */}
              {selectedProduct && (
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-0 w-full h-16 backdrop-blur-sm">
                  <CardContent className="px-4 w-full flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      <span className="font-medium">Preço de Venda</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatCurrency(precoVenda)}
                      </div>
                      <div className="text-xs opacity-80">
                        Markup:{" "}
                        {percentuais.custo && percentuais.custo > 0
                          ? (
                              (precoVenda / percentuais.custo - 1) *
                              100
                            ).toFixed(1)
                          : "0.0"}
                        %
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      <BackgroundBeams className="absolute inset-0 opacity-50" />
    </div>
  );
}
