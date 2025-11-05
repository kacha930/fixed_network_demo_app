from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder="../frontend/dist", template_folder="templates")
CORS(app)

# ---------------------------------------------
# INITIAL STATE AND CONSTANTS
# ---------------------------------------------
state = {
    "sim_status": "locked",           # can be: locked, unlocked, blocked, permanently_locked
    "remaining_attempts": 3,          # PIN attempts left
    "puk_attempts": 3,                # PUK attempts left
    "connection": "disconnected"
}

CORRECT_PIN = "1234"
CORRECT_PUK = "12345678"

# ---------------------------------------------
# LOAD GATEWAY CREDENTIALS (for Sign-In)
# ---------------------------------------------
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "gateway_credentials.json")

def load_credentials():
    try:
        with open(CREDENTIALS_FILE, "r") as f:
            creds = json.load(f)
            creds.setdefault("gateway_id", "GW-001")
            creds.setdefault("device_label", "Nokia Gateway 2")
            return creds
    except FileNotFoundError:
        return {
            "username": "admin",
            "password": "admin",
            "gateway_id": "GW-001",
            "device_label": "Nokia Gateway 2"
        }

# ---------------------------------------------
# LOGIN ENDPOINT
# ---------------------------------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    creds = load_credentials()
    if username == creds["username"] and password == creds["password"]:
        return jsonify({
            "success": True,
            "message": "Login successful",
            "gateway_id": creds["gateway_id"],
            "device_label": creds["device_label"]
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials. Please check the label on your Gateway 2 device."
        }), 401

# ---------------------------------------------
# STATUS ENDPOINT
# ---------------------------------------------
@app.route("/api/status")
def status():
    return jsonify(state)

# ---------------------------------------------
# SIM UNLOCK VIA PIN
# ---------------------------------------------
@app.route("/api/sim/unlock", methods=["POST"])
def unlock_sim():
    global CORRECT_PIN

    data = request.get_json()
    pin = data.get("pin")

    # Block permanent locks
    if state["sim_status"] == "permanently_locked":
        return jsonify({
            "status": "error",
            "message": "SIM permanently locked. Contact support."
        }), 403

    # Block if PUK required
    if state["sim_status"] == "blocked":
        return jsonify({
            "status": "error",
            "message": "SIM is blocked. Please enter PUK to unlock."
        }), 403

    # ✅ Correct PIN → success message only (no attempts)
    if pin == CORRECT_PIN:
        state.update({
            "sim_status": "unlocked",
            "connection": "connected",
            "remaining_attempts": 3,
            "puk_attempts": 3
        })
        return jsonify({
            "status": "success",
            "message": "SIM unlocked successfully."
        })

    # ❌ Incorrect PIN
    state["remaining_attempts"] -= 1
    if state["remaining_attempts"] <= 0:
        state.update({
            "sim_status": "blocked",
            "remaining_attempts": 0
        })
        return jsonify({
            "status": "error",
            "message": "SIM blocked. Enter PUK to unlock."
        }), 403

    return jsonify({
        "status": "error",
        "message": f"Incorrect PIN. Attempts left: {state['remaining_attempts']}"
    }), 400

# ---------------------------------------------
# SIM UNLOCK VIA PUK
# ---------------------------------------------
@app.route("/api/puk", methods=["POST"])
def unlock_puk():
    global CORRECT_PIN

    data = request.get_json()
    puk = data.get("puk")
    new_pin = data.get("new_pin")

    # Check states
    if state["sim_status"] == "permanently_locked":
        return jsonify({
            "status": "error",
            "message": "SIM permanently locked. Cannot accept PUK."
        }), 403

    if state["sim_status"] != "blocked":
        return jsonify({
            "status": "error",
            "message": "PUK not required. SIM is not blocked."
        }), 400

    # ✅ Correct PUK → success message only
    if puk == CORRECT_PUK:
        CORRECT_PIN = new_pin
        state.update({
            "sim_status": "unlocked",
            "connection": "connected",
            "remaining_attempts": 3,
            "puk_attempts": 3
        })
        return jsonify({
            "status": "success",
            "message": "SIM unlocked via PUK. New PIN set successfully."
        })

    # ❌ Incorrect PUK
    state["puk_attempts"] -= 1
    if state["puk_attempts"] <= 0:
        state["sim_status"] = "permanently_locked"
        return jsonify({
            "status": "error",
            "message": "PUK attempts exhausted. SIM permanently locked."
        }), 403

    return jsonify({
        "status": "error",
        "message": f"Invalid PUK. Attempts left: {state['puk_attempts']}"
    }), 403

# ---------------------------------------------
# HTML ROUTES
# ---------------------------------------------
@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/puk")
def puk_page():
    return render_template("puk.html")

# ---------------------------------------------
# RESET SIM
# ---------------------------------------------
@app.route("/reset")
def reset():
    state.update({
        "sim_status": "locked",
        "remaining_attempts": 3,
        "puk_attempts": 3,
        "connection": "disconnected"
    })
    return jsonify({"status": "reset", "message": "SIM reset to locked"})

# ---------------------------------------------
# SERVE FRONTEND BUILD
# ---------------------------------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    try:
        if path != "" and (app.static_folder and (app.static_folder + "/" + path)):
            return send_from_directory(app.static_folder, path)
    except Exception:
        pass
    return "Flask backend running. Use /login and /puk for WebUI."

# ---------------------------------------------
# MAIN
# ---------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
