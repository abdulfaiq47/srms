"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const Admin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shown = useRef(false);
  const [data, setdata] = useState({
    a_name: "",
    a_email: "",
    a_password: "",
  });

  useEffect(() => {
    if (shown.current) return;
    const admin = document.cookie.includes("admin=true");
    if (admin) {
      router.replace("/admin/dashboard");
      return;
    }
    const message = searchParams.get("message");
    if (message) {
      toast.info(message);
      router.replace("/auth");
      shown.current = true;
    }
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const fet = await fetch("http://127.0.0.1:5000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let reult = await fet.json();

    if (reult["status"] == "success") {
      toast.success("Login successful! Redirecting to dashboard...");
      document.cookie = "admin=true; path=/; max-age=86400;  SameSite=Strict;";
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } else {
      toast.error("Invalid credentials!");
    }
  };

  return (
    <div>
      <form onSubmit={handelSubmit}>
        <input
          value={data.a_name}
          onChange={(e) => setdata({ ...data, a_name: e.target.value })}
          type="text"
          name="a_name"
          placeholder="Enter Your name"
          required
        />
        <input
          value={data.a_email}
          onChange={(e) => setdata({ ...data, a_email: e.target.value })}
          type="email"
          name="email"
          placeholder="Enter Your email"
          required
        />
        <input
          value={data.a_password}
          onChange={(e) => setdata({ ...data, a_password: e.target.value })}
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

export default Admin;
