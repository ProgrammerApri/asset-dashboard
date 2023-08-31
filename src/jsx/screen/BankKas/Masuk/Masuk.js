import { current } from "@reduxjs/toolkit";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useState } from "react";
import KoreksiPiutang from "./KoreksiPiutang";
import Pemasukan from "./Pemasukan";
import PencairanGiroMasuk from "./PencairanGiro";

const Masuk = () => {
  const [active, setActive] = useState(0);
  const [trigger, setTrigger] = useState(0);

  return (
    <TabView
      activeIndex={active}
      onTabChange={({ index }) => {
        setActive(index);
        setTrigger((current) => current + 1);
      }}
    >
      <TabPanel header="Pemasukan & Pembayaran">
        <Pemasukan trigger={trigger}/>
      </TabPanel>
      <TabPanel header="Pencairan Giro Masuk">
        <PencairanGiroMasuk />
      </TabPanel>
      <TabPanel header="Koreksi Piutang">
        <KoreksiPiutang trigger={trigger}/>
      </TabPanel>
    </TabView>
  );
};

export default Masuk;
