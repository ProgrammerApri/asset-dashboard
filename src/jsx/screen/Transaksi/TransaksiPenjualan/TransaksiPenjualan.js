import { current } from "@reduxjs/toolkit";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useState } from "react";
import Penjualan from "./Penjualan";
import ReturPenjualan from "./ReturPenjualan";
import SalesOrder from "./SalesOrder";

const TransaksiPenjualan = () => {
  const [active, setActive] = useState(0);
  const [trigger, setTrigger] = useState(0);
  return (
    <TabView
      activeIndex={active}
      onTabChange={({ index }) => {
        setActive(index);
        setTrigger(current => current + 1);
      }}
    >
      <TabPanel header="Pesanan Penjualan">
        <SalesOrder trigger={trigger}/>
      </TabPanel>
      <TabPanel header="Penjualan">
        <Penjualan trigger={trigger}/>
      </TabPanel>
      <TabPanel header="Retur Penjualan">
        <ReturPenjualan trigger={trigger}/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPenjualan;
