const faqs = [
  {
    q: "How does ScamShield AI detect scams?",
    a: "Six autonomous agents analyze NLP patterns, URLs, behavioral signals, and built-in AI reasoning — no API key required.",
  },
  {
    q: "Is my data stored?",
    a: "Scans can be saved to your account. We use encryption in transit and follow security best practices.",
  },
  {
    q: "Do I need ChatGPT or an API key?",
    a: "No. ScamShield includes a built-in AI engine for scans and chat. OpenAI is optional for extra enhancement.",
  },
];

export function FAQSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="mb-8 text-center text-3xl font-bold">FAQ</h2>
      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="glass rounded-xl p-6">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
