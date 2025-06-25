#!/usr/bin/env python3

import os
from dotenv import load_dotenv

# 1. Load environment variables from .env
load_dotenv()

# 2. Flask and extensions
from flask import Flask, jsonify, request, current_app
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token
from config import create_app, db, api

# 3. Your models and services
from models.currency_pair import CurrencyPair
from models.user import User
from models.kyc_document import KYCDocument
from rates_service import fetch_live_rates
from utils import allowed_file

# 4. Create the Flask app using the factory
app = create_app()

# 5. Signup endpoint (multipart/form-data + KYC upload)
@app.route("/api/signup", methods=["POST"])
def signup():
    email    = request.form.get("email")
    password = request.form.get("password")
    name     = request.form.get("name")
    phone    = request.form.get("phone")
    address  = request.form.get("address")
    kyc_file = request.files.get("kycDoc")

    # Validate inputs
    if not all([email, password, name, phone, address, kyc_file]):
        return jsonify({"message": "All fields including KYC document are required."}), 400
    if not allowed_file(kyc_file.filename):
        return jsonify({"message": "Invalid file type."}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered."}), 409

    # Save the uploaded KYC file
    filename    = secure_filename(kyc_file.filename)
    upload_dir  = current_app.config["UPLOAD_FOLDER"]
    upload_path = os.path.join(upload_dir, filename)
    kyc_file.save(upload_path)

    # Create the user
    hashed_pw = generate_password_hash(password)
    user = User(
        email=email,
        password_hash=hashed_pw,
        name=name,
        phone=phone,
        address=address
    )
    db.session.add(user)
    db.session.flush()  # assign user.id

    # Create the KYC document record
    doc = KYCDocument(
        user_id=user.id,
        doc_type=filename.rsplit(".", 1)[1].upper(),
        file_url=upload_path
    )
    db.session.add(doc)
    db.session.commit()

    # Issue a JWT token
    token = create_access_token(identity=user.id)

    return jsonify({
        "user": {"id": user.id, "email": user.email, "name": user.name},
        "token": token
    }), 201

# 6. Live rates endpoint
@app.route("/api/rates", methods=["GET"])
def get_rates():
    pairs = CurrencyPair.query.all()
    symbols = list({p.quote_currency for p in pairs})
    rates = fetch_live_rates(symbols=symbols)

    result = []
    for p in pairs:
        rate = rates.get(p.quote_currency)
        if rate is None:
            continue
        result.append({
            "id":             p.id,
            "base_currency":  p.base_currency,
            "quote_currency": p.quote_currency,
            "buy_rate":       round(float(rate) * 0.995, 6),
            "sell_rate":      round(float(rate) * 1.005, 6),
            "updated_at":     p.updated_at.isoformat()
        })

    return jsonify(result), 200

# 7. Health-check endpoint
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

# 8. Run the app
if __name__ == "__main__":
    # Print registered routes for debugging
    print(app.url_map)
    app.run(host="0.0.0.0", port=5555, debug=True)
