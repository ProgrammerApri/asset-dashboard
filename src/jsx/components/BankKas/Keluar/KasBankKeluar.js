import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import KoreksiHutangAP from "./KoreksiHutang";
import PelunasanHutang from "./PelunasanHutang";
import KasBankOutList from "./PelunasanHutang/KasBankKeluarList";
import PencairanGiroMundur from "./PencairanGiro";
import PencairanGiroMundurList from "./PencairanGiro/PencairanGiroList";

const KasBankKeluar = () => {
  return (
    <TabView>
      <TabPanel header="Pengeluaran">
          <PelunasanHutang/>
      </TabPanel>
      <TabPanel header="Pencairan Giro">
          <PencairanGiroMundurList/>
      </TabPanel>
      <TabPanel header="Koreksi Hutang">
          <KoreksiHutangAP/>
      </TabPanel>
    </TabView>
  );
};


export default KasBankKeluar;
