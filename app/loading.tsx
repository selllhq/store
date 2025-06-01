export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
        <p className="mt-2 text-lg text-gray-600">
          Please wait while we fetch your store data.
        </p>
      </div>
    </div>
  );
}
