"use client";
import React from "react";
import style from "./page.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbr = () => {
  const pathname = usePathname();

  return (
    <div className={style.secnav}>
      <ul>
        <li>
          <Link
            className={pathname === "/admin/add" ? style.active : ""}
            href="/admin/add"
          >
            Add Student
          </Link>
        </li>

        <li>
          <Link
            className={pathname === "/admin/dashboard" ? style.active : ""}
            href="/admin/dashboard"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            className={pathname === "/admin/attendance" ? style.active : ""}
            href="/admin/attendance"
          >
            Attendance
          </Link>
        </li>

        <li>
          <Link
            className={pathname === "/admin/delete" ? style.active : ""}
            href="/admin/delete"
          >
            Delete
          </Link>
        </li>

        <li>
          <Link
            className={pathname === "/admin/update" ? style.active : ""}
            href="/admin/update"
          >
            Update
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbr;
