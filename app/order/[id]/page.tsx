'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/context/store-context';
import { useOrder } from '@/data/order';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderPage() {
  const { store, config } = useStore();
  const { isLoading, order } = useOrder(store.id, useParams().id as string);

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: config?.background_color || '#FFFFFF',
          color: config?.text_color || '#000000',
        }}
      >
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="animate-pulse mb-8">
            <div className="h-10 w-64 bg-gray-300 rounded mb-2"></div>
            <div className="h-5 w-48 bg-gray-300 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="h-6 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="p-4 space-y-4">
                <div className="h-5 w-full bg-gray-300 rounded"></div>
                <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="h-6 w-40 bg-gray-300 rounded"></div>
              </div>
              <div className="p-4 space-y-4">
                <div className="h-5 w-full bg-gray-300 rounded"></div>
                <div className="h-5 w-2/3 bg-gray-300 rounded"></div>
                <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
            </div>
            <div className="divide-y divide-gray-200">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 flex items-center">
                  <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="h-6 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-gray-300 rounded"></div>
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div
          className="text-center py-12 px-4 rounded-lg"
          style={{
            backgroundColor: config?.background_color
              ? `${config.background_color}80`
              : '#1E1E1E80',
          }}
        >
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FF000022', color: '#FF0000' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Order Not Found</h2>
          <p className="mb-8">
            {'We could not find the order you are looking for.'}
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-2 rounded font-medium transition-all duration-200"
            style={{
              backgroundColor: config?.theme_color || '#FFA726',
              color: '#FFFFFF',
            }}
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: config?.background_color || '#FFFFFF',
        color: config?.text_color || '#000000',
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-lg mb-2">Your order has been confirmed.</p>
          <p className="text-md text-gray-500">Order #{order?.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            style={{ borderColor: config?.border_color || '#E5E7EB' }}
          >
            <div
              className="p-4 border-b border-gray-200 bg-gray-50/10"
              style={{ borderColor: config?.border_color || '#E5E7EB' }}
            >
              <h3 className="font-medium">Order Information</h3>
            </div>
            <div className="p-6 space-y-3">
              <p>
                <span className="text-gray-600">Order ID:</span> {order?.id}
              </p>
              <p>
                <span className="text-gray-600">Status:</span>{' '}
                <span className="capitalize">{order?.status}</span>
              </p>
              <p>
                <span className="text-gray-600">Date:</span>{' '}
                {dayjs(order?.created_at).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>

          <div
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            style={{ borderColor: config?.border_color || '#E5E7EB' }}
          >
            <div
              className="p-4 border-b border-gray-200 bg-gray-50/10"
              style={{ borderColor: config?.border_color || '#E5E7EB' }}
            >
              <h3 className="font-medium">Payment Information</h3>
            </div>
            <div className="p-6 space-y-3">
              <p>
                <span className="text-gray-600">Customer ID:</span>{' '}
                {order?.customer_id}
              </p>
              <p>
                <span className="text-gray-600">Store URL:</span>{' '}
                {order?.store_url.includes(window.location.hostname) ? (
                  <Link
                    href={order?.store_url.replace(window.location.origin, '')}
                    className="hover:underline"
                    style={{ color: config?.theme_color || '#FFA726' }}
                  >
                    {order?.store_url}
                  </Link>
                ) : (
                  <a
                    href={order?.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: config?.theme_color || '#FFA726' }}
                  >
                    {order?.store_url}
                  </a>
                )}
              </p>
              <p>
                <span className="text-gray-600">Last Updated:</span>{' '}
                {dayjs(order?.updated_at).format('MMMM D, YYYY')}
              </p>
            </div>
          </div>
        </div>

        {order?.items?.length > 0 && (
          <div
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8"
            style={{ borderColor: config?.border_color || '#E5E7EB' }}
          >
            <div
              className="p-4 border-b border-gray-200 bg-gray-50/10"
              style={{ borderColor: config?.border_color || '#E5E7EB' }}
            >
              <h3 className="font-medium">Items</h3>
            </div>
            <div
              className="divide-y divide-gray-200"
              style={{ borderColor: config?.border_color || '#E5E7EB' }}
            >
              {order?.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-md mr-4 flex items-center justify-center overflow-hidden">
                    {item.product.images ? (
                      <img
                        src={JSON.parse(item.product.images)[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div
                    className="font-medium"
                    style={{ color: config?.theme_color || '#FFA726' }}
                  >
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: store?.currency || 'USD',
                    }).format(Number(item.product.price))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8"
          style={{ borderColor: config?.border_color || '#E5E7EB' }}
        >
          <div
            className="p-4 border-b border-gray-200 bg-gray-50/10"
            style={{ borderColor: config?.border_color || '#E5E7EB' }}
          >
            <h3 className="font-medium">Order Summary</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: store?.currency || 'USD',
                }).format(Number(order?.total) * 0.98)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: store?.currency || 'USD',
                }).format(Number(order?.total) * 0.02)}
              </span>
            </div>
            <div
              className="flex justify-between pt-4 border-t border-gray-200"
              style={{ borderColor: config?.border_color || '#E5E7EB' }}
            >
              <span className="font-semibold">Total</span>
              <span
                className="font-semibold"
                style={{ color: config?.theme_color || '#FFA726' }}
              >
                {Number(order?.total).toLocaleString('en-US', {
                  style: 'currency',
                  currency: store?.currency || 'USD',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <Button
            asChild
            className="px-6 py-2 rounded-md font-medium transition-all duration-200 text-white cursor-pointer"
            style={{ backgroundColor: config?.theme_color || '#FFA726' }}
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
