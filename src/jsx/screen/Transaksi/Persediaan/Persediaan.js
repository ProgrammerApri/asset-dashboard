import { current } from "@reduxjs/toolkit";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useState } from "react";
import { tr } from "src/data/tr";
import KoreksiStok from "./KoreksiPersediaan";
import MutasiLokasi from "./MutasiAntarLokasi";
import PemakaianBahan from "./PemakaianBahan";
import PenerimaanHasil from "./PenerimaanHasilJadi";

const Persediaan = () => {
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
      <TabPanel header={tr[localStorage.getItem("language")].mutasi}>
        <MutasiLokasi trigger={trigger} />
      </TabPanel>
      <TabPanel header="Koreksi Persediaan">
        <KoreksiStok trigger={trigger} />
      </TabPanel>
      {/* <TabPanel header="Pemakaian Bahan Baku">
        <PemakaianBahan trigger={trigger} />
      </TabPanel>
      <TabPanel header="Penerimaan Hasil Jadi">
        <PenerimaanHasil trigger={trigger} />
      </TabPanel> */}
    </TabView>
  );
};

export default Persediaan;
