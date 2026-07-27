// app/checkout/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt, FaShoppingCart, FaCcVisa, FaCcMastercard, FaPaypal, FaLock } from "react-icons/fa";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "service" | "product";
}

// Mock cart data – in production, fetch from context or API
const initialCart: CartItem[] = [
  { id: "1", name: "Emergency Plumbing Service", price: 120, quantity: 1, image: "/plumber-placeholder.jpg", type: "service" },
  { id: "2", name: "Water Heater Installation", price: 350, quantity: 1, image: "/plumber-placeholder.jpg", type: "service" },
  { id: "3", name: "Drain Cleaning Kit", price: 45, quantity: 1, image: "/plumber-placeholder.jpg", type: "product" },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(() => initialCart);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  // Cart initialized lazily from `initialCart` to avoid setting state inside an effect

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10" && !promoApplied) {
      setDiscount(10);
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === "WELCOME20" && !promoApplied) {
      setDiscount(20);
      setPromoApplied(true);
    } else {
      alert("Invalid or already applied promo code");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + tax;

  const handleCheckout = () => {
    alert(`Proceeding to payment. Total: $${total.toFixed(2)}`);
    // Redirect to payment page or process order
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">Loading cart...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <FaShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-gray-500">Your cart is empty.</p>
            <Link
              href="/find"
              className="mt-4 inline-block rounded-full bg-[#FFD60A] px-6 py-2 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="rounded-full border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="rounded-full border border-gray-300 px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-2 border-b border-gray-200 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Promo Code</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
                  />
                  <button
                    onClick={applyPromo}
                    className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && <p className="mt-1 text-xs text-green-600">Promo code applied!</p>}
              </div>

              {/* Payment Methods */}
              <div className="mt-6 flex justify-center gap-4 text-gray-400">
                <FaCcVisa className="h-8 w-8" />
                <FaCcMastercard className="h-8 w-8" />
                <FaPaypal className="h-8 w-8" />
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-full bg-[#FFD60A] py-3 font-semibold text-white shadow-md transition hover:brightness-105"
              >
                Proceed to Checkout
              </button>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
                <FaLock className="h-3 w-3" />
                Secure checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}