
// const fs = require('fs');

// const sampleImages = [
//   "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
//   "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
//   "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
//   "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
//   "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
// ];
// const sampleVideos = [
//   "https://www.youtube.com/embed/dQw4w9WgXcQ",
//   "https://www.youtube.com/embed/9bZkp7q19f0",
// ];

// const cities = [
//   "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
//   "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "Austin, TX",
//   "San Jose, CA", "Fort Worth, TX", "Jacksonville, FL", "Columbus, OH", "Charlotte, NC",
//   "Indianapolis, IN", "San Francisco, CA", "Seattle, WA", "Denver, CO", "Boston, MA",
//   "Nashville, TN", "Oklahoma City, OK", "Portland, OR", "Las Vegas, NV", "Detroit, MI",
//   "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI", "Albuquerque, NM",
//   "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Kansas City, MO", "Atlanta, GA",
//   "Miami, FL", "Raleigh, NC", "Omaha, NE", "Colorado Springs, CO", "Virginia Beach, VA"
// ];

// const servicesList = [
//   "Leak Repair", "Drain Cleaning", "Water Heater", "Pipe Repair", "Sewer Line",
//   "Emergency Service", "Faucet Installation", "Toilet Repair", "Garbage Disposal",
//   "Hydro Jetting", "Video Inspection", "Slab Leak", "Repiping", "Sump Pump",
//   "Water Softener", "Gas Line Repair", "Bathroom Remodel", "Radiant Heating"
// ];

// const specializationsList = [
//   "Residential", "Commercial", "Emergency", "Water Heaters", "Drain Cleaning",
//   "Sewer", "Pipe Repair", "Remodeling", "Green Plumbing", "Tankless Heaters"
// ];

// const certificationsList = [
//   "EPA", "OSHA", "LEED", "GreenPlumber", "Backflow Certified", "Gas Fitter",
//   "Pipe Welding", "Medical Gas", "Solar Thermal"
// ];

// const paymentMethodsList = ["Cash", "Check", "Credit Card", "Financing", "Venmo", "PayPal"];
// const languagesList = ["English", "Spanish", "Mandarin", "Tagalog", "Vietnamese", "Russian"];

// function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
// function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
// function randomFloat(min, max, decimals = 1) { return parseFloat((Math.random() * (max - min) + min).toFixed(decimals)); }
// function randomSubset(arr, min, max) {
//   const size = randomInt(min, max);
//   const shuffled = [...arr];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled.slice(0, size);
// }

// const companies = [];
// for (let i = 1; i <= 100; i++) {
//   const location = randomItem(cities);
//   const cityName = location.split(',')[0];
//   const companyName = `${randomItem(["A","The","","Premier","Elite","Express","Reliable","Professional"])} ${cityName} ${randomItem(["Plumbing","Pipe Works","Drain Masters","Plumb Pros","Rooter","Hydro","Flow Solutions"])}`.trim();
//   const ownerName = `${randomItem(["Mike","Sarah","David","Lisa","James","Maria","Robert","Jennifer","William","Patricia"])} ${randomItem(["Johnson","Chen","Rodriguez","Smith","Williams","Brown","Jones","Garcia","Miller","Davis"])}`;
//   const rating = randomFloat(3.5, 5.0, 1);
//   const reviewCount = randomInt(20, 500);
//   const logo = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${randomInt(1, 99)}.jpg`;
//   const services = randomSubset(servicesList, 4, 8);
//   const priceRange = randomItem(["$", "$$", "$$$", "$89 call", "$99 diag", "$120/hr", "Flat rate $150"]);
//   const averageCost = randomInt(150, 800);
//   const availability = randomItem(["24/7 Emergency", "Weekends only", "Business hours", "Evenings available", "Same-day"]);
//   const isVerified = Math.random() > 0.2;
//   const isEmergency = Math.random() > 0.6;
//   const yearsInBusiness = randomInt(1, 35);
//   const established = new Date().getFullYear() - yearsInBusiness;
//   const licenseNumber = `PL-${randomInt(10000, 99999)}`;
//   const insurance = `$${randomInt(1, 5)}M liability`;
//   const certifications = randomSubset(certificationsList, 0, 3);
//   const serviceAreas = randomSubset(cities.filter(c => c !== location), 3, 8);
//   const specializations = randomSubset(specializationsList, 2, 5);
//   const responseTime = randomItem(["< 30 min", "< 1 hour", "< 2 hours", "< 4 hours", "Next day"]);
//   const teamSize = randomInt(2, 50);
//   const warranty = randomItem(["90 days", "1 year", "2 years", "Lifetime on parts", "No warranty"]);
//   const paymentMethods = randomSubset(paymentMethodsList, 2, 4);
//   const languages = randomSubset(languagesList, 1, 3);
//   const socialLinks = {
//     facebook: `https://facebook.com/${companyName.replace(/\s/g, '')}`,
//     twitter: `https://twitter.com/${companyName.replace(/\s/g, '')}`,
//     instagram: `https://instagram.com/${companyName.replace(/\s/g, '')}`,
//   };
//   const description = `${companyName} has been serving ${location} for over ${yearsInBusiness} years. We specialize in ${specializations.slice(0, 2).join(' and ')}. ${isVerified ? 'Fully licensed and insured.' : ''} ${isEmergency ? 'Available 24/7 for emergencies.' : ''}`;

//   companies.push({
//     id: i.toString(),
//     companyName,
//     ownerName,
//     rating,
//     reviewCount,
//     logo,
//     services,
//     priceRange,
//     averageCost,
//     availability,
//     isVerified,
//     isEmergency,
//     location,
//     phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
//     email: `contact@${companyName.replace(/\s/g, '').toLowerCase()}.com`,
//     website: `https://${companyName.replace(/\s/g, '').toLowerCase()}.com`,
//     description,
//     yearsInBusiness,
//     established,
//     licenseNumber,
//     insurance,
//     certifications,
//     serviceAreas,
//     specializations,
//     responseTime,
//     teamSize,
//     socialLinks,
//     warranty,
//     paymentMethods,
//     languages,
//   });
// }

// const output = `import { Plumber } from "@/components/find/types";\n\nexport const plumbers: Plumber[] = ${JSON.stringify(companies, null, 2)};`;
// fs.writeFileSync('data/plumbers.ts', output);
// console.log('Generated 100 plumbers in data/plumbers.ts');



















import fs from "node:fs";

// City list (40+ major US cities)
const cities = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "Austin, TX",
  "San Jose, CA", "Fort Worth, TX", "Jacksonville, FL", "Columbus, OH", "Charlotte, NC",
  "Indianapolis, IN", "San Francisco, CA", "Seattle, WA", "Denver, CO", "Boston, MA",
  "Nashville, TN", "Oklahoma City, OK", "Portland, OR", "Las Vegas, NV", "Detroit, MI",
  "Memphis, TN", "Louisville, KY", "Baltimore, MD", "Milwaukee, WI", "Albuquerque, NM",
  "Tucson, AZ", "Fresno, CA", "Sacramento, CA", "Kansas City, MO", "Atlanta, GA",
  "Miami, FL", "Raleigh, NC", "Omaha, NE", "Colorado Springs, CO", "Virginia Beach, VA"
];

// Service lists
const servicesList = [
  "Leak Repair", "Drain Cleaning", "Water Heater", "Pipe Repair", "Sewer Line",
  "Emergency Service", "Faucet Installation", "Toilet Repair", "Garbage Disposal",
  "Hydro Jetting", "Video Inspection", "Slab Leak", "Repiping", "Sump Pump",
  "Water Softener", "Gas Line Repair", "Bathroom Remodel", "Radiant Heating"
];

const specializationsList = [
  "Residential", "Commercial", "Emergency", "Water Heaters", "Drain Cleaning",
  "Sewer", "Pipe Repair", "Remodeling", "Green Plumbing", "Tankless Heaters"
];

const certificationsList = [
  "EPA", "OSHA", "LEED", "GreenPlumber", "Backflow Certified", "Gas Fitter",
  "Pipe Welding", "Medical Gas", "Solar Thermal"
];

const paymentMethodsList = ["Cash", "Check", "Credit Card", "Financing", "Venmo", "PayPal"];
const languagesList = ["English", "Spanish", "Mandarin", "Tagalog", "Vietnamese", "Russian"];

// Sample images for galleries (Unsplash)
const sampleImages = [
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
  "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800",
  "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
  "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"
];

// Sample videos (YouTube embeds)
const sampleVideos = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/9bZkp7q19f0",
  "https://www.youtube.com/embed/tgbNymZ7vqY"
];

// Discount & promo options
const discountOptions = [
  "10% off first service", "20% off first service", "$50 off any repair",
  "Free estimate", "10% off emergency calls", "15% off water heater installation",
  "Buy 1 get 1 50% off", "No dispatch fee"
];
const promoOptions = ["SAVE10", "SAVE20", "PLUMB50", "FREEEST", "EMERG10", "HEATER15", "BOGO50", "NODISPATCH"];

// Branch names and address templates
const branchNames = ["Downtown", "Northside", "Southside", "Eastside", "Westside", "Airport", "Midtown", "Suburb"];
const addressTemplates = [
  "{num} {street} St, {city}, {state} {zip}",
  "{num} {street} Ave, {city}, {state} {zip}",
  "{num} {street} Blvd, {city}, {state} {zip}"
];
const streets = ["Main", "Oak", "Maple", "Cedar", "Pine", "Elm", "Washington", "Lincoln", "Broadway"];

// Project images
const projectImages = [
  "/Plumber working under a modern sink.png",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
  "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800"
];

// Key highlights options
const highlightOptions = [
  "Same-day service guarantee", "Licensed & bonded", "Free estimates",
  "Eco-friendly solutions", "24/7 emergency response", "Family-owned",
  "A+ BBB rating", "100% satisfaction guarantee", "Transparent pricing",
  "Certified master plumbers", "Senior & military discount"
];

// Helper functions
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFloat(min, max, decimals = 1) { return parseFloat((Math.random() * (max - min) + min).toFixed(decimals)); }
function randomSubset(arr, min, max) {
  const size = randomInt(min, max);
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, size);
}
function randomBool(probability = 0.5) { return Math.random() < probability; }

// Generate random address
function randomAddress(city) {
  const zip = randomInt(10000, 99999);
  const street = randomItem(streets);
  const num = randomInt(100, 9999);
  const template = randomItem(addressTemplates);
  return template.replace('{num}', num).replace('{street}', street).replace('{city}', city.split(',')[0]).replace('{state}', state).replace('{zip}', zip);
}

// Generate random project
function randomProject() {
  const titles = ["Complete Repiping", "Water Heater Installation", "Bathroom Renovation", "Sewer Line Replacement", "Emergency Flood Repair", "Drain Cleaning & Hydro Jetting", "Gas Line Installation"];
  const clients = ["Local Residence", "Commercial Building", "Apartment Complex", "Restaurant", "Hotel", "School", "Hospital"];
  return {
    title: randomItem(titles),
    client: randomItem(clients),
    description: `Successfully completed ${randomItem(titles).toLowerCase()} for ${randomItem(clients)}. Project involved ${randomInt(5, 50)} hours of work and ${randomInt(2, 10)} technicians.`,
    image: randomItem(projectImages),
    year: randomInt(2018, 2025)
  };
}

// Generate random branch
function randomBranch(city) {
  const lat = parseFloat((40 + Math.random() * 5).toFixed(4));
  const lng = parseFloat((-74 + Math.random() * 5).toFixed(4));
  return {
    name: `${randomItem(branchNames)} Office`,
    lat: lat,
    lng: lng,
    address: randomAddress(city)
  };
}

const companies = [];
for (let i = 1; i <= 100; i++) {
  const location = randomItem(cities);
  const cityName = location.split(',')[0];
  const companyName = `${randomItem(["A","The","","Premier","Elite","Express","Reliable","Professional"])} ${cityName} ${randomItem(["Plumbing","Pipe Works","Drain Masters","Plumb Pros","Rooter","Hydro","Flow Solutions"])}`.trim();
  const ownerName = `${randomItem(["Mike","Sarah","David","Lisa","James","Maria","Robert","Jennifer","William","Patricia"])} ${randomItem(["Johnson","Chen","Rodriguez","Smith","Williams","Brown","Jones","Garcia","Miller","Davis"])}`;
  const rating = randomFloat(3.5, 5.0, 1);
  const reviewCount = randomInt(20, 500);
  const logo = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${randomInt(1, 99)}.jpg`;
  const services = randomSubset(servicesList, 4, 8);
  const priceRange = randomItem(["$", "$$", "$$$", "$89 call", "$99 diag", "$120/hr", "Flat rate $150"]);
  const averageCost = randomInt(150, 800);
  const availability = randomItem(["24/7 Emergency", "Weekends only", "Business hours", "Evenings available", "Same-day"]);
  const isVerified = Math.random() > 0.2;
  const isEmergency = Math.random() > 0.6;
  const yearsInBusiness = randomInt(1, 35);
  const established = new Date().getFullYear() - yearsInBusiness;
  const licenseNumber = `PL-${randomInt(10000, 99999)}`;
  const insurance = `$${randomInt(1, 5)}M liability`;
  const certifications = randomSubset(certificationsList, 0, 3);
  const serviceAreas = randomSubset(cities.filter(c => c !== location), 3, 8);
  const specializations = randomSubset(specializationsList, 2, 5);
  const responseTime = randomItem(["< 30 min", "< 1 hour", "< 2 hours", "< 4 hours", "Next day"]);
  const teamSize = randomInt(2, 50);
  const warranty = randomItem(["90 days", "1 year", "2 years", "Lifetime on parts", "No warranty"]);
  const paymentMethods = randomSubset(paymentMethodsList, 2, 4);
  const languages = randomSubset(languagesList, 1, 3);
  const socialLinks = {
    facebook: `https://facebook.com/${companyName.replace(/\s/g, '')}`,
    twitter: `https://twitter.com/${companyName.replace(/\s/g, '')}`,
    instagram: `https://instagram.com/${companyName.replace(/\s/g, '')}`,
  };
  const description = `${companyName} has been serving ${location} for over ${yearsInBusiness} years. We specialize in ${specializations.slice(0, 2).join(' and ')}. ${isVerified ? 'Fully licensed and insured.' : ''} ${isEmergency ? 'Available 24/7 for emergencies.' : ''}`;

  // Media
  const media = {
    images: randomSubset(sampleImages, 1, 4),
    videos: randomSubset(sampleVideos, 0, 2),
  };

  // Discount & promo (50% chance)
  const hasDiscount = randomBool(0.5);
  const discount = hasDiscount ? randomItem(discountOptions) : undefined;
  const promoCode = hasDiscount ? randomItem(promoOptions) : undefined;

  // Branches (0-2 branches)
  const numBranches = randomInt(0, 2);
  const branches = numBranches > 0 ? Array.from({ length: numBranches }, () => randomBranch(location)) : undefined;

  // Projects (0-3 projects)
  const numProjects = randomInt(0, 3);
  const projects = numProjects > 0 ? Array.from({ length: numProjects }, () => randomProject(companyName)) : undefined;

  // Key highlights (2-5 highlights)
  const keyHighlights = randomSubset(highlightOptions, 2, 5);

  companies.push({
    id: i.toString(),
    companyName,
    ownerName,
    rating,
    reviewCount,
    logo,
    services,
    priceRange,
    averageCost,
    availability,
    isVerified,
    isEmergency,
    location,
    phone: `(${randomInt(200, 999)}) ${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
    email: `contact@${companyName.replace(/\s/g, '').toLowerCase()}.com`,
    website: `https://${companyName.replace(/\s/g, '').toLowerCase()}.com`,
    description,
    yearsInBusiness,
    established,
    licenseNumber,
    insurance,
    certifications,
    serviceAreas,
    specializations,
    responseTime,
    teamSize,
    socialLinks,
    warranty,
    paymentMethods,
    languages,
    media,
    discount,
    promoCode,
    branches,
    projects,
    keyHighlights,
  });
}

const output = `import { Plumber } from "@/components/find/types";\n\nexport const plumbers: Plumber[] = ${JSON.stringify(companies, null, 2)};`;
fs.writeFileSync('data/plumbers.ts', output);
console.log('Generated 100 plumbers with full data (discounts, branches, projects, highlights) in data/plumbers.ts');
