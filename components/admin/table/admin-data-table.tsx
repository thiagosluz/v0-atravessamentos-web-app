"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { TableBulkActions } from "./table-bulk-actions"
import { AdminTableHeader } from "./table-header"
import { AdminTableRow } from "./table-row"

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
  const handleSelectAll = React.useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(data.map((item) => String(item[idField as keyof T]))))
    } else {
      setSelectedIds(new Set())
    }
  }, [data, idField])

  const handleSelectItem = React.useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const handleSort = React.useCallback((key: string) => {
    setSortConfig(prev => {
      let direction: "asc" | "desc" | null = "asc"
      if (prev.key === key && prev.direction === "asc") {
        direction = "desc"
      } else if (prev.key === key && prev.direction === "desc") {
        direction = null
      }
      return { key, direction }
    })
  }, [])

  const copyToClipboard = React.useCallback((id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    toast.success("ID copiado para a área de transferência")
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

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
      <TableBulkActions
        selectedCount={selectedIds.size}
        entityName={entityName}
        data={data}
        onBulkDelete={() => {
          setConfirmText("")
          setBulkDeleteOpen(true)
        }}
      />

      <div className="overflow-x-auto">
        <Table>
          <AdminTableHeader
            columns={columns}
            allSelected={selectedIds.size === data.length && data.length > 0}
            onSelectAll={handleSelectAll}
            sortConfig={sortConfig}
            onSort={handleSort}
            dataLength={data.length}
          />
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 3} className="py-12 text-center text-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item) => {
                const id = String(item[idField as keyof T])
                return (
                  <AdminTableRow
                    key={id}
                    id={id}
                    item={item}
                    columns={columns}
                    selected={selectedIds.has(id)}
                    onSelect={handleSelectItem}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCopyId={copyToClipboard}
                    isCopied={copiedId === id}
                    labels={labels}
                    entityName={entityName}
                  />
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

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
