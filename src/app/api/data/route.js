import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase-admin'

export async function POST(request) {
  try {
    const { category, items } = await request.json()
    
    if (!category || !items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 })
    }

    // Filter and map to correct column (val_data)
    const payload = items
      .filter(item => item.trim() !== '')
      .map(item => ({
        category,
        val_data: item.trim()
      }))

    if (payload.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid items to insert' }, { status: 400 })
    }

    // Using INSERT instead of UPSERT because we don't have a unique constraint on (category, val_data)
    const { error } = await supabaseAdmin
      .from('identity_names')
      .insert(payload)

    if (error) throw error

    return NextResponse.json({ success: true, count: payload.length })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}