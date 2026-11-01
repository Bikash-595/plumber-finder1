// Leads = booking requests, by stage: new (waiting for a reply), won (accepted), lost (declined, or cancelled
// before it was accepted). Interest signals (calls, emails, website visits, saves, compares) are counted
// anonymously — who clicked is never shown to the company.
export const leadsConfig = { stages: ["new", "won", "lost"], signalDays: 30, signalEvents: ["call_click", "email_click", "website_click", "save", "compare_add", "share"] };
