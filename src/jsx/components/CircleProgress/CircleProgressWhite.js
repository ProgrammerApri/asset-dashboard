import React, { useEffect, useRef } from "react";

const CircleProgressWhite = ({ percent, icon, colors }) => {
  const circle = React.createRef();

  useEffect(() => {
    console.log(circle);
    var cir = circle.current;
    var radius = cir.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;

    cir.style.strokeDasharray = `${circumference} ${circumference}`;
    cir.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - (percent / 100) * circumference;
    cir.style.strokeDashoffset = offset;
  });

  var primaryColor = colors;
  var secondaryColor = `${primaryColor}40`;

  return (
    <div className="mr-3 d-inline-block position-relative donut-chart-sale">
      <svg className="peity progress-ring" width="75" height="75">
        <circle
          className="progress-ring__circle"
          stroke={primaryColor}
          strokeWidth={8}
          fill="transparent"
          r="32"
          cx="38"
          cy="38"
          ref={circle}
        ></circle>
      </svg>
      <small className="text" style={{ color: primaryColor, fontSize: "24px" }}>
        {icon}
      </small>
      <span
        className="circle"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0px 0px 10px rgb(0 0 0 / 10%)",
          height: "55px",
          width: "55px",
        }}
      />
    </div>
  );
};

export default CircleProgressWhite;
