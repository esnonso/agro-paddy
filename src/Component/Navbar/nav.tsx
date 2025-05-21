"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./nav.module.css";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.container}>
      {pathname !== "/" && (
        <Link href="/" className={styles["nav-link"]}>
          Home
        </Link>
      )}
      {pathname !== "/chat" && (
        <Link href="/chat" className={styles["nav-link"]}>
          Chat
        </Link>
      )}
      {pathname !== "/upload" && (
        <Link href="/upload" className={styles["nav-link"]}>
          Upload
        </Link>
      )}
      {pathname !== "/dashboard" && (
        <Link href="/dashboard" className={styles["nav-link"]}>
          Dashboard
        </Link>
      )}
    </nav>
  );
}
