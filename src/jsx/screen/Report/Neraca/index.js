import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReportJurnal from "./Jurnal";
import NeracaPerbandingan from "./NeracaPerbandingan";
import Pnl from "./Pnl";
import ReportKBB from "./KartuBB";
import KartuStock from "./KartuStock";
import Neraca from "./ReportNeraca";
import KBBRincian from "./KbbRincian";
import NeracaSaldo from "./NeracaSaldo";

const LaporanNeraca = (self) => {
  const [active, setActive] = useState(0);
  const [subMenu, setSubMenu] = useState([
    {
      tittle: "Jurnal",
      icon: "bx-spreadsheet",
      component: <ReportJurnal />,
    },
    {
      tittle: "Neraca",
      icon: "bx-spreadsheet",
      component: <Neraca />,
    },
    {
      tittle: "Neraca Perbandingan",
      icon: "bx-spreadsheet",
      component: <NeracaPerbandingan />,
    },
    {
      tittle: "Laba Rugi",
      icon: "bx-spreadsheet",
      component: <Pnl />,
    },

    {
      tittle: "Neraca Saldo",
      icon: "bx-spreadsheet",
      component: <NeracaSaldo />,
    },

    {
      tittle: "Kartu Buku Besar Ringkasan",
      icon: "bx-spreadsheet",
      component: (
        <ReportKBB
          month={
            self?.match?.params?.month &&
            atob(self?.match?.params?.month)?.replace("m'", "")
          }
          year={
            self?.match?.params?.year &&
            atob(self?.match?.params?.year)?.replace("y'", "")
          }
          kategory={
            self?.match?.params?.kat_id &&
            JSON.parse(atob(atob(self?.match?.params?.kat_id))).kat_id
          }
        />
      ),
    },

    {
      tittle: "Kartu Buku Besar Rincian",
      icon: "bx-spreadsheet",
      component: (
        <KBBRincian
          month={
            self?.match?.params?.month &&
            atob(self?.match?.params?.month)?.replace("m'", "")
          }
          year={
            self?.match?.params?.year &&
            atob(self?.match?.params?.year)?.replace("y'", "")
          }
          accId={
            self?.match?.params?.acc_id &&
            JSON.parse(atob(atob(self?.match?.params?.acc_id))).acc_id
          }
        />
      ),
    },
    // {
    //   tittle: "Kartu Stock",
    //   icon: "bx-spreadsheet",
    //   component: <KartuStock />,
    // },
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
        <Link
          to={"/laporan/gl/" + el.tittle.toLowerCase().replaceAll(" ", "-")}
        >
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

export default LaporanNeraca;
