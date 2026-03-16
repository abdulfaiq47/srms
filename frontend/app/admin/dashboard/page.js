"use client";
import React, { useEffect, useState, Suspense } from "react";
import style from "./page.module.css";
import Navbr from "@/component/navbr/page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const DashboardContent = () => {
  const [stude, setstude] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch stude from Flask API
  const fetchstude = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/"); 
      const data = await res.json();
      setstude(data.students);
    } catch (error) {
      toast.error("Failed to fetch stude");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchstude();
  }, []);

  // Calculate stats
  const totalstude = stude.length;
  // const totalMarks = stude.reduce((acc, cur) => acc + (cur.marks || 0), 0);

  return (
    <div className={style.container}>
      <Navbr />

      <div className={style.statsContainer}>
        <div className={style.statCard}>
          <h3>Total stude</h3>
          <p>{totalstude}</p>
        </div>
        <div className={style.statCard}>
          <h3>Total Classes</h3>
          <p>null</p>
        </div>
      </div>

      <div className={style.tableCard}>
        <h2>Student List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={style.studentTable}>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stude.map((s) => (
                <tr key={s.roll}>
                  <td>{s.roll}</td>
                  <td>{s.marks}</td>
                  <td>
                    <button
                      className={style.editBtn}
                      onClick={() => router.push(`/admin/update?roll=${s.roll}`)}
                    >
                      Edit
                    </button>
                    <button
                      className={style.deleteBtn}
                      onClick={() => router.push(`/admin/delete?roll=${s.roll}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}