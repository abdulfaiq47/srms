"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Navbar from "@/component/navbar/page";

export default function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/");
      const data = await res.json();
      setStudents(data.students);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>All Students</h1>
        {students?.length > 0 ? (
          <div className={styles.grid}>
            {students.map((student, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2>{student.name}</h2>
                  <span>Roll: {student.roll}</span>
                </div>
                <div className={styles.cardBody}>
                  <p>Course: {student.course}</p>
                  <p>Marks: {student.marks}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>No students found</p>
        )}
      </div>
    </>
  );
}
