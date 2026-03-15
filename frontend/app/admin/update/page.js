"use client";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Navbr from "@/component/navbr/page";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const Update = () => {
  const searchParams = useSearchParams();
  const roll = searchParams.get("roll");
  const [data, setdata] = useState({
    roll: roll || "",
    marks: 0,
  });
  const [studentinfo, setStudentinfo] = useState({})

  const [result, setresult] = useState();

  // const fetc = async (e => {

  // };

  const handlesub = async (e) => {
    e.preventDefault();

    const fet = await fetch("http://127.0.0.1:5000/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let result = await fet.json();
    setresult(result);

    if (result.status === "success") {
      toast.success("Data updated successfully!");
      const stud = result["data"][0];
      setStudentinfo(stud)
    } else {
      toast.error("Failed to update data.");
      setStudentinfo({})
    }


    
  };

  return (
    <div className={styles.container}>
      <Navbr />

      <div className={styles.card}>
        <h2>Update Student Marks</h2>
        <form onSubmit={handlesub} className={styles.form}>
          <input
            type="text"
            name="roll"
            placeholder="Enter Roll Number"
            value={data.roll}
            onChange={(e) => setdata({ ...data, roll: e.target.value })}
            required
            className={styles.input}
          />
          <input
            type="number"
            name="marks"
            placeholder="Enter Marks"
            value={data.marks}
            onChange={(e) => setdata({ ...data, marks: e.target.value })}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Update
          </button>
        </form>
      </div>

      {result && (
        <div className={styles.resultWrapper}>
          <Image src="/arrow.png" alt="arrow" width={50} height={50} priority />
          <div className={styles.resultCard}>
            <h3>Result</h3>
            <div className={styles.resultRow}>
              <span>Status:</span>
              <span
                className={
                  result.status === "success" ? styles.success : styles.error
                }
              >
                {result.status}
              </span>
            </div>

            <p>Message: {result.message}</p>
            <p>Roll: {studentinfo.roll}</p>
            <hr />
            <h3>Updated Student</h3>
            <p>Name: {studentinfo.name}</p>
            <p>Roll: {studentinfo.roll}</p>
            <p>Marks: {studentinfo.marks}</p>
            
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Update;
