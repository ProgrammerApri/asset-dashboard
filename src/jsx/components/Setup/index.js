import React from "react";
import Perusahaan from "./Perusahaan";
import { TabView, TabPanel } from 'primereact/tabview';
import Penjualan from "./Penjualan";

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
      </TabPanel>
      <TabPanel header="Pengguna">
      </TabPanel>
    </TabView>
  );
};

export default Setup;
