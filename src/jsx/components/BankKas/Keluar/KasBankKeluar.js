import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import PelunasanHutang from "./PelunasanHutang";
import KasBankOutList from "./PelunasanHutang/KasBankKeluarList";

const KasBankKeluar = () => {
  return (
    <TabView>
      <TabPanel header="Pengeluaran">
          <PelunasanHutang/>
      </TabPanel>
      {/* <TabPanel header="Pencairan Giro">
          <Y/>
      </TabPanel>
      <TabPanel header="Koreksi Hutang">
          <Y/>
      </TabPanel> */}
    </TabView>
  );
};


export default KasBankKeluar;
