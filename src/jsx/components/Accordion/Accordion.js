import React, { useEffect, useState } from "react";
import { Card, Accordion } from "react-bootstrap";

const CustomAccordion = ({
  tittle,
  onClick,
  body,
  active,
  defaultActive,
  key,
}) => {

  return (
    <Accordion
      className="accordion"
      defaultActiveKey={`${defaultActive ? "0" : "1"}`}
    >
      <div className="accordion__item" key={key}>
        <Accordion.Toggle
          as={Card.Text}
          eventKey={"0"}
          className={`accordion__header ${active ? "collapsed" : ""}`}
          onClick={onClick}
        >
          <span className="accordion__header--text">{tittle}</span>
          <span className="accordion__header--indicator indicator_bordered"></span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={"0"}>
          <div className="accordion__body--text">
            {/* body of accordion */}
            {body}
          </div>
        </Accordion.Collapse>
      </div>
    </Accordion>
  );
};

export default CustomAccordion;
