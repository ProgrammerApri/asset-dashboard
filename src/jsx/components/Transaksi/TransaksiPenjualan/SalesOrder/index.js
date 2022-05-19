import React, { useState, useEffect } from "react";
import InputSO from "./InputSO";
import DataSalesOrder from "./DataSalesOrder";

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
  return (
    view[active]
  );
};

export default SalesOrder;
