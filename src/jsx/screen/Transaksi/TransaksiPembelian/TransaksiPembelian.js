import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import RequestPurchase from "./RequestPurchase";
import PermintaanPO from "./PO";
import ReturBeli from "./ReturBeli";
import FakturPembelian from "./FakturPembelian";
import Order from "./Order";
import { tr } from "src/data/tr";

const TransaksiPembelian = () => {
  const [active, setActive] = useState(0);
  const [trigger, setTrigger] = useState(0);
  return (
    <TabView
      activeIndex={active}
      onTabChange={({index}) => {
        setActive(index)
        setTrigger(current => current + 1);
      }}
    >
      <TabPanel header={tr[localStorage.getItem("language")].req_pur}>
        <RequestPurchase trigger={trigger} />
      </TabPanel>
      <TabPanel header={tr[localStorage.getItem("language")].ord_pur}>
        <PermintaanPO trigger={trigger}/>
      </TabPanel>
      <TabPanel header={tr[localStorage.getItem("language")].pur}>
        <Order trigger={trigger}/>
      </TabPanel>
      <TabPanel header={tr[localStorage.getItem("language")].fak_pur}>
        <FakturPembelian trigger={trigger}/>
      </TabPanel>
      <TabPanel header={tr[localStorage.getItem("language")].ret_pur}>
        <ReturBeli trigger={trigger}/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPembelian;
