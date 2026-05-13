import { z } from "zod"

// Esquema para Configurações do Site
export const siteSettingsSchema = z.object({
  seo_title: z.string().min(3).max(100),
  seo_description: z.string().min(10).max(500),
  footer_description: z.string().min(10).max(500),
  contact_email: z.string().email(),
  location_text: z.string().min(5),
  location_url: z.string().url().optional().or(z.literal("")),
  instagram_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  youtube_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  whatsapp_number: z.string().optional().or(z.null()),
  og_image_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  hero_image_url: z.string().url().optional().or(z.literal("")).or(z.null()),
  about_images: z.array(z.string().url().optional().or(z.literal("")).or(z.null())).optional().or(z.null()),
  stats_years: z.string().optional().or(z.null()),
  stats_projects: z.string().optional().or(z.null()),
  stats_cities: z.string().optional().or(z.null()),
})

// Esquema para Ativos da Galeria (Acervo)
export const galleryAssetSchema = z.object({
  title: z.string().max(100).optional().or(z.literal("")),
  description: z.string().max(1000).optional().or(z.literal("")),
  location: z.string().optional().nullable(),
  project_id: z.string().uuid().optional().nullable().or(z.literal("")).or(z.literal("none")),
  tags: z.array(z.string()).optional(),
})

// Esquema para Tags da Galeria
export const galleryTagSchema = z.object({
  name: z.string().min(2).max(30),
  color: z.string().optional().or(z.null()),
})

// Esquema para Posts do Blog
export const blogPostSchema = z.object({
  title: z.string().min(5, "Título muito curto").max(200),
  category: z.string().min(1, "Selecione uma categoria"),
  excerpt: z.string().min(10, "Resumo muito curto").max(500),
  content: z.string().min(20, "Conteúdo muito curto"),
  author: z.string().min(2, "Nome do autor é obrigatório"),
  read_time: z.string().optional(),
  status: z.enum(["Publicado", "Rascunho"]),
})

// Esquema para Projetos
export const projectSchema = z.object({
  title: z.string().min(5, "Título muito curto").max(200),
  category: z.string().min(1, "Selecione uma categoria"),
  excerpt: z.string().min(10, "Resumo muito curto").max(500),
  description: z.string().optional().or(z.literal("")),
  year: z.string().regex(/^\d{4}$/, "Ano inválido"),
  status: z.enum(["Publicado", "Rascunho", "Em revisão"]),
})

// Esquema para Contato
export const contactSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  category: z.string().min(1, "Selecione uma categoria"),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
})
