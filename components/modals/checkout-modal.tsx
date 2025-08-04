import { toast } from 'sonner';
import { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '../ui/button';
import { checkoutBag } from '@/data/order';

import type { Store, StoreConfig } from '@/@types/store';
import type { BagItem, CheckoutCustomer } from '@/@types/order';
import Map from '../store/map';

export default function CheckoutModal({
  show,
  setShow,
  items,
  store,
  storeConfig,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  items: BagItem[];
  store: Store;
  storeConfig?: StoreConfig;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [customerInfo, setCustomerInfo] = useState<CheckoutCustomer>({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: 'Ghana',
    notes: '',
  });

  const [deliveryLocation, setDeliveryLocation] = useState<{
    address: string;
    lngLat: [number, number];
  } | null>(null);

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + parseFloat(item.product.price) * item.quantity,
      0
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryLocation) {
      toast.error('Please select your delivery location on the map.');
      return;
    }

    setStep('payment');
  };

  const handleBackToInfo = () => {
    setStep('info');
  };

  const handleProceedToPayment = async () => {
    if (!deliveryLocation) {
      toast.error('Please select your delivery location on the map.');
      return;
    }

    setIsSubmitting(true);

    checkoutBag({
      store,
      items,
      customer: {
        ...customerInfo,
        deliveryLocation,
      },
    })
      .then((response) => {
        window.location.href = response.url;
        setIsSubmitting(false);
      })
      .catch(() => {
        toast.error(
          'An error occurred while processing your order. Please try again.'
        );
        setIsSubmitting(false);
      });
  };

  const renderOrderSummary = () => (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Order Summary</h3>
      <div
        className="border rounded-lg divide-y"
        style={{
          backgroundColor: storeConfig?.background_color || '#1A1A1A',
          borderColor: storeConfig?.border_color || '#2A2A2A',
        }}
      >
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between p-3"
            style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded overflow-hidden flex-shrink-0"
                style={{
                  backgroundColor: storeConfig?.background_color
                    ? `${storeConfig.background_color}`
                    : '#1A1A1A',
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm opacity-70">Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: store?.currency || 'USD',
                }).format(Number(item.product.price) * Number(item.quantity))}
              </p>
            </div>
          </div>
        ))}
        <div
          className="p-3 flex justify-between font-medium"
          style={{ borderColor: storeConfig?.border_color || '#2A2A2A' }}
        >
          <span>Total</span>
          <span style={{ color: storeConfig?.theme_color || '#FFA726' }}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: store?.currency || 'USD',
            }).format(Number(calculateTotal()))}
          </span>
        </div>
      </div>
    </div>
  );

  const renderCustomerInfoForm = () => (
    <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)] sm:max-h-[calc(90vh-80px)]">
      <h1 className="hidden sm:block text-2xl font-bold mb-6">Checkout</h1>
      {renderOrderSummary()}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <form onSubmit={handleContinueToPayment} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={customerInfo.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={customerInfo.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Delivery Location <span className="text-red-500">*</span>
            </label>
            <Map
              value={deliveryLocation || undefined}
              onChange={(loc) => {
                setDeliveryLocation(loc);
                // Try to extract city and country from loc.address or loc context
                // Use regex or split for city, country (Mapbox returns 'place_name' as 'city, region, country')
                let city = '';
                let country = '';

                if (loc.address) {
                  const parts = loc.address.split(',').map((s) => s.trim());
                  country = parts[parts.length - 1] || '';
                  city = parts.length > 2 ? parts[parts.length - 3] : '';
                }

                setCustomerInfo((prev) => ({
                  ...prev,
                  city,
                  country,
                }));
              }}
            />
            {deliveryLocation?.address && (
              <div
                className="mt-2 text-xs"
                style={{ color: storeConfig?.text_color || '#000000' }}
              >
                Selected: {deliveryLocation.address}
              </div>
            )}
            {!deliveryLocation && (
              <div className="mt-2 text-xs text-red-600">
                Please select your delivery location on the map above.
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block mb-1 font-medium">
              Order Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={customerInfo.notes}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ borderColor: storeConfig?.border_color || '#E5E7EB' }}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-4 mt-4 text-white font-medium rounded-md transition-all duration-300 hover:brightness-90"
            style={{ backgroundColor: storeConfig?.theme_color || '#4CAF50' }}
            disabled={!deliveryLocation || isSubmitting}
          >
            Continue to Payment
          </Button>
        </form>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="p-6 overflow-y-auto max-h-[calc(100vh-80px)] sm:max-h-[calc(90vh-80px)]">
      <h1 className="hidden sm:block text-2xl font-bold mb-6">Payment Information</h1>
      {renderOrderSummary()}

      <div
        className="mb-6 p-4 border rounded-lg"
        style={{
          backgroundColor: storeConfig?.background_color || '#1A1A1A',
          borderColor: storeConfig?.border_color || '#2A2A2A',
        }}
      >
        <div className="flex items-center mb-4">
          <input
            type="radio"
            id="payment-online"
            name="payment-method"
            checked
            className="mr-2"
            style={{ accentColor: storeConfig?.theme_color || '#4CAF50' }}
          />
          <label htmlFor="payment-online" className="font-medium">
            Pay Online
          </label>
        </div>
        <p className="text-sm opacity-70">
          You'll be redirected to a secure payment page to complete your
          purchase.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="py-4 font-medium rounded-md transition-all duration-300"
          onClick={handleBackToInfo}
          style={{
            borderColor: storeConfig?.theme_color || '#4CAF50',
            color: storeConfig?.theme_color || '#4CAF50',
            backgroundColor: 'transparent',
          }}
        >
          Back
        </Button>
        <Button
          type="button"
          className="py-4 text-white font-medium rounded-md transition-all duration-300 hover:brightness-90"
          onClick={handleProceedToPayment}
          disabled={isSubmitting}
          style={{ backgroundColor: storeConfig?.theme_color || '#4CAF50' }}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {show && (
        <div
          className="fixed w-screen h-screen left-0 top-0 z-50 flex flex-col sm:flex-row items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500"
          onClick={() => {
            setShow(false);
          }}
        >
          <div
            className="w-full py-4.5 sm:py-6 px-5 sm:px-9 md:px-12.5 sm:hidden"
            style={{
              backgroundColor: storeConfig?.background_color || '#FFFFFF',
              color: storeConfig?.text_color || '#000000',
              borderBottom: `1px solid ${
                storeConfig?.theme_color || '#E5E7EB'
              }10`,
            }}
          >
            <div className="store-container flex justify-between items-center">
              <div>
                {step === 'info' ? (
                  <h1 className="text-lg font-bold">Checkout</h1>
                ) : (
                  <h1 className="text-lg font-bold">Payment</h1>
                )}
              </div>
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 z-90 p-2 rounded-full transition-all duration-300 hover:bg-black/5"
                aria-label="Close modal"
                onClick={() => {
                  setShow(false);
                }}
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>
          <div
            className="relative bg-opacity-95 backdrop-blur-xl sm:rounded-2xl shadow-2xl max-w-xl w-full sm:max-h-[90vh] overflow-hidden transform transition-all duration-500 sm:border border-opacity-10"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: storeConfig?.background_color || '#FFFFFF',
              color: storeConfig?.text_color || '#000000',
              borderColor: storeConfig?.border_color || '#E5E7EB',
            }}
          >
            <Button
              variant="ghost"
              className="hidden sm:flex absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 p-2 rounded-full transition-all duration-300 hover:bg-black/5"
              aria-label="Close modal"
              onClick={() => {
                setShow(false);
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            {step === 'info' ? renderCustomerInfoForm() : renderPaymentForm()}
          </div>
        </div>
      )}
    </>
  );
}
