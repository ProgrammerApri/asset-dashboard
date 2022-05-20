import React, { useState, useEffect } from "react";
import DataSalesOrder from "./DataSalesOrder";
import InputSO from "./InputSO";

const SalesOrder = () => {
  const [active, setActive] = useState(0);
  const [view, setView] = useState([
    <DataSalesOrder
      onAdd={() => {
        setActive(1);
      }}
    />,
    <InputSO onCancel={() => setActive(0)} onSubmit={() => {}} />,
  ]);
  return view[active];
};

export default SalesOrder;
