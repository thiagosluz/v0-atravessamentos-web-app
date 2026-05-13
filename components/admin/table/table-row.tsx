"use client"

import * as React from "react"
import { Copy, Check, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TableCell, TableRow } from "@/components/ui/table"
import { type Column } from "./admin-data-table"

interface TableRowProps<T> {
  item: T
  columns: Column<T>[]
  id: string
  selected: boolean
  onSelect: (id: string, checked: boolean) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onCopyId: (id: string) => void
  isCopied: boolean
  labels?: { edit?: string; delete?: string }
  entityName: string
}

function AdminTableRowInner<T extends Record<string, any>>({
  item,
  columns,
  id,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onCopyId,
  isCopied,
  labels,
  entityName
}: TableRowProps<T>) {
  return (
    <TableRow className="border-border group">
      <TableCell className="no-print">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(id, !!checked)}
          aria-label={`Selecionar item ${id}`}
        />
      </TableCell>
      <TableCell>
        <button
          onClick={() => onCopyId(id)}
          className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/id"
          title={id}
        >
          {id.substring(0, 4)}...
          {isCopied ? (
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
}

export const AdminTableRow = React.memo(AdminTableRowInner) as typeof AdminTableRowInner
