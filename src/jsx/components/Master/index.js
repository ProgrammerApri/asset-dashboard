import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Mitra from "../Mitra/Mitra";
import Akun from "./Akun";
import GroupProduk from "./GroupProduk";
import Produk from "./Produk";

const Master = () => {
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
      component: <></>,
    },
    {
      tittle: "Aset",
      icon: "bx-car",
      component: <></>,
    },
  ]);

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Button
          className={`sub-menu mr-4 ${active == i ? "act" : ""}`}
          role="button"
          onClick={() => {
            setActive(i);
          }}
          data-toggle="dropdown"
        >
          <Row className="ml-0 mr-0 align-items-center">
            <div className="sub-icon">
              <i className={`bx ${el.icon}`}></i>
            </div>
            <span className="ml-3 mr-3">{el.tittle}</span>
          </Row>
        </Button>
      );
    });
    return menu;
  };

  return (
    <Row className="mb-0">
      <Col className="col-12">{renderSubMenu()}</Col>
      <Col className="mb-0">{subMenu[active].component}</Col>
    </Row>
  );
};

export default Master;