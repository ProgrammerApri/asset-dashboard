import React from "react";
import Perusahaan from "./Perusahaan";
import { TabView, TabPanel } from 'primereact/tabview';
import Penjualan from "./Penjualan";
import Pembelian from "./Pembelian";
import Pengguna from "./Pengguna";
import SetupAkun from "./SetupAkun";

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
      <TabPanel header="Setup Akun">
        <SetupAkun/>
      </TabPanel>
    </TabView>
  );
};

export default Setup;
