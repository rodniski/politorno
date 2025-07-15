import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Página não encontrada
      </p>
      <Link href="/" className="text-primary underline text-base">
        Voltar para o início
      </Link>
    </div>
  );
}
