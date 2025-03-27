// React is used implicitly for JSX

interface ShimmerCardProps {
  type?: 'product' | 'store';
}

export default function ShimmerCard({ type = 'product' }: ShimmerCardProps) {
  return (
    <div 
      className="animate-pulse rounded-lg overflow-hidden"
      style={{ 
        backgroundColor: '#1A1A1A20',
        border: '1px solid #2A2A2A20'
      }}
    >
      {type === 'product' ? (
        // Product card shimmer
        <div className="flex flex-col h-full">
          {/* Image placeholder */}
          <div className="w-full aspect-square bg-gray-300"></div>
          
          {/* Content area */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title placeholder */}
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            
            {/* Description placeholder */}
            <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
            
            {/* Price placeholder */}
            <div className="h-6 bg-gray-300 rounded w-1/3 mt-auto mb-3"></div>
            
            {/* Button placeholder */}
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ) : (
        // Store loading shimmer
        <div className="p-6 flex flex-col space-y-4">
          {/* Store header */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          
          {/* Store content */}
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          
          {/* Store stats */}
          <div className="flex justify-between mt-4">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      )}
    </div>
  );
}
