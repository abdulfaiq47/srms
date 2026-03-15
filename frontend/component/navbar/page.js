"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";

const navLinks = [
  { name: "Home", icon: "home-outline", href: "/", group: "/" },
  {
    name: "Admin",
    icon: "person-outline",
    href: "/admin/add",
    group: "/admin",
  },
  {
    name: "Student",
    icon: "chatbubble-outline",
    href: "/student/dashboard",
    group: "/student",
  },
  {
    name: "Admin Login",
    icon: "camera-outline",
    href: "/login",
    group: "/login",
  },
  {
    name: "Student Login",
    icon: "settings-outline",
    href: "/auth",
    group: "/auth",
  },
];

export default function AnimatedNavbar() {
  const pathname = usePathname();

  // const restrictedPages = [
  //   "/admin/delete",
  //   "/admin/add",
  //   "/admin/update",
  // ];
  // const isRestricted = restrictedPages.includes(pathname);

  return (
    <div className={styles.bodyWrapper}>
      <div className={`${styles.navigation}  `}>
        <ul>
          {navLinks.map((link, index) => {
            const isActive =
              pathname === link.href ||
              (link.href.startsWith("/admin") &&
                pathname.startsWith("/admin")) ||
              (link.href.startsWith("/student") &&
                pathname.startsWith("/student"));
            return (
              <li
                key={index}
                className={`${styles.list} ${isActive ? styles.active : ""}`}
              >
                <Link href={link.href}>
                  <span className={styles.icon}>
                    <ion-icon name={link.icon}></ion-icon>
                  </span>
                  <span className={styles.text}>{link.name}</span>
                </Link>
              </li>
            );
          })}
          <div className={styles.indicator}></div>
        </ul>
      </div>
    </div>
  );
}
