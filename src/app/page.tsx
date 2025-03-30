'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import CategoryList from '@/components/CategoryList'
import type { Product, Category } from '@/lib/supabase'

function Loading() {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = async (categoryId: number | null = null) => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
      
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }

      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching products:', error)
        setError(`Error fetching products: ${error.message}`)
        return
      }
      
      if (!data) {
        console.log('No products found')
        setProducts([])
        return
      }

      console.log('Fetched products:', data)
      setProducts(data)
      setError(null)
    } catch (err) {
      console.error('Error in fetchProducts:', err)
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
      
      if (error) {
        console.error('Error fetching categories:', error)
        setError(`Error fetching categories: ${error.message}`)
        return
      }
      
      if (!data) {
        console.log('No categories found')
        setCategories([])
        return
      }

      console.log('Fetched categories:', data)
      setCategories(data)
      setError(null)
    } catch (err) {
      console.error('Error in fetchCategories:', err)
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts(selectedCategory)
  }, [selectedCategory, searchQuery])

  return (
    <Suspense fallback={<Loading />}>
      <main className="container">
        <div className="header">
          <h1>Car-Go Parts</h1>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <div className="products-grid">
            {products.length === 0 ? (
              <p className="no-products">
                No products found
              </p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </main>
    </Suspense>
  )
}
