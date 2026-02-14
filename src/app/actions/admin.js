'use server'

import { supabaseAdmin } from '../../lib/supabase-admin'

export async function getAdminProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .eq('product_type', 'account')
      .order('name')

    if (error) {
      console.error('Supabase Error (getAdminProducts):', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Server Action Error:', err)
    return { success: false, error: 'Internal Server Error' }
  }
}

export async function pushAdminStock(payload) {
  try {
    const { error } = await supabaseAdmin
      .from('account_stocks')
      .insert(payload)

    if (error) {
      console.error('Supabase Error (pushAdminStock):', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Server Action Error:', err)
    return { success: false, error: 'Internal Server Error' }
  }
}
