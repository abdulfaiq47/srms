"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dash = () => {
    const router = useRouter();


    useEffect(() => {
        const student = document.cookie.includes("student=true");

        if (student) {
            router.replace("/login");
        }
    }, []);
  return <div>Redirecting...</div>;
};

export default Dash;
