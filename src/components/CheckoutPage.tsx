import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Truck, 
  Tag, 
  AlertCircle,
  Printer,
  Banknote,
  Phone,
  MapPin,
  User,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Order } from '../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToShop, onOrderSuccess }) => {
  const { items, subtotal, clearCart } = useCart();

  // Customer Checkout Details State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [email, setEmail] = useState('');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'nextday'>('standard');

  // Coupon Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Order Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculations
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const shippingCost = React.useMemo(() => {
    if (shippingMethod === 'standard') {
      return discountedSubtotal >= 75 ? 0 : 15;
    }
    if (shippingMethod === 'express') return 25;
    if (shippingMethod === 'nextday') return 45;
    return 0;
  }, [shippingMethod, discountedSubtotal]);

  const tax = discountedSubtotal * 0.08;
  const grandTotal = discountedSubtotal + shippingCost + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'AURA10') {
      setAppliedCoupon({ code: 'AURA10', discountPercent: 10 });
      setCouponCode('');
    } else if (code === 'LUXE20') {
      setAppliedCoupon({ code: 'LUXE20', discountPercent: 20 });
      setCouponCode('');
    } else {
      setCouponError('Invalid promotion code. Try AURA10 or LUXE20');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (items.length === 0) {
      setOrderError('Your shopping bag is empty.');
      return;
    }

    // Validate Required Customer Checkout Details
    if (!fullName.trim()) {
      setOrderError('Please enter your Full Name.');
      return;
    }
    if (!mobileNumber.trim()) {
      setOrderError('Please enter your Mobile Number for delivery coordination.');
      return;
    }
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setOrderError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim()) {
      setOrderError('Please enter your Delivery Street Address.');
      return;
    }
    if (!city.trim()) {
      setOrderError('Please enter your City.');
      return;
    }
    if (!state.trim()) {
      setOrderError('Please enter your State.');
      return;
    }
    if (!pinCode.trim()) {
      setOrderError('Please enter your Postal PIN Code.');
      return;
    }
    if (pinCode.trim().length < 4) {
      setOrderError('Please enter a valid PIN Code.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullStreet = apartment.trim() ? `${address.trim()}, ${apartment.trim()}` : address.trim();
      const customerEmail = email.trim() || `${cleanDigits}@auraparfums.com`;

      const orderPayload = {
        customerName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        phone: mobileNumber.trim(),
        address: fullStreet,
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        email: customerEmail,
        shippingAddress: {
          address1: fullStreet,
          city: city.trim(),
          state: state.trim(),
          postalCode: pinCode.trim(),
          country: 'India'
        },
        customer: {
          firstName: fullName.trim().split(' ')[0] || fullName.trim(),
          lastName: fullName.trim().split(' ').slice(1).join(' ') || '',
          email: customerEmail,
          phone: mobileNumber.trim(),
          address: {
            street: fullStreet,
            city: city.trim(),
            state: state.trim(),
            zip: pinCode.trim(),
            country: 'India'
          }
        },
        items: items.map(i => ({
          productId: i.productId,
          productName: i.productName,
          variationId: i.variationId,
          variationName: i.variationName,
          variationColor: i.variationColor,
          selectedSize: i.selectedSize,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        subtotal: discountedSubtotal,
        discount: discountAmount,
        shipping: shippingCost,
        shippingMethod: shippingMethod === 'standard' 
          ? 'Standard Fragrance Courier (Cash on Delivery)' 
          : shippingMethod === 'express' 
          ? 'Express White-Glove Courier (Cash on Delivery)' 
          : 'Next-Day Air Direct (Cash on Delivery)',
        tax,
        total: grandTotal,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      const returnedOrder = data.order || data;

      if (res.ok && (returnedOrder?.id || returnedOrder?.orderNumber)) {
        setCompletedOrder(returnedOrder);
        clearCart();
        onOrderSuccess(returnedOrder);
      } else {
        setOrderError(data.error || 'Failed to place order.');
      }
    } catch (err) {
      setOrderError('A network error occurred while booking your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed, show luxury order confirmation page
  if (completedOrder) {
    const custName = completedOrder.customerName || completedOrder.customer?.firstName || 'Valued Client';
    const custMobile = completedOrder.mobileNumber || completedOrder.phone || completedOrder.customer?.phone || '';
    const streetAddr = completedOrder.address || completedOrder.shippingAddress?.address1 || completedOrder.customer?.address?.street || '';
    const cityAddr = completedOrder.city || completedOrder.shippingAddress?.city || completedOrder.customer?.address?.city || '';
    const stateAddr = completedOrder.state || completedOrder.shippingAddress?.state || completedOrder.customer?.address?.state || '';
    const pinAddr = completedOrder.pinCode || completedOrder.shippingAddress?.postalCode || completedOrder.customer?.address?.zip || '';
    const confEmail = completedOrder.email || completedOrder.customer?.email || '';

    return (
      <div id="aura-order-confirmation-screen" className="w-full bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-[#E5DDD0] p-8 sm:p-12 shadow-xl text-center space-y-6">
            
            <div className="w-16 h-16 bg-[#F4EFE6] rounded-full flex items-center justify-center mx-auto text-[#141312]">
              <CheckCircle2 className="w-8 h-8 text-[#141312] stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#8C8476] font-semibold">
                Haute Parfumerie Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#141312] font-normal">
                Thank you, {custName}.
              </h1>
              <p className="text-xs sm:text-sm text-[#615A4F] font-light max-w-md mx-auto">
                Your bespoke fragrance order has been placed with <strong>Cash on Delivery</strong>. Our atelier is hand-packing your flacons with utmost care.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#FAF7F2] border border-[#ECE4D8] p-5 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#8C8476] block text-[10px] uppercase tracking-wider font-semibold">Order Number</span>
                <span className="font-semibold text-[#141312] font-mono text-sm">{completedOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-[#8C8476] block text-[10px] uppercase tracking-wider font-semibold">Order Date</span>
                <span className="text-[#141312] font-medium">{new Date(completedOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[#8C8476] block text-[10px] uppercase tracking-wider font-semibold">Payment Option</span>
                <span className="text-[#141312] font-medium flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cash on Delivery</span>
                </span>
              </div>
              <div>
                <span className="text-[#8C8476] block text-[10px] uppercase tracking-wider font-semibold">Status</span>
                <span className="text-amber-800 font-semibold uppercase tracking-wider text-[10px] bg-amber-50 px-2 py-0.5 border border-amber-200 inline-block">
                  Pay upon arrival
                </span>
              </div>
            </div>

            {/* Customer & Delivery Coordinates */}
            <div className="text-left text-xs text-[#5E574D] border border-[#ECE4D8] p-5 bg-white space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0EAE1]">
                <MapPin className="w-4 h-4 text-[#141312]" />
                <span className="font-semibold text-[#141312] uppercase tracking-wider text-[11px]">
                  Delivery Address & Contact
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[#8C8476] block text-[10px] uppercase">Customer Name</span>
                  <span className="font-medium text-[#141312]">{custName}</span>
                </div>
                <div>
                  <span className="text-[#8C8476] block text-[10px] uppercase">Mobile Number</span>
                  <span className="font-medium text-[#141312] font-mono">{custMobile}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#8C8476] block text-[10px] uppercase">Address</span>
                  <p className="text-[#141312] font-medium">
                    {streetAddr}
                    {cityAddr ? `, ${cityAddr}` : ''}
                    {stateAddr ? `, ${stateAddr}` : ''}
                    {pinAddr ? ` - PIN: ${pinAddr}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="text-left border border-[#ECE4D8] divide-y divide-[#ECE4D8]">
              <div className="bg-[#F8F5F0] px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-[#141312]">
                Items in this Shipment ({completedOrder.items.length})
              </div>
              {completedOrder.items.map((it, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={it.image} alt={it.productName} className="w-12 h-14 object-contain bg-[#F4EFE6] border border-[#DDD4C5] p-1" />
                    <div>
                      <h4 className="font-serif text-sm text-[#141312] font-semibold">{it.productName}</h4>
                      <p className="text-[11px] text-[#787165]">
                        {it.variationName && <span className="font-medium text-[#141312]">{it.variationName} · </span>}
                        {it.selectedSize} · Qty {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#141312]">
                    ₹{((it.unitPrice || it.price || 0) * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Totals */}
            <div className="bg-[#FAF7F2] p-4 text-xs text-[#524B40] space-y-1.5 text-left border border-[#ECE4D8]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{completedOrder.subtotal.toFixed(2)}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Promotion Savings</span>
                  <span>-₹{completedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery ({completedOrder.shippingMethod || 'Standard Fragrance Courier'})</span>
                <span>{completedOrder.shipping === 0 ? 'Complimentary' : `₹${completedOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{completedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#141312] pt-2 border-t border-[#E5DDD0]">
                <span>Total Amount Payable upon Delivery (COD)</span>
                <span className="text-base text-[#141312]">₹{completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-2 border border-[#DDD4C5] px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#141312] hover:bg-[#F2ECE1] transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Order Receipt</span>
              </button>

              <button
                onClick={onBackToShop}
                className="bg-[#141312] text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2B2824] transition-colors"
              >
                Continue Exploring
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Active Checkout Form
  return (
    <div id="aura-checkout-page" className="w-full bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#EAE3D6]">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-[#4A453D] hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping</span>
          </button>
          <div className="flex items-center space-x-2 text-xs text-[#7A7265] uppercase tracking-wider font-medium">
            <Lock className="w-3.5 h-3.5 text-[#141312]" />
            <span>Secure Cash on Delivery Checkout</span>
          </div>
        </div>

        {orderError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left Column: Customer & Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Customer Details */}
              <div className="bg-white border border-[#ECE4D8] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#141312]" />
                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141312]">
                      1. Customer Details
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#8C8476]">* All fields required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      id="checkout-full-name-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#141312]" />
                      <span>Mobile Number (for Delivery Updates & COD Verification) *</span>
                    </label>
                    <div className="relative">
                      <input
                        id="checkout-mobile-number-input"
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                      />
                    </div>
                    <p className="text-[10px] text-[#8C8476] mt-1">
                      Our dispatch team will coordinate delivery via this mobile number.
                    </p>
                  </div>

                  {/* Email (Optional) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-medium mb-1">
                      Email Address (Optional — for digital invoice)
                    </label>
                    <input
                      id="checkout-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@luxury.com"
                      className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-white border border-[#ECE4D8] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#141312]" />
                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141312]">
                      2. Delivery Address
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#8C8476]">* All fields required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                      Street Address & Building / House No. *
                    </label>
                    <input
                      id="checkout-address-input"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat 402, Royal Palms, MG Road"
                      className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                    />
                  </div>

                  {/* Apartment / Landmark */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-medium mb-1">
                      Apartment, Floor, Landmark (Optional)
                    </label>
                    <input
                      id="checkout-apartment-input"
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Near Oberoi Hotel"
                      className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                      City *
                    </label>
                    <input
                      id="checkout-city-input"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                      State *
                    </label>
                    <input
                      id="checkout-state-input"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312]"
                    />
                  </div>

                  {/* PIN Code */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#70685C] font-semibold mb-1">
                      PIN Code *
                    </label>
                    <input
                      id="checkout-pincode-input"
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="400001"
                      maxLength={10}
                      className="w-full sm:w-1/2 bg-[#FAF8F5] border border-[#DDD4C5] px-3.5 py-2.5 text-xs text-[#141312] focus:outline-none focus:border-[#141312] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Shipping Courier Speed */}
              <div className="bg-white border border-[#ECE4D8] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#141312]" />
                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141312]">
                      3. Delivery Speed
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                    shippingMethod === 'standard' ? 'border-[#141312] bg-[#FCFAF7]' : 'border-[#DDD4C5] hover:border-[#8C8476]'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-[#141312]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#141312]">Standard Fragrance Courier (3–5 Business Days)</p>
                        <p className="text-[11px] text-[#7A7265] font-light">Includes temperature-controlled protective packaging</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#141312]">
                      {discountedSubtotal >= 75 ? 'Complimentary' : '₹15.00'}
                    </span>
                  </label>

                  <label className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                    shippingMethod === 'express' ? 'border-[#141312] bg-[#FCFAF7]' : 'border-[#DDD4C5] hover:border-[#8C8476]'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="accent-[#141312]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#141312]">Express White-Glove (2 Business Days)</p>
                        <p className="text-[11px] text-[#7A7265] font-light">Priority atelier dispatch with door verification</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#141312]">₹25.00</span>
                  </label>

                  <label className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                    shippingMethod === 'nextday' ? 'border-[#141312] bg-[#FCFAF7]' : 'border-[#DDD4C5] hover:border-[#8C8476]'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'nextday'}
                        onChange={() => setShippingMethod('nextday')}
                        className="accent-[#141312]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#141312]">Next-Day Air Direct (Next Morning)</p>
                        <p className="text-[11px] text-[#7A7265] font-light">Dedicated courier air freight</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#141312]">₹45.00</span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment Option - Cash on Delivery (COD Only) */}
              <div className="bg-white border border-[#ECE4D8] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0EAE1]">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#141312]" />
                    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141312]">
                      4. Payment Method
                    </h2>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                    Pay upon Delivery
                  </span>
                </div>

                {/* Cash on Delivery Exclusive Banner */}
                <div className="p-5 bg-[#FAF7F2] border-2 border-[#141312] space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#141312] text-white flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#141312]">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-xs text-[#6B6356]">
                        Pay directly upon delivery of your luxury fragrance.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#524B40] leading-relaxed pt-2 border-t border-[#EAE3D6]">
                    No upfront online payment or credit card is required. You can pay with cash or via UPI/QR code to the delivery executive once your parcel arrives securely at your doorstep.
                  </p>

                  <div className="flex items-center space-x-2 text-[11px] text-[#7A7265] pt-1">
                    <PackageCheck className="w-4 h-4 text-emerald-700" />
                    <span>Inspection before payment supported for tamper-evident sealed box.</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center space-x-2 text-[11px] text-[#7A7265]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>100% Genuine, Sealed Haute Parfumerie Guaranteed.</span>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Placement (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-[#ECE4D8] p-6 shadow-xs space-y-5">
                <h3 className="font-serif text-xl text-[#141312] font-semibold pb-3 border-b border-[#EAE3D6]">
                  Order Summary ({items.reduce((a, b) => a + b.quantity, 0)})
                </h3>

                {/* Items in Checkout */}
                <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1 divide-y divide-[#F2ECE1]">
                  {items.map((it) => (
                    <div key={it.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-16 bg-[#F4EFE6] border border-[#E0D7C9] shrink-0 p-1 flex items-center justify-center">
                          <img src={it.image} alt={it.productName} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#141312]">{it.productName}</h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#70685C]">
                            {it.variationName && (
                              <span className="flex items-center gap-1">
                                {it.variationColor && (
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: it.variationColor }} />
                                )}
                                <span>{it.variationName}</span>
                                <span>·</span>
                              </span>
                            )}
                            <span>{it.selectedSize}</span>
                            <span>·</span>
                            <span>Qty {it.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#141312]">
                        ₹{(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-3 border-t border-[#EAE3D6]">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (e.g. AURA10)"
                      className="flex-1 bg-[#FAF8F5] border border-[#DDD4C5] px-3 py-2 text-xs text-[#141312] uppercase tracking-wider focus:outline-none focus:border-[#141312]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#2B2926] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Code {appliedCoupon.code} applied ({appliedCoupon.discountPercent}% off subtotal)
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium mt-1.5">{couponError}</p>
                  )}
                </div>

                {/* Calculations Breakdown */}
                <div className="space-y-2 pt-4 border-t border-[#EAE3D6] text-xs text-[#544D42]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#141312]">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Promotional Privilege ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Courier</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-700">Complimentary</strong> : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#141312] pt-3 border-t border-[#EAE3D6]">
                    <span>Total Payable (COD)</span>
                    <span className="text-lg text-[#141312]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="checkout-submit-order-btn"
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-4 bg-[#141312] text-white hover:bg-[#2B2824] text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Placing Order...</span>
                  ) : (
                    <span>Confirm Order (Cash on Delivery) — ₹{grandTotal.toFixed(2)}</span>
                  )}
                </button>

                <p className="text-[10px] text-center text-[#8C8476] font-light">
                  By clicking Confirm Order, your parcel will be scheduled for dispatch with Cash on Delivery payment.
                </p>

              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
