"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  FileDown,
  MoreHorizontal,
  Trash2,
  Copy,
  Check,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { exportToCSV, exportToPDF } from "@/lib/utils/export"
import { toast } from "sonner"

export interface Column<T> {
  id: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

interface AdminDataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onDeleteBulk?: (ids: string[]) => Promise<void>
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  entityName: string
  idField?: keyof T
  labels?: {
    edit?: string
    delete?: string
  }
}

export function AdminDataTable<T extends Record<string, any>>({
  data,
  columns,
  onDeleteBulk,
  onEdit,
  onDelete,
  entityName,
  idField = "id" as keyof T,
  labels,
}: AdminDataTableProps<T>) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  })
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")

  const isConfirmValid = confirmText === "EXCLUIR"

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(data.map((item) => String(item[idField as keyof T]))))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    setSelectedIds(next)
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null
    }
    setSortConfig({ key, direction })
  }

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    toast.success("ID copiado para a área de transferência")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Dados ordenados
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data

    return [...data].sort((a, b) => {
      const aValue = String(a[sortConfig.key as keyof T] || "")
      const bValue = String(b[sortConfig.key as keyof T] || "")
      
      if (sortConfig.direction === "asc") {
        return aValue.localeCompare(bValue, undefined, { numeric: true })
      } else {
        return bValue.localeCompare(aValue, undefined, { numeric: true })
      }
    })
  }, [data, sortConfig])

  return (
    <div className="space-y-4">
      {/* Barra de Ações Superiores */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {selectedIds.size} selecionado(s)
              </span>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 gap-2"
                onClick={() => {
                  setConfirmText("")
                  setBulkDeleteOpen(true)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir em massa
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto no-print">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 border-dashed"
            disabled={data.length === 0}
            onClick={() => {
              console.log(`Exportando ${entityName} para CSV...`)
              exportToCSV(data, entityName)
            }}
            title="Exportar para CSV"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 border-dashed"
            disabled={data.length === 0}
            onClick={() => {
              console.log(`Exportando ${entityName} para PDF...`)
              exportToPDF()
            }}
            title="Exportar para PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[40px] no-print">
                <Checkbox
                  checked={selectedIds.size === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              {columns.map((col) => (
                <TableHead key={col.id} className={cn(col.sortable && "cursor-pointer select-none")}>
                  {col.sortable ? (
                    <div
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                      {sortConfig.key === col.id ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />
                      )}
                    </div>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              <TableHead className="w-[60px] text-right no-print">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 3} className="py-12 text-center text-foreground/60">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => {
                const id = String(item[idField as keyof T])
                return (
                  <TableRow key={id} className="border-border group">
                    <TableCell className="no-print">
                      <Checkbox
                        checked={selectedIds.has(id)}
                        onCheckedChange={(checked) => handleSelectItem(id, !!checked)}
                        aria-label={`Selecionar item ${id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => copyToClipboard(id)}
                        className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/id"
                        title={id}
                      >
                        {id.substring(0, 4)}...
                        {copiedId === id ? (
                          <Check className="h-2.5 w-2.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-2.5 w-2.5 opacity-0 group-hover/id:opacity-100" />
                        )}
                      </button>
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        {col.render ? col.render(item) : String(item[col.id as keyof T] || "-")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right no-print">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onEdit?.(id)}
                          aria-label={labels?.edit || `Editar ${entityName.slice(0, -1)}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete?.(id)}
                          aria-label={labels?.delete || `Excluir ${entityName.slice(0, -1)}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Confirmação em Massa */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Confirmar exclusão em massa
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                <div>
                  Você está prestes a excluir permanentemente <strong>{selectedIds.size} {entityName}</strong>. 
                  Esta ação não poderá ser desfeita.
                </div>
                <div className="space-y-2 rounded-lg bg-destructive/5 p-3 border border-destructive/10 text-destructive text-xs">
                  <div className="font-semibold uppercase tracking-wider">Atenção:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Os dados serão removidos dos servidores.</li>
                    <li>Arquivos de mídia associados podem ser perdidos.</li>
                    <li>O histórico de versões será apagado.</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmText" className="text-sm font-medium">
                Para confirmar, digite <span className="font-bold text-foreground">EXCLUIR</span> abaixo:
              </Label>
              <Input
                id="confirmText"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Digite a palavra de segurança"
                className={cn(
                  "uppercase",
                  confirmText && !isConfirmValid && "border-destructive focus-visible:ring-destructive"
                )}
                autoFocus
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmText("")}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!isConfirmValid}
              onClick={() => {
                onDeleteBulk?.(Array.from(selectedIds))
                setBulkDeleteOpen(false)
                setSelectedIds(new Set())
              }}
              className="gap-2"
            >
              Excluir permanentemente
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
