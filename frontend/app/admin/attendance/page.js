"use client";
import React, { useState } from "react";
import Navbr from "@/component/navbr/page";
import style from "./page.module.css";
import { toast } from "react-toastify";
import { Preahvihear } from "next/font/google";

const Attendance = () => {
  const [form, setForm] = useState({
    roll: "",
    date: "",
    status: "present",
  });

  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Same structure like your Flask API
  const addAttendance = async () => {
    const { roll, status } = form;

    if (!roll ) {
      return toast.error("All fields required");
    }

    const fet = await fetch("http://localhost:5000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await fet.json();

    if (result.status === "success") {
       toast.success(result.message);
    }else{
         toast.error(result.message);
    }

    const newRecord = {
      roll,
      date: result.data[0].date, 
      status,
    };

    setRecords([...records, newRecord]);


    // reset form
    setForm((prev) => ({
      roll: "",
      status: "present",
    }));
  };

  return (
    <div className={style.container}>
      <Navbr />

      <div className={style.card}>
        <h2 className={style.title}>Add Attendance</h2>

        {/* FORM */}
        <div className={style.form}>
          <input
            type="text"
            name="roll"
            placeholder="Enter Roll Number"
            value={form.roll}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>

          <button className={style.submit} onClick={addAttendance}>
            Add Attendance
          </button>
        </div>
      </div>

      {/* RECORD LIST */}
      <div className={style.card}>
        <div className={style.titleRow}>
          <h3>Today Records</h3>
          <button
            className={style.resetBtn}
            onClick={() => {
              if (confirm("Are you sure you want to reset all records?")) {
                setRecords([]);
                toast.info("Records cleared");
              }
            }}
          >
            Reset
          </button>
        </div>

        {records.length === 0 ? (
          <p className={style.empty}>No records yet</p>
        ) : (
          records.map((rec, i) => (
            <div key={i} className={style.row}>
              <span>Roll: {rec.roll}</span>
              <span>{rec.date}</span>
              <span
                className={
                  rec.status === "present" ? style.present : style.absent
                }
              >
                {rec.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Attendance;
