import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import KoreksiPiutang from "./KoreksiPiutang";
import Pemasukan from "./Pemasukan";
import PencairanGiroMasuk from "./PencairanGiro";

const Masuk = () => {
  return (
    <TabView>
      <TabPanel header="Pemasukan">
          <Pemasukan/>
      </TabPanel>
      <TabPanel header="Pencairan Giro Masuk">
          <PencairanGiroMasuk/>
      </TabPanel>
      <TabPanel header="Koreksi Piutang">
          <KoreksiPiutang/>
      </TabPanel>
      
    </TabView>
  );
};


export default Masuk;
