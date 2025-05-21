import { Quicksand } from "next/font/google";
import Link from "next/link";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export default function Home() {
  return (
    <div className="home-container">
      <h1 className={quicksand.className} style={{ margin: 0 }}>
        Agro Sage
      </h1>
      <p>Your Farming Assistant</p>
      <Link href="/chat" style={{ margin: "0.4rem 0" }}>
        Chat with me, on your farming problems
      </Link>
      <Link href="/upload" style={{ margin: "0.4rem 0" }}>
        Upload leaf image to access crop health
      </Link>
      <Link href="/dashboard" style={{ margin: "0.4rem 0" }}>
        Get reports on yield predictions, climate alerts
      </Link>
    </div>
  );
}
