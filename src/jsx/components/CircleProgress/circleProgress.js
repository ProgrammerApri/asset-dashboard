import React, { useEffect, useRef } from "react";

const CircleProgress = ({ percent, color, icon }) => {
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

  var letters = '0123456789ABCDEF';
  var colors = '#';
  for (var i = 0; i < 6; i++) {
    colors += letters[Math.floor(Math.random() * 16)];
  }

  var primaryColor = colors;
  var secondaryColor = `${primaryColor}40`;

  return (
    <div className="d-inline-block mb-4 ml--12 position-relative donut-chart-sale">
      <svg className="peity progress-ring" width="110" height="110">
        <circle
          className="progress-ring__circle"
          stroke={secondaryColor}
          strokeWidth={10}
          fill="transparent"
          r="50"
          cx="55"
          cy="55"
          ref={circle}
        ></circle>
      </svg>
      <small className="text-primary">{icon}</small>
      <span className="circle" style={{ backgroundColor: primaryColor }} />
    </div>
  );
};

export default CircleProgress;
