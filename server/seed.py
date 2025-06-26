# #!/usr/bin/env python3

# # Standard library imports
# from random import randint, choice as rc

# # Remote library imports
# from faker import Faker

# # Local imports
# from app import app
# from models import db

# if __name__ == '__main__':
#     fake = Faker()
#     with app.app_context():
#         print("Starting seed...")
#         # Seed code goes here!

# server/seed.py
from server.config import create_app, db
from server.models import CurrencyPair, FAQ

app = create_app()
with app.app_context():
    pairs = [
        ("USD", "KES", 108.50, 110.00),
        ("EUR", "KES", 120.00, 121.50),
        ("GBP", "KES", 135.00, 137.00),
    ]
    for base, quote, buy, sell in pairs:
        if not CurrencyPair.query.filter_by(
            base_currency=base, quote_currency=quote
        ).first():
            db.session.add(
                CurrencyPair(
                    base_currency=base,
                    quote_currency=quote,
                    buy_rate=buy,
                    sell_rate=sell,
                )
            )

    SAMPLE_FAQS = [
        {
            "question": "What currencies can I exchange?",
            "answer": "We support USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, and more.",
        },
        {
            "question": "How do I create a rate alert?",
            "answer": "Log in, go to Alerts, pick a pair and your target rate, then click Create.",
        },
        {
            "question": "What are your branch hours?",
            "answer": "Our branches are open Mon-Fri, 9 AM-5 PM, and Sat 10 AM-2 PM.",
        },
    ]

    if __name__ == "__main__":
        app = create_app()
        with app.app_context():
            for faq_data in SAMPLE_FAQS:
                if not FAQ.query.filter_by(question=faq_data["question"]).first():
                    db.session.add(FAQ(**faq_data))
            db.session.commit()
            print(f"Seeded {len(SAMPLE_FAQS)} FAQs")

    # faqs = [
    #     ("How do I upload KYC documents?", "Upload them during signup."),
    #     ("What are your fees?", "Included in the spread."),
    #     ("How long do transfers take?", "1-2 business days.")
    # ]
    # for q, a in faqs:
    #     if not FAQ.query.filter_by(question=q).first():
    #         db.session.add(FAQ(question=q, answer=a))

    # db.session.commit()
    # print("Seed data inserted.")
