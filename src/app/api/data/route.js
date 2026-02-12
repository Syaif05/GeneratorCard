import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const { category, items } = await request.json()
    
    if (!category || !items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 })
    }

    const payload = items
      .filter(item => item.trim() !== '')
      .map(item => ({
        category,
        value: item.trim()
      }))

    if (payload.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid items to insert' }, { status: 400 })
    }

    const { error } = await supabase
      .from('source_data')
      .upsert(payload, { onConflict: 'category, value', ignoreDuplicates: true })

    if (error) throw error

    return NextResponse.json({ success: true, count: payload.length })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}