import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

from flask import Flask, jsonify, request, current_app
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from decimal import Decimal

# Import your factory and extensions
from server.config import create_app, db
from server.models.user import User
from server.models.exchange_order import ExchangeOrder
from server.models.currency_pair import CurrencyPair
from server.models.rate_alert import RateAlert
from server.models.faq import FAQ
from server.models.kyc_document import KYCDocument
from server.rates_service import fetch_live_rates
from server.utils import allowed_file

# Create the Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://forex-bureau-ui.onrender.com"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type", "Authorization"]
    }
})

@app.after_request
def after_request(response):
    """Add CORS headers to every response"""
    response.headers.add('Access-Control-Allow-Origin', 'https://forex-bureau-ui.onrender.com')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/api/signup", methods=["POST", "OPTIONS"])
def signup():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    email = request.form.get("email")
    password = request.form.get("password")
    name = request.form.get("name")
    phone = request.form.get("phone")
    address = request.form.get("address")
    kyc_file = request.files.get("kycDoc")

    if not all([email, password, name, phone, address, kyc_file]):
        return jsonify({"message": "All fields including KYC document are required."}), 400
    if not allowed_file(kyc_file.filename):
        return jsonify({"message": "Invalid file type."}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered."}), 409

    filename = secure_filename(kyc_file.filename)
    upload_dir = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_dir, exist_ok=True)
    filepath = os.path.join(upload_dir, filename)
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
    db.session.flush()

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
    pairs = CurrencyPair.query.all()
    result = []
    for p in pairs:
        result.append({
            "id": p.id,
            "base_currency": p.base_currency,
            "quote_currency": p.quote_currency,
            "buy_rate": round(float(p.buy_rate) * 0.995, 6),
            "sell_rate": round(float(p.sell_rate) * 1.005, 6),
            "updated_at": p.updated_at.isoformat()
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

@app.route("/api/orders", methods=["POST"])
@jwt_required()
def create_order():
    data = request.get_json()
    pair_id = data.get("currency_pair_id")
    raw_amount = data.get("amount")
    direction = data.get("direction")
    delivery = data.get("delivery_method")
    user_id = get_jwt_identity()

    if not all([pair_id, raw_amount, direction, delivery]):
        return jsonify({"message": "All fields are required."}), 400

    if direction not in ("buy", "sell"):
        return jsonify({"message": "direction must be 'buy' or 'sell'."}), 400
    if delivery not in ("branch_pickup", "bank_transfer"):
        return jsonify({"message": "delivery_method must be 'branch_pickup' or 'bank_transfer'."}), 400

    try:
        amount = Decimal(raw_amount)
        if amount <= 0:
            raise ValueError()
    except:
        return jsonify({"message": "amount must be a positive number."}), 400 

    pair = CurrencyPair.query.get(pair_id)
    if not pair:
        return jsonify({"message": "CurrencyPair not found."}), 404 

    executed_rate = pair.sell_rate if direction == "buy" else pair.buy_rate 

    order = ExchangeOrder(
        user_id=user_id,
        currency_pair_id=pair_id,
        amount=amount,
        direction=direction,
        delivery_method=delivery,
        rate_executed=executed_rate,
        status="pending"
    )
    db.session.add(order)
    db.session.commit()

    return jsonify(order.to_dict()), 201

@app.route("/api/orders", methods=["GET"])
@jwt_required()
def list_orders():
    user_id = get_jwt_identity()
    orders = ExchangeOrder.query.filter_by(user_id=user_id).order_by(ExchangeOrder.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200

@app.route("/api/alerts", methods=["POST"])
@jwt_required()
def create_alert():
    data = request.get_json()
    pair_id = data.get("currency_pair_id")
    target_raw = data.get("target_rate")
    user_id = get_jwt_identity()

    if not pair_id or target_raw is None:
        return jsonify({"message": "currency_pair_id and target_rate are required"}), 400

    try:
        target_rate = Decimal(str(target_raw))
    except:
        return jsonify({"message": "target_rate must be a number"}), 400

    alert = RateAlert(
        user_id=user_id,
        currency_pair_id=pair_id,
        target_rate=target_rate
    )
    db.session.add(alert)
    db.session.commit()

    return jsonify({
        "id": alert.id,
        "currency_pair_id": alert.currency_pair_id,
        "target_rate": str(alert.target_rate),
        "is_active": alert.is_active
    }), 201

@app.route("/api/alerts", methods=["GET"])
@jwt_required()
def list_alerts():
    user_id = get_jwt_identity()
    alerts = RateAlert.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": a.id,
        "currency_pair_id": a.currency_pair_id,
        "target_rate": str(a.target_rate),
        "is_active": a.is_active
    } for a in alerts]), 200

@app.route("/api/alerts/<int:alert_id>", methods=["DELETE"])
@jwt_required()
def delete_alert(alert_id):
    user_id = get_jwt_identity()
    alert = RateAlert.query.get(alert_id)
    if not alert or alert.user_id != user_id:
        return jsonify({"message": "Alert not found"}), 404

    db.session.delete(alert)
    db.session.commit()
    return '', 204

@app.route("/api/alerts/<int:alert_id>", methods=["PATCH"])
@jwt_required()
def update_alert(alert_id):
    data = request.get_json() or {}
    new_rate = data.get("target_rate")
    new_active = data.get("is_active")

    if new_rate is None and new_active is None:
        return jsonify({"message": "Nothing to update."}), 400

    user_id = get_jwt_identity()
    alert = RateAlert.query.filter_by(id=alert_id, user_id=user_id).first()
    if not alert:
        return jsonify({"message": "Alert not found."}), 404

    try:
        if new_rate is not None:
            amt = Decimal(str(new_rate))
            if amt <= 0:
                raise ValueError()
            alert.target_rate = amt

        if new_active is not None:
            alert.is_active = bool(new_active)

    except (ArithmeticError, ValueError):
        return jsonify({"message": "Invalid update payload."}), 400

    db.session.commit()
    return jsonify(alert.to_dict()), 200

@app.route("/api/faqs", methods=["GET"])
def list_faqs():
    faqs = FAQ.query.all()
    return jsonify([f.to_dict() for f in faqs]), 200

@app.route("/api/faqs/<int:faq_id>", methods=["GET"])
def get_faq(faq_id):
    faq = FAQ.query.get(faq_id)
    if not faq:
        return jsonify({"message": "FAQ not found."}), 404
    return jsonify(faq.to_dict()), 200

@app.route("/api/users/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found."}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "address": user.address,
    }), 200

@app.route("/api/users/me", methods=["PATCH"])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found."}), 404

    data = request.get_json() or {}
    phone = data.get("phone")
    address = data.get("address")

    if phone is None and address is None:
        return jsonify({"message": "Nothing to update."}), 400

    if phone is not None:
        user.phone = phone
    if address is not None:
        user.address = address

    db.session.commit()

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "address": user.address,
    }), 200

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, debug=True)