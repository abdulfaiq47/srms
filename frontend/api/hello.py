from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows your Next.js frontend to fetch

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask Serverless!"})

# Important for Vercel
handler = app