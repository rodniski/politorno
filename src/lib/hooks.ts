"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import { Produto } from "./products";

interface CalculoResultado {
  precoVenda: number;
  markup: number;
  despesas: number;
  lucro: number;
  custoBase: number;
}

// Hook para cálculos de markup otimizado
export const useMarkupCalculations = (
  selectedProduct: Produto | null,
  percentuais: Record<string, number>
): CalculoResultado => {
  return useMemo(() => {
    if (!selectedProduct || !percentuais.custo || percentuais.custo <= 0) {
      return {
        precoVenda: 0,
        markup: 0,
        despesas: 0,
        lucro: 0,
        custoBase: 0,
      };
    }

    const custoBase = percentuais.custo;
    let despesas = 0;

    // Calcula todas as despesas em uma única iteração
    Object.entries(percentuais).forEach(([key, value]) => {
      if (key !== "custo" && key !== "lucro" && value > 0) {
        despesas += custoBase * (value / 100);
      }
    });

    const subtotal = custoBase + despesas;
    const lucro =
      percentuais.lucro && percentuais.lucro > 0
        ? subtotal * (percentuais.lucro / 100)
        : 0;

    const precoVenda = subtotal + lucro;
    const markup = (precoVenda / custoBase - 1) * 100;

    return {
      precoVenda,
      markup,
      despesas,
      lucro,
      custoBase,
    };
  }, [selectedProduct, percentuais]);
};

// Hook para inicialização de percentuais padrão
export const useDefaultPercentuais = (produto: Produto | null) => {
  return useMemo(() => {
    if (!produto) return {};

    return {
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
  }, [produto]);
};

// Hook para formatação de moeda otimizada
export const useCurrencyFormatter = () => {
  return useCallback((value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, []);
};

// Hook para debounce de busca
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para filtro de produtos otimizado
export const useProductFilter = (produtos: Produto[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return produtos;

    const term = searchTerm.toLowerCase();
    return produtos.filter(
      (produto) =>
        produto.descricao.toLowerCase().includes(term) ||
        produto.codigo.toLowerCase().includes(term)
    );
  }, [produtos, searchTerm]);
};
