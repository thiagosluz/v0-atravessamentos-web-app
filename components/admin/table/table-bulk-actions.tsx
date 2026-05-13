"use client"

import * as React from "react"
import { Trash2, FileDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportToCSV, exportToPDF } from "@/lib/utils/export"

interface TableBulkActionsProps {
  selectedCount: number
  entityName: string
  data: any[]
  onBulkDelete: () => void
}

export function TableBulkActions({
  selectedCount,
  entityName,
  data,
  onBulkDelete
}: TableBulkActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {selectedCount} selecionado(s)
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 gap-2"
              onClick={onBulkDelete}
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
          onClick={() => exportToCSV(data, entityName)}
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
          onClick={() => exportToPDF()}
          title="Exportar para PDF"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">PDF</span>
        </Button>
      </div>
    </div>
  )
}
