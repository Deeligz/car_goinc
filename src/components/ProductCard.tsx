import type { Product } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="product-card-content">
        <h2 className="product-title">{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-category">{product.categories?.name || 'Uncategorized'}</span>
        </div>
      </div>
    </div>
  )
} 