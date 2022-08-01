import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Batch from "./Batchh";
import Formula from "./Formula";
import Mesin from "./Mesin";
import Planning from "./Planning";



const Produksi = () => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Mesin",
      icon: "bx-receipt",
      component: <Mesin />,
    },
    {
      tittle: "Planning",
      icon: "bx-receipt",
      component: <Planning />,
    },
    {
      tittle: "Formula",
      icon: "bx-receipt",
      component: <Formula/>,
    },
    {
    tittle: "Batch",
      icon: "bx-receipt",
      component: <Batch/>,
    },
  ]);

  const renderSubMenu = () => {
    let menu = [];

    subMenu.forEach((el, i) => {
      menu.push(
        <Button
          className={`sub-menu mr-4 mb-4 ${active == i ? "act" : ""}`}
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
      <Col className="col-12 pb-0">
        <div className="">{renderSubMenu()}</div>
      </Col>
      <Col className="pt-0 p-component">{subMenu[active].component}</Col>
    </Row>
  );
};

export default Produksi;
