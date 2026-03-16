"use client";
import React from "react";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const LoginContent = () => {
  const router = useRouter();
  const shown = useRef(false);
  const searchParams = useSearchParams();
  const [data, setdata] = useState({
    s_email: "",
    s_password: "",
  });

  useEffect(() => {
    if (shown.current) return;
    const student = document.cookie.includes("student=true");

    if (student) {
      const sid = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sid="))
        ?.split("=")[1];

      const ob = `f${sid}f`;

      router.replace(`/student/dashboard/${ob}`);
      return;
    }

    const message = searchParams.get("message");

    if (message) {
      toast.info(message);
      router.replace("/login");
      shown.current = true;
    }
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const fet = await fetch("http://127.0.0.1:5000/stulogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let reult = await fet.json();

    if (reult["status"] == "success") {
      toast.success("Login successful! Redirecting to dashboard...");
      document.cookie = "student=true; path=/;  SameSite=Strict;";
      const student_id = reult.student.id;
      document.cookie = `sid=${student_id}; path=/; SameSite=Strict`;
      const ob = `f${student_id}f`;

      setTimeout(() => {
        router.push(`/student/dashboard/${ob}`);
      }, 1000);
    } else {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div>
      <form onSubmit={handelSubmit}>
        <input
          value={data.s_email}
          onChange={(e) => setdata({ ...data, s_email: e.target.value })}
          type="email"
          name="email"
          placeholder="Enter Your email"
          required
        />
        <input
          value={data.s_password}
          onChange={(e) => setdata({ ...data, s_password: e.target.value })}
          type="text"
          name="password"
          placeholder="Enter Your password"
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
