import React from "react";

export default function Point({ color }) {
  return (
    <svg
      style={{ zIndex: "10" }}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="5" r="5" fill={`${color}`} />
    </svg>
  );
}
