import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src="/store-not-found.svg"
            alt="Store not found"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900">Store Not Found</h1>
        <p className="mt-2 text-lg text-gray-600 md:w-2/3 mx-auto">
          The store you're looking for doesn't exist or is no longer available.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link
              href="https://selll.online"
            >
              Go to Selll Homepage
            </Link>
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Are you a store owner?{' '}
            <a
              href="https://selll.online/auth/login"
              className="text-primary hover:text-primary/90"
            >
              Login to your account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
