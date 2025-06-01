import Link from 'next/link';
import Image from 'next/image';

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
        <p className="mt-2 text-lg text-gray-600">
          The store you're looking for doesn't exist or is no longer available.
        </p>
        
        <div className="mt-8">
          <Link 
            href="https://selll.online" 
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Selll Homepage
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Are you a store owner? <a href="https://selll.online/login" className="text-indigo-600 hover:text-indigo-500">Login to your account</a></p>
        </div>
      </div>
    </div>
  );
}
