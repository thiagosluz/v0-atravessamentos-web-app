"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { type Column } from "./admin-data-table"

interface TableHeaderProps<T> {
  columns: Column<T>[]
  allSelected: boolean
  onSelectAll: (checked: boolean) => void
  sortConfig: { key: string; direction: "asc" | "desc" | null }
  onSort: (key: string) => void
  dataLength: number
}

export function AdminTableHeader<T>({
  columns,
  allSelected,
  onSelectAll,
  sortConfig,
  onSort,
  dataLength
}: TableHeaderProps<T>) {
  return (
    <TableHeader>
      <TableRow className="border-border hover:bg-transparent">
        <TableHead className="w-[40px] no-print">
          <Checkbox
            checked={allSelected && dataLength > 0}
            onCheckedChange={onSelectAll}
            aria-label="Selecionar todos"
          />
        </TableHead>
        <TableHead className="w-[80px]">ID</TableHead>
        {columns.map((col) => (
          <TableHead key={col.id} className={cn(col.sortable && "cursor-pointer select-none")}>
            {col.sortable ? (
              <div
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                onClick={() => onSort(col.id)}
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
  )
}
