const { globalSearch } = require('./lib/actions/search');

async function verifyAdminSearch() {
  console.log("--- TESTE BUSCA ADMIN ---");
  
  // Teste 1: Busca pública (não deve retornar rascunhos)
  const publicRes = await globalSearch("Cartografias", false);
  console.log("Busca Pública (Cartografias):", publicRes.length, "resultados");

  // Teste 2: Busca Admin (deve retornar rascunhos como 'Cartografias do Cerrado')
  const adminRes = await globalSearch("Cartografias", true);
  console.log("Busca Admin (Cartografias):", adminRes.length, "resultados");
  if (adminRes.length > 0) {
    console.log("Primeiro resultado admin:", adminRes[0].title);
  }
}

verifyAdminSearch().catch(console.error);
