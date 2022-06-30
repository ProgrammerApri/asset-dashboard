import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import X from "./x";

const Masuk = () => {
  return (
    <TabView>
      <TabPanel header="X">
          <X/>
      </TabPanel>
      
    </TabView>
  );
};


export default Masuk;
