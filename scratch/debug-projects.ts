import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkProjects() {
  const { error: insertError } = await supabase
    .from('projects')
    .insert({
      title: 'Test Project ' + Date.now(),
      category: 'Nova Categoria Teste',
      description: 'Test Description',
      status: 'Rascunho',
      year: 2024
    })

  if (insertError) {
    console.log('Project Insert Error:', insertError)
  } else {
    console.log('Project Insert Success')
  }
}

checkProjects()
