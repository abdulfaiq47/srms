"use client";
import React from "react";
import style from "./page.module.css";
import { useState, useEffect } from "react";
import Navbr from "@/component/navbr/page";
import { toast } from "react-toastify";

function Add() {
  const [data, setdata] = useState({
    name: "",
    roll: "",
    course: "",
    marks: 0,
    s_email: "",
    s_password: "",
  });

  // const fetc = async (e => {

  // };

  const handlesub = async (e) => {
    e.preventDefault();

    const fet = await fetch("http://127.0.0.1:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let result = await fet.json();
    if (result.status === "success") {
      toast.success("Student added successfully!");
    } else {
      toast.error(result.message || "Failed to add student.");
    }

    console.log(result);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.css}>
          <Navbr />
          <h2>Add Students</h2>
          <form onSubmit={handlesub}>
            <input
              value={data.name}
              onChange={(e) => setdata({ ...data, name: e.target.value })}
              type="text"
              name="name"
              placeholder="Enter Your name"
              required
            />
            <input
              value={data.roll}
              onChange={(e) => setdata({ ...data, roll: e.target.value })}
              type="text"
              name="roll"
              placeholder="Enter Your roll"
              required
            />
            <input
              value={data.course}
              onChange={(e) => setdata({ ...data, course: e.target.value })}
              type="text"
              name="course"
              placeholder="Enter Your course"
              required
            />
            <input
              value={data.marks}
              onChange={(e) => setdata({ ...data, marks: e.target.value })}
              type="number"
              name="marks"
              placeholder="Enter your marks"
              required
            />
            <input
              value={data.s_email}
              onChange={(e) => setdata({ ...data, s_email: e.target.value })}
              type="email"
              name="s_email"
              placeholder="Enter Your email"
              required
            />
            <input
              value={data.s_password}
              onChange={(e) => setdata({ ...data, s_password: e.target.value })}
              type="password"
              name="s_password"
              placeholder="Enter Your password"
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Add;
