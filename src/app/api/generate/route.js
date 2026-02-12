import { NextResponse } from 'next/server'
import { fetchSourceData, generateBatch } from '../../../lib/generator'

export async function POST(request) {
  try {
    const { count, nameLength } = await request.json()
    const limit = parseInt(count) || 10
    const length = parseInt(nameLength) || 2
    
    if (limit > 10000) {
        return NextResponse.json({ 
            success: false, 
            error: "Max 10,000 rows." 
        }, { status: 400 })
    }

    const pool = await fetchSourceData()
    const data = generateBatch(limit, pool, { nameLength: length })

    return NextResponse.json({ success: true, count: data.length, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}