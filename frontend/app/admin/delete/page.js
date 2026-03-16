"use client";
import React from "react";
import { useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import Navbr from "@/component/navbr/page";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const DeleteContent = () => {
  const searchparam = useSearchParams();
  const [data, setdata] = useState({
    roll: roll || "",
  });
   const [roll, setRoll] = useState("");
  const [result, setresult] = useState();
  const [studentinfo, setStudentinfo] = useState({});
  
  useEffect(() => {
    const r = searchparam.get("roll");
    if (r){setRoll(r)};
  }, [])

    

  

  const handlesub = async (e) => {
    e.preventDefault();

    const fet = await fetch("http://127.0.0.1:5000/delete", {
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
      const stud = result["student"][0];
      setStudentinfo(stud);
    } else {
      toast.error("Failed to update data.");
      setStudentinfo({});
    }

    console.log(result);
  };

  return (
    <div className={styles.container}>
      <Navbr />

      <div className={styles.card}>
        <h2>Delete Student</h2>
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
          <button type="submit" className={styles.button}>
            Delete
          </button>
        </form>
      </div>
      {/* <Image src="/arrow.png" alt="arrow" width={200} height={200} priority /> */}
      {result && (
        <div className={styles.resultWrapper}>
          <Image src="/arrow.png" alt="arrow" width={50} height={50} priority />
          <div className={styles.resultCard}>
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
            <h3>Result</h3>
            <p>Status: {result.status}</p>
            <p>Message: {result.message}</p>
            <p>Roll: {result.roll}</p>
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

export default function Delete() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteContent />
    </Suspense>
  );
}
