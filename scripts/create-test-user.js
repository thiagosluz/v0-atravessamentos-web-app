const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Faltam variáveis de ambiente (SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  const email = 'test@atravessamentos.com'
  const password = 'password123'

  console.log(`Tentando criar/limpar usuário de teste: ${email}`)

  try {
    // Delete if exists (to start clean)
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('Erro ao listar usuários:', listError)
      return
    }

    const existingUser = users.users.find(u => u.email === email)
    if (existingUser) {
      await supabase.auth.admin.deleteUser(existingUser.id)
      console.log('Usuário existente deletado.')
    }

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Test Admin' }
    })

    if (error) {
      console.error('Erro ao criar usuário:', error)
    } else {
      console.log('Usuário de teste criado com sucesso:', data.user.id)
    }
  } catch (err) {
    console.error('Erro inesperado:', err)
  }
}

createTestUser()
