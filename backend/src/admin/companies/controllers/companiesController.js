import { Company } from "../../../auth/company/models/Company.js";
import { CompanyListing } from "../../../company/listing/models/CompanyListing.js";
import { paginatedList, searchFilter } from "../../shared/listQuery.js";
import { companiesConfig } from "../config/companiesConfig.js";

/** GET /api/admin/companies?status=&search=&page= — includes each company's public listing (if any). */
export async function listCompanies(req, res, next) {
  try {
    const status = companiesConfig.statuses.includes(req.query.status) ? { status: req.query.status } : {};
    const result = await paginatedList(Company, { ...status, ...searchFilter(req.query.search, companiesConfig.searchFields) }, req.query, { select: companiesConfig.fields });
    const listings = await CompanyListing.find({ company: { $in: result.data.map((company) => company._id) } }).select("company slug isPublished city state services").lean();
    const byCompany = Object.fromEntries(listings.map((listing) => [String(listing.company), listing]));
    res.json({ ...result, data: result.data.map((company) => ({ ...company, listing: byCompany[String(company._id)] ?? null })) });
  } catch (error) { next(error); }
}

/** PATCH /api/admin/companies/:id/status { status } — suspended companies are hidden from the public site. */
export async function setCompanyStatus(req, res, next) {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, { $set: { status: req.validated.status } }, { new: true, runValidators: true }).select(companiesConfig.fields);
    if (!company) return res.status(404).json({ message: "Company not found." });
    await CompanyListing.updateOne({ company: company._id }, { $set: { isPublished: company.status !== "suspended" } });
    res.json({ message: `Company ${company.status}.`, data: company });
  } catch (error) { next(error); }
}
