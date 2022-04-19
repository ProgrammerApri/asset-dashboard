import React from "react";
import Perusahaan from "./Perusahaan";
import { TabView, TabPanel } from 'primereact/tabview';
import Penjualan from "./Penjualan";
import Pembelian from "./Pembelian";
import Pengguna from "./Pengguna";

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
    </TabView>
  );
};

export default Setup;
