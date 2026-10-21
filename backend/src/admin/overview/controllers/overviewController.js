import { Company } from "../../../auth/company/models/Company.js";
import { Freelancer } from "../../../auth/freelancer/models/Freelancer.js";
import { User } from "../../../auth/user/models/User.js";
import { CompanyListing } from "../../../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../../../freelancer/listing/models/FreelancerListing.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { UserInvoice } from "../../../user/invoices/models/UserInvoice.js";
import { overviewConfig } from "../config/overviewConfig.js";

const byKey = (rows) => Object.fromEntries(rows.map(({ _id, count }) => [_id, count]));

/** GET /api/admin/overview — platform-wide counts for the admin dashboard. */
export async function getOverview(_req, res, next) {
  try {
    const since = new Date(Date.now() - overviewConfig.recentDays * 24 * 60 * 60 * 1000);
    const [users, companies, freelancers, newUsers, newCompanies, newFreelancers, companyStatus, freelancerStatus, bookingStatus, invoiceTotals, publishedCompanies, publishedFreelancers] = await Promise.all([
      User.countDocuments(), Company.countDocuments(), Freelancer.countDocuments(),
      User.countDocuments({ createdAt: { $gte: since } }), Company.countDocuments({ createdAt: { $gte: since } }), Freelancer.countDocuments({ createdAt: { $gte: since } }),
      Company.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Freelancer.aggregate([{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }]),
      UserBooking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      UserInvoice.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$total" } } }]),
      CompanyListing.countDocuments({ isPublished: true }), FreelancerListing.countDocuments({ isPublished: true }),
    ]);
    const invoices = Object.fromEntries(invoiceTotals.map(({ _id, count, total }) => [_id, { count, total: Math.round(total * 100) / 100 }]));
    const companiesByStatus = byKey(companyStatus);
    const freelancersByStatus = byKey(freelancerStatus);
    res.json({
      data: {
        totals: { users, companies, freelancers, publishedCompanies, publishedFreelancers },
        newThisWeek: { users: newUsers, companies: newCompanies, freelancers: newFreelancers },
        pendingApprovals: { companies: companiesByStatus.pending ?? 0, freelancers: freelancersByStatus.pending ?? 0 },
        companiesByStatus, freelancersByStatus,
        bookingsByStatus: byKey(bookingStatus),
        invoices,
      },
    });
  } catch (error) { next(error); }
}
