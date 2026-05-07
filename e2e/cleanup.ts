import { createAdminClient } from '../lib/supabase/admin'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente (.env.local)
dotenv.config({ path: '.env.local' })

async function globalTeardown() {
  console.log('\n🧹 Iniciando limpeza de dados de teste...')
  
  const supabase = createAdminClient()
  const prefix = '[E2E]'

  try {
    // 1. Limpar Projetos
    const { data: projects } = await supabase
      .from('projects')
      .select('id')
      .ilike('title', `${prefix}%`)
    
    if (projects && projects.length > 0) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', projects.map(p => p.id))
      if (!error) console.log(`✅ ${projects.length} projetos de teste removidos.`)
    }

    // 2. Limpar Blog
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id')
      .ilike('title', `${prefix}%`)
    
    if (posts && posts.length > 0) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .in('id', posts.map(p => p.id))
      if (!error) console.log(`✅ ${posts.length} posts de teste removidos.`)
    }

    // 3. Limpar Membros
    const { data: members } = await supabase
      .from('members')
      .select('id')
      .ilike('name', `${prefix}%`)
    
    if (members && members.length > 0) {
      const { error } = await supabase
        .from('members')
        .delete()
        .in('id', members.map(p => p.id))
      if (!error) console.log(`✅ ${members.length} membros de teste removidos.`)
    }

    // 4. Limpar Categorias de teste
    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `${prefix}%`)
    
    if (categories && categories.length > 0) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .in('id', categories.map(c => c.id))
      if (!error) console.log(`✅ ${categories.length} categorias de teste removidas.`)
    }

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error)
  }
}

export default globalTeardown
