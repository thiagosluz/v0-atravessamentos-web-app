/**
 * Utilitários para exportação de dados do dashboard administrativo.
 * Focado em performance e portabilidade.
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (!data || !data.length) return;

  const targetColumns = columns || Object.keys(data[0]).map(key => ({ key, label: key }));
  
  // Cabeçalho
  const headers = targetColumns.map(col => `"${String(col.label)}"`).join(",");
  
  // Linhas
  const rows = data.map(item => {
    return targetColumns.map(col => {
      const value = item[col.key];
      // Tratar nulos, undefined e escapar aspas
      const escaped = String(value ?? "").replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(",");
  });

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exportação para PDF (Simulação nativa via print)
 * Para uma exportação de alta fidelidade sem bibliotecas externas pesadas,
 * usamos o motor de impressão do browser com CSS print específico.
 */
export function exportToPDF() {
  window.print();
}
