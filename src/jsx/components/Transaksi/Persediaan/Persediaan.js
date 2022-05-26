import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import X from "./x";

const Persediaan = () => {
  return (
    <TabView>
      <TabPanel header="x">
          <X/>
      </TabPanel>
    </TabView>
  );
};

export default Persediaan;
