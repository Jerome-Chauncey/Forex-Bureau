#!/usr/bin/env python3

# Standard library imports
from flask import jsonify
from rates_service import fetch_live_rates
from models import CurrencyPair


# Remote library imports
from flask import request
from flask_restful import Resource



# Local imports
from config import app, db, api
# Add your model imports

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route("/api/rates", methods=["GET"])
def get_rates():
    pairs   = CurrencyPair.query.all()
    symbols = list({p.quote_currency for p in pairs})
    rates   = fetch_live_rates(symbols=symbols)

    result = []
    for p in pairs:
        rate = rates.get(p.quote_currency)
        result.append({
            "id":             p.id,
            "base_currency":  p.base_currency,
            "quote_currency": p.quote_currency,
            "buy_rate":       float(rate) * 0.995,
            "sell_rate":      float(rate) * 1.005,
            "updated_at":     p.updated_at
        })

    return jsonify(result), 200




if __name__ == '__main__':
    app.run(port=5555, debug=True)

