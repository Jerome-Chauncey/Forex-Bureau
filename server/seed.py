
from decimal import Decimal
from server.config import create_app, db
from server.models import CurrencyPair, FAQ

app = create_app()

PAIRS = [
    # Majors
    ("USD", "KES", Decimal("108.50"), Decimal("110.00")),
    ("EUR", "KES", Decimal("120.00"), Decimal("121.50")),
    ("GBP", "KES", Decimal("135.00"), Decimal("137.00")),
    ("JPY", "KES", Decimal("0.75"),   Decimal("0.78")),
    ("AUD", "KES", Decimal("78.50"),  Decimal("80.00")),
    ("CAD", "KES", Decimal("82.00"),  Decimal("83.50")),
    ("CHF", "KES", Decimal("117.50"), Decimal("119.00")),
    ("CNY", "KES", Decimal("15.75"),  Decimal("16.25")),

    # Minors & exotics
    ("SGD", "KES", Decimal("80.00"),  Decimal("81.50")),   # Singapore Dollar
    ("NZD", "KES", Decimal("72.00"),  Decimal("74.00")),   # New Zealand Dollar
    ("INR", "KES", Decimal("1.16"),   Decimal("1.18")),    # Indian Rupee
    ("ZAR", "KES", Decimal("6.90"),   Decimal("7.10")),    # South African Rand
    ("AED", "KES", Decimal("29.80"),  Decimal("30.30")),   # UAE Dirham
    ("SAR", "KES", Decimal("28.90"),  Decimal("29.40")),   # Saudi Riyal
    ("EGP", "KES", Decimal("3.40"),   Decimal("3.50")),    # Egyptian Pound
    ("NGN", "KES", Decimal("0.25"),   Decimal("0.27")),    # Nigerian Naira
    ("RUB", "KES", Decimal("1.20"),   Decimal("1.22")),    # Russian Ruble
    ("KRW", "KES", Decimal("0.085"),  Decimal("0.090")),   # South Korean Won
    ("MYR", "KES", Decimal("25.50"),  Decimal("26.00")),   # Malaysian Ringgit

    # Extras
    ("HKD", "KES", Decimal("13.80"),  Decimal("14.20")),   # Hong Kong Dollar
    ("SEK", "KES", Decimal("11.50"),  Decimal("11.90")),   # Swedish Krona
    ("NOK", "KES", Decimal("11.00"),  Decimal("11.40")),   # Norwegian Krone
    ("DKK", "KES", Decimal("16.00"),  Decimal("16.50")),   # Danish Krone
    ("TRY", "KES", Decimal("3.20"),   Decimal("3.40")),    # Turkish Lira
    ("MXN", "KES", Decimal("5.50"),   Decimal("5.70")),    # Mexican Peso
    ("BRL", "KES", Decimal("20.00"),  Decimal("20.50")),   # Brazilian Real
]

SAMPLE_FAQS = [
    {
        "question": "What currencies can I exchange?",
        "answer": "We support USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SGD, NZD, INR and many more.",
    },
    {
        "question": "How do I create a rate alert?",
        "answer": "Log in, go to Alerts, pick a pair and your target rate, then click Create.",
    },
    {
        "question": "What are your branch hours?",
        "answer": "Our branches are open Mon-Fri, 9 AM-5 PM, and Sat 10 AM-2 PM.",
    },
    {
        "question": "How long do transfers take?",
        "answer": "Most transfers complete within 1-2 business days.",
    },
]

if __name__ == "__main__":
    with app.app_context():
        for base, quote, buy, sell in PAIRS:
            exists = CurrencyPair.query.filter_by(
                base_currency=base, quote_currency=quote
            ).first()
            if not exists:
                db.session.add(
                    CurrencyPair(
                        base_currency=base,
                        quote_currency=quote,
                        buy_rate=buy,    # Store raw buy rate
                        sell_rate=sell,  # Store raw sell rate
                    )
                )

        for faq in SAMPLE_FAQS:
            if not FAQ.query.filter_by(question=faq["question"]).first():
                db.session.add(FAQ(**faq))

        db.session.commit()
        print(f"Seeded {len(PAIRS)} currency pairs and {len(SAMPLE_FAQS)} FAQs.")
