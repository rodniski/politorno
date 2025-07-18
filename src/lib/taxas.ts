import { Package, Truck, Building, Users, Receipt, FileText, Calculator, CreditCard, Target } from "lucide-react";

// Suas taxas reais com ícones apropriados
export const taxas = [
  {
    nome: "Custo",
    key: "custo",
    valor: 0,
    editavel: true,
    icon: Package,
    variant: "default",
  },
  {
    nome: "Frete",
    key: "frete",
    valor: 0,
    editavel: true,
    icon: Truck,
    variant: "default",
  },
  {
    nome: "Despesas Fixas",
    key: "fixas",
    valor: 0,
    editavel: true,
    icon: Building,
    variant: "default",
  },
  {
    nome: "Comissão Repres.",
    key: "comissao",
    valor: 0,
    editavel: true,
    icon: Users,
    variant: "default",
  },
  {
    nome: "I. Renda",
    key: "ir",
    valor: 2.5,
    editavel: false,
    icon: Receipt,
    variant: "default",
  },
  {
    nome: "ICMS",
    key: "icms",
    valor: 0,
    editavel: true,
    icon: FileText,
    variant: "default",
  },
  {
    nome: "PIS/COFINS",
    key: "pis",
    valor: 9.25,
    editavel: false,
    icon: Calculator,
    variant: "default",
  },
  {
    nome: "Financeiro",
    key: "financeiro",
    valor: 0,
    editavel: true,
    icon: CreditCard,
    variant: "default",
  },
  {
    nome: "Lucro",
    key: "lucro",
    valor: 0,
    editavel: true,
    icon: Target,
    variant: "default",
  },
];
