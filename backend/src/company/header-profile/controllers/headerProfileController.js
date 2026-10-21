import { headerProfileConfig } from "../config/headerProfileConfig.js";
import { CompanyHeaderProfile } from "../models/CompanyHeaderProfile.js";
import { CompanyListing } from "../../models/CompanyListing.js";

function pickHeaderProfileFields(body) {
  return Object.fromEntries(headerProfileConfig.publicFields.map((field) => [field, body[field]]));
}

export async function getHeaderProfile(req, res, next) {
  try {
    const profile = await CompanyHeaderProfile.findOne({ company: req.auth.sub });
    res.json({ data: profile });
  } catch (error) { next(error); }
}

export async function saveHeaderProfile(req, res, next) {
  try {
    const values = pickHeaderProfileFields(req.body);
    if (typeof values.companyName !== "string" || !values.companyName.trim()) return res.status(400).json({ message: "Company name is required." });
    const hasYears = values.yearsInBusiness !== undefined && values.yearsInBusiness !== null && values.yearsInBusiness !== "";
    const yearsInBusiness = hasYears ? Number(values.yearsInBusiness) : undefined;
    if (hasYears && !Number.isFinite(yearsInBusiness)) return res.status(400).json({ message: "Years in business must be a number." });
    const profile = await CompanyHeaderProfile.findOneAndUpdate(
      { company: req.auth.sub },
      { company: req.auth.sub, ...values, yearsInBusiness },
      { new: true, upsert: true, runValidators: true }
    );
    await CompanyListing.findOneAndUpdate(
      { company: req.auth.sub },
      { $set: { companyName: profile.companyName, logo: profile.logo, coverImage: profile.coverImage } },
      { new: true }
    );
    res.status(200).json({ message: "Header profile saved.", data: profile });
  } catch (error) { next(error); }
}
