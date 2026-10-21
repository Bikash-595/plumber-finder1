import { cartConfig } from "../config/cartConfig.js";
import { UserCart } from "../models/UserCart.js";
import { UserCartItem } from "../models/UserCartItem.js";
import { clearCart, loadCart } from "../services/cartSummary.js";

const sendCart = async (res, user, status = 200, message) => res.status(status).json({ ...(message ? { message } : {}), data: await loadCart(user) });

export const cartController = {
  get: async (req, res, next) => {
    try { await sendCart(res, req.auth.sub); } catch (error) { next(error); }
  },

  // Adding the same service from the same plumber again increases its quantity.
  addItem: async (req, res, next) => {
    try {
      const user = req.auth.sub;
      const { providerType, providerId, name } = req.validated;
      const existing = await UserCartItem.findOne({ user, providerType, providerId, name });
      if (existing) {
        existing.quantity = Math.min(cartConfig.maxQuantity, existing.quantity + (req.validated.quantity ?? 1));
        existing.price = req.validated.price;
        await existing.save();
        return sendCart(res, user, 200, "Cart updated.");
      }
      const count = await UserCartItem.countDocuments({ user });
      if (count >= cartConfig.maxItems) return res.status(409).json({ message: `Your cart can hold up to ${cartConfig.maxItems} items.` });
      await UserCartItem.create({ ...req.validated, user, position: count });
      await sendCart(res, user, 201, "Added to cart.");
    } catch (error) { next(error); }
  },

  updateQuantity: async (req, res, next) => {
    try {
      const doc = await UserCartItem.findOneAndUpdate({ _id: req.params.id, user: req.auth.sub }, { $set: { quantity: req.validated.quantity } }, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: "Cart item not found." });
      await sendCart(res, req.auth.sub);
    } catch (error) { next(error); }
  },

  removeItem: async (req, res, next) => {
    try {
      const doc = await UserCartItem.findOneAndDelete({ _id: req.params.id, user: req.auth.sub });
      if (!doc) return res.status(404).json({ message: "Cart item not found." });
      await sendCart(res, req.auth.sub, 200, "Removed from cart.");
    } catch (error) { next(error); }
  },

  clear: async (req, res, next) => {
    try { await clearCart(req.auth.sub); await sendCart(res, req.auth.sub, 200, "Cart cleared."); } catch (error) { next(error); }
  },

  applyPromo: async (req, res, next) => {
    try {
      const code = req.validated.code;
      if (!cartConfig.promoCodes[code]) return res.status(400).json({ message: "That promo code is not valid.", errors: { code: "is not a valid promo code" } });
      await UserCart.findOneAndUpdate({ user: req.auth.sub }, { $set: { promoCode: code } }, { upsert: true });
      await sendCart(res, req.auth.sub, 200, `Promo ${code} applied.`);
    } catch (error) { next(error); }
  },

  removePromo: async (req, res, next) => {
    try { await UserCart.updateOne({ user: req.auth.sub }, { $unset: { promoCode: 1 } }); await sendCart(res, req.auth.sub); } catch (error) { next(error); }
  },
};
