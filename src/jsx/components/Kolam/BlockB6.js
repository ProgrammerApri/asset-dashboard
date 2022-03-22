import React, { useState, useRef } from "react";
import { Table, Pagination, Badge, Dropdown } from "react-bootstrap";

import { Link } from "react-router-dom";
import data from "../../../constants/tableData.js";

const BlockB6 = () => {
   const sort = 3;
   let jobPagination = Array(Math.ceil(data.kolamTable.data.length / sort))
      .fill()
      .map((_, i) => i + 1);

   const activePag = useRef(0);
   const jobData = useRef(
      data.kolamTable.data.slice(
         activePag.current * sort,
         (activePag.current + 1) * sort
      )
   );
   const [demo, setdemo] = useState();
   const onClick = (i) => {
      activePag.current = i;

      jobData.current = data.kolamTable.data.slice(
         activePag.current * sort,
         (activePag.current + 1) * sort
      );
      setdemo(
         data.kolamTable.data.slice(
            activePag.current * sort,
            (activePag.current + 1) * sort
         )
      );
   };
   return (
      <div className="col-12">
         <div className="card">
            <div className="card-header">
               <h4 className="card-title">Data Kolam Block B(6)</h4>
            </div>
            <div className="card-body">
               <Table responsive className="w-100">
                  <div id="example_wrapper" className="dataTables_wrapper">
                     <table id="example" className="display w-100 dataTable">
                        <thead>
                           <tr role="row">
                              {data.kolamTable.columns.map((d, i) => (
                                 <th key={i}>
                                    {i === 0 ? (
                                       <div className="custom-control custom-checkbox">
                                          <input
                                             type="checkbox"
                                             className="custom-control-input"
                                             id="checkAll"
                                             required
                                          />
                                          <label
                                             className="custom-control-label"
                                             htmlFor="checkAll"
                                          />
                                       </div>
                                    ) : (
                                       d
                                    )}
                                 </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody>
                           {jobData.current.map((d, i) => (
                              <tr key={i}>
                                 {d.map((da, ii) => (
                                    <td key={ii}>
                                       {ii === 0 ? (
                                          <div className="custom-control custom-checkbox">
                                             <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={`checkAll${i}`}
                                                required
                                             />
                                             <label
                                                className="custom-control-label"
                                                htmlFor={`checkAll${i}`}
                                             />
                                          </div>
                                       ) : da === "P1" ? (
                                          <Badge variant="success light">
                                             <i className="fa fa-circle text-success mr-1"></i>
                                             P1
                                          </Badge>
                                       ) : da === "P2" ? (
                                          <Badge variant="danger light">
                                             <i className="fa fa-circle text-success mr-1"></i>
                                             P2
                                          </Badge>
                                       ) : da === "P3" ? (
                                          <Badge variant="warning light">
                                             <i className="fa fa-circle text-success mr-1"></i>
                                             P3
                                          </Badge>
                                       ) : da === "P4" ? (
                                        <Badge variant="warning light">
                                           <i className="fa fa-circle text-success mr-1"></i>
                                           P4
                                        </Badge>
                                       ) : da === "FP" ? (
                                        <Badge variant="warning light">
                                           <i className="fa fa-circle text-success mr-1"></i>
                                           FP
                                        </Badge>
                                       ) : ii === 7 ? (
                                          <Dropdown>
                                             <Dropdown.Toggle
                                                variant
                                                className="icon-false table-dropdown"
                                             >
                                                <svg
                                                   width="24px"
                                                   height="24px"
                                                   viewBox="0 0 24 24"
                                                   version="1.1"
                                                >
                                                   <g
                                                      stroke="none"
                                                      stroke-width="1"
                                                      fill="none"
                                                      fill-rule="evenodd"
                                                   >
                                                      <rect
                                                         x="0"
                                                         y="0"
                                                         width="24"
                                                         height="24"
                                                      ></rect>
                                                      <circle
                                                         fill="#000000"
                                                         cx="5"
                                                         cy="12"
                                                         r="2"
                                                      ></circle>
                                                      <circle
                                                         fill="#000000"
                                                         cx="12"
                                                         cy="12"
                                                         r="2"
                                                      ></circle>
                                                      <circle
                                                         fill="#000000"
                                                         cx="19"
                                                         cy="12"
                                                         r="2"
                                                      ></circle>
                                                   </g>
                                                </svg>
                                             </Dropdown.Toggle>
                                             <Dropdown.Menu>
                                                <Dropdown.Item to="#">
                                                   Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item to="#">
                                                   Delete
                                                </Dropdown.Item>
                                             </Dropdown.Menu>
                                          </Dropdown>
                                       ) : (
                                          da
                                       )}
                                    </td>
                                 ))}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="dataTables_info">
                           Showing {activePag.current * sort + 1} to
                           {data.kolamTable.data.length <
                           (activePag.current + 1) * sort
                              ? data.kolamTable.data.length
                              : (activePag.current + 1) * sort}
                           of {data.kolamTable.data.length} entries
                        </div>
                        <div className="dataTables_paginate paging_simple_numbers">
                           <Pagination
                              className="pagination-primary pagination-circle"
                              size="lg"
                           >
                              <li
                                 className="page-item page-indicator "
                                 onClick={() =>
                                    activePag.current > 1 &&
                                    onClick(activePag.current - 1)
                                 }
                              >
                                 <Link className="page-link" to="#">
                                    <i className="la la-angle-left" />
                                 </Link>
                              </li>
                              {jobPagination.map((number, i) => (
                                 <Pagination.Item
                                    className={
                                       activePag.current === i ? "active" : ""
                                    }
                                    onClick={() => onClick(i)}
                                 >
                                    {number}
                                 </Pagination.Item>
                              ))}
                              <li
                                 className="page-item page-indicator"
                                 onClick={() =>
                                    activePag.current + 1 <
                                       jobPagination.length &&
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
               </Table>
            </div>
         </div>
      </div>
   );
};

export default BlockB6;