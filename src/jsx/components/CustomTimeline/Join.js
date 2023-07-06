import React from "react";

export default function Join({ color }) {
  return (
    <svg
      style={{ marginTop: "-2px", marginBottom: "-2px" }}
      width="4"
      height="26"
      viewBox="0 0 4 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2L2 24"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
}
