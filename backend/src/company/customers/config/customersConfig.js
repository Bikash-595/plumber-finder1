// Everyone who has booked the company. Phone and email are only shown for customers whose booking the company
// accepted (the same rule as on bookings) — a request alone doesn't share contact details.
export const customersConfig = { pageSize: 25, sorts: ["recent", "bookings", "spent", "name"] };
