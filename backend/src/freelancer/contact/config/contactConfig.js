// How customers reach the freelancer. The main phone is copied to the public listing.
import { contactConfig as companyContact } from "../../../company/contact/config/contactConfig.js";

const { primaryPhone, secondaryPhone, whatsapp, emergencyHotline, email, website } = companyContact.fields;
export const contactConfig = { label: "Contact information", fields: { primaryPhone, secondaryPhone, whatsapp, emergencyHotline, email, website } };
