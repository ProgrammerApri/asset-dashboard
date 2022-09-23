import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Bank from "../MasterLainnya/Bank";
import Mitra from "../Mitra/Mitra";
import Akun from "./Akun";
import GroupProduk from "./GroupProduk";
import Jasa from "./Jasa";
import Lokasi from "./Lokasi";
import Pajak from "./Pajak";
import Produk from "./Produk";

const Master = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "akun",
      icon: "bx-category-alt",
      component: <Akun />,
    },
    {
      tittle: "mitra",
      icon: "bx-shape-circle",
      component: <Mitra />,
    },
    {
      tittle: "Bank",
      icon: "bx-money-withdraw",
      component: <Bank />,
    },
    {
      tittle: "grup produk",
      icon: "bx-cabinet",
      component: <GroupProduk />,
    },
    {
      tittle: "produk",
      icon: "bx-archive",
      component: <Produk />,
    },
    {
      tittle: "Gudang",
      icon: "bx-building",
      component: <Lokasi/>,
    },
    
  ]);

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
        <Link to={"/master/" + el.tittle.toLowerCase().replaceAll(" ", "-")}>
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
      <Col className="mb-0 pt-0">{subMenu[id].component}</Col>
    </Row>
  );
};

export default Master;
