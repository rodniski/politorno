"use client";
import React, { useState } from "react";
import { Produto } from "@/lib/products";
import { DialogSearch } from "@/components/DialogSearch";

interface ProductDialogSearchProps {
  produtos: Produto[];
  value: Produto | null;
  onChange: (produto: Produto) => void;
}

export const ProductDialogSearch: React.FC<ProductDialogSearchProps> = ({
  produtos,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Filtro que mostra todos os produtos se não houver termo, ou filtra se houver
  const filtered =
    term.length === 0
      ? produtos
      : produtos.filter(
          (p) =>
            p.descricao.toLowerCase().includes(term.toLowerCase()) ||
            p.codigo.toLowerCase().includes(term.toLowerCase())
        );

  return (
    <DialogSearch<Produto>
      open={open}
      onOpenChange={setOpen}
      term={term}
      onTermChange={(v) => {
        setTerm(v);
        setHasUserTyped(true);
      }}
      options={filtered}
      isLoading={false}
      hasUserTyped={hasUserTyped}
      searchError={null}
      label={
        value ? `${value.codigo} - ${value.descricao}` : "Buscar produto..."
      }
      current={value}
      onSelect={(produto) => {
        onChange(produto);
        setTerm("");
        setHasUserTyped(false);
      }}
      placeholder="Digite nome ou código..."
      buttonIcon={null}
      buttonClassName="w-full"
    >
      {(produto) => (
        <div className="flex items-center justify-between w-full py-0">
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            <span className="font-medium text-sm truncate">
              {produto.descricao}
            </span>
            <span className="text-xs text-muted-foreground">
              {produto.codigo}
            </span>
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
      )}
    </DialogSearch>
  );
};
