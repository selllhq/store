import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src="/product-not-found.svg"
            alt="Product not found"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900">Product Not Found</h1>
        <p className="mt-2 text-lg text-gray-600 md:w-2/3 mx-auto">
          The product you're looking for doesn't exist or is no longer available.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link
              href="/"
            >
              Back to Store
            </Link>
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Want to browse more products?{' '}
            <Link
              href="/products"
              className="text-primary hover:text-primary/90"
            >
              View all products
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
