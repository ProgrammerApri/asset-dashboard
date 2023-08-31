import { current } from "@reduxjs/toolkit";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useState } from "react";
import KoreksiHutangAP from "./KoreksiHutang";
import PelunasanHutang from "./PelunasanHutang";
import KasBankOutList from "./PelunasanHutang/KasBankKeluarList";
import PencairanGiroMundur from "./PencairanGiro";
import PencairanGiroMundurList from "./PencairanGiro/PencairanGiroList";

const KasBankKeluar = () => {
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
      <TabPanel header="Pengeluaran & Pembayaran">
        <PelunasanHutang trigger={trigger}/>
      </TabPanel>
      <TabPanel header="Pencairan Giro Keluar">
        <PencairanGiroMundurList />
      </TabPanel>
      <TabPanel header="Koreksi Hutang">
        <KoreksiHutangAP trigger={trigger}/>
      </TabPanel>
    </TabView>
  );
};

export default KasBankKeluar;
