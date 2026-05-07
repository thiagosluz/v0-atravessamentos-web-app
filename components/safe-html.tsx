import React from "react"
import DOMPurify from "isomorphic-dompurify"

interface SafeHTMLProps {
  content: string | null | undefined
  className?: string
  as?: "div" | "article" | "section"
}

/**
 * Renderiza HTML de forma segura, sanitizando contra ataques XSS.
 * Ideal para conteúdos vindos do Tiptap ou CMS.
 */
export function SafeHTML({ content, className, as: Component = "div" }: SafeHTMLProps) {
  if (!content) return null

  // Configuração rigorosa para o DOMPurify
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ["iframe"], // Permite iframes para vídeos do YouTube se necessário
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  })

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
