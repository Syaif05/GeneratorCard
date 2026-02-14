import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabase-admin'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page')) || 1
  const limit = parseInt(searchParams.get('limit')) || 10
  const category = searchParams.get('category') || 'all'
  
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabaseAdmin
    .from('identity_names')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error, count } = await query

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  // Map val_data to value for frontend compatibility
  const mappedData = data.map(item => ({
      ...item,
      value: item.val_data
  }))

  return NextResponse.json({ 
    success: true, 
    data: mappedData, 
    meta: {
      total: count,
      page,
      last_page: Math.ceil(count / limit)
    }
  })
}

export async function DELETE(request) {
  const { id } = await request.json()
  const { error } = await supabaseAdmin.from('identity_names').delete().eq('id', id)
  
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PUT(request) {
  const { id, value } = await request.json()
  const { error } = await supabaseAdmin.from('identity_names').update({ val_data: value }).eq('id', id)
  
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}