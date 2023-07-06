import React from "react";
import Point from "./Point";
import Join from "./Join";
import BranchEndJoin from "./BranchEndJoin";
import Filler from "./Filler";
import SmallJoin from "./SmallJoin";
import BranchStartJoin from "./BranchStartJoin";

export default function DrawTimeline() {
  return (
    <div style={{ width: "3rem" }} className="d-flex flex-row">
      <div className="d-flex flex-column align-items-center">
        <Point color={"#0000ff"} />
        <Join color={"#0000ff"} />
        <Point color={"#0000ff"} />
        <Join color={"#0000ff"} />
        <SmallJoin color={"#0000ff"} />
        <Join color={"#0000ff"} />
        <SmallJoin color={"#0000ff"} />
        <Join color={"#0000ff"} />
        <Point color={"#0000ff"} />
        <Join color={"#0000ff"} />
        <Point color={"#0000ff"} />
      </div>
      <div
        className="d-flex flex-column align-items-center"
        style={{ marginLeft: "0.8rem" }}
      >
        <Filler height={10} />
        <Filler height={22} />
        <Filler height={10} />
        <BranchEndJoin color={"#ff0000"} />
        <Point color={"#ff0000"} />
        <Join color={"#ff0000"} />
        <Point color={"#ff0000"} />
        <BranchStartJoin color={"#ff0000"} />
        <Filler height={10} />
        <Filler height={22} />
        <Filler height={10} />
      </div>
    </div>
  );
}
