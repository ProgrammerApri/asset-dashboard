import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import KoreksiStok from "./KoreksiPersediaan";
import MutasiLokasi from "./MutasiAntarLokasi";

const Persediaan = () => {
  return (
    <TabView>
      <TabPanel header="Koreksi Persediaan">
          <KoreksiStok/>
      </TabPanel>
      <TabPanel header="Mutasi Antar Lokasi">
          <MutasiLokasi/>
      </TabPanel>
      
    </TabView>
  );
};


export default Persediaan;
