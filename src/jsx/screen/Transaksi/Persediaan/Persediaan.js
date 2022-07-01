import { TabView, TabPanel } from "primereact/tabview";
import React from "react";
import KoreksiStok from "./KoreksiPersediaan";
import MutasiLokasi from "./MutasiAntarLokasi";
import PemakaianBahan from "./PemakaianBahan";
import PenerimaanHasil from "./PenerimaanHasilJadi";

const Persediaan = () => {
  return (
    <TabView>
      <TabPanel header="Koreksi Persediaan">
          <KoreksiStok/>
      </TabPanel>
      <TabPanel header="Mutasi Antar Lokasi">
          <MutasiLokasi/>
      </TabPanel>
      <TabPanel header="Pemakaian Bahan Baku">
          <PemakaianBahan/>
      </TabPanel>
      <TabPanel header="Penerimaan Hasil Jadi">
          <PenerimaanHasil/>
      </TabPanel>
      
    </TabView>
  );
};


export default Persediaan;
