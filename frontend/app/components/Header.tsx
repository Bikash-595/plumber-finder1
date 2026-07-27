// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
// // import { useRouter } from "next/navigation";
// // import { FaBell, FaCaretDown, FaEllipsisH, FaHeart, FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
// // import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
// // import { StatesDropdown } from "../components/dropdowns/StatesDropdown";
// // import { allStateAbbrs, getStateName } from "../components/utils/location";
// // import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
// // import { getInitials, readStoredUser, type AppUser } from "../components/utils/auth";

// // const navLinks = [
// //   { label: "Home", href: "/" },
// //   { label: "Find Plumber", href: "/find" },
// //   { label: "About Us", href: "/about" },
// //   { label: "FAQ", href: "/faq" },
// //   { label: "Blogs", href: "/blogs" },
// //   { label: "Contact", href: "/contact" },
// // ];

// // const usStates = allStateAbbrs.map(getStateName);

// // const headerActions = [
// //   { label: "Saved deals", href: "/saved", icon: FaHeart, count: 2 },
// //   { label: "Alerts", href: "/faq", icon: FaBell, count: 3 },
// //   { label: "Cart", href: "/checkout", icon: FaShoppingCart, count: 1 },
// // ];

// export function Header() {
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [searchLocation, setSearchLocation] = useState("Chicago");
// //   const [searchOpen, setSearchOpen] = useState(false);
// //   const [user, setUser] = useState<AppUser | null>(() => readStoredUser());
// //   const router = useRouter();
// //   const searchWrapRef = useRef<HTMLDivElement>(null);

// //   const handleSearch = useCallback(
// //     (e?: FormEvent | null, term?: string, location?: string) => {
// //       if (e) e.preventDefault();
// //       const nextTerm = (term ?? searchQuery).trim();
// //       const nextLocation = (location ?? searchLocation).trim();
// //       const params = new URLSearchParams();
// //       if (nextTerm) params.set("search", nextTerm);
// //       if (nextLocation) params.set("location", nextLocation);
// //       router.push(params.toString() ? `/find?${params.toString()}` : "/find");
// //       setMenuOpen(false);
// //       setSearchOpen(false);
// //       if (nextLocation) {
// //         window.localStorage.setItem("plumberfinder_location", nextLocation);
// //       }
// //     },
// //     [searchLocation, searchQuery, router]
// //   );

// //   useEffect(() => {
// //     const onClickOutside = (event: MouseEvent) => {
// //       if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
// //         setSearchOpen(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", onClickOutside);
// //     return () => document.removeEventListener("mousedown", onClickOutside);
// //   }, []);

// //   useEffect(() => {
// //     const syncUser = () => setUser(readStoredUser());
// //     window.addEventListener("storage", syncUser);
// //     window.addEventListener("focus", syncUser);

// //     return () => {
// //       window.removeEventListener("storage", syncUser);
// //       window.removeEventListener("focus", syncUser);
// //     };
// //   }, []);

//   return (
//     <header className="fixed inset-x-0 top-0 z-50 bg-white text-gray-800 backdrop-blur shadow-lg">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="flex h-16 items-center gap-4">
// //           <div className="flex flex-shrink-0 items-center">
// //             <Link href="/" className="flex items-center gap-2 text-[#FFD60A]">
// //               <div className="relative h-14 w-14">
// //                 <Image
// //                   src="/Plumber%20(1).png"
// //                   alt="Plumber Finder icon"
// //                   fill
// //                   sizes="56px"
// //                   className="object-contain"
// //                   priority
// //                 />
// //               </div>
// //               <div className="leading-none text-gray-800">
// //                 <div className="text-xl font-extrabold">Plumber Finder</div>
// //               </div>
// //             </Link>
// //           </div>

// //           <div ref={searchWrapRef} className="relative hidden flex-1 justify-center lg:flex">
// //             <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-md">
// //               <input
// //                 type="text"
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 onFocus={() => setSearchOpen(true)}
// //                 onClick={() => setSearchOpen(true)}
// //                 placeholder="Search plumbers, services, location..."
// //                 className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
// //               />
// //               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
// //               <button
// //                 type="submit"
// //                 className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
// //               >
// //                 Search
// //               </button>
// //             </form>
// //             <SearchSuggestionsPanel
// //               open={searchOpen}
// //               onClose={() => setSearchOpen(false)}
// //               query={searchQuery}
// //               onQueryChange={setSearchQuery}
// //               location={searchLocation}
// //               onLocationChange={setSearchLocation}
// //               onSearch={(term, location) => handleSearch(null, term, location)}
// //             />
// //           </div>

// //           <div className="hidden items-center gap-2 lg:flex">
// //             <Link
// //               href="/add-business"
// //               className="rounded-full border border-emerald-700 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
// //             >
// //               Get Pro Leads
// //             </Link>

// //             <div className="ml-2 flex items-center gap-1">
// //               {headerActions.map((action) => {
// //                 const Icon = action.icon;
// //                 return (
// //                   <Link
// //                     key={action.label}
// //                     href={action.href}
// //                     aria-label={action.label}
// //                     className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
// //                     title={action.label}
// //                   >
// //                     <Icon className="text-[15px]" />
// //                     {action.count > 0 && (
// //                       <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
// //                         {action.count}
// //                       </span>
// //                     )}
// //                   </Link>
// //                 );
// //               })}
// //             </div>

// //             {user ? (
// //               <button
// //                 type="button"
// //                 className="ml-1 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
// //                 aria-label="Profile menu"
// //                 title={user.name}
// //               >
// //                 {user.avatarUrl ? (
// //                   <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
// //                     <Image src={user.avatarUrl} alt={user.name} fill sizes="32px" className="object-cover" />
// //                   </span>
// //                 ) : (
// //                   <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
// //                     {getInitials(user.name)}
// //                   </span>
// //                 )}
// //                 <span className="hidden xl:inline">{user.name}</span>
// //                 <FaCaretDown className="text-[11px] text-slate-500" />
// //               </button>
// //             ) : (
// //               <Link
// //                 href="/login"
// //                 className="ml-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
// //                 title="Login"
// //               >
// //                 <FaUserCircle className="text-base text-slate-500" />
// //                 <span className="hidden xl:inline">Login</span>
// //               </Link>
// //             )}

// //             <Link
// //               href={user ? "/account" : "/signup"}
// //               className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
// //               title={user ? "Account" : "Sign up"}
// //             >
// //               <FaEllipsisH className="text-[15px]" />
// //             </Link>
// //           </div>

//           <button
//             type="button"
//             className="inline-flex items-center justify-center rounded-full border border-gray-800/20 p-2 text-gray-800 hover:bg-gray-800/5 lg:hidden"
//             aria-label="Toggle menu"
//             aria-expanded={menuOpen}
//             onClick={() => setMenuOpen((open) => !open)}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
//               {menuOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
//             </svg>
//           </button>
// //         </div>

// //         <div className="hidden h-12 items-center justify-start gap-8 border-t border-gray-200 text-sm font-semibold text-gray-800 lg:flex">
// //           {navLinks.map((link) => (
// //             <Link key={link.href} href={link.href} className="transition-colors hover:text-[#FFD60A]">
// //               {link.label}
// //             </Link>
// //           ))}
// //           <ServicesDropdown />
// //           <StatesDropdown />
// //         </div>
// //       </div>

// //       {menuOpen && (
// //         <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
// //           <nav className="flex flex-col gap-3 text-sm font-medium text-gray-800">
// //             <form onSubmit={handleSearch} className="relative mb-2">
// //               <input
// //                 type="text"
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 placeholder="Search plumbers, services..."
// //                 className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
// //               />
// //               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
// //               <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
// //                 Search
// //               </button>
// //             </form>

// //             {navLinks.map((link) => (
// //               <Link key={link.href} href={link.href} className="rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                 {link.label}
// //               </Link>
// //             ))}
// //             <div className="pl-4 border-l-2 border-gray-200 mt-1">
// //               <div className="text-xs font-semibold text-gray-500 mb-1">Services</div>
// //               <div className="grid grid-cols-1 gap-1">
// //                 <Link href="/find" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                   Find Plumber Companies
// //                 </Link>
// //                 <Link href="/post-requirement" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                   Post a Requirement
// //                 </Link>
// //                 <Link href="/quotes" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                   Get Quotes
// //                 </Link>
// //                 <Link href="/book-appointment" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                   Book Appointment
// //                 </Link>
// //                 <Link href="/compare" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                   Compare Companies
// //                 </Link>
// //                 <Link href="/register-business" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
// //                   Register Your Business
// //                 </Link>
// //               </div>
// //             </div>
// //             <div className="pl-4 border-l-2 border-gray-200 mt-1">
// //               <div className="text-xs font-semibold text-gray-500 mb-1">States</div>
// //               <div className="grid grid-cols-2 gap-1 mt-1">
// //                 {usStates.map((state) => (
// //                   <Link key={state} href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`} className="rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setMenuOpen(false)}>
// //                     {state}
// //                   </Link>
// //                 ))}
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-3 pt-2">
// //               <Link href="/add-business" className="flex-1 rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110" onClick={() => setMenuOpen(false)}>
// //                 Get Pro Leads
// //               </Link>
// //               {user ? (
// //                 <button type="button" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10">
// //                   {getInitials(user.name)} {user.name.split(" ")[0]}
// //                 </button>
// //               ) : (
// //                 <Link href="/login" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10" onClick={() => setMenuOpen(false)}>
// //                   Login
// //                 </Link>
// //               )}
// //               <Link href="/signup" className="flex-1 rounded-full border border-emerald-700 px-4 py-2 text-center text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50" onClick={() => setMenuOpen(false)}>
// //                 Sign Up
// //               </Link>
// //             </div>
// //           </nav>
// //         </div>
// //       )}
// //     </header>
//   );
// }





















// // components/Header.tsx (updated)
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaBell,
//   FaCaretDown,
//   FaEllipsisH,
//   FaHeart,
//   FaSearch,
//   FaShoppingCart,
//   FaUserCircle,
//   FaUser,
//   FaSignOutAlt,
//   FaBoxOpen,
// } from "react-icons/fa";
// import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
// import { StatesDropdown } from "../components/dropdowns/StatesDropdown";
// import { allStateAbbrs, getStateName } from "../components/utils/location";
// import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
// import { getInitials, readStoredUser, clearStoredUser, type AppUser } from "../components/utils/auth";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Find Plumber", href: "/find" },
//   { label: "About Us", href: "/about" },
//   { label: "FAQ", href: "/faq" },
//   { label: "Blogs", href: "/blogs" },
//   { label: "Contact", href: "/contact" },
// ];

// const usStates = allStateAbbrs.map(getStateName);

// const headerActions = [
//   { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
//   { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
//   { label: "Cart", href: "/checkout", icon: FaShoppingCart, countKey: "cartCount" },
// ];

// export function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchLocation, setSearchLocation] = useState("Chicago");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [user, setUser] = useState<AppUser | null>(() => readStoredUser());
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const router = useRouter();
//   const searchWrapRef = useRef<HTMLDivElement>(null);
//   const userDropdownRef = useRef<HTMLDivElement>(null);

//   // Mock counts (replace with real data from context/API)
//   const [counts, setCounts] = useState({ savedCount: 2, notifCount: 3, cartCount: 1 });

//   const handleSearch = useCallback(
//     (e?: FormEvent | null, term?: string, location?: string) => {
//       if (e) e.preventDefault();
//       const nextTerm = (term ?? searchQuery).trim();
//       const nextLocation = (location ?? searchLocation).trim();
//       const params = new URLSearchParams();
//       if (nextTerm) params.set("search", nextTerm);
//       if (nextLocation) params.set("location", nextLocation);
//       router.push(params.toString() ? `/find?${params.toString()}` : "/find");
//       setMenuOpen(false);
//       setSearchOpen(false);
//       if (nextLocation) {
//         window.localStorage.setItem("plumberfinder_location", nextLocation);
//       }
//     },
//     [searchLocation, searchQuery, router]
//   );

//   const handleLogout = () => {
//     clearStoredUser();
//     setUser(null);
//     router.push("/");
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
//         setSearchOpen(false);
//       }
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
//         setUserDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const syncUser = () => setUser(readStoredUser());
//     window.addEventListener("storage", syncUser);
//     window.addEventListener("focus", syncUser);
//     return () => {
//       window.removeEventListener("storage", syncUser);
//       window.removeEventListener("focus", syncUser);
//     };
//   }, []);

//   return (
//     <header className="fixed inset-x-0 top-0 z-50 bg-white text-gray-800 backdrop-blur shadow-lg">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center gap-4">
//           {/* Logo */}
//           <div className="flex flex-shrink-0 items-center">
//             <Link href="/" className="flex items-center gap-2 text-[#FFD60A]">
//               <div className="relative h-14 w-14">
//                 <Image
//                   src="/Plumber%20(1).png"
//                   alt="Plumber Finder icon"
//                   fill
//                   sizes="56px"
//                   className="object-contain"
//                   priority
//                 />
//               </div>
//               <div className="leading-none text-gray-800">
//                 <div className="text-xl font-extrabold">Plumber Finder</div>
//               </div>
//             </Link>
//           </div>

//           {/* Search (desktop) */}
//           <div ref={searchWrapRef} className="relative hidden flex-1 justify-center lg:flex">
//             <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-md">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setSearchOpen(true)}
//                 onClick={() => setSearchOpen(true)}
//                 placeholder="Search plumbers, services, location..."
//                 className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
//               />
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//               <button
//                 type="submit"
//                 className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
//               >
//                 Search
//               </button>
//             </form>
//             <SearchSuggestionsPanel
//               open={searchOpen}
//               onClose={() => setSearchOpen(false)}
//               query={searchQuery}
//               onQueryChange={setSearchQuery}
//               location={searchLocation}
//               onLocationChange={setSearchLocation}
//               onSearch={handleSearch}
//             />
//           </div>

//           {/* Desktop Actions */}
//           <div className="hidden items-center gap-2 lg:flex">
//             <Link
//               href="/add-business"
//               className="rounded-full border border-emerald-700 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
//             >
//               Get Pro Leads
//             </Link>

//             <div className="ml-2 flex items-center gap-1">
//               {headerActions.map((action) => {
//                 const Icon = action.icon;
//                 const count = counts[action.countKey as keyof typeof counts] || 0;
//                 return (
//                   <Link
//                     key={action.label}
//                     href={action.href}
//                     aria-label={action.label}
//                     className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
//                     title={action.label}
//                   >
//                     <Icon className="text-[15px]" />
//                     {count > 0 && (
//                       <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
//                         {count}
//                       </span>
//                     )}
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* User Menu */}
//             {user ? (
//               <div className="relative" ref={userDropdownRef}>
//                 <button
//                   type="button"
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                   className="ml-1 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
//                   aria-label="Profile menu"
//                 >
//                   {user.avatarUrl ? (
//                     <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
//                       <Image src={user.avatarUrl} alt={user.name} fill sizes="32px" className="object-cover" />
//                     </span>
//                   ) : (
//                     <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
//                       {getInitials(user.name)}
//                     </span>
//                   )}
//                   <span className="hidden xl:inline">{user.name}</span>
//                   <FaCaretDown className="text-[11px] text-slate-500" />
//                 </button>

//                 {userDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
//                     <div className="p-2">
//                       <Link
//                         href="/account"
//                         className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
//                         onClick={() => setUserDropdownOpen(false)}
//                       >
//                         <FaUser className="h-4 w-4" />
//                         My Profile
//                       </Link>
//                       <Link
//                         href="/saved"
//                         className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
//                         onClick={() => setUserDropdownOpen(false)}
//                       >
//                         <FaHeart className="h-4 w-4" />
//                         Saved Deals
//                       </Link>
//                       <Link
//                         href="/notifications"
//                         className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
//                         onClick={() => setUserDropdownOpen(false)}
//                       >
//                         <FaBell className="h-4 w-4" />
//                         Notifications
//                       </Link>
//                       <Link
//                         href="/checkout"
//                         className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
//                         onClick={() => setUserDropdownOpen(false)}
//                       >
//                         <FaShoppingCart className="h-4 w-4" />
//                         Cart
//                       </Link>
//                       <hr className="my-1 border-gray-100" />
//                       <button
//                         onClick={() => {
//                           setUserDropdownOpen(false);
//                           handleLogout();
//                         }}
//                         className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
//                       >
//                         <FaSignOutAlt className="h-4 w-4" />
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="ml-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
//                 title="Login"
//               >
//                 <FaUserCircle className="text-base text-slate-500" />
//                 <span className="hidden xl:inline">Login</span>
//               </Link>
//             )}

//             <Link
//               href={user ? "/account" : "/signup"}
//               className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
//               title={user ? "Account" : "Sign up"}
//             >
//               <FaEllipsisH className="text-[15px]" />
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             className="inline-flex items-center justify-center rounded-full border border-gray-800/20 p-2 text-gray-800 hover:bg-gray-800/5 lg:hidden"
//             aria-label="Toggle menu"
//             aria-expanded={menuOpen}
//             onClick={() => setMenuOpen((open) => !open)}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
//               {menuOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
//             </svg>
//           </button>
//         </div>

//         {/* Desktop bottom nav */}
//         <div className="hidden h-12 items-center justify-start gap-8 border-t border-gray-200 text-sm font-semibold text-gray-800 lg:flex">
//           {navLinks.map((link) => (
//             <Link key={link.href} href={link.href} className="transition-colors hover:text-[#FFD60A]">
//               {link.label}
//             </Link>
//           ))}
//           <ServicesDropdown />
//           <StatesDropdown />
//         </div>
//       </div>

//       {/* Mobile menu (unchanged, but already contains search, services, states, login/signup) */}
//       {menuOpen && (
//         <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
//           <nav className="flex flex-col gap-3 text-sm font-medium text-gray-800">
//             <form onSubmit={handleSearch} className="relative mb-2">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search plumbers, services..."
//                 className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
//               />
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//               <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
//                 Search
//               </button>
//             </form>

//             {navLinks.map((link) => (
//               <Link key={link.href} href={link.href} className="rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                 {link.label}
//               </Link>
//             ))}
//             <div className="pl-4 border-l-2 border-gray-200 mt-1">
//               <div className="text-xs font-semibold text-gray-500 mb-1">Services</div>
//               <div className="grid grid-cols-1 gap-1">
//                 <Link href="/find" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                   Find Plumber Companies
//                 </Link>
//                 <Link href="/post-requirement" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                   Post a Requirement
//                 </Link>
//                 <Link href="/quotes" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                   Get Quotes
//                 </Link>
//                 <Link href="/book-appointment" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                   Book Appointment
//                 </Link>
//                 <Link href="/compare" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                   Compare Companies
//                 </Link>
//                 <Link href="/register-business" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
//                   Register Your Business
//                 </Link>
//               </div>
//             </div>
//             <div className="pl-4 border-l-2 border-gray-200 mt-1">
//               <div className="text-xs font-semibold text-gray-500 mb-1">States</div>
//               <div className="grid grid-cols-2 gap-1 mt-1">
//                 {usStates.map((state) => (
//                   <Link key={state} href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`} className="rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setMenuOpen(false)}>
//                     {state}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div className="flex items-center gap-3 pt-2">
//               <Link href="/add-business" className="flex-1 rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110" onClick={() => setMenuOpen(false)}>
//                 Get Pro Leads
//               </Link>
//               {user ? (
//                 <button type="button" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10">
//                   {getInitials(user.name)} {user.name.split(" ")[0]}
//                 </button>
//               ) : (
//                 <Link href="/login" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10" onClick={() => setMenuOpen(false)}>
//                   Login
//                 </Link>
//               )}
//               <Link href="/signup" className="flex-1 rounded-full border border-emerald-700 px-4 py-2 text-center text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50" onClick={() => setMenuOpen(false)}>
//                 Sign Up
//               </Link>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }








// components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FaBell,
  FaCaretDown,
  FaEllipsisH,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
import { StatesDropdown } from "../components/dropdowns/StatesDropdown";
import { allStateAbbrs, getStateName } from "../components/utils/location";
import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
import { getInitials, readStoredUser, clearStoredUser, type AppUser } from "../components/utils/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Plumber", href: "/find" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const usStates = allStateAbbrs.map(getStateName);

const headerActions = [
  { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
  { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
  { label: "Cart", href: "/checkout", icon: FaShoppingCart, countKey: "cartCount" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("Chicago");
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Mock counts (replace with real data)
  const [counts, setCounts] = useState({ savedCount: 2, notifCount: 3, cartCount: 1 });

  // Main search handler – accepts event (optional) + term + location
  const handleSearch = useCallback(
    (e?: FormEvent | null, term?: string, location?: string) => {
      if (e) e.preventDefault();
      const nextTerm = (term ?? searchQuery).trim();
      const nextLocation = (location ?? searchLocation).trim();
      const params = new URLSearchParams();
      if (nextTerm) params.set("search", nextTerm);
      if (nextLocation) params.set("location", nextLocation);
      router.push(params.toString() ? `/find?${params.toString()}` : "/find");
      setMenuOpen(false);
      setSearchOpen(false);
      if (nextLocation) {
        window.localStorage.setItem("plumberfinder_location", nextLocation);
      }
    },
    [searchLocation, searchQuery, router]
  );

  // ✅ Wrapper for SearchSuggestionsPanel (no event, just term + location)
  const handlePanelSearch = useCallback(
    (term: string, location: string) => {
      handleSearch(null, term, location);
    },
    [handleSearch]
  );

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    router.push("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white text-gray-800 backdrop-blur shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2 text-[#FFD60A]">
              <div className="relative h-14 w-14">
                <Image
                  src="/Plumber%20(1).png"
                  alt="Plumber Finder icon"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="leading-none text-gray-800">
                <div className="text-xl font-extrabold">Plumber Finder</div>
              </div>
            </Link>
          </div>

          {/* Search (desktop) */}
          <div ref={searchWrapRef} className="relative hidden flex-1 justify-center lg:flex">
            <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onClick={() => setSearchOpen(true)}
                placeholder="Search plumbers, services, location..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
              >
                Search
              </button>
            </form>
            <SearchSuggestionsPanel
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              location={searchLocation}
              onLocationChange={setSearchLocation}
              onSearch={handlePanelSearch}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/add-business"
              className="rounded-full border border-emerald-700 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
            >
              Get Pro Leads
            </Link>

            <div className="ml-2 flex items-center gap-1">
              {headerActions.map((action) => {
                const Icon = action.icon;
                const count = counts[action.countKey as keyof typeof counts] || 0;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    aria-label={action.label}
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    title={action.label}
                  >
                    <Icon className="text-[15px]" />
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="ml-1 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
                  aria-label="Profile menu"
                >
                  {user.avatarUrl ? (
                    <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                      <Image src={user.avatarUrl} alt={user.name} fill sizes="32px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                      {getInitials(user.name)}
                    </span>
                  )}
                  <span className="hidden xl:inline">{user.name}</span>
                  <FaCaretDown className="text-[11px] text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaUser className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/saved"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaHeart className="h-4 w-4" />
                        Saved Deals
                      </Link>
                      <Link
                        href="/notifications"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaBell className="h-4 w-4" />
                        Notifications
                      </Link>
                      <Link
                        href="/checkout"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaShoppingCart className="h-4 w-4" />
                        Cart
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                title="Login"
              >
                <FaUserCircle className="text-base text-slate-500" />
                <span className="hidden xl:inline">Login</span>
              </Link>
            )}

            <Link
              href={user ? "/account" : "/signup"}
              className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              title={user ? "Account" : "Sign up"}
            >
              <FaEllipsisH className="text-[15px]" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-800/20 p-2 text-gray-800 hover:bg-gray-800/5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
              {menuOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>

        {/* Desktop bottom nav */}
        <div className="hidden h-12 items-center justify-start gap-8 border-t border-gray-200 text-sm font-semibold text-gray-800 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[#FFD60A]">
              {link.label}
            </Link>
          ))}
          <ServicesDropdown />
          <StatesDropdown />
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-800">
            <form onSubmit={handleSearch} className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plumbers, services..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                Search
              </button>
            </form>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pl-4 border-l-2 border-gray-200 mt-1">
              <div className="text-xs font-semibold text-gray-500 mb-1">Services</div>
              <div className="grid grid-cols-1 gap-1">
                <Link href="/find" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Find Plumber Companies
                </Link>
                <Link href="/post-requirement" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Post a Requirement
                </Link>
                <Link href="/quotes" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Get Quotes
                </Link>
                <Link href="/book-appointment" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Book Appointment
                </Link>
                <Link href="/compare" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Compare Companies
                </Link>
                <Link href="/register-business" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Register Your Business
                </Link>
              </div>
            </div>
            <div className="pl-4 border-l-2 border-gray-200 mt-1">
              <div className="text-xs font-semibold text-gray-500 mb-1">States</div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {usStates.map((state) => (
                  <Link key={state} href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`} className="rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setMenuOpen(false)}>
                    {state}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link href="/add-business" className="flex-1 rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110" onClick={() => setMenuOpen(false)}>
                Get Pro Leads
              </Link>
              {user ? (
                <button type="button" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10">
                  {getInitials(user.name)} {user.name.split(" ")[0]}
                </button>
              ) : (
                <Link href="/login" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              )}
              <Link href="/signup" className="flex-1 rounded-full border border-emerald-700 px-4 py-2 text-center text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}




































// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaBell,
//   FaCaretDown,
//   FaEllipsisH,
//   FaHeart,
//   FaSearch,
//   FaShoppingCart,
//   FaUserCircle,
//   FaUser,
//   FaSignOutAlt,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
// import { StatesDropdown } from "../components/dropdowns/StatesDropdown";
// import { allStateAbbrs, getStateName } from "../components/utils/location";
// import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
// import { getInitials, readStoredUser, clearStoredUser, type AppUser } from "../components/utils/auth";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Find Plumber", href: "/find" },
//   { label: "About Us", href: "/about" },
//   { label: "FAQ", href: "/faq" },
//   { label: "Blogs", href: "/blogs" },
//   { label: "Contact", href: "/contact" },
// ];

// const usStates = allStateAbbrs.map(getStateName);

// const headerActions = [
//   { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
//   { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
//   { label: "Cart", href: "/checkout", icon: FaShoppingCart, countKey: "cartCount" },
// ];

// export function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchLocation, setSearchLocation] = useState("Chicago");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [user, setUser] = useState<AppUser | null>(() => readStoredUser());
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const router = useRouter();
//   const searchWrapRef = useRef<HTMLDivElement>(null);
//   const userDropdownRef = useRef<HTMLDivElement>(null);
//   const mobileMenuRef = useRef<HTMLDivElement>(null);

//   const [counts, setCounts] = useState({ savedCount: 2, notifCount: 3, cartCount: 1 });

//   const handleSearch = useCallback(
//     (e?: FormEvent | null, term?: string, location?: string) => {
//       if (e) e.preventDefault();
//       const nextTerm = (term ?? searchQuery).trim();
//       const nextLocation = (location ?? searchLocation).trim();
//       const params = new URLSearchParams();
//       if (nextTerm) params.set("search", nextTerm);
//       if (nextLocation) params.set("location", nextLocation);
//       router.push(params.toString() ? `/find?${params.toString()}` : "/find");
//       setMenuOpen(false);
//       setSearchOpen(false);
//       if (nextLocation) {
//         window.localStorage.setItem("plumberfinder_location", nextLocation);
//       }
//     },
//     [searchLocation, searchQuery, router]
//   );

//   const handlePanelSearch = useCallback(
//     (term: string, location: string) => {
//       handleSearch(null, term, location);
//     },
//     [handleSearch]
//   );

//   const handleLogout = () => {
//     clearStoredUser();
//     setUser(null);
//     router.push("/");
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
//         setSearchOpen(false);
//       }
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
//         setUserDropdownOpen(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   useEffect(() => {
//     const syncUser = () => setUser(readStoredUser());
//     window.addEventListener("storage", syncUser);
//     window.addEventListener("focus", syncUser);
//     return () => {
//       window.removeEventListener("storage", syncUser);
//       window.removeEventListener("focus", syncUser);
//     };
//   }, []);

//   return (
//     <>
//       <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           {/* Top bar – logo + actions (mobile) / full layout desktop */}
//           <div className="flex h-16 items-center justify-between gap-4">
//             {/* Logo */}
//             <div className="flex flex-shrink-0 items-center">
//               <Link href="/" className="flex items-center gap-2">
//                 <div className="relative h-10 w-10 sm:h-12 sm:w-12">
//                   <Image
//                     src="/Plumber%20(1).png"
//                     alt="Plumber Finder icon"
//                     fill
//                     sizes="48px"
//                     className="object-contain"
//                     priority
//                   />
//                 </div>
//                 <span className="text-base sm:text-lg font-extrabold text-gray-800">Plumber<span className="text-[#FFD60A]">Finder</span></span>
//               </Link>
//             </div>

//             {/* Desktop Search – centered (only on lg) */}
//             <div ref={searchWrapRef} className="hidden lg:flex flex-1 justify-center px-8">
//               <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-lg">
//                 <div className="relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onFocus={() => setSearchOpen(true)}
//                     placeholder="Search plumbers, services..."
//                     className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-20 text-sm text-gray-800 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
//                   />
//                   <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//                     <FaMapMarkerAlt className="text-gray-400 text-xs" />
//                     <select
//                       value={searchLocation}
//                       onChange={(e) => setSearchLocation(e.target.value)}
//                       className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none"
//                     >
//                       {["Chicago", "New York", "Los Angeles", "Houston", "Phoenix"].map((loc) => (
//                         <option key={loc}>{loc}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm transition hover:brightness-105"
//                 >
//                   Search
//                 </button>
//               </form>
//             </div>

//             {/* Desktop Actions */}
//             <div className="hidden lg:flex items-center gap-3">
//               <Link
//                 href="/add-business"
//                 className="rounded-full border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
//               >
//                 Get Pro Leads
//               </Link>

//               <div className="flex items-center gap-1">
//                 {headerActions.map((action) => {
//                   const Icon = action.icon;
//                   const count = counts[action.countKey as keyof typeof counts] || 0;
//                   return (
//                     <Link
//                       key={action.label}
//                       href={action.href}
//                       aria-label={action.label}
//                       className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
//                     >
//                       <Icon className="h-4 w-4" />
//                       {count > 0 && (
//                         <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
//                           {count}
//                         </span>
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>

//               {/* User Menu */}
//               {user ? (
//                 <div className="relative" ref={userDropdownRef}>
//                   <button
//                     onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                     className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
//                   >
//                     {/* {user.avatarUrl ? (
//                       <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
//                     ) : (
//                       <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs text-white">
//                         {getInitials(user.name)}
//                       </span>
//                     )} */}


//                     {user.avatarUrl ? (
//                        <Image src={user.avatarUrl} alt="User avatar" width={24} height={24} className="rounded-full    object-cover" />) : (
//                        <span className="flex h-6 w-6 items-center justify-centerrounded-full bg-gray-800 text-xs text-white">
//                       {getInitials(user.name)}
//                       </span>)}
                    

                    
//                     <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
//                     <FaCaretDown className="text-xs" />
//                   </button>
//                   {userDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg">
//                       <div className="p-1">
//                         <Link
//                           href="/account"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaUser className="h-4 w-4" /> Profile
//                         </Link>
//                         <Link
//                           href="/saved"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaHeart className="h-4 w-4" /> Saved
//                         </Link>
//                         <Link
//                           href="/notifications"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaBell className="h-4 w-4" /> Alerts
//                         </Link>
//                         <Link
//                           href="/checkout"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaShoppingCart className="h-4 w-4" /> Cart
//                         </Link>
//                         <hr className="my-1" />
//                         <button
//                           onClick={() => {
//                             setUserDropdownOpen(false);
//                             handleLogout();
//                           }}
//                           className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           <FaSignOutAlt className="h-4 w-4" /> Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Link
//                     href="/login"
//                     className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-semibold text-gray-900 transition hover:brightness-105"
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//               <Link
//                 href={user ? "/account" : "/signup"}
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
//               >
//                 <FaEllipsisH className="h-4 w-4" />
//               </Link>
//             </div>

//             {/* Mobile menu button & icon row */}
//             <div className="flex items-center gap-2 lg:hidden">
//               {/* Mobile search icon – opens overlay or toggles search? We'll just keep simple for now */}
//               <button
//                 onClick={() => setSearchOpen((prev) => !prev)}
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
//               >
//                 <FaSearch className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => setMenuOpen(true)}
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Desktop bottom nav */}
//           <div className="hidden lg:flex h-12 items-center gap-8 border-t border-gray-100 text-sm font-medium text-gray-700">
//             {navLinks.map((link) => (
//               <Link key={link.href} href={link.href} className="transition hover:text-[#FFD60A]">
//                 {link.label}
//               </Link>
//             ))}
//             <ServicesDropdown />
//             <StatesDropdown />
//           </div>
//         </div>

//         {/* Mobile Search Overlay (simple popup) */}
//         {searchOpen && (
//           <div className="lg:hidden fixed inset-x-0 top-16 z-50 bg-white p-4 shadow-lg border-b border-gray-200">
//             <form onSubmit={handleSearch} className="flex gap-2">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search plumbers..."
//                 className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 className="rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-semibold text-gray-900"
//               >
//                 Go
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSearchOpen(false)}
//                 className="rounded-full border border-gray-300 px-3 py-2 text-gray-600"
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         )}
//       </header>

//       {/* Mobile Slide-Out Menu */}
//       <div
//         className={`fixed inset-0 z-50 transition-transform duration-300 ${
//           menuOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:hidden`}
//       >
//         <div className="relative h-full w-80 max-w-[80%] bg-white shadow-xl">
//           <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
//             <span className="text-lg font-bold text-gray-800">Menu</span>
//             <button onClick={() => setMenuOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <nav className="flex flex-col p-4 space-y-3">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <div className="pt-2">
//               <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-500">Services</p>
//               <div className="space-y-1">
//                 <Link href="/find" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Find Plumber Companies</Link>
//                 <Link href="/post-requirement" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Post a Requirement</Link>
//                 <Link href="/quotes" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Get Quotes</Link>
//                 <Link href="/book-appointment" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Book Appointment</Link>
//                 <Link href="/compare" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Compare Companies</Link>
//                 <Link href="/register-business" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Register Your Business</Link>
//               </div>
//             </div>
//             <div className="pt-2">
//               <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-500">States</p>
//               <div className="grid grid-cols-2 gap-1">
//                 {usStates.map((state) => (
//                   <Link
//                     key={state}
//                     href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`}
//                     className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     {state}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div className="pt-4 border-t border-gray-100">
//               <Link
//                 href="/add-business"
//                 className="mb-2 block rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Get Pro Leads
//               </Link>
//               {user ? (
//                 <>
//                   <div className="mb-2 rounded-lg bg-gray-50 p-3">
//                     <p className="font-medium text-gray-800">{user.name}</p>
//                     <p className="text-xs text-gray-500">{user.email}</p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMenuOpen(false);
//                     }}
//                     className="w-full rounded-lg border border-red-200 px-4 py-2 text-center text-sm font-medium text-red-600"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <div className="flex gap-2">
//                   <Link
//                     href="/login"
//                     className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="flex-1 rounded-full bg-[#FFD60A] px-4 py-2 text-center text-sm font-semibold text-gray-900"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>
//         {/* Overlay background */}
//         <div className="absolute inset-0 -z-10 bg-black/50" onClick={() => setMenuOpen(false)} />
//       </div>
//     </>
//   );
// }












// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import {
//   FaBell,
//   FaCaretDown,
//   FaEllipsisH,
//   FaHeart,
//   FaSearch,
//   FaShoppingCart,
//   FaUser,
//   FaSignOutAlt,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
// import { StatesDropdown } from "../components/dropdowns/StatesDropdown";
// import { allStateAbbrs, getStateName } from "../components/utils/location";
// import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
// import { getInitials, readStoredUser, clearStoredUser, type AppUser } from "../components/utils/auth";

// const navLinks = [
//   { label: "Home", href: "/" },
//   { label: "Find Plumber", href: "/find" },
//   { label: "About Us", href: "/about" },
//   { label: "FAQ", href: "/faq" },
//   { label: "Blogs", href: "/blogs" },
//   { label: "Contact", href: "/contact" },
// ];

// const usStates = allStateAbbrs.map(getStateName);

// const headerActions = [
//   { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
//   { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
//   { label: "Cart", href: "/checkout", icon: FaShoppingCart, countKey: "cartCount" },
// ];

// export function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchLocation, setSearchLocation] = useState("Chicago");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [user, setUser] = useState<AppUser | null>(() => readStoredUser());
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const router = useRouter();
//   const searchWrapRef = useRef<HTMLDivElement>(null);
//   const userDropdownRef = useRef<HTMLDivElement>(null);
//   const mobileMenuRef = useRef<HTMLDivElement>(null);

//   // Mock counts (replace with real data)
//   const [counts, setCounts] = useState({ savedCount: 2, notifCount: 3, cartCount: 1 });

//   const handleSearch = useCallback(
//     (e?: FormEvent | null, term?: string, location?: string) => {
//       if (e) e.preventDefault();
//       const nextTerm = (term ?? searchQuery).trim();
//       const nextLocation = (location ?? searchLocation).trim();
//       const params = new URLSearchParams();
//       if (nextTerm) params.set("search", nextTerm);
//       if (nextLocation) params.set("location", nextLocation);
//       router.push(params.toString() ? `/find?${params.toString()}` : "/find");
//       setMenuOpen(false);
//       setSearchOpen(false);
//       if (nextLocation) {
//         window.localStorage.setItem("plumberfinder_location", nextLocation);
//       }
//     },
//     [searchLocation, searchQuery, router]
//   );

//   const handlePanelSearch = useCallback(
//     (term: string, location: string) => {
//       handleSearch(null, term, location);
//     },
//     [handleSearch]
//   );

//   const handleLogout = () => {
//     clearStoredUser();
//     setUser(null);
//     router.push("/");
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
//         setSearchOpen(false);
//       }
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
//         setUserDropdownOpen(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && menuOpen) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [menuOpen]);

//   // Sync user from localStorage across tabs
//   useEffect(() => {
//     const syncUser = () => setUser(readStoredUser());
//     window.addEventListener("storage", syncUser);
//     window.addEventListener("focus", syncUser);
//     return () => {
//       window.removeEventListener("storage", syncUser);
//       window.removeEventListener("focus", syncUser);
//     };
//   }, []);

//   return (
//     <>
//       <header className="fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between gap-4">
//             {/* Logo */}
//             <div className="flex flex-shrink-0 items-center">
//               <Link href="/" className="flex items-center gap-2">
//                 <div className="relative h-10 w-10 sm:h-12 sm:w-12">
//                   <Image
//                     src="/Plumber%20(1).png"
//                     alt="Plumber Finder icon"
//                     fill
//                     sizes="48px"
//                     className="object-contain"
//                     priority
//                   />
//                 </div>
//                 <span className="text-base sm:text-lg font-extrabold text-gray-800">Plumber<span className="text-[#FFD60A]">Finder</span></span>
//               </Link>
//             </div>

//             {/* Desktop Search */}
//             <div ref={searchWrapRef} className="hidden lg:flex flex-1 justify-center px-8">
//               <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-lg">
//                 <div className="relative">
//                   <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onFocus={() => setSearchOpen(true)}
//                     placeholder="Search plumbers, services..."
//                     className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-20 text-sm text-gray-800 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
//                   />
//                   <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//                     <FaMapMarkerAlt className="text-gray-400 text-xs" />
//                     <select
//                       value={searchLocation}
//                       onChange={(e) => setSearchLocation(e.target.value)}
//                       className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none"
//                     >
//                       {["Chicago", "New York", "Los Angeles", "Houston", "Phoenix"].map((loc) => (
//                         <option key={loc}>{loc}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm transition hover:brightness-105"
//                 >
//                   Search
//                 </button>
//               </form>
//             </div>

//             {/* Desktop Actions */}
//             <div className="hidden lg:flex items-center gap-3">
//               <Link
//                 href="/add-business"
//                 className="rounded-full border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
//               >
//                 Get Pro Leads
//               </Link>

//               <div className="flex items-center gap-1">
//                 {headerActions.map((action) => {
//                   const Icon = action.icon;
//                   const count = counts[action.countKey as keyof typeof counts] || 0;
//                   return (
//                     <Link
//                       key={action.label}
//                       href={action.href}
//                       aria-label={action.label}
//                       className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
//                     >
//                       <Icon className="h-4 w-4" />
//                       {count > 0 && (
//                         <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
//                           {count}
//                         </span>
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>

//               {/* User Menu */}
//               {user ? (
//                 <div className="relative" ref={userDropdownRef}>
//                   <button
//                     onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                     className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
//                   >
//                     {user.avatarUrl ? (
//                       <Image
//                         src={user.avatarUrl}
//                         alt="User avatar"
//                         width={24}
//                         height={24}
//                         className="rounded-full object-cover"
//                       />
//                     ) : (
//                       <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs text-white">
//                         {getInitials(user.name)}
//                       </span>
//                     )}
//                     <span className="hidden xl:inline">{user.name.split(" ")[0]}</span>
//                     <FaCaretDown className="text-xs" />
//                   </button>
//                   {userDropdownOpen && (
//                     <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg">
//                       <div className="p-1">
//                         <Link
//                           href="/account"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaUser className="h-4 w-4" /> Profile
//                         </Link>
//                         <Link
//                           href="/saved"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaHeart className="h-4 w-4" /> Saved
//                         </Link>
//                         <Link
//                           href="/notifications"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaBell className="h-4 w-4" /> Alerts
//                         </Link>
//                         <Link
//                           href="/checkout"
//                           className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           onClick={() => setUserDropdownOpen(false)}
//                         >
//                           <FaShoppingCart className="h-4 w-4" /> Cart
//                         </Link>
//                         <hr className="my-1" />
//                         <button
//                           onClick={() => {
//                             setUserDropdownOpen(false);
//                             handleLogout();
//                           }}
//                           className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           <FaSignOutAlt className="h-4 w-4" /> Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Link
//                     href="/login"
//                     className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-semibold text-gray-900 transition hover:brightness-105"
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//               <Link
//                 href={user ? "/account" : "/signup"}
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
//               >
//                 <FaEllipsisH className="h-4 w-4" />
//               </Link>
//             </div>

//             {/* Mobile controls */}
//             <div className="flex items-center gap-2 lg:hidden">
//               <button
//                 onClick={() => setSearchOpen(!searchOpen)}
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
//               >
//                 <FaSearch className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => setMenuOpen(true)}
//                 className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Desktop bottom nav */}
//           <div className="hidden lg:flex h-12 items-center gap-8 border-t border-gray-100 text-sm font-medium text-gray-700">
//             {navLinks.map((link) => (
//               <Link key={link.href} href={link.href} className="transition hover:text-[#FFD60A]">
//                 {link.label}
//               </Link>
//             ))}
//             <ServicesDropdown />
//             <StatesDropdown />
//           </div>
//         </div>

//         {/* Mobile Search Overlay */}
//         {searchOpen && (
//           <div className="lg:hidden fixed inset-x-0 top-16 z-50 bg-white p-4 shadow-lg border-b border-gray-200">
//             <form onSubmit={handleSearch} className="flex gap-2">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search plumbers..."
//                 className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm"
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 className="rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-semibold text-gray-900"
//               >
//                 Go
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSearchOpen(false)}
//                 className="rounded-full border border-gray-300 px-3 py-2 text-gray-600"
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         )}
//       </header>

//       {/* Mobile Menu */}
//       <div
//         className={`fixed inset-0 z-50 transition-transform duration-300 ${
//           menuOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:hidden`}
//       >
//         <div className="relative h-full w-80 max-w-[80%] bg-white shadow-xl">
//           <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
//             <span className="text-lg font-bold text-gray-800">Menu</span>
//             <button onClick={() => setMenuOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <nav className="flex flex-col p-4 space-y-3 overflow-y-auto h-[calc(100%-4rem)]">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <div className="pt-2">
//               <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-500">Services</p>
//               <div className="space-y-1">
//                 <Link href="/find" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Find Plumber Companies</Link>
//                 <Link href="/post-requirement" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Post a Requirement</Link>
//                 <Link href="/quotes" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Get Quotes</Link>
//                 <Link href="/book-appointment" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Book Appointment</Link>
//                 <Link href="/compare" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Compare Companies</Link>
//                 <Link href="/register-business" className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Register Your Business</Link>
//               </div>
//             </div>
//             <div className="pt-2">
//               <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-500">States</p>
//               <div className="grid grid-cols-2 gap-1">
//                 {usStates.map((state) => (
//                   <Link
//                     key={state}
//                     href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`}
//                     className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     {state}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div className="pt-4 border-t border-gray-100">
//               <Link
//                 href="/add-business"
//                 className="mb-2 block rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Get Pro Leads
//               </Link>
//               {user ? (
//                 <>
//                   <div className="mb-2 rounded-lg bg-gray-50 p-3">
//                     <p className="font-medium text-gray-800">{user.name}</p>
//                     <p className="text-xs text-gray-500">{user.email}</p>
//                   </div>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMenuOpen(false);
//                     }}
//                     className="w-full rounded-lg border border-red-200 px-4 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-50"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <div className="flex gap-2">
//                   <Link
//                     href="/login"
//                     className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/signup"
//                     className="flex-1 rounded-full bg-[#FFD60A] px-4 py-2 text-center text-sm font-semibold text-gray-900"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </nav>
//         </div>
//         {/* Overlay */}
//         <div className="absolute inset-0 -z-10 bg-black/50" onClick={() => setMenuOpen(false)} />
//       </div>
//     </>
//   );
// }
