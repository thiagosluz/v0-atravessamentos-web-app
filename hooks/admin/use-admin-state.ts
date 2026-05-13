import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { type Project, type Member, type BlogPost, type AdminDashboardProps } from "@/types/admin"
import { deleteProject } from "@/lib/actions/projects-admin"
import { deleteMember } from "@/lib/actions/members-admin"
import { deleteBlogPost } from "@/lib/actions/blog-admin"

export function useAdminState(props: AdminDashboardProps) {
  const [active, setActive] = React.useState("overview")
  const [searchEditItem, setSearchEditItem] = React.useState<{ type: "project" | "member" | "blog", id: string } | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = React.useState<{ type: "project" | "member" | "blog", id: string } | null>(null)
  const { toast } = useToast()

  // Local state for optimistic updates
  const [localProjects, setLocalProjects] = React.useState<Project[]>(props.projectsData.data)
  const [localMembers, setLocalMembers] = React.useState<Member[]>(props.membersData.data)
  const [localBlogPosts, setLocalBlogPosts] = React.useState<BlogPost[]>(props.blogPostsData.data)

  // Sync local state when props change
  React.useEffect(() => {
    setLocalProjects(props.projectsData.data)
    setLocalMembers(props.membersData.data)
    setLocalBlogPosts(props.blogPostsData.data)
  }, [props.projectsData.data, props.membersData.data, props.blogPostsData.data])

  const handleProjectSuccess = React.useCallback((project: Project, isEdit: boolean) => {
    if (isEdit) {
      setLocalProjects(prev => prev.map(p => p.id === project.id ? project : p))
    } else {
      setLocalProjects(prev => [project, ...prev])
    }
  }, [])

  const handleMemberSuccess = React.useCallback((member: Member, isEdit: boolean) => {
    if (isEdit) {
      setLocalMembers(prev => prev.map(m => m.id === member.id ? member : m))
    } else {
      setLocalMembers(prev => [member, ...prev])
    }
  }, [])

  const handleBlogSuccess = React.useCallback((post: BlogPost, isEdit: boolean) => {
    if (isEdit) {
      setLocalBlogPosts(prev => prev.map(p => p.id === post.id ? post : p))
    } else {
      setLocalBlogPosts(prev => [post, ...prev])
    }
  }, [])

  const handleEditItem = React.useCallback((type: "project" | "member" | "blog", id: string) => {
    setSearchEditItem({ type, id })
  }, [])

  const handleDeleteTrigger = React.useCallback((type: "project" | "member" | "blog", id: string) => {
    setDeleteConfirmation({ type, id })
  }, [])

  const confirmDelete = async () => {
    if (!deleteConfirmation) return

    const { type, id } = deleteConfirmation
    let success = false

    try {
      if (type === "project") {
        const res = await deleteProject(id)
        if (res.success) {
          setLocalProjects(prev => prev.filter(p => p.id !== id))
          success = true
        }
      } else if (type === "member") {
        const res = await deleteMember(id)
        if (res.success) {
          setLocalMembers(prev => prev.filter(m => m.id !== id))
          success = true
        }
      } else if (type === "blog") {
        const res = await deleteBlogPost(id)
        if (res.success) {
          setLocalBlogPosts(prev => prev.filter(p => p.id !== id))
          success = true
        }
      }

      if (success) {
        toast({ title: "Item excluído com sucesso" })
      } else {
        toast({ title: "Erro ao excluir item", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Erro na operação", variant: "destructive" })
    } finally {
      setDeleteConfirmation(null)
    }
  }

  // Find items for editing
  const projectToEdit = React.useMemo(() => 
    searchEditItem?.type === "project" ? localProjects.find(p => p.id === searchEditItem.id) : null,
    [searchEditItem, localProjects]
  )

  const memberToEdit = React.useMemo(() => 
    searchEditItem?.type === "member" ? localMembers.find(m => m.id === searchEditItem.id) : null,
    [searchEditItem, localMembers]
  )

  const blogToEdit = React.useMemo(() => 
    searchEditItem?.type === "blog" ? localBlogPosts.find(p => p.id === searchEditItem.id) : null,
    [searchEditItem, localBlogPosts]
  )

  return {
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
  }
}
