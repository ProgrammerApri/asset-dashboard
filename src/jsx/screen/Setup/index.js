import React from "react";
import Perusahaan from "./Perusahaan";
import { TabView, TabPanel } from 'primereact/tabview';
import Penjualan from "./Penjualan";
import Pembelian from "./Pembelian";
import Pengguna from "./Pengguna";
import SetupAkun from "./SetupAkun";
import SetupNeraca from "./SetupNeraca";
import SetupPnl from "./SetupPnl";
import Menu from "./Menu";

const Setup = () => {
  return (
    <TabView>
      <TabPanel header="Perusahaan">
          <Perusahaan/>
      </TabPanel>
      <TabPanel header="Penjualan">
        <Penjualan/>
      </TabPanel>
      <TabPanel header="Pembelian">
        <Pembelian/>
      </TabPanel>
      <TabPanel header="Pengguna">
        <Pengguna/>
      </TabPanel>
      <TabPanel header="Menu">
        <Menu/>
      </TabPanel>
      <TabPanel header="Setup Akun">
        <SetupAkun/>
      </TabPanel>
      <TabPanel header="Setup Neraca">
        <SetupNeraca/>
      </TabPanel>
      <TabPanel header="Setup P/L">
        <SetupPnl/>
      </TabPanel>
    </TabView>
  );
};

export default Setup;
