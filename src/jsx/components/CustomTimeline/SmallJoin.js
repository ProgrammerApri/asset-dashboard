import React from "react";

export default function SmallJoin({ color }) {
  return (
    <svg
      style={{ marginTop: "-2px", marginBottom: "-2px" }}
      width="4"
      height="14"
      viewBox="0 0 4 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2L2 12"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
}
