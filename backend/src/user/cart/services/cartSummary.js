import { cartConfig } from "../config/cartConfig.js";
import { UserCart } from "../models/UserCart.js";
import { UserCartItem } from "../models/UserCartItem.js";

const money = (value) => Math.round(value * 100) / 100;

/** Items plus server-calculated totals for a customer's cart. */
export async function loadCart(user) {
  const [items, cart] = await Promise.all([
    UserCartItem.find({ user }).sort({ position: 1, createdAt: 1 }),
    UserCart.findOne({ user }).lean(),
  ]);
  const promoCode = cart?.promoCode && cartConfig.promoCodes[cart.promoCode] ? cart.promoCode : null;
  const discountPercent = promoCode ? cartConfig.promoCodes[promoCode] : 0;
  const subtotal = money(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const discount = money((subtotal * discountPercent) / 100);
  const tax = money((subtotal - discount) * cartConfig.taxRate);
  return {
    items,
    summary: {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal, promoCode, discountPercent, discount, taxRate: cartConfig.taxRate, tax,
      total: money(subtotal - discount + tax),
    },
  };
}

export async function clearCart(user) {
  await Promise.all([UserCartItem.deleteMany({ user }), UserCart.deleteOne({ user })]);
}
