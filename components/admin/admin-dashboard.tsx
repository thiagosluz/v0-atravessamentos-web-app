"use client"

import * as React from "react"
import { 
  Users, 
  Settings, 
  Loader2, 
  LayoutDashboard, 
  FileText, 
  FolderKanban,
  Library,
  Mail,
  UserCircle,
  LogOut,
  ChevronRight,
  Menu
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { type AdminDashboardProps, type Project, type Member, type BlogPost } from "@/types/admin"
import { signOut } from "@/lib/actions/auth"

// Painéis
import { OverviewPanel } from "./panels/overview-panel"
import { ProjectPanel } from "./panels/project-panel"
import { BlogPanel } from "./panels/blog-panel"
import { MemberPanel } from "./panels/member-panel"
import { ProjectFormDialog } from "./forms/project-form-dialog"
import { BlogFormDialog } from "./forms/blog-form-dialog"
import { MemberFormDialog } from "./forms/member-form-dialog"
import { SettingsPanel } from "./panels/settings-panel"
import { ProfilePanel } from "./panels/profile-panel"
import { VisualSettingsPanel } from "./panels/visual-settings-panel"
import { GalleryAdminPanel } from "./panels/gallery-admin-panel"
import { ExhibitionsAdminPanel } from "./panels/exhibitions-admin-panel"
import { NewsletterAdminPanel } from "./panels/newsletter-admin-panel"

// Actions
import { deleteProject } from "@/lib/actions/projects-admin"
import { deleteMember } from "@/lib/actions/members-admin"
import { deleteBlogPost } from "@/lib/actions/blog-admin"

// Componentes UI
import { Button } from "@/components/ui/button"
import { AdminCommandMenu } from "./shared/admin-command-menu"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2 } from "lucide-react"

import { useAdminState } from "@/hooks/admin/use-admin-state"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { WifiOff } from "lucide-react"

export function AdminDashboard(props: AdminDashboardProps) {
  const {
    active,
    setActive,
    localProjects,
    localMembers,
    localBlogPosts,
    projectToEdit,
    memberToEdit,
    blogToEdit,
    deleteConfirmation,
    setDeleteConfirmation,
    handleProjectSuccess,
    handleMemberSuccess,
    handleBlogSuccess,
    handleEditItem,
    handleDeleteTrigger,
    confirmDelete,
    setSearchEditItem
  } = useAdminState(props)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    // Inicializar no cliente
    setIsOffline(!navigator.onLine)
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const { user, projectsData, membersData, blogPostsData, initialCategories, siteSettings, currentPage } = props

  return (
    <div className="flex min-h-screen bg-[#F9F6F1] text-foreground selection:bg-primary selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border/40 flex-col sticky top-0 h-screen bg-[#F9F6F1]">
        {/* Header (Logo) - Fixed */}
        <div className="p-6 pb-2 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 bg-[#A65A3C] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#A65A3C]/20">
              <span className="font-display font-black text-lg italic">A</span>
            </div>
            <h1 data-testid="admin-logo" className="font-display font-black text-xl tracking-tighter uppercase text-[#333]">Admin</h1>
          </div>
        </div>
        
        {/* Nav Area - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide px-6 py-2">
          <nav className="space-y-1.5 pb-4">
            <SidebarItem 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              label="Visão Geral" 
              active={active === "overview"} 
              onClick={() => setActive("overview")} 
            />
            
            <div className="pt-6 pb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Acervo & Memória</span>
            </div>
            <SidebarItem 
              icon={<FolderKanban className="h-4 w-4" />} 
              label="Projetos" 
              active={active === "projects"} 
              onClick={() => setActive("projects")} 
            />
            <SidebarItem 
              icon={<Library className="h-4 w-4" />} 
              label="Acervo Vivo" 
              active={active === "acervo"} 
              onClick={() => setActive("acervo")} 
            />
            <SidebarItem 
              icon={<Image className="h-4 w-4" />} 
              label="Exposições" 
              active={active === "exhibitions"} 
              onClick={() => setActive("exhibitions")} 
            />
            
            <div className="pt-6 pb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Comunicados</span>
            </div>
            <SidebarItem 
              icon={<FileText className="h-4 w-4" />} 
              label="Diário" 
              active={active === "blog"} 
              onClick={() => setActive("blog")} 
            />
            <SidebarItem 
              icon={<Mail className="h-4 w-4" />} 
              label="Newsletter" 
              active={active === "newsletter"} 
              onClick={() => setActive("newsletter")} 
            />
            
            <div className="pt-6 pb-2 px-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Coletivo</span>
            </div>
            <SidebarItem 
              icon={<Users className="h-4 w-4" />} 
              label="Membros" 
              active={active === "members"} 
              onClick={() => setActive("members")} 
            />
            <SidebarItem 
              icon={<Settings className="h-4 w-4" />} 
              label="Configurações" 
              active={active === "settings"} 
              onClick={() => setActive("settings")} 
            />
          </nav>
        </div>

        {/* User Profile Section in Sidebar */}
        <div className="mt-auto p-4 m-4 rounded-2xl bg-white/50 border border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
               ) : (
                 <span className="font-bold text-primary">{user?.email?.[0].toUpperCase()}</span>
               )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black truncate text-[#333]">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-foreground truncate">{user?.email}</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors flex items-center justify-center text-foreground"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-none md:shadow-[-20px_0_40px_rgba(0,0,0,0.02)] rounded-none md:rounded-l-[40px] relative z-10 md:my-4 md:mr-4 overflow-hidden border-none md:border">
        <header className="h-20 flex items-center justify-between px-4 md:px-10 bg-white/80 backdrop-blur-xl sticky top-0 z-30 border-b border-border/40">
          <div className="flex items-center gap-2 md:gap-4">
             {/* Mobile Menu Trigger */}
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden">
                   <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-72 bg-[#F9F6F1] border-r-border/40">
                 <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                 <div className="h-full flex flex-col">
                   {/* Header (Logo) - Fixed */}
                   <div className="p-6 pb-2 shrink-0">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="h-9 w-9 bg-[#A65A3C] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#A65A3C]/20">
                         <span className="font-display font-black text-lg italic">A</span>
                       </div>
                       <h1 className="font-display font-black text-xl tracking-tighter uppercase text-[#333]">Admin</h1>
                     </div>
                   </div>
                   
                   {/* Nav Area - Scrollable */}
                   <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide px-6 py-2">
                     <nav className="space-y-1.5 pb-4">
                       <SidebarItem 
                         icon={<LayoutDashboard className="h-4 w-4" />} 
                         label="Visão Geral" 
                         active={active === "overview"} 
                         onClick={() => { setActive("overview"); setIsMobileMenuOpen(false); }} 
                       />
                       
                       <div className="pt-6 pb-2 px-3">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Acervo & Memória</span>
                       </div>
                       <SidebarItem 
                         icon={<FolderKanban className="h-4 w-4" />} 
                         label="Projetos" 
                         active={active === "projects"} 
                         onClick={() => { setActive("projects"); setIsMobileMenuOpen(false); }} 
                       />
                       <SidebarItem 
                         icon={<Library className="h-4 w-4" />} 
                         label="Acervo Vivo" 
                         active={active === "acervo"} 
                         onClick={() => { setActive("acervo"); setIsMobileMenuOpen(false); }} 
                       />
                       <SidebarItem 
                         icon={<Image className="h-4 w-4" />} 
                         label="Exposições" 
                         active={active === "exhibitions"} 
                         onClick={() => { setActive("exhibitions"); setIsMobileMenuOpen(false); }} 
                       />
                       
                       <div className="pt-6 pb-2 px-3">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Comunicados</span>
                       </div>
                       <SidebarItem 
                         icon={<FileText className="h-4 w-4" />} 
                         label="Diário" 
                         active={active === "blog"} 
                         onClick={() => { setActive("blog"); setIsMobileMenuOpen(false); }} 
                       />
                       <SidebarItem 
                         icon={<Mail className="h-4 w-4" />} 
                         label="Newsletter" 
                         active={active === "newsletter"} 
                         onClick={() => { setActive("newsletter"); setIsMobileMenuOpen(false); }} 
                       />
                       
                       <div className="pt-6 pb-2 px-3">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Coletivo</span>
                       </div>
                       <SidebarItem 
                         icon={<Users className="h-4 w-4" />} 
                         label="Membros" 
                         active={active === "members"} 
                         onClick={() => { setActive("members"); setIsMobileMenuOpen(false); }} 
                       />
                       <SidebarItem 
                         icon={<Settings className="h-4 w-4" />} 
                         label="Configurações" 
                         active={active === "settings"} 
                         onClick={() => { setActive("settings"); setIsMobileMenuOpen(false); }} 
                       />
                     </nav>
                   </div>

                   <div className="mt-auto p-4 m-4 rounded-2xl bg-white/50 border border-border/40 shrink-0">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                           {user?.user_metadata?.avatar_url ? (
                             <img src={user.user_metadata.avatar_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
                           ) : (
                            <span className="font-bold text-primary">{user?.email?.[0].toUpperCase()}</span>
                          )}
                       </div>
                       <div className="min-w-0 flex-1">
                         <p className="text-xs font-black truncate text-[#333]">
                           {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                         </p>
                         <p className="text-[10px] text-foreground truncate">{user?.email}</p>
                       </div>
                       <button 
                         onClick={() => signOut()}
                         className="h-8 w-8 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors flex items-center justify-center text-foreground"
                         title="Sair"
                       >
                         <LogOut className="h-4 w-4" />
                       </button>
                     </div>
                   </div>
                 </div>
               </SheetContent>
             </Sheet>

             <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-foreground uppercase tracking-widest">
               <button 
                 type="button"
                 className="hover:text-primary transition-colors cursor-pointer" 
                 onClick={() => setActive("overview")}
               >
                 Admin
               </button>
               <ChevronRight className="h-3 w-3" />
               <span className="text-[#333]">
                 {active === "overview" ? "Visão Geral" : 
                  active === "projects" ? "Projetos" :
                  active === "blog" ? "Diário" :
                  active === "members" ? "Membros" :
                  active === "newsletter" ? "Newsletter" :
                  active === "acervo" ? "Acervo Vivo" :
                  active === "exhibitions" ? "Exposições" :
                  active === "settings" ? "Configurações" :
                  active === "profile" ? "Perfil" :
                  active === "visual" ? "Identidade Visual" :
                  active.charAt(0).toUpperCase() + active.slice(1)}
               </span>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <AdminCommandMenu setActive={setActive} onEditItem={handleEditItem} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-center overflow-hidden hover:border-primary/40 transition-colors">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{user?.email?.[0].toUpperCase()}</span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="font-display font-bold">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActive("profile")} className="rounded-xl cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActive("settings")} className="rounded-xl cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isOffline && (
              <div 
                data-testid="offline-banner"
                className="bg-orange-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-500/20 animate-in slide-in-from-top-4 duration-500"
              >
                <WifiOff className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-bold">Você está offline</p>
                  <p className="text-xs opacity-90">Verifique sua conexão para salvar alterações.</p>
                </div>
              </div>
            )}
            
            <ErrorBoundary name={active}>
              <React.Suspense fallback={
              <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              </div>
            }>
              {active === "overview" && (
                <OverviewPanel 
                  user={user}
                  projects={localProjects}
                  blogPosts={localBlogPosts}
                  members={localMembers}
                  categories={initialCategories}
                  setActive={setActive}
                />
              )}

              {active === "projects" && (
                <ProjectPanel 
                  projects={localProjects}
                  totalCount={projectsData.count}
                  currentPage={currentPage.projects}
                  categories={initialCategories}
                  onSuccess={handleProjectSuccess}
                  onEdit={(id) => handleEditItem("project", id)}
                  onDelete={(id) => handleDeleteTrigger("project", id)}
                  onDeleteBulk={async () => {}}
                />
              )}

              {active === "blog" && (
                <BlogPanel 
                  posts={localBlogPosts}
                  totalCount={blogPostsData.count}
                  currentPage={currentPage.blog}
                  categories={initialCategories}
                  onSuccess={handleBlogSuccess}
                  onEdit={(id) => handleEditItem("blog", id)}
                  onDelete={(id) => handleDeleteTrigger("blog", id)}
                  onDeleteBulk={async () => {}}
                />
              )}

              {active === "members" && (
                <MemberPanel 
                  members={localMembers}
                  totalCount={membersData.count}
                  currentPage={currentPage.members}
                  categories={initialCategories}
                  onSuccess={handleMemberSuccess}
                  onEdit={(id) => handleEditItem("member", id)}
                  onDelete={(id) => handleDeleteTrigger("member", id)}
                  onDeleteBulk={async () => {}}
                />
              )}

              {active === "profile" && (
                <ProfilePanel user={user} />
              )}

              {active === "settings" && (
                <SettingsPanel siteSettings={siteSettings} categories={initialCategories} />
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

              {active === "newsletter" && (
                <NewsletterAdminPanel />
              )}
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>

        {/* Modais de Edição (Controlados) */}
        {projectToEdit && (
          <ProjectFormDialog 
            open={!!projectToEdit} 
            onOpenChange={(open: boolean) => !open && setSearchEditItem(null)}
            initialData={projectToEdit}
            categories={initialCategories}
            onSuccess={handleProjectSuccess}
          />
        )}

        {memberToEdit && (
          <MemberFormDialog 
            open={!!memberToEdit} 
            onOpenChange={(open: boolean) => !open && setSearchEditItem(null)}
            initialData={memberToEdit}
            categories={initialCategories}
            onSuccess={handleMemberSuccess}
          />
        )}

        {blogToEdit && (
          <BlogFormDialog 
            open={!!blogToEdit} 
            onOpenChange={(open: boolean) => !open && setSearchEditItem(null)}
            initialData={blogToEdit}
            categories={initialCategories}
            onSuccess={handleBlogSuccess}
          />
        )}

        {/* Modal de Confirmação de Deleção Customizado */}
        <AlertDialog open={!!deleteConfirmation} onOpenChange={(open: boolean) => !open && setDeleteConfirmation(null)}>
          <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
            <AlertDialogHeader>
              <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-2xl font-display font-black uppercase italic tracking-tight">
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-foreground">
                Você tem certeza que deseja excluir este item? Esta ação é irreversível e removerá todos os dados permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-3">
              <AlertDialogCancel className="rounded-full border-none bg-muted hover:bg-muted/80 h-12 px-6 font-bold transition-all">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-bold shadow-lg shadow-red-600/20 transition-all border-none"
              >
                Sim, Excluir Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid={`sidebar-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
        active 
          ? "bg-[#A65A3C] text-white shadow-xl shadow-[#A65A3C]/20 translate-x-1" 
          : "text-foreground hover:text-[#A65A3C] hover:bg-white/50"
      )}
    >
      <div className={cn(
        "transition-transform group-hover:scale-110",
        active ? "text-white" : "text-foreground"
      )}>
        {icon}
      </div>
      {label}
    </button>
  )
}

function Image(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}
