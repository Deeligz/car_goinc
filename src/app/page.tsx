'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import CategoryList from '@/components/CategoryList'
import { ProductSkeleton, CategorySkeleton } from '@/components/Skeleton'
import type { Product, Category } from '@/lib/supabase'

function LoadingState() {
  return (
    <>
      <CategorySkeleton />
      <div className="products-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </>
  )
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 20

  const fetchProducts = async (categoryId: number | null = null) => {
    try {
      setIsLoading(true)
      // First, get total count
      let countQuery = supabase
        .from('products')
        .select('id', { count: 'exact' })
      
      if (categoryId) {
        countQuery = countQuery.eq('category_id', categoryId)
      }
      
      if (searchQuery) {
        countQuery = countQuery.ilike('name', `%${searchQuery}%`)
      }

      const { count, error: countError } = await countQuery

      if (countError) {
        console.error('Error getting count:', countError)
        setError(`Error getting count: ${countError.message}`)
        return
      }

      setTotalCount(count || 0)

      // Then get paginated data
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id(name)
        `)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
      
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
      setProducts(data as Product[])
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
    setCurrentPage(1) // Reset to first page when category or search changes
    fetchProducts(selectedCategory)
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    fetchProducts(selectedCategory)
  }, [currentPage])

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <Suspense fallback={<LoadingState />}>
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

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

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

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </Suspense>
  )
}
