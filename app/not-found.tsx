import { ErrorLayout } from "@/components/ui/error-layout"

export const metadata = {
  title: "Página não encontrada | Atravessamentos",
  description: "O caminho que você procurou não existe ou foi movido para uma nova travessia.",
}

export default function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="Caminho Perdido"
      message="A travessia que você buscou parece ter se dissipado ou mudado de direção. Que tal explorar nossas rotas conhecidas?"
      action={{
        label: "Ver projetos",
        href: "/projetos"
      }}
    />
  )
}
