"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DetectivePage() {
  const router = useRouter();
  return (
    <>
      <div className="role-page bg-[#0b0b2e]">
        <img
          src="/images/detective.png"
          alt="Lead Detective"
          className="role-image"
        />

        <div className="relative flex w-full flex-col gap-2  role-box">
          <h2>LEAD DETECTIVE</h2>
          <div>
            Follow the clues.
            <br />
            Interrogate suspects.
          </div>
          <Link href="/detective-case" className="start-role-btn">
            Enter Your Case
          </Link>
        </div>

        <button
          className="back-btn nav-btn"
          onClick={() => {
            router.back();
          }}
        >
          &larr; Back
        </button>
      </div>

      <style jsx>{`
        body {
          margin: 0;
          font-family: "Courier New", monospace;
          background-color: #0b0b2e;
          background-image: url("/images/bg.png");
          color: white;
          text-align: center;
        }
        .role-page {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          height: 100vh;
          padding: 50px;
          gap: 30px;
          flex-wrap: wrap;
        }
        .back-btn {
          position: fixed; /* fixed to viewport */
          bottom: 20px;
          left: 20px;
          padding: 10px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #b9a9ff, #d4c6ff);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .back-btn:hover {
          background-color: #4b2dbd;
          transform: scale(1.05);
        }
        .role-image {
          height: 570px;
          border-radius: 18px;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
          transition: transform 0.3s ease;
        }
        .role-image:hover {
          transform: scale(1.02);
        }
        .role-box {
          background-color: #7a5cff;
          padding: 40px 30px;
          border-radius: 24px;
          max-width: 450px;
          color: white;
          box-shadow: 0 0 25px rgba(122, 92, 255, 0.6);
          font-size: 1.2rem;
          line-height: 1.6;
        }
        .role-box h2 {
          font-size: 2.2rem;
          margin-bottom: 15px;
          letter-spacing: 2px;
        }
        .start-role-btn {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 28px;
          background: #0b0b2e;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.3s;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
        }
        .start-role-btn:hover {
          background: #2c2c6e;
          transform: scale(1.05);
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: transparent;
          border: 2px solid #7a5cff;
          color: #7a5cff;
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 0.95rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
          text-decoration: none;
        }
        .back-button:hover {
          background-color: #7a5cff;
          color: white;
        }
      `}</style>
    </>
  );
}
