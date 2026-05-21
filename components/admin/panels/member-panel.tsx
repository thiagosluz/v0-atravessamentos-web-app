"use client"

import * as React from "react"
import { type Member } from "@/lib/mock-data"
import { type Category } from "@/lib/actions/categories"
import { AdminDataTable, type Column } from "../table/admin-data-table"
import { MemberFormDialog } from "../forms/member-form-dialog"
import { Pagination } from "../shared/pagination"
import { PDFDownloadButton } from "../pdf/pdf-download-button"

interface MemberPanelProps {
  members: Member[]
  totalCount: number
  currentPage: number
  categories: Category[]
  onSuccess: (member: Member, isEdit: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDeleteBulk: (ids: string[]) => Promise<void>
}

export function MemberPanel({
  members,
  totalCount,
  currentPage,
  categories,
  onSuccess,
  onEdit,
  onDelete,
  onDeleteBulk,
}: MemberPanelProps) {
  const columns: Column<Member>[] = [
    {
      id: "name",
      label: "Membro",
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted sm:block">
            <img
              src={m.avatar || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <p className="truncate font-medium">{m.name}</p>
        </div>
      ),
    },
    { id: "role", label: "Papel", sortable: true },
    {
      id: "tags",
      label: "Tags",
      render: (m) => (
        <div className="flex flex-wrap gap-1">
          {m.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      label: "",
      render: (m) => (
        <div className="flex justify-end">
          <PDFDownloadButton member={m} />
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
            Membros do Coletivo
          </h2>
          <p className="mt-1 text-sm text-foreground">Gerencie quem faz parte do Atravessamentos.</p>
        </div>
        <MemberFormDialog onSuccess={onSuccess} categories={categories} />
      </div>
      <AdminDataTable
        data={members}
        columns={columns}
        entityName="membros"
        onEdit={onEdit}
        onDelete={onDelete}
        onDeleteBulk={onDeleteBulk}
        labels={{ edit: "Editar membro", delete: "Excluir membro" }}
      />
      <Pagination totalCount={totalCount} pageSize={10} currentPage={currentPage} paramName="m_page" />
    </>
  )
}
