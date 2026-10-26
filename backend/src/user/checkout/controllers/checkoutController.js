import { UserBooking } from "../../bookings/models/UserBooking.js";
import { clearCart, loadCart } from "../../cart/services/cartSummary.js";
import { invoicesConfig } from "../../invoices/config/invoicesConfig.js";
import { UserInvoice } from "../../invoices/models/UserInvoice.js";
import { newInvoiceNumber } from "../../invoices/services/invoiceNumber.js";
import { notify } from "../../notifications/services/notify.js";
import { announce, newBookingFields } from "../../../shared/bookings/bookingWorkflow.js";

/**
 * POST /api/users/checkout — turns the cart into one booking request per line plus a pending invoice,
 * then empties the cart. No card is charged here; the invoice stays "pending" until payment is taken.
 */
export async function checkout(req, res, next) {
  try {
    const user = req.auth.sub;
    const { items, summary } = await loadCart(user);
    if (!items.length) return res.status(400).json({ message: "Your cart is empty." });

    const { address, phone, scheduledDate, timeSlot, details } = req.validated;
    const fields = await Promise.all(items.map((item) => newBookingFields(user, item.providerType, item.providerId)));
    const bookings = await UserBooking.insertMany(items.map((item, index) => ({
      user, ...fields[index], providerType: item.providerType, providerId: item.providerId, providerName: item.providerName,
      service: item.name, quantity: item.quantity, price: item.price,
      address, phone, scheduledDate, timeSlot, details, source: "checkout", status: "pending",
    })));

    const dueDate = new Date(Date.now() + invoicesConfig.paymentDueDays * 24 * 60 * 60 * 1000);
    let invoice;
    for (let attempt = 0; !invoice; attempt++) {
      try {
        invoice = await UserInvoice.create({
          user, number: newInvoiceNumber(),
          items: items.map(({ name, providerName, quantity, price }) => ({ name, providerName, quantity, price })),
          subtotal: summary.subtotal, promoCode: summary.promoCode ?? undefined, discount: summary.discount, tax: summary.tax, total: summary.total,
          status: "pending", dueDate, bookings: bookings.map((booking) => booking._id),
        });
      } catch (error) {
        if (error?.code !== 11000 || attempt >= 4) throw error; // retry on the (very unlikely) invoice number clash
      }
    }
    await UserBooking.updateMany({ _id: { $in: invoice.bookings } }, { $set: { invoice: invoice._id } });
    await clearCart(user);
    // Each plumber gets its booking request to accept or decline; admins see them all.
    await Promise.all(bookings.map((booking) => announce(booking, "created", "customer", { tellCustomer: false })));
    await notify(user, { type: "order", title: "Order placed", message: `Invoice ${invoice.number} for $${invoice.total.toFixed(2)} was created. Your booking requests were sent.`, link: "/dashboard/invoices" });

    res.status(201).json({ message: "Order placed.", data: { invoice, bookings } });
  } catch (error) { next(error); }
}
