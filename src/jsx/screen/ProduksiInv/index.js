import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { tr } from "../../../data/tr";
// import BiayaPanen from "../Transaksi/TransaksiPembelian/BiayaPanen";
import DirectBatch from "./DirectBatchh";
import DirectBatchRM from "./DirectBatchhRM";
import Formula from "./Formula";
import Mesin from "./Mesin";
import PanenProduk from "./PanenProduk";
import Pembebanan from "./Pembebanan";
import PerubahanProduk from "./PerubahanProduk";
import { useSelector } from "react-redux";
import UsageMaterial from "./UsageMaterial";

const ProduksiInv = (self) => {
  const [active, setActive] = useState(0);
  const accessMenu = useSelector((state) => state.profile.profile?.menu);
  const [subMenu, setSubMenu] = useState([]);

  useEffect(() => {
    let sub = [];
    accessMenu
      ?.filter((v) => v.route_name === "produksi" && v.view)
      ?.map((el) => {
        el.submenu.forEach((e) => {
          if (e.view) {
            switch (e.route_name) {
              case "mesin":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].mesin,
                  icon: "bx-receipt",
                  component: <Mesin />,
                });
                break;
              case "formula":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].forml,
                  icon: "bx-receipt",
                  component: <Formula />,
                });
                break;
              case "biaya-pemakaian-bahan":
                sub.push({
                  tittle: "Biaya Pemakaian Bahan",
                  icon: "bx-receipt",
                  component: <UsageMaterial />,
                });
                break;
              case "pemakaian-bahan":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].pemakaian_mat,
                  icon: "bx-receipt",
                  component: <DirectBatchRM />,
                });
                break;
              case "produk-jadi":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].prod_jd,
                  icon: "bx-receipt",
                  component: <DirectBatch />,
                });
                break;
              case "panen":
                sub.push({
                  tittle: "Panen",
                  icon: "bx-receipt",
                  component: <PanenProduk />,
                });
                break;
              case "pembebanan":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].pbb,
                  icon: "bx-receipt",
                  component: <Pembebanan />,
                });
                break;
              case "perubahan-produk":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].perubahan_prod,
                  icon: "bx-receipt",
                  component: <PerubahanProduk />,
                });
                break;

              default:
                break;
            }
          }
        });
      });

    console.log(sub);
    setSubMenu(sub);
  }, []);

  let id =
    subMenu.findIndex(
      (e) =>
        e.tittle.toLowerCase() ===
        self?.match?.params?.active?.replaceAll("-", " ")
    ) < 0
      ? 0
      : subMenu.findIndex(
          (e) =>
            e.tittle.toLowerCase() ===
            self?.match?.params?.active?.replaceAll("-", " ")
        );

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Link to={"/produksi/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
          <Button
            className={`sub-menu mr-4 mb-4 ${id == i ? "act" : ""}`}
            role="button"
            data-toggle="dropdown"
          >
            <Row className="ml-0 mr-0 align-items-center">
              <div className="sub-icon">
                <i className={`bx ${el.icon}`}></i>
              </div>
              <span className="ml-3 mr-3">{el.tittle}</span>
            </Row>
          </Button>
        </Link>
      );
    });
    return menu;
  };

  return (
    <Row className="mb-0">
      <Col className="col-12 pb-0">{renderSubMenu()}</Col>
      <Col className="mb-0 pt-0">
        {subMenu.length ? subMenu[id].component : ""}
      </Col>
    </Row>
  );
};

export default ProduksiInv;
