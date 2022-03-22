import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Dropdown,
  Pagination,
} from "react-bootstrap";

const PaginatedTable = ({ header, body, tittle }) => {
  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{tittle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <div id="example_wrapper" className="dataTables_wrapper">
            <Table responsive>
              <thead>
                <tr role="row">
                  {data.patientTable.columns.map((d, i) => (
                    <th key={i}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobData.current.map((d, i) => (
                  <tr key={i}>
                    {d.map((da, ii) => {
                      return (
                        <td key={ii}>
                          {da === "Recovered" ? (
                            <Badge variant="success light">
                              <i className="fa fa-circle text-success mr-1"></i>
                              Recovered
                            </Badge>
                          ) : da === "New Patient" ? (
                            <Badge variant="danger light">
                              <i className="fa fa-circle text-danger mr-1"></i>
                              New Patient
                            </Badge>
                          ) : da === "In Treatment" ? (
                            <Badge variant="warning light">
                              <i className="fa fa-circle text-warning mr-1"></i>
                              In Treatment
                            </Badge>
                          ) : (
                            da
                          )}
                        </td>
                      );
                    })}
                    <td>
                      <div className="d-flex">
                        <Link
                          to="#"
                          className="btn btn-secondary shadow btn-xs sharp mr-1"
                        >
                          <i className="fa fa-eye"></i>
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-primary shadow btn-xs sharp mr-1"
                        >
                          <i className="fa fa-pencil"></i>
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-danger shadow btn-xs sharp"
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="dataTables_info">
                Menampilkan {activePag.current * sort + 1} -
                {` ${
                  data.patientTable.data.length < (activePag.current + 1) * sort
                    ? data.patientTable.data.length
                    : (activePag.current + 1) * sort
                } `}
                dari {data.patientTable.data.length} data
              </div>
              <div className="dataTables_paginate paging_simple_numbers">
                <Pagination
                  className="pagination-primary pagination-circle"
                  size="lg"
                >
                  <li
                    className="page-item page-indicator "
                    onClick={() =>
                      activePag.current > 0 && onClick(activePag.current - 1)
                    }
                  >
                    <Link className="page-link" to="#">
                      <i className="la la-angle-left" />
                    </Link>
                  </li>
                  {jobPagination.map((number, i) => (
                    <Pagination.Item
                      className={activePag.current === i ? "active" : ""}
                      onClick={() => onClick(i)}
                    >
                      {number}
                    </Pagination.Item>
                  ))}
                  <li
                    className="page-item page-indicator"
                    onClick={() =>
                      activePag.current + 1 < jobPagination.length &&
                      onClick(activePag.current + 1)
                    }
                  >
                    <Link className="page-link" to="#">
                      <i className="la la-angle-right" />
                    </Link>
                  </li>
                </Pagination>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default PaginatedTable;
