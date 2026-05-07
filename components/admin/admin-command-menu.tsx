"use client"
 
import * as React from "react"
import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  UserCircle,
  ExternalLink,
} from "lucide-react"
import { useDebounce } from "../../lib/hooks/use-debounce"
import { globalSearch, type SearchResult } from "@/lib/actions/search"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
 
interface AdminCommandMenuProps {
  setActive: (id: string) => void
  onEditItem: (type: "project" | "member" | "blog", id: string) => void
}
 
export function AdminCommandMenu({ setActive, onEditItem }: AdminCommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const debouncedQuery = useDebounce(query, 300)
 
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
 
  React.useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }
 
    const fetchResults = async () => {
      setLoading(true)
      try {
        // Busca com isAdmin: true para incluir rascunhos
        const data = await globalSearch(debouncedQuery, true)
        setResults(data)
      } catch (error) {
        console.error("Erro na busca admin:", error)
      } finally {
        setLoading(false)
      }
    }
 
    fetchResults()
  }, [debouncedQuery])
 
  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }
 
  const projects = results.filter((r) => r.type === "project")
  const members = results.filter((r) => r.type === "member")
  const blogPosts = results.filter((r) => r.type === "blog")
 
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-9 w-56 items-center rounded-full border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted md:w-64"
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="flex-1 text-left">Buscar ou comandar...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
 
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput 
          placeholder="O que você quer fazer?" 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && <div className="p-4 text-center text-sm text-muted-foreground">Buscando...</div>}
          
          {query.length < 2 && (
            <CommandGroup heading="Navegação Rápida">
              <CommandItem onSelect={() => runCommand(() => setActive("overview"))}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Visão Geral</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActive("projects"))}>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>Projetos</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActive("members"))}>
                <Users className="mr-2 h-4 w-4" />
                <span>Membros</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActive("blog"))}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Blog</span>
              </CommandItem>
              <CommandSeparator />
              <CommandItem onSelect={() => runCommand(() => setActive("settings"))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setActive("profile"))}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => window.location.href = "/")}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Ver Site Público</span>
              </CommandItem>
            </CommandGroup>
          )}
 
          {results.length === 0 && query.length >= 2 && !loading && (
            <CommandEmpty>Nenhum resultado encontrado para "{query}".</CommandEmpty>
          )}
 
          {projects.length > 0 && (
            <CommandGroup heading="Editar Projetos">
              {projects.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => {
                    onEditItem("project", item.id)
                  })}
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
 
          {members.length > 0 && (
            <CommandGroup heading="Gerenciar Membros">
              {members.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => onEditItem("member", item.id))}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
 
          {blogPosts.length > 0 && (
            <CommandGroup heading="Editar Blog">
              {blogPosts.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => onEditItem("blog", item.id))}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
