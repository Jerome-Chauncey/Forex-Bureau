import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

from flask import jsonify, request, current_app
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

# Import your factory and extensions
from server.config import create_app, db
from server.models.user import User

# Import models and services using absolute paths
from server.models.currency_pair import CurrencyPair
from server.models.user          import User
from server.models.kyc_document import KYCDocument
from server.rates_service        import fetch_live_rates
from server.utils                import allowed_file

# Create the Flask app
app = create_app()

@app.route("/api/signup", methods=["POST"])
def signup():
    email    = request.form.get("email")
    password = request.form.get("password")
    name     = request.form.get("name")
    phone    = request.form.get("phone")
    address  = request.form.get("address")
    kyc_file = request.files.get("kycDoc")

    if not all([email, password, name, phone, address, kyc_file]):
        return jsonify({"message": "All fields including KYC document are required."}), 400
    if not allowed_file(kyc_file.filename):
        return jsonify({"message": "Invalid file type."}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered."}), 409

    filename   = secure_filename(kyc_file.filename)
    upload_dir = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_dir, exist_ok=True)
    filepath   = os.path.join(upload_dir, filename)
    kyc_file.save(filepath)

    hashed_pw = generate_password_hash(password)
    user = User(
        email=email,
        password_hash=hashed_pw,
        name=name,
        phone=phone,
        address=address
    )
    db.session.add(user)
    db.session.flush()  # user.id is now available

    doc = KYCDocument(
        user_id=user.id,
        doc_type=filename.rsplit('.', 1)[1].upper(),
        file_url=filepath
    )
    db.session.add(doc)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({
        "user": {"id": user.id, "email": user.email, "name": user.name},
        "token": token
    }), 201

@app.route("/api/rates", methods=["GET"])
def get_rates():
    pairs   = CurrencyPair.query.all()
    symbols = list({p.quote_currency for p in pairs})
    rates   = fetch_live_rates(symbols=symbols)

    result = []
    for p in pairs:
        rate = rates.get(p.quote_currency)
        if rate is None:
            continue
        result.append({
            "id":            p.id,
            "base_currency": p.base_currency,
            "quote_currency":p.quote_currency,
            "buy_rate":      round(float(rate) * 0.995, 6),
            "sell_rate":     round(float(rate) * 1.005, 6),
            "updated_at":    p.updated_at.isoformat()
        })

    return jsonify(result), 200

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and Password are required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password."}), 401
    
    token = create_access_token(identity=user.id)
    return jsonify({
        "user": {"id": user.id, "email": user.email, "name": user.name},
        "token": token
    }), 200

# Health check
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    print(app.url_map)
    app.run(host="0.0.0.0", port=5555, debug=True)
