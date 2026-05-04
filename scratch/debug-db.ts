import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSchema() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Error fetching blog_posts:', error)
  } else {
    console.log('Sample blog post:', data)
  }

  // Try to insert a post with a new category to see the error
  const { error: insertError } = await supabase
    .from('blog_posts')
    .insert({
      title: 'Test Post ' + Date.now(),
      category: 'Nova Categoria Teste',
      author: 'Tester',
      status: 'Rascunho',
      slug: 'test-post-' + Date.now()
    })

  if (insertError) {
    console.log('Insert Error:', insertError)
  } else {
    console.log('Insert Success')
  }
}

checkSchema()
