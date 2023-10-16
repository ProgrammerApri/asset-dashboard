import React from "react";
import Point from "./Point";
import Join from "./Join";
import BranchEndJoin from "./BranchEndJoin";
import Filler from "./Filler";
import SmallJoin from "./SmallJoin";
import BranchStartJoin from "./BranchStartJoin";

export default function DrawTimeline({data}) {
  // type :
  // 1. Normal
  // 2. branch start
  // 3. branch end
  // 4. branch start and branch end
  // 0. filler
  // 5. join

  // column : integer

  let columnColor = {
    1: "#0000ff",
    2: "#ff0000",
    3: "#00ff00",
  };

  var groupBy = function (xs, key) {
    return xs?.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const generateRow = () => {
    if (data) {
      let grouped = groupBy(data, "column");
      let colKey = [];
      let filler = {
        id: null,
        ref_code: null,
        message: null,
        note: null,
        approved: null,
        type: 0,
        column: 1,
      };

      Object.keys(grouped).forEach((el) => {
        colKey.push(Number(el));
      });

      console.log(grouped);
      console.log(colKey);

      let generatedRow = [];

      colKey.forEach((el) => {
        let row = [];
        data?.forEach((ek) => {
          if (el == ek.column) {
            row.push(ek);
          } else {
            row.push({ ...filler, column: el, type: el < ek.column ? 5 : 0 });
          }
        });
        generatedRow.push({
          column: el,
          row: row,
        });
      });

      console.log(generatedRow);

      return generatedRow;
    }

    return [];
  };

  const formatDateTime = (date) => {
    var d = new Date(`${date}Z`),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = "" + d.getFullYear(),
      hour = "" + d.getHours(),
      minute = "" + d.getMinutes(),
      second = "" + d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    if (second.length < 2) second = "0" + second;

    return `${[day, month, year].join("-")} || ${[hour, minute, second].join(
      ":"
    )}`;
  };

  return (
    <div>
      <div
        className="row ml-3 mr-3 p-0 pb-2 pt-2"
        style={{ backgroundColor: "var(--input-bg)" }}
      >
        <div style={{ width: "4rem" }} className="pl-3">
          <b>Timeline</b>
        </div>
        <div className="col-4 py-0 pr-0 pl-4">
          <b>Action</b>
        </div>
        <div className="col-3 py-0 pr-0 pl-3">
          <b>Date</b>
        </div>
        <div className="col-2 p-0">
          <b>Message</b>
        </div>
        <div className="col-2 p-0">
          <b>Note</b>
        </div>
      </div>

      <div
        style={{ width: "4rem", marginTop: "0.8rem" }}
        className="d-flex flex-row mx-0 pl-1 position-absolute ml-3 mr-3"
      >
        {generateRow().map((v) => {
          return (
            <div
              className="d-flex flex-column align-items-center"
              style={{ marginLeft: "0.8rem" }}
            >
              {v.row.map((w, i) => {
                if (w.type === 0) {
                  return (
                    <>
                      {i > 0 && v.row[i-1].type !== 4? <Filler height={22} /> : null}
                      <Filler height={10} />
                    </>
                  );
                }
                if (w.type === 1) {
                  return (
                    <>
                      {i > 0 ? <Join color={columnColor[v.column]} /> : null}
                      <Point color={columnColor[v.column]} />
                    </>
                  );
                }
                if (w.type === 2) {
                  return (
                    <>
                      <Join color={columnColor[v.column]} />
                      <Point color={columnColor[v.column]} />
                      <BranchStartJoin color={columnColor[v.column]} />
                      <Filler height={10} />
                    </>
                  );
                }
                if (w.type === 3) {
                  return (
                    <>
                      <BranchEndJoin color={columnColor[v.column]} />
                      <Point color={columnColor[v.column]} />
                    </>
                  );
                }
                if (w.type === 4) {
                  return (
                    <>
                      <BranchEndJoin color={columnColor[v.column]} />
                      <Point color={columnColor[v.column]} />
                      <BranchStartJoin color={columnColor[v.column]} />
                    </>
                  );
                }
                if (w.type === 5) {
                  return (
                    <>
                      <Join color={columnColor[v.column]} />
                      <SmallJoin color={columnColor[v.column]} />
                    </>
                  );
                }
              })}
            </div>
          );
        })}
      </div>

      {data?.map((v) => {
        return (
          <div className="row ml-3 mr-3 timeline-description">
            <div style={{ width: "4rem" }} className="pl-3"></div>

            <div className="col-4 py-0 pr-0 pl-4">
              <div style={{ height: 32 }} className="d-flex align-items-center">
                <b>{v?.action}</b>
              </div>
            </div>

            <div className="col-3 py-0 pr-0 pl-3">
              <div
                style={{ height: 32, color: "grey" }}
                className="d-flex align-items-center"
              >
                {formatDateTime(v?.timestamp)}
              </div>
            </div>

            <div className="col-2 p-0">
              <div style={{ height: 32 }} className="d-flex align-items-center">
                {v?.message ?? "-"}
              </div>
            </div>

            <div className="col-2 p-0">
              <div style={{ height: 32 }} className="d-flex align-items-center">
                {v?.note ?? "-"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
