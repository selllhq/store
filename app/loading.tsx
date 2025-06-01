export default function Loading() {
  return (
    <div className="py-12">
      <div className="animate-pulse h-8 w-48 bg-gray-300 rounded mb-8"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[...Array(8)].map((_, index) => (
          <ShimmerCard key={index} type="product" />
        ))}
      </div>

      <div className="flex justify-center mt-12 mb-8">
        <div className="animate-pulse h-12 w-48 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}

interface ShimmerCardProps {
  type?: 'product' | 'store';
}

export function ShimmerCard({ type = 'product' }: ShimmerCardProps) {
  return (
    <div
      className="animate-pulse rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#1A1A1A20',
        border: '1px solid #2A2A2A20',
      }}
    >
      {type === 'product' ? (
        <div className="flex flex-col h-full">
          <div className="w-full aspect-square bg-gray-300"></div>

          <div className="p-4 flex flex-col flex-grow">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3 mt-auto mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>

          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>

          <div className="flex justify-between mt-4">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      )}
    </div>
  );
}
