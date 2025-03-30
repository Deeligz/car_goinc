interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`skeleton ${className || ''}`} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="product-card">
      <div className="product-card-content">
        <div className="skeleton-wrapper">
          <Skeleton className="skeleton-title" />
          <Skeleton className="skeleton-description" />
          <div className="product-footer">
            <Skeleton className="skeleton-price" />
            <Skeleton className="skeleton-category" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="category-list">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="skeleton-category-button" />
      ))}
    </div>
  );
} 