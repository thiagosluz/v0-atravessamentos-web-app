import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { SafeHTML } from "@/components/safe-html"

describe("SafeHTML Component", () => {
  it("should render null if content is empty or null", () => {
    const { container } = render(<SafeHTML content={null} />)
    expect(container.firstChild).toBeNull()
  })

  it("should render allowed HTML tags", () => {
    const html = "<p>Parágrafo com <strong>negrito</strong> e <em>itálico</em>.</p>"
    const { container } = render(<SafeHTML content={html} />)
    expect(container.querySelector("strong")?.textContent).toBe("negrito")
    expect(container.querySelector("em")?.textContent).toBe("itálico")
  })

  it("should allow img tags with attributes", () => {
    const html = '<img src="https://example.com/image.jpg" alt="Foto teste" title="Título da foto" class="rounded-xl" />'
    const { container } = render(<SafeHTML content={html} />)
    const img = container.querySelector("img")
    expect(img).not.toBeNull()
    expect(img?.getAttribute("src")).toBe("https://example.com/image.jpg")
    expect(img?.getAttribute("alt")).toBe("Foto teste")
    expect(img?.getAttribute("title")).toBe("Título da foto")
    expect(img?.getAttribute("class")).toBe("rounded-xl")
  })

  it("should allow figure and figcaption tags", () => {
    const html = '<figure class="editorial-figure"><img src="https://example.com/art.jpg" /><figcaption class="editorial-caption">Legenda</figcaption></figure>'
    const { container } = render(<SafeHTML content={html} />)
    expect(container.querySelector("figure")).not.toBeNull()
    expect(container.querySelector("figcaption")?.textContent).toBe("Legenda")
  })

  it("should sanitize and remove malicious scripts and javascript hrefs", () => {
    const maliciousHtml = '<p>Texto</p><script>alert("hack")</script><a href="javascript:alert(1)">Clique</a>'
    const { container } = render(<SafeHTML content={maliciousHtml} />)
    expect(container.querySelector("script")).toBeNull()
    expect(container.querySelector("a")?.getAttribute("href")).toBeNull()
  })
})
