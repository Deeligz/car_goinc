import { createClient } from '@supabase/supabase-js'

// Define database types
export type Product = {
  id: number
  name: string
  description: string
  price: number
  category_id: number
  created_at?: string
  categories?: {
    name: string
  }
}

export type Category = {
  id: number
  name: string
  created_at?: string
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) 