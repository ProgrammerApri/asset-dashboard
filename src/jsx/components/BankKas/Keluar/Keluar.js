import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import Y from "./y";

const Keluar = () => {
  return (
    <TabView>
      <TabPanel header="Y">
          <Y/>
      </TabPanel>
      
    </TabView>
  );
};


export default Keluar;
