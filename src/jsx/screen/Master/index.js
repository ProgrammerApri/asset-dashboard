import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { tr } from "src/data/tr";
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
  const accessMenu = useSelector((state) => state.profile.profile?.menu);
  const [subMenu, setSubMenu] = useState([]);

  useEffect(() => {
    let sub = [];
    accessMenu
      ?.filter((v) => v.route_name === "master" && v.view)
      ?.map((el) => {
        el.submenu.forEach((e) => {
          if (e.view) {
            switch (e.route_name) {
              case "akun":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].akun,
                  icon: e.icon_file,
                  component: <Akun edit={e.edit} del={e.delete} />,
                });
                break;
              case "mitra":
                let last = [];
                e.lastmenu.forEach((x) => {
                  if (x.view) {
                    last.push(x);
                  }
                });
                if (last.length) {
                  sub.push({
                    tittle: tr[localStorage.getItem("language")].mitra,
                    icon: e.icon_file,
                    component: <Mitra item={last} />,
                  });
                }
                break;
              case "bank":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].bank,
                  icon: e.icon_file,
                  component: <Bank edit={e.edit} del={e.delete} />,
                });
                break;
              case "group-produk":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].g_prod,
                  icon: e.icon_file,
                  component: <GroupProduk edit={e.edit} del={e.delete} />,
                });
                break;
              case "produk":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].prod,
                  icon: e.icon_file,
                  component: <Produk edit={e.edit} del={e.delete} />,
                });
                break;
              case "gudang":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].gudang,
                  icon: e.icon_file,
                  component: <Lokasi edit={e.edit} del={e.delete} />,
                });
                break;
              case "asset":
                sub.push({
                  tittle: tr[localStorage.getItem("language")].asset,
                  icon: e.icon_file,
                  component: <Lokasi edit={e.edit} del={e.delete} />,
                });
                break;

              default:
                break;
            }
          }
        });
      });

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
      <Col className="mb-0 pt-0">
        {subMenu.length ? subMenu[id].component : ""}
      </Col>
    </Row>
  );
};

export default Master;
