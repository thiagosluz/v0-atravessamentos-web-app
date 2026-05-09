import { createAdminClient } from "./lib/supabase/admin"

async function testFetch() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("projects").select("id, title")
  console.log("=== DIAGNÓSTICO DE PROJETOS ===")
  if (error) {
    console.error("Erro na busca:", error)
  } else {
    console.log(`Encontrados ${data?.length || 0} projetos.`)
    console.log("Dados:", JSON.stringify(data, null, 2))
  }
}

testFetch()
