"use client"

import * as React from "react"
import Link from "next/link"
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
  UserCircle,
  ExternalLink,
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
import { ProjectFormDialog } from "@/components/admin/project-form-dialog"
import { MemberFormDialog } from "@/components/admin/member-form-dialog"
import { BlogFormDialog } from "@/components/admin/blog-form-dialog"
import { SettingsPanel } from "@/components/admin/settings-panel"
import { ProfilePanel } from "@/components/admin/profile-panel"
import { OverviewPanel } from "@/components/admin/overview-panel"
import { type Category } from "@/lib/actions/categories"
import { type SiteSettings } from "@/lib/actions/settings"
import { AdminCommandMenu } from "@/components/admin/admin-command-menu"
import { AdminDataTable, type Column } from "@/components/admin/admin-data-table"
import { exportToCSV, exportToPDF } from "@/lib/utils/export"

const navigation = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "members", label: "Membros", icon: Users },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "profile", label: "Meu Perfil", icon: UserCircle },
]

const statusStyles = {
  Publicado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
  Rascunho: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
  "Em revisão": "bg-primary/10 text-primary border-primary/20",
} as const

import { Pagination } from "@/components/admin/pagination"

interface AdminDashboardProps {
  user: any
  projectsData: { data: Project[], count: number }
  membersData: { data: Member[], count: number }
  blogPostsData: { data: BlogPost[], count: number }
  initialCategories: Category[]
  siteSettings: SiteSettings
  currentPage: {
    projects: number
    members: number
    blog: number
  }
}

export function AdminDashboard({ 
  user, 
  projectsData, 
  membersData, 
  blogPostsData, 
  initialCategories, 
  siteSettings,
  currentPage
}: AdminDashboardProps) {
  const [active, setActive] = React.useState("overview")
  const [query, setQuery] = React.useState("")
  const [searchEditItem, setSearchEditItem] = React.useState<{type: "project" | "member" | "blog", id: string} | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<{type: "project" | "member" | "blog", id: string} | null>(null)
  const { toast } = useToast()
  
  const [localProjects, setLocalProjects] = React.useState<Project[]>(projectsData.data)
  const [localMembers, setLocalMembers] = React.useState<Member[]>(membersData.data)
  const [localBlogPosts, setLocalBlogPosts] = React.useState<BlogPost[]>(blogPostsData.data)

  // Sincroniza estado local quando as props mudam (navegação por página)
  React.useEffect(() => {
    setLocalProjects(projectsData.data)
  }, [projectsData.data])

  React.useEffect(() => {
    setLocalMembers(membersData.data)
  }, [membersData.data])

  React.useEffect(() => {
    setLocalBlogPosts(blogPostsData.data)
  }, [blogPostsData.data])

  const filteredProjects = localProjects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredMembers = localMembers.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  )
  const filteredBlogPosts = localBlogPosts.filter((b) =>
    b.title.toLowerCase().includes(query.toLowerCase()),
  )

  function handleProjectSuccess(project: Project, isEdit: boolean) {
    if (isEdit) {
      setLocalProjects((prev) => prev.map((p) => p.id === project.id ? project : p))
    } else {
      setLocalProjects((prev) => [project, ...prev])
    }
  }
  function handleMemberSuccess(member: Member, isEdit: boolean) {
    if (isEdit) {
      setLocalMembers((prev) => prev.map((m) => m.id === member.id ? member : m))
    } else {
      setLocalMembers((prev) => [member, ...prev])
    }
  }
  function handleBlogPostSuccess(post: BlogPost, isEdit: boolean) {
    if (isEdit) {
      setLocalBlogPosts((prev) => prev.map((b) => b.id === post.id ? post : b))
    } else {
      setLocalBlogPosts((prev) => [post, ...prev])
    }
  }

  function handleDelete(type: "project" | "member" | "blog", id: string) {
    setDeleteConfirm({ type, id })
  }

  async function handleDeleteBulk(type: "project" | "member" | "blog", ids: string[]) {
    let result: { success?: boolean, error?: string } = { success: true }
    
    // Atualização otimista
    if (type === "project") {
      setLocalProjects((prev) => prev.filter((p) => !ids.includes(p.id)))
      for (const id of ids) {
        const res = await deleteProject(id)
        if (res.error) result = res
      }
    } else if (type === "member") {
      setLocalMembers((prev) => prev.filter((m) => !ids.includes(m.id)))
      for (const id of ids) {
        const res = await deleteMember(id)
        if (res.error) result = res
      }
    } else if (type === "blog") {
      setLocalBlogPosts((prev) => prev.filter((b) => !ids.includes(b.id)))
      for (const id of ids) {
        const res = await deleteBlogPost(id)
        if (res.error) result = res
      }
    }

    if (result.error) {
      toast({
        title: "Erro ao excluir alguns itens",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Exclusão em massa concluída",
        description: `${ids.length} itens foram removidos com sucesso.`,
      })
    }
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

  // Definições de Colunas
  const projectColumns: Column<Project>[] = [
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (p) => (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", statusStyles[p.status])}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {p.status}
        </span>
      )
    },
    {
      id: "title",
      label: "Título",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
            <img src={p.coverImage || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{p.title}</p>
            <p className="truncate text-xs text-foreground/60 md:hidden">{p.category} · {p.year}</p>
          </div>
        </div>
      )
    },
    { id: "category", label: "Categoria", sortable: true },
    {
      id: "updatedAt",
      label: "Atualizado",
      sortable: true,
      render: (p) => <span className="text-sm text-foreground/65">{new Date(p.updatedAt).toLocaleDateString("pt-BR")}</span>
    }
  ]

  const memberColumns: Column<Member>[] = [
    {
      id: "name",
      label: "Membro",
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted sm:block">
            <img src={m.avatar || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
          </div>
          <p className="truncate font-medium">{m.name}</p>
        </div>
      )
    },
    { id: "role", label: "Papel", sortable: true },
    {
      id: "tags",
      label: "Tags",
      render: (m) => (
        <div className="flex flex-wrap gap-1">
          {m.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground/60">
              {tag}
            </span>
          ))}
        </div>
      )
    }
  ]

  const blogColumns: Column<BlogPost>[] = [
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (post) => (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", statusStyles[post.status as keyof typeof statusStyles] || statusStyles.Publicado)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {post.status || "Publicado"}
        </span>
      )
    },
    {
      id: "title",
      label: "Título",
      sortable: true,
      render: (post) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{post.title}</p>
          <p className="truncate text-xs text-foreground/50">Por {post.author}</p>
        </div>
      )
    },
    { id: "category", label: "Categoria", sortable: true },
    {
      id: "date",
      label: "Data",
      sortable: true,
      render: (post) => <span className="text-sm text-foreground/65">{new Date(post.date).toLocaleDateString("pt-BR")}</span>
    }
  ]

  function handleEditItem(type: "project" | "member" | "blog", id: string) {
    if (type === "project") setActive("projects")
    if (type === "member") setActive("members")
    if (type === "blog") setActive("blog")
    
    setSearchEditItem({ type, id })
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
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="flex h-8 w-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground border-organic">
                <span className="font-display text-base font-bold leading-none">A</span>
              </span>
              <span className="font-display text-sm font-bold tracking-tight">
                atravessamentos
              </span>
            </Link>
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent font-display text-sm font-bold uppercase">
                {user?.user_metadata?.full_name?.substring(0, 2) || user?.email?.substring(0, 2) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário"}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/55">
                  {user?.email || "Sem e-mail"}
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
          <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-8 no-print">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                {navigation.find((n) => n.id === active)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <AdminCommandMenu setActive={setActive} onEditItem={handleEditItem} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden gap-2 text-muted-foreground hover:text-foreground lg:flex"
              >
                <Link href="/">
                  <ExternalLink className="h-4 w-4" />
                  Ver site
                </Link>
              </Button>
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
              {/* Stats - Ocultos no PDF */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 admin-stats-grid">
                <StatCard
                  label="Projetos publicados"
                  value={localProjects.filter(p => p.status === "Publicado").length.toString()}
                  trend={`${localProjects.length} totais no banco`}
                  icon={FolderKanban}
                  accent="bg-primary/10 text-primary"
                  variation={`+${localProjects.filter(p => new Date(p.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length}`}
                />
                <StatCard
                  label="Pessoas no coletivo"
                  value={localMembers.length.toString()}
                  trend="Membros cadastrados"
                  icon={Users}
                  accent="bg-accent/15 text-accent"
                />
                <StatCard
                  label="Posts no diário"
                  value={localBlogPosts.filter(p => p.status === "Publicado").length.toString()}
                  trend={`${localBlogPosts.length} rascunhos e publicados`}
                  icon={BookOpen}
                  accent="bg-[var(--ouro)]/25 text-foreground"
                  variation={`+${localBlogPosts.filter(p => new Date(p.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length}`}
                />
                <StatCard
                  label="Categorias & Tags"
                  value={initialCategories.length.toString()}
                  trend="Filtros globais do sistema"
                  icon={LayoutDashboard}
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
                      <ProjectFormDialog categories={initialCategories.filter(c => c.type === "project")} onSuccess={handleProjectSuccess} />
                    </div>

                    <AdminDataTable
                      data={filteredProjects}
                      columns={projectColumns}
                      entityName="projetos"
                      onEdit={(id) => handleEditItem("project", id)}
                      onDelete={(id) => handleDelete("project", id)}
                      onDeleteBulk={(ids) => handleDeleteBulk("project", ids)}
                      labels={{ edit: "Editar projeto", delete: "Excluir projeto" }}
                    />
                    <Pagination 
                      totalCount={projectsData.count} 
                      pageSize={10} 
                      currentPage={currentPage.projects} 
                      paramName="p_page" 
                    />
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
                      <MemberFormDialog onSuccess={handleMemberSuccess} categories={initialCategories} />
                    </div>
                    <AdminDataTable
                      data={filteredMembers}
                      columns={memberColumns}
                      entityName="membros"
                      onEdit={(id) => handleEditItem("member", id)}
                      onDelete={(id) => handleDelete("member", id)}
                      onDeleteBulk={(ids) => handleDeleteBulk("member", ids)}
                      labels={{ edit: "Editar membro", delete: "Excluir membro" }}
                    />
                    <Pagination 
                      totalCount={membersData.count} 
                      pageSize={10} 
                      currentPage={currentPage.members} 
                      paramName="m_page" 
                    />
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
                      <BlogFormDialog categories={initialCategories.filter(c => c.type === "post")} onSuccess={handleBlogPostSuccess} />
                    </div>
                    <AdminDataTable
                      data={filteredBlogPosts}
                      columns={blogColumns}
                      entityName="blog"
                      onEdit={(id) => handleEditItem("blog", id)}
                      onDelete={(id) => handleDelete("blog", id)}
                      onDeleteBulk={(ids) => handleDeleteBulk("blog", ids)}
                      labels={{ edit: "Editar post", delete: "Excluir post" }}
                    />
                    <Pagination 
                      totalCount={blogPostsData.count} 
                      pageSize={10} 
                      currentPage={currentPage.blog} 
                      paramName="b_page" 
                    />
                  </>
                )}

                {active === "settings" && (
                  <SettingsPanel categories={initialCategories} siteSettings={siteSettings} />
                )}
                
                {active === "profile" && (
                  <ProfilePanel user={user} />
                )}

                {active === "overview" && (
                  <OverviewPanel 
                    user={user}
                    projects={localProjects} 
                    blogPosts={localBlogPosts} 
                    members={localMembers}
                    setActive={setActive}
                  />
                )}

                {active !== "overview" && active !== "projects" && active !== "members" && active !== "blog" && active !== "settings" && active !== "profile" && (
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

      {/* Global Edit Dialogs (from Search) */}
      {searchEditItem?.type === "project" && (
        <ProjectFormDialog
          open={!!searchEditItem}
          onOpenChange={(open) => !open && setSearchEditItem(null)}
          initialData={localProjects.find(p => p.id === searchEditItem.id)}
          categories={initialCategories.filter(c => c.type === "project")}
          onSuccess={handleProjectSuccess}
        />
      )}

      {searchEditItem?.type === "member" && (
        <MemberFormDialog
          open={!!searchEditItem}
          onOpenChange={(open) => !open && setSearchEditItem(null)}
          initialData={localMembers.find(m => m.id === searchEditItem.id)}
          categories={initialCategories}
          onSuccess={handleMemberSuccess}
        />
      )}

      {searchEditItem?.type === "blog" && (
        <BlogFormDialog
          open={!!searchEditItem}
          onOpenChange={(open) => !open && setSearchEditItem(null)}
          initialData={localBlogPosts.find(p => p.id === searchEditItem.id)}
          categories={initialCategories.filter(c => c.type === "post")}
          onSuccess={handleBlogPostSuccess}
        />
      )}

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
  variation?: string
}

function StatCard({ label, value, trend, icon: Icon, accent, variation }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-foreground/65">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight">
        {value}
        {variation && (
          <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            {variation}
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-foreground/60">{trend}</p>
    </div>
  )
}
