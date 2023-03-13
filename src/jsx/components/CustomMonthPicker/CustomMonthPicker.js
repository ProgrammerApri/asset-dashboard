import { SelectButton } from "primereact/selectbutton";
import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Dropdown } from "primereact/dropdown";

export default function CustomMonthPicker({
  single = false,
  value,
  onChange,
  dropdown = false,
  dyear = false,
}) {
  const [getYear, setYear] = useState(null);

  useEffect(() => {
    let yr = new Date().getFullYear();
    setYear(yr);
    // getYears();
  }, []);

  const getMonthlyDates = (start, count) => {
    var result = [];
    var temp;
    var year = start.getFullYear();
    var month = start.getMonth();
    var startDay = start.getDate();
    for (var i = 0; i < count; i++) {
      temp = new Date(year, month + i, startDay);
      if (temp.getDate() != startDay) temp.setDate(0);
      result.push(temp);
    }
    return result;
  };

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getYears = (start) => {
    var temp = [];
    var start_y = start || 2010;
    while (start_y <= getYear) {
      temp.push(start_y++);
    }
    console.log("==========");
    console.log(temp);
    return temp;
  };

  const year = [
    { name: 2017, code: 2017 },
    { name: 2018, code: 2018 },
    { name: 2019, code: 2019 },
    { name: 2020, code: 2020 },
    { name: 2021, code: 2021 },
    { name: 2022, code: 2022 },
    { name: 2023, code: 2023 },
    { name: 2024, code: 2024 },
    { name: 2025, code: 2025 },
    { name: 2026, code: 2026 },
    { name: 2027, code: 2027 },
    { name: 2028, code: 2028 },
    { name: 2029, code: 2029 },
    { name: 2030, code: 2030 },
  ];

  let option_dropdown = getMonthlyDates(
    new Date(new Date().getFullYear(), 0, 31),
    12
  ).map((v, i) => {
    return {
      code: i + 1,
      name: `${v.getDate()} ${month[v.getMonth()]}`,
    };
  });


  const checkValueDropdown = (data) => {
    let selected = null;
    option_dropdown.forEach((el) => {
      if (el.code === data) {
        selected = el;
      }
    });

    return selected;
  };

  const checkValue = (data) => {
    let option = [
      {
        code: 1,
        name: "Jan",
      },
      {
        code: 2,
        name: "Feb",
      },
      {
        code: 3,
        name: "Mar",
      },
      {
        code: 4,
        name: "Apr",
      },
      {
        code: 5,
        name: "Mei",
      },
      {
        code: 6,
        name: "Jun",
      },
      {
        code: 7,
        name: "Jul",
      },
      {
        code: 8,
        name: "Agu",
      },
      {
        code: 9,
        name: "Sep",
      },
      {
        code: 10,
        name: "Okt",
      },
      {
        code: 11,
        name: "Nov",
      },
      {
        code: 12,
        name: "Des",
      },
    ];

    let selected = null;
    option.forEach((el) => {
      if (el.code === data) {
        selected = el;
      }
    });

    return selected;
  };

  const checkYear = (data) => {
    let selected = null;
    year.forEach((el) => {
      if (el.code === data) {
        selected = el;
      }
    });

    return selected;
  };

  if (dropdown) {
    // console.log(option_dropdown);
    return (
      <Row className="mr-0 ml-0">
        <div className="col-12">
          {/* <label className="text-label">{"Bulan Cutoff"}</label> */}
          <div className="p-inputgroup">
            <Dropdown
              value={checkValueDropdown(value)}
              options={option_dropdown}
              onChange={(e) => {
                onChange(e.value.code);
              }}
              optionLabel="name"
              placeholder="Pilih Bulan"
            />
          </div>
        </div>
      </Row>
    );
  }

  if (dyear) {
    return (
      <Row className="mr-0 ml-0">
        <div className="col-12">
          <div className="p-inputgroup">
            <Dropdown
              value={checkYear(value)}
              options={year}
              onChange={(e) => {
                onChange(e.value.code);
              }}
              optionLabel="name"
              placeholder="Pilih Tahun"
            />
          </div>
        </div>
      </Row>
    );
  }

  return (
    <Row className="mr-0 ml-0">
      {single ? (
        <div className="col-12 mb-2">
          <div className="p-inputgroup">
            <SelectButton
              value={checkValue(value)}
              options={[
                {
                  code: 1,
                  name: "Jan",
                },
                {
                  code: 2,
                  name: "Feb",
                },
                {
                  code: 3,
                  name: "Mar",
                },
                {
                  code: 4,
                  name: "Apr",
                },
                {
                  code: 5,
                  name: "Mei",
                },
                {
                  code: 6,
                  name: "Jun",
                },
                {
                  code: 7,
                  name: "Jul",
                },
                {
                  code: 8,
                  name: "Agu",
                },
                {
                  code: 9,
                  name: "Sep",
                },
                {
                  code: 10,
                  name: "Okt",
                },
                {
                  code: 11,
                  name: "Nov",
                },
                {
                  code: 12,
                  name: "Des",
                },
              ]}
              onChange={(e) => {
                onChange(e.value.code);
              }}
              optionLabel="name"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="col-12 mb-2">
            <div className="p-inputgroup">
              <SelectButton
                value={value <= 6 ? checkValue(value) : null}
                options={[
                  {
                    code: 1,
                    name: "Jan",
                  },
                  {
                    code: 2,
                    name: "Feb",
                  },
                  {
                    code: 3,
                    name: "Mar",
                  },
                  {
                    code: 4,
                    name: "Apr",
                  },
                  {
                    code: 5,
                    name: "Mei",
                  },
                  {
                    code: 6,
                    name: "Jun",
                  },
                ]}
                onChange={(e) => {
                  onChange(e.value.code);
                }}
                optionLabel="name"
              />
            </div>
          </div>
          <div className="col-12 mb-2">
            <div className="p-inputgroup">
              <SelectButton
                value={value > 6 ? checkValue(value) : null}
                options={[
                  {
                    code: 7,
                    name: "Jul",
                  },
                  {
                    code: 8,
                    name: "Agu",
                  },
                  {
                    code: 9,
                    name: "Sep",
                  },
                  {
                    code: 10,
                    name: "Okt",
                  },
                  {
                    code: 11,
                    name: "Nov",
                  },
                  {
                    code: 12,
                    name: "Des",
                  },
                ]}
                onChange={(e) => {
                  onChange(e.value.code);
                }}
                optionLabel="name"
              />
            </div>
          </div>
        </>
      )}
    </Row>
  );
}
