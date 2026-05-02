// ============================================================================
// Tipos de dados — prontos para integração com backend (CMS, Supabase, etc.)
// ============================================================================

export type ProjectCategory = "Audiovisual" | "Educação" | "Evento" | "Pesquisa" | "Editorial"
export type ProjectStatus = "Publicado" | "Rascunho" | "Em revisão"

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  description: string
  coverImage: string
  year: number
  status: ProjectStatus
  updatedAt: string
}

export interface Member {
  id: string
  name: string
  role: string
  tags: string[]
  avatar: string
  bio: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: "Reflexão" | "Evento" | "Manifesto" | "Notícia"
  author: string
  date: string
  readTime: string
  coverImage: string
}

// ============================================================================
// Mock data
// ============================================================================

export const projects: Project[] = [
  {
    id: "p-001",
    title: "América Invertida",
    category: "Audiovisual",
    description:
      "Série documental que inverte o mapa colonial e revisita narrativas do sul global a partir do interior do Brasil.",
    coverImage: "/placeholder.svg?width=800&height=1000&query=inverted-map-of-south-america-collage-texture",
    year: 2024,
    status: "Publicado",
    updatedAt: "2024-11-12",
  },
  {
    id: "p-002",
    title: "Websérie: Mulheres na docência",
    category: "Audiovisual",
    description:
      "Cinco episódios que escutam professoras de escolas públicas do cerrado sobre afetos, salário e resistência.",
    coverImage: "/placeholder.svg?width=800&height=1000&query=black-and-white-portrait-brazilian-women-teachers",
    year: 2024,
    status: "Publicado",
    updatedAt: "2024-09-30",
  },
  {
    id: "p-003",
    title: "Audiovisual Popular",
    category: "Educação",
    description:
      "Oficina itinerante de produção audiovisual com jovens periféricos de Jataí. Câmera, montagem e narrativa decolonial.",
    coverImage: "/placeholder.svg?width=800&height=1000&query=young-people-cameras-community-workshop",
    year: 2023,
    status: "Publicado",
    updatedAt: "2024-02-18",
  },
  {
    id: "p-004",
    title: "Cartografias do Cerrado",
    category: "Pesquisa",
    description:
      "Mapeamento afetivo de territórios quilombolas e indígenas do sudoeste goiano em diálogo com a universidade.",
    coverImage: "/placeholder.svg?width=800&height=1000&query=hand-drawn-map-cerrado-biome-organic",
    year: 2023,
    status: "Em revisão",
    updatedAt: "2024-08-05",
  },
  {
    id: "p-005",
    title: "Festival Travessia",
    category: "Evento",
    description:
      "Três dias de cinema, performance e roda de conversa em praças públicas. Programação curada por mulheres negras.",
    coverImage: "/placeholder.svg?width=800&height=1000&query=outdoor-cultural-festival-projection-audience",
    year: 2024,
    status: "Publicado",
    updatedAt: "2024-10-21",
  },
  {
    id: "p-006",
    title: "Caderno Frestas",
    category: "Editorial",
    description:
      "Publicação experimental que reúne ensaios, poemas e fotografias sobre raça, gênero e território.",
    coverImage: "/placeholder.svg?width=800&height=1000&query=handmade-zine-collage-typography",
    year: 2025,
    status: "Rascunho",
    updatedAt: "2025-01-08",
  },
]

export const members: Member[] = [
  {
    id: "m-001",
    name: "Aline Sá",
    role: "Educadora & Diretora",
    tags: ["Educadoras", "Artistas"],
    avatar: "/placeholder.svg?width=600&height=750&query=portrait-black-woman-curly-hair-warm-light",
    bio: "Pedagoga, cineasta e mestra em educação. Coordena oficinas de audiovisual popular há mais de uma década.",
  },
  {
    id: "m-002",
    name: "Helena Borges",
    role: "Pesquisadora",
    tags: ["Pesquisadoras"],
    avatar: "/placeholder.svg?width=600&height=750&query=portrait-woman-glasses-warm-tone-researcher",
    bio: "Doutoranda em antropologia. Estuda corpos dissidentes e territorialidades do cerrado.",
  },
  {
    id: "m-003",
    name: "Davi Costa",
    role: "Artista visual",
    tags: ["Artistas"],
    avatar: "/placeholder.svg?width=600&height=750&query=portrait-young-non-binary-artist-earrings",
    bio: "Trabalha com colagem, fotografia e pintura. Curador independente em projetos LGBTQIAPN+.",
  },
  {
    id: "m-004",
    name: "Marina Lopes",
    role: "Comunicadora",
    tags: ["Educadoras", "Artistas"],
    avatar: "/placeholder.svg?width=600&height=750&query=portrait-indigenous-brazilian-woman-painted-face",
    bio: "Jornalista e podcaster. Edita o Diário de Travessia e o canal de comunicação do coletivo.",
  },
  {
    id: "m-005",
    name: "Joana R. Vieira",
    role: "Pesquisadora & Professora",
    tags: ["Educadoras", "Pesquisadoras"],
    avatar: "/placeholder.svg?width=600&height=750&query=portrait-older-black-woman-headwrap-smiling",
    bio: "Professora de filosofia da educação. Pesquisa pedagogias decoloniais e justiça epistêmica.",
  },
  {
    id: "m-006",
    name: "Leandro Pires",
    role: "Cineasta",
    tags: ["Artistas"],
    avatar: "/placeholder.svg?width=600&height=750&query=portrait-brazilian-man-camera-around-neck",
    bio: "Diretor e diretor de fotografia. Co-realizou as obras audiovisuais do coletivo desde 2021.",
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "b-001",
    title: "Afetamentos sobre gênero, raça e classe",
    excerpt:
      "Um ensaio coletivo sobre como nossos corpos atravessam — e são atravessados — pelas estruturas que herdamos.",
    category: "Reflexão",
    author: "Aline Sá",
    date: "2025-04-12",
    readTime: "8 min",
    coverImage: "/placeholder.svg?width=1200&height=750&query=abstract-collage-hands-textures-warm-tones",
    },
  {
    id: "b-002",
    title: "Lady Gaga no CTN: travessias inesperadas",
    excerpt:
      "Crônica sobre a noite em que pop, axé e tradição se cruzaram no Centro de Tradições Nordestinas — e o que isso nos ensina.",
    category: "Evento",
    author: "Marina Lopes",
    date: "2025-03-28",
    readTime: "5 min",
    coverImage: "/placeholder.svg?width=600&height=600&query=concert-stage-purple-gold-lights-crowd",
  },
  {
    id: "b-003",
    title: "Manifesto das frestas",
    excerpt:
      "Habitar a fresta é recusar o centro. É escolher a margem como lugar de escuta e potência criativa.",
    category: "Manifesto",
    author: "Coletivo Atravessamentos",
    date: "2025-02-14",
    readTime: "6 min",
    coverImage: "/placeholder.svg?width=600&height=600&query=torn-paper-collage-handwritten-text-earth-tones",
  },
  {
    id: "b-004",
    title: "Chamada aberta: residência artística 2025",
    excerpt:
      "Inscrições abertas para a primeira residência artística do coletivo no cerrado. Edital até 30 de junho.",
    category: "Notícia",
    author: "Helena Borges",
    date: "2025-05-02",
    readTime: "3 min",
    coverImage: "/placeholder.svg?width=600&height=600&query=cerrado-landscape-yellow-flowers-sunset",
  },
]

// ============================================================================
// Helpers
// ============================================================================

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
