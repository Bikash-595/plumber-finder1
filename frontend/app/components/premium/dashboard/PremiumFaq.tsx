const faqs = [
  ["How quickly does my badge appear?", "As soon as payment is confirmed — card payments within a minute, offline payments when our team confirms them."],
  ["Can I cancel?", "Yes, any time. Your plan stays active until the end of the period you've paid for, then your listing goes back to free. Nothing else changes."],
  ["Does premium change my reviews or rating?", "No. Reviews are never affected by payment — premium only changes your badge and where you appear in the directory."],
  ["Is my card safe?", "Card payments happen on Stripe's secure checkout page. Your card number never reaches Plumber Finder."],
];

/** Common questions about premium. */
export default function PremiumFaq() {
  return (
    <section aria-labelledby="premium-faq-heading" className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 id="premium-faq-heading" className="text-lg font-extrabold text-gray-900">Questions</h2>
      <div className="mt-3 divide-y divide-gray-100">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group py-3">
            <summary className="cursor-pointer list-none text-sm font-bold text-gray-900 [&::-webkit-details-marker]:hidden">{question}</summary>
            <p className="mt-2 text-sm text-gray-600">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
