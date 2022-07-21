import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import RequestPurchase from "./RequestPurchase";
import PermintaanPO from "./PO";
import ReturBeli from "./ReturBeli";
import FakturPembelian from "./FakturPembelian";
import Order from "./Order";

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
      <TabPanel header="Permintaan Pembelian (RP)">
        <RequestPurchase trigger={trigger} />
      </TabPanel>
      <TabPanel header="Pesanan Pembelian (PO)">
        <PermintaanPO />
      </TabPanel>
      <TabPanel header="Pembelian">
        <Order trigger={trigger}/>
      </TabPanel>
      <TabPanel header="Faktur">
        <FakturPembelian trigger={trigger}/>
      </TabPanel>
      <TabPanel header="Retur Pembelian">
        <ReturBeli trigger={trigger}/>
      </TabPanel>
    </TabView>
  );
};

export default TransaksiPembelian;
