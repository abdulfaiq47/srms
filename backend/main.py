from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import date

load_dotenv()

app = Flask(__name__)
CORS(app)
# Debugging line to check environment variables

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print(SUPABASE_URL, SUPABASE_KEY)


# ===================Student Authentication========================
@app.route("/stulogin", methods=["POST"])
def stulogin():
    st_data = request.json
    email = st_data["s_email"]
    password = st_data["s_password"]

    if not email or not password:
        return (
            jsonify({"status": "error", "message": "Email and password are required"}),
            400,
        )

    responce = (
        supabase.table("students")
        .select("*")
        .eq("s_email", email)
        .eq("s_password", password)
        .execute()
    )

    if responce.data is None or len(responce.data) == 0:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    return jsonify(
        {
            "status": "success",
            "message": "Login successful!",
            "student": responce.data[0],
        }
    )


# Get single student ========================
@app.route("/student/<student_id>", methods=["GET"])
def get_student(student_id):
    response = supabase.table("students").select("*").eq("id", student_id).execute()

    if response.data is None or len(response.data) == 0:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    return jsonify({"status": "success", "student": response.data[0]})


# ====================Admin Authentication========================
@app.route("/auth", methods=["POST"])
def auth():
    ad_data = request.json
    name = ad_data["a_name"]
    email = ad_data["a_email"]
    password = ad_data["a_password"]

    responce = (
        supabase.table("admin")
        .select("*")
        .eq("a_name", name)
        .eq("a_email", email)
        .eq("a_password", password)
        .execute()
    )

    if responce.data is None or len(responce.data) == 0:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    return jsonify({"status": "success", "admin": "Your are now admin"})


#  READ STUDENTS
@app.route("/", methods=["GET"])
def getstudent():

    responce = supabase.table("students").select("*").execute()
    if responce.data is None or len(responce.data) == 0:
        return jsonify({"status": "error", "message": "Data not found"}), 401

    return jsonify({"status": "success", "students": responce.data})


# ===================Add Student =======================


@app.route("/add", methods=["POST"])
def add_student():

    data = request.json

    name = data["name"]
    roll = data["roll"]
    course = data["course"]
    marks = int(data.get("marks"))
    s_email = data["s_email"]
    s_password = data["s_password"]

    check = supabase.table("students").select("*").eq("roll", roll).execute()

    if check.data:
        return (
            jsonify(
                {"status": "error", "message": "Student with this roll already exists"}
            ),
            400,
        )
    if marks < 0 or marks > 100:
        return (
            jsonify({"status": "error", "message": "Marks must be between 0 and 100"}),
            400,
        )

    responce = (
        supabase.table("students")
        .insert(
            {
                "name": name,
                "roll": roll,
                "course": course,
                "marks": marks,
                "s_email": s_email,
                "s_password": s_password,
            }
        )
        .execute()
    )

    if not responce.data:
        return jsonify({"status": "error", "message": "Failed to add student"}), 500

    return jsonify(
        {"status": "success", "message": "Student Added", "data": responce.data}
    )


# =======================Update========================


@app.route("/update", methods=["POST"])
def update():

    data = request.json

    roll = data["roll"]
    marks = int(data.get("marks"))

    if marks < 0 or marks > 100:
        return (
            jsonify({"status": "error", "message": "Marks must be between 0 and 100"}),
            400,
        )
    check = supabase.table("students").select("*").eq("roll", roll).execute()
    if check.data is None or len(check.data) == 0:
        return (
            jsonify({"status": "error", "message": "Student not found", "roll": roll}),
            404,
        )
    responce = (
        supabase.table("students").update({"marks": marks}).eq("roll", roll).execute()
    )

    if not responce.data:
        return jsonify({"status": "error", "message": "Failed to update student"}), 500

    return jsonify(
        {
            "status": "success",
            "message": "Student updated Successfully",
            "data": responce.data,
        }
    )


# ========================Delete========================
@app.route("/delete", methods=["POST"])
def delete():
    data = request.json

    roll = data["roll"]

    check = supabase.table("students").select("*").eq("roll", roll).execute()
    if check.data is None or len(check.data) == 0:
        return (
            jsonify({"status": "error", "message": "Student not found", "roll": roll}),
            404,
        )
    responce = supabase.table("students").delete().eq("roll", roll).execute()

    if not responce.data:
        return jsonify({"status": "error", "message": "Failed to delete student"}), 500

    return jsonify(
        {
            "status": "success",
            "message": "Student deleted Successfully",
            "data": responce.data,
        }
    )


# Attendence==========================================
@app.route("/attendance", methods=["POST"])
def add_attendance():
    data = request.json

    roll = data.get("roll")
    status = data.get("status")

    if not roll or not status:
        return jsonify({"message": "Missing data"}), 400

    if status not in ["present", "absent"]:
        return jsonify({"message": "Invalid status"}), 400

    today = str(date.today())
    check = supabase.table("students").select("*").eq("roll", roll).execute()
    if check.data is None or len(check.data) == 0:
        return (
            jsonify({"status": "error", "message": "Student not found", "roll": roll}),
            404,
        )
    check_attendance = (
        supabase.table("attendance")
        .select("*")
        .eq("s_roll", roll)
        .eq("date", today)
        .execute()
    )
    if check_attendance.data and len(check_attendance.data) > 0:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Attendance already added for today",
                    "roll": roll,
                }
            ),
            400,
        )

    responce = (
        supabase.table("attendance")
        .insert(
            {
                "s_roll": roll,
                "date": today,
                "status": status,
            }
        )
        .execute()
    )

    if not responce.data:
        return jsonify({"status": "error", "message": "Failed to add attendance"}), 500

    return jsonify(
        {
            "status": "success",
            "message": "Today's Attendance Added",
            "data": responce.data,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
