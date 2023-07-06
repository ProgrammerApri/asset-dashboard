import React from "react";

export default function BranchStartJoin({ color }) {
  return (
    <svg
      style={{ marginLeft: "-1.4rem", marginTop: "-2px", marginBottom: "-2px" }}
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 24.5C2 10 25 18.5 25 2"
        stroke={color}
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  );
}
