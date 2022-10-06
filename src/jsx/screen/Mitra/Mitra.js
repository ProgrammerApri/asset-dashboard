import React, { useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import Customer from "./Pelanggan";
import Supplier from "./Pemasok";
import { tr } from "src/data/tr";

const Mitra = ({ item }) => {
  let tab = [];

  useEffect(() => {
    item.forEach((el) => {
      switch (el.route_name) {
        case "pelanggan":
          tab.push(
            <TabPanel header={tr[localStorage.getItem("language")].customer}>
              <Customer edit={el.edit} del={el.del}/>
            </TabPanel>
          );
          break;
        case "pemasok":
          tab.push(
            <TabPanel header={tr[localStorage.getItem("language")].supplier}>
              <Supplier edit={el.edit} del={el.del}/>
            </TabPanel>
          );
          break;

        default:
          break;
      }
    });
  }, []);

  return <TabView>{tab}</TabView>;
};

export default Mitra;
