"use client"

import * as React from "react"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Pencil,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type Project, type ProjectStatus, type Member, type BlogPost } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions/auth"
import { deleteProject } from "@/lib/actions/projects-admin"
import { deleteMember } from "@/lib/actions/members-admin"
import { deleteBlogPost } from "@/lib/actions/blog-admin"
import { NewProjectDialog } from "@/components/admin/new-project-dialog"
import { MemberFormDialog } from "@/components/admin/member-form-dialog"
import { NewBlogPostDialog } from "@/components/admin/new-blog-post-dialog"

const navigation = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "members", label: "Membros", icon: Users },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "settings", label: "Configurações", icon: Settings },
]

const statusStyles: Record<ProjectStatus, string> = {
  Publicado: "bg-[var(--musgo)]/15 text-[var(--musgo)] border-[var(--musgo)]/30",
  Rascunho: "bg-foreground/10 text-foreground/70 border-foreground/20",
  "Em revisão": "bg-[var(--ouro)]/20 text-foreground border-[var(--ouro)]/40",
}

interface AdminDashboardProps {
  initialProjects: Project[]
  initialMembers: Member[]
  initialBlogPosts: BlogPost[]
}

export function AdminDashboard({ initialProjects, initialMembers, initialBlogPosts }: AdminDashboardProps) {
  const [active, setActive] = React.useState("dashboard")
  const [query, setQuery] = React.useState("")
  const [deleteConfirm, setDeleteConfirm] = React.useState<{type: "project" | "member" | "blog", id: string} | null>(null)
  const { toast } = useToast()
  
  const [localProjects, setLocalProjects] = React.useState<Project[]>(initialProjects)
  const [localMembers, setLocalMembers] = React.useState<Member[]>(initialMembers)
  const [localBlogPosts, setLocalBlogPosts] = React.useState<BlogPost[]>(initialBlogPosts)

  const filteredProjects = localProjects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredMembers = localMembers.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredBlogPosts = localBlogPosts.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase()),
  )

  function handleNewProject(project: Project) {
    setLocalProjects((prev) => [project, ...prev])
  }
  function handleMemberSuccess(member: Member, isEdit: boolean) {
    if (isEdit) {
      setLocalMembers((prev) => prev.map((m) => m.id === member.id ? member : m))
    } else {
      setLocalMembers((prev) => [member, ...prev])
    }
  }
  function handleNewBlogPost(post: BlogPost) {
    setLocalBlogPosts((prev) => [post, ...prev])
  }

  function handleDelete(type: "project" | "member" | "blog", id: string) {
    setDeleteConfirm({ type, id })
  }

  async function confirmDelete() {
    if (!deleteConfirm) return
    const { type, id } = deleteConfirm
    setDeleteConfirm(null)
    
    let result: { success?: boolean, error?: string } = {}

    if (type === "project") {
      setLocalProjects((prev) => prev.filter((p) => p.id !== id))
      result = await deleteProject(id)
    } else if (type === "member") {
      setLocalMembers((prev) => prev.filter((m) => m.id !== id))
      result = await deleteMember(id)
    } else if (type === "blog") {
      setLocalBlogPosts((prev) => prev.filter((b) => b.id !== id))
      result = await deleteBlogPost(id)
    }

    if (result.error) {
      toast({
        title: "Erro ao excluir",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Excluído com sucesso",
        description: "O item foi removido permanentemente do sistema.",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] bg-background"
    >
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
            <a href="#" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground border-organic">
                <span className="font-display text-base font-bold leading-none">A</span>
              </span>
              <span className="font-display text-sm font-bold tracking-tight">
                atravessamentos
              </span>
            </a>
          </div>

          <div className="px-3 py-3">
            <div className="rounded-lg bg-sidebar-accent px-3 py-2 text-xs">
              <div className="flex items-center gap-1.5 text-sidebar-foreground/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--musgo)]" />
                Modo administrador
              </div>
              <p className="mt-1 font-medium text-sidebar-foreground">
                Painel de demonstração
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 px-3" aria-label="Navegação do painel">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.id === "projects" && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        isActive
                          ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                          : "bg-sidebar-accent text-sidebar-foreground/80",
                      )}
                    >
                      {localProjects.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent font-display text-sm font-bold">
                AS
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  Aline Sá
                </p>
                <p className="truncate text-xs text-sidebar-foreground/55">
                  admin@atravessamentos.org
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="h-8 w-8 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                aria-label="Sair do painel"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Topbar */}
          <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-8">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                {navigation.find((n) => n.id === active)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar projetos…"
                  className="h-9 w-56 rounded-full pl-9"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="rounded-full"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sair
              </Button>
            </div>
          </header>

          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Projetos publicados"
                  value="32"
                  trend="+4 este mês"
                  icon={FolderKanban}
                  accent="bg-primary/10 text-primary"
                />
                <StatCard
                  label="Pessoas no coletivo"
                  value="14"
                  trend="+2 novas"
                  icon={Users}
                  accent="bg-accent/15 text-accent"
                />
                <StatCard
                  label="Posts no diário"
                  value="58"
                  trend="+12 este trimestre"
                  icon={FileText}
                  accent="bg-[var(--ouro)]/25 text-foreground"
                />
                <StatCard
                  label="Alcance médio"
                  value="8.4K"
                  trend="+18% vs. mês passado"
                  icon={TrendingUp}
                  accent="bg-foreground text-background"
                />
              </div>

              {/* Data Table */}
              <div className="rounded-2xl border border-border bg-card">
                {active === "projects" && (
                  <>
                    <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
                      <div>
                        <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
                          Projetos recentes
                        </h2>
                        <p className="mt-1 text-sm text-foreground/65">
                          Gerencie publicações, rascunhos e revisões do coletivo.
                        </p>
                      </div>
                      <NewProjectDialog onSuccess={handleNewProject} />
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead className="hidden md:table-cell">Categoria</TableHead>
                            <TableHead className="hidden md:table-cell">Atualizado</TableHead>
                            <TableHead className="w-[60px] text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProjects.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="py-12 text-center text-foreground/60">
                                Nenhum projeto encontrado para “{query}”.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProjects.map((project) => (
                              <TableRow key={project.id} className="border-border">
                                <TableCell>
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                      statusStyles[project.status],
                                    )}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {project.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
                                      <img
                                        src={project.coverImage || "/placeholder.svg"}
                                        alt=""
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate font-medium">{project.title}</p>
                                      <p className="truncate text-xs text-foreground/60 md:hidden">
                                        {project.category} · {project.year}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="text-sm text-foreground/75">
                                    {project.category}
                                  </span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="text-sm text-foreground/65">
                                    {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete("project", project.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}

                {active === "members" && (
                  <>
                    <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
                      <div>
                        <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
                          Membros do Coletivo
                        </h2>
                        <p className="mt-1 text-sm text-foreground/65">
                          Gerencie quem faz parte do Atravessamentos.
                        </p>
                      </div>
                      <MemberFormDialog onSuccess={handleMemberSuccess} />
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead>Membro</TableHead>
                            <TableHead className="hidden md:table-cell">Papel</TableHead>
                            <TableHead className="hidden md:table-cell">Tags</TableHead>
                            <TableHead className="w-[60px] text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMembers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="py-12 text-center text-foreground/60">
                                Nenhum membro encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredMembers.map((member) => (
                              <TableRow key={member.id} className="border-border">
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted sm:block">
                                      <img src={member.avatar || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate font-medium">{member.name}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="text-sm text-foreground/75">{member.role}</span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <div className="flex flex-wrap gap-1">
                                    {member.tags.map((tag) => (
                                      <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground/60">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <MemberFormDialog initialData={member} onSuccess={handleMemberSuccess} />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleDelete("member", member.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}

                {active === "blog" && (
                  <>
                    <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
                      <div>
                        <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
                          Diário de Travessia
                        </h2>
                        <p className="mt-1 text-sm text-foreground/65">
                          Gerencie os posts do blog e artigos.
                        </p>
                      </div>
                      <NewBlogPostDialog onSuccess={handleNewBlogPost} />
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead className="hidden md:table-cell">Categoria</TableHead>
                            <TableHead className="hidden md:table-cell">Data</TableHead>
                            <TableHead className="w-[60px] text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBlogPosts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="py-12 text-center text-foreground/60">
                                Nenhum post encontrado.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredBlogPosts.map((post) => (
                              <TableRow key={post.id} className="border-border">
                                <TableCell>
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                                      post.status === "Publicado" ? "bg-[var(--musgo)]/15 text-[var(--musgo)] border-[var(--musgo)]/30" : "bg-foreground/10 text-foreground/70 border-foreground/20"
                                    )}
                                  >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {post.status || "Publicado"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="min-w-0">
                                    <p className="truncate font-medium">{post.title}</p>
                                    <p className="truncate text-xs text-foreground/50">Por {post.author}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="text-sm text-foreground/75">{post.category}</span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="text-sm text-foreground/65">{new Date(post.date).toLocaleDateString("pt-BR")}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete("blog", post.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}

                {active !== "projects" && active !== "members" && active !== "blog" && (
                  <div className="p-12 text-center text-foreground/60">
                    Esta seção estará disponível em breve.
                  </div>
                )}
              </div>

              {/* Mobile menu hint */}
              <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-xs text-foreground/65 md:hidden">
                Esta é uma visualização demo do CMS. No celular, o menu lateral é colapsado para
                priorizar a tabela.
              </div>
            </div>
          </div>
        </main>
      </div>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente este item e todos os dados associados a ele dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

interface StatCardProps {
  label: string
  value: string
  trend: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}

function StatCard({ label, value, trend, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-foreground/65">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-foreground/60">{trend}</p>
    </div>
  )
}
