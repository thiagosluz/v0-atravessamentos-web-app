import React from "react"
import sanitizeHtml from "sanitize-html"

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

  // Configuração para o sanitize-html
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "iframe",
      "img",
      "figure",
      "figcaption",
      "u",
      "s",
      "strike",
      "span",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ["src", "allow", "allowfullscreen", "frameborder", "scrolling", "class", "width", "height"],
      img: ["src", "alt", "title", "width", "height", "loading", "class", "style"],
      a: ["href", "name", "target", "rel", "class"],
      figure: ["class", "style"],
      figcaption: ["class", "style"],
      span: ["class", "style"],
      "*": ["class", "style", "id"], // Permite classes e estilos básicos se necessário
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "data"],
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
  })

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
