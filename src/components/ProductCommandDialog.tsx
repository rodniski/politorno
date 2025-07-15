"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Produto } from "@/lib/products";
import { DialogSearch } from "@/components/DialogSearch";

interface ProductDialogSearchProps {
  produtos: Produto[];
  value: Produto | null;
  onChange: (produto: Produto) => void;
}

// Componente de item do produto memoizado
const ProductItem = React.memo<{ produto: Produto }>(({ produto }) => (
  <div className="flex items-center justify-between w-full py-0">
    <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
      <span className="font-medium text-sm truncate">{produto.descricao}</span>
      <span className="text-xs text-muted-foreground">{produto.codigo}</span>
    </div>
    <div className="flex flex-col items-end gap-0.5 text-xs text-right flex-shrink-0 ml-2">
      <span className="text-muted-foreground">
        Custo: <b>R$ {produto.custoTotal.toFixed(2)}</b>
      </span>
      <span className="text-muted-foreground">
        Preço: <b>R$ {produto.precoLiquido.toFixed(2)}</b>
      </span>
    </div>
  </div>
));

ProductItem.displayName = "ProductItem";

export const ProductDialogSearch: React.FC<ProductDialogSearchProps> =
  React.memo(({ produtos, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState("");
    const [hasUserTyped, setHasUserTyped] = useState(false);

    // Memoização do filtro de produtos para evitar recálculos desnecessários
    const filtered = useMemo(() => {
      if (term.length === 0) return produtos;

      const searchTerm = term.toLowerCase();
      return produtos.filter(
        (p) =>
          p.descricao.toLowerCase().includes(searchTerm) ||
          p.codigo.toLowerCase().includes(searchTerm)
      );
    }, [produtos, term]);

    // Callbacks memoizados para evitar re-renders
    const handleTermChange = useCallback((newTerm: string) => {
      setTerm(newTerm);
      setHasUserTyped(true);
    }, []);

    const handleSelect = useCallback(
      (produto: Produto) => {
        onChange(produto);
        setTerm("");
        setHasUserTyped(false);
      },
      [onChange]
    );

    const handleOpenChange = useCallback((newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setTerm("");
        setHasUserTyped(false);
      }
    }, []);

    // Memoização do label para evitar recálculos
    const label = useMemo(() => {
      return value
        ? `${value.codigo} - ${value.descricao}`
        : "Buscar produto...";
    }, [value]);

    return (
      <DialogSearch<Produto>
        open={open}
        onOpenChange={handleOpenChange}
        term={term}
        onTermChange={handleTermChange}
        options={filtered}
        isLoading={false}
        hasUserTyped={hasUserTyped}
        searchError={null}
        label={label}
        current={value}
        onSelect={handleSelect}
        placeholder="Digite nome ou código..."
        buttonIcon={null}
        buttonClassName="w-full"
      >
        {(produto) => <ProductItem produto={produto} />}
      </DialogSearch>
    );
  });

ProductDialogSearch.displayName = "ProductDialogSearch";
