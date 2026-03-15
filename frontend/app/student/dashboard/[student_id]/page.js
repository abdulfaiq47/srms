"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./page.module.css";

const Studentdashboard = () => {
  const { student_id } = useParams(); // <-- get from URL
  const [studentData, setStudentData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!student_id) {
      toast.error("Student ID missing!");
      router.push("/login");
      return;
    }

    const realId = student_id.slice(1, -1);
    // Fetch student data from backend
    fetch(`http://127.0.0.1:5000/student/${realId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setStudentData(data.student);
          // localStorage.setItem("realId", realId);
          toast.success(`Welcome ${data.student.name}!`);
        } else {
          toast.error(data.message);
          router.push("/login");
        }
      })
      .catch((err) => {
        toast.error("Server error");
        console.error(err);
      });
  }, [student_id]);

  const logout = (params) => {
    localStorage.removeItem("realId");
    document.cookie = "student=; path=/; max-age=0; SameSite=Strict";
    router.push("/login");
    toast.info("Logged out successfully!");
  };
  if (!studentData) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        &gt; <span>Student Dashboard</span>
      </div>
      <button onClick={logout}>Logout</button>

      {/* Top cards */}
      <div className={styles.topCards}>
        <div className={styles.card}>
          <div className={styles.cardNumber}>null</div>
          <div className={styles.cardLabel}>Attendance</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardNumber}>9/11</div>
          <div className={styles.cardLabel}>Assignment</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Class Schedule</div>
          <div className={styles.schedule}>
            <div className={styles.day}>Sun 08</div>
            <div className={`${styles.day} ${styles.active}`}>Mon 09</div>
            <div className={`${styles.day} ${styles.active}`}>Tue 10</div>
            <div className={`${styles.day} ${styles.active}`}>Wed 11</div>
            <div className={styles.day}>Thu 12</div>
            <div className={styles.day}>Fri 13</div>
            <div className={styles.day}>Sat 14</div>
          </div>
        </div>
      </div>

      {/* Active Course */}
      <div className={styles.activeCourse}>
        <div className={styles.courseHeader}>
          <h2>Web Development With Python</h2>
          <span className={styles.enrolled}>ENROLLED</span>
        </div>
        <div className={styles.courseInfo}>
          <span>Mon 09:00 PM – 12:00 PM</span>
          <span>To</span>
          <span>Fri 09:00 PM – 12:00 PM</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: "35%" }}></div>
        </div>
        <div className={styles.courseDetails}>
          <span>Roll: web</span>
          <span>Campus: IMST</span>
          <span>City: Karachi</span>
        </div>
      </div>

      {/* Assignments / Quizzes / Events */}
      <div className={styles.tabBox}>
        <div className={styles.tabs}>
          <button className={styles.tabActive}>Assignments</button>
          <button>Quizzes</button>
          <button>Events</button>
        </div>
        <div className={styles.tabContent}>
          <p>No upcoming quizzes</p>
        </div>
      </div>
      <div>
        <h1>Welcome, {studentData.s_name}</h1>
        <p>Email: {studentData.s_email}</p>
        <p>Roll: {studentData.roll}</p>
        <p>Campus: {studentData.campus}</p>
        {/* Add other dynamic data here */}
      </div>
    </div>
  );
};

export default Studentdashboard;
