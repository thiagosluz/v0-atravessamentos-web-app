"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Pencil,
  Settings,
  Trash2,
  Users,
  UserCircle,
  ExternalLink,
  Palette,
  GalleryVertical,
  Image as ImageIcon,
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
import { VisualSettingsPanel } from "@/components/admin/visual-settings-panel"
import { GalleryAdminPanel } from "@/components/admin/gallery-admin-panel"
import { ExhibitionsAdminPanel } from "@/components/admin/exhibitions-admin-panel"
import { type Category } from "@/lib/actions/categories"
import { type SiteSettings } from "@/lib/actions/settings"
import { AdminCommandMenu } from "@/components/admin/admin-command-menu"
import { AdminDataTable, type Column } from "@/components/admin/admin-data-table"

import { AdminSidebar } from "./layout/admin-sidebar"
import { AdminTopbar } from "./layout/admin-topbar"
import { StatCard } from "./layout/stat-card"
import { ProjectPanel } from "./panels/project-panel"

import { MemberPanel } from "./panels/member-panel"
import { BlogPanel } from "./panels/blog-panel"

const navigation = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "projects", label: "Projetos", icon: FolderKanban },
  { id: "members", label: "Membros", icon: Users },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "acervo", label: "Acervo", icon: ImageIcon },
  { id: "exhibitions", label: "Exposições", icon: GalleryVertical },
  { id: "visual", label: "Identidade Visual", icon: Palette },
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "profile", label: "Meu Perfil", icon: UserCircle },
]

import { type AdminDashboardProps, type User } from "@/types/admin"

export function AdminDashboard({
  user,
  projectsData,
  membersData,
  blogPostsData,
  initialCategories,
  siteSettings,
  currentPage,
}: AdminDashboardProps) {

  const [active, setActive] = React.useState("overview")
  const [query, setQuery] = React.useState("")
  const [searchEditItem, setSearchEditItem] = React.useState<{ type: "project" | "member" | "blog", id: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ type: "project" | "member" | "blog", id: string } | null>(null)
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
        <AdminSidebar
          active={active}
          setActive={setActive}
          navigation={navigation}
          user={user}
          projectsCount={localProjects.length}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar
            activeLabel={navigation.find((n) => n.id === active)?.label || ""}
            setActive={setActive}
            onEditItem={handleEditItem}
          />

          <div className="flex-1 overflow-y-auto bg-background">
            <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 admin-stats-grid">
                <StatCard
                  label="Projetos publicados"
                  value={localProjects.filter((p) => p.status === "Publicado").length.toString()}
                  trend={`${localProjects.length} totais no banco`}
                  icon={FolderKanban}
                  accent="bg-primary/10 text-primary"
                  variation={`+${
                    localProjects.filter(
                      (p) =>
                        new Date(p.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
                    ).length
                  }`}
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
                  value={localBlogPosts.filter((p) => p.status === "Publicado").length.toString()}
                  trend={`${localBlogPosts.length} rascunhos e publicados`}
                  icon={BookOpen}
                  accent="bg-[var(--ouro)]/25 text-foreground"
                  variation={`+${
                    localBlogPosts.filter(
                      (p) => new Date(p.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
                    ).length
                  }`}
                />
                <StatCard
                  label="Categorias & Tags"
                  value={initialCategories.length.toString()}
                  trend="Filtros globais do sistema"
                  icon={LayoutDashboard}
                  accent="bg-foreground text-background"
                />
              </div>

              <div className="rounded-2xl border border-border bg-card">
                {active === "projects" && (
                  <ProjectPanel
                    projects={filteredProjects}
                    totalCount={projectsData.count}
                    currentPage={currentPage.projects}
                    categories={initialCategories}
                    onSuccess={handleProjectSuccess}
                    onEdit={(id) => handleEditItem("project", id)}
                    onDelete={(id) => handleDelete("project", id)}
                    onDeleteBulk={(ids) => handleDeleteBulk("project", ids)}
                  />
                )}

                {active === "members" && (
                  <MemberPanel
                    members={filteredMembers}
                    totalCount={membersData.count}
                    currentPage={currentPage.members}
                    categories={initialCategories}
                    onSuccess={handleMemberSuccess}
                    onEdit={(id) => handleEditItem("member", id)}
                    onDelete={(id) => handleDelete("member", id)}
                    onDeleteBulk={(ids) => handleDeleteBulk("member", ids)}
                  />
                )}

                {active === "blog" && (
                  <BlogPanel
                    posts={filteredBlogPosts}
                    totalCount={blogPostsData.count}
                    currentPage={currentPage.blog}
                    categories={initialCategories}
                    onSuccess={handleBlogPostSuccess}
                    onEdit={(id) => handleEditItem("blog", id)}
                    onDelete={(id) => handleDelete("blog", id)}
                    onDeleteBulk={(ids) => handleDeleteBulk("blog", ids)}
                  />
                )}


                {active === "settings" && (
                  <SettingsPanel categories={initialCategories} siteSettings={siteSettings} />
                )}

                {active === "profile" && (
                  <ProfilePanel user={user} />
                )}

                {active === "visual" && (
                  <VisualSettingsPanel siteSettings={siteSettings} />
                )}

                {active === "acervo" && (
                  <GalleryAdminPanel />
                )}

                {active === "exhibitions" && (
                  <ExhibitionsAdminPanel />
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

