import React from "react";
import Customer from "./Customer";
import { TabView, TabPanel } from 'primereact/tabview';
import Pemasok from "./Pemasok";

const Mitra = () => {
  return (
    <TabView>
      <TabPanel header="Pelanggan">
          <Customer/>
      </TabPanel>
      <TabPanel header="Pemasok">
        <Pemasok/>
      </TabPanel>
    </TabView>
  );
};

export default Mitra;
