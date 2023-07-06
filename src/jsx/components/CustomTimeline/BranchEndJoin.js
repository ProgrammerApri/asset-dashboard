import React from "react";

export default function BranchEndJoin({ color }) {
  return (
    <svg
      style={{ marginLeft: "-1.4rem", marginTop: "-2px", marginBottom: "-2px" }}
      width="27"
      height="26"
      viewBox="0 0 27 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 24C25 8 2 16.5 2 2"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
}
