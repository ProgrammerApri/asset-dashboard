import React from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import Menu from "./Menu";
import SetupPenggunaa from "./SetupPenggunaa";

const Setup = () => {
  return (
    <TabView>
      <TabPanel header="Pengguna">
        <SetupPenggunaa/>
      </TabPanel>
      <TabPanel header="Menu">
        <Menu/>
      </TabPanel>     
    </TabView>
  );
};

export default Setup;
