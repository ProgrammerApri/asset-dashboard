// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { request, endpoints } from "src/utils";
// import { Row, Col, Card } from "react-bootstrap";
// import { Button as PButton } from "primereact/button";
// import { Link } from "react-router-dom";
// import { InputText } from "primereact/inputtext";
// import { Toast } from "primereact/toast";
// import { Dropdown } from "primereact/dropdown";
// import { Divider } from "@material-ui/core";
// import { Calendar } from "primereact/calendar";
// import { InputSwitch } from "primereact/inputswitch";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import CustomAccordion from "src/jsx/components/Accordion/Accordion";
// import { SET_CURRENT_FM } from "src/redux/actions";
// import DataSupplier from "src/jsx/screen/Mitra/Pemasok/DataPemasok";
// import DataRulesPay from "src/jsx/screen/MasterLainnya/RulesPay/DataRulesPay";
// import DataProduk from "src/jsx/screen/Master/Produk/DataProduk";
// import DataJasa from "src/jsx/screen/Master/Jasa/DataJasa";
// import DataSatuan from "src/jsx/screen/MasterLainnya/Satuan/DataSatuan";
// import { SelectButton } from "primereact/selectbutton";
// 
// import CustomDropdown from "src/jsx/components/CustomDropdown/CustomDropdown";
// import DataLokasi from "src/jsx/screen/Master/Lokasi/DataLokasi";
// import DataPusatBiaya from "src/jsx/screen/MasterLainnya/PusatBiaya/DataPusatBiaya";
// import PrimeCalendar from "src/jsx/components/PrimeCalendar/PrimeCalendar";
// import PrimeInput from "src/jsx/components/PrimeInput/PrimeInput";
// import PrimeNumber from "src/jsx/components/PrimeNumber/PrimeNumber";

// const defError = {
//   code: false,
//   date: false,
//   sup: false,
//   rul: false,
//   prod: [
//     {
//       id: false,
//       lok: false,
//       jum: false,
//       prc: false,
//     },
//   ],
//   jasa: [
//     {
//       id: false,
//       jum: false,
//     },
//   ],
// };

// const InputMesin = ({ onCancel, onSuccess }) => {
//   const fm = useSelector((state) => state.forml.current);
//   const [dept, setDept] = useState(null);
//   const [po, setPO] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [supplier, setSupplier] = useState(null);
//   const [rulesPay, setRulesPay] = useState(null);
//   const [pajak, setPajak] = useState(null);
//   const [product, setProduct] = useState(null);
//   const [jasa, setJasa] = useState(null);
//   const [satuan, setSatuan] = useState(null);
//   const [lokasi, setLokasi] = useState(null);
//   const [showSupplier, setShowSupplier] = useState(false);
//   const [showRulesPay, setShowRulesPay] = useState(false);
//   const [showDept, setShowDept] = useState(false);
//   const [showProduk, setShowProduk] = useState(false);
//   const [showJasa, setShowJasa] = useState(false);
//   const [showSatuan, setShowSatuan] = useState(false);
//   const [showLok, setShowLok] = useState(false);
//   const isEdit = useSelector((state) => state.forml.editForml);
//   const [update, setUpdate] = useState(false);
//   const toast = useRef(null);
//   const [doubleClick, setDoubleClick] = useState(false);
//   const [isRp, setRp] = useState(true);
//   const [isRpJasa, setRpJasa] = useState(true);
//   const [error, setError] = useState(defError);
//   const dispatch = useDispatch();
//   const [accor, setAccor] = useState({
//     produk: true,
//     jasa: false,
//   });

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "smooth",
//     });
//   }, []);

//   const editODR = async () => {
//     const config = {
//       ...endpoints.editODR,
//       endpoint: endpoints.editODR.endpoint + fm.id,
//       data: fm,
//     };
//     console.log(config.data);
//     let response = null;
//     try {
//       response = await request(null, config);
//       console.log(response);
//       if (response.status) {
//         onSuccess();
//       }
//     } catch (error) {
//       setTimeout(() => {
//         setUpdate(false);
//         toast.current.show({
//           severity: "error",
//           summary: "Gagal",
//           detail: "Gagal Memperbarui Data",
//           life: 3000,
//         });
//       }, 500);
//     }
//   };

//   const addODR = async () => {
//     const config = {
//       ...endpoints.addODR,
//       data: fm,
//     };
//     console.log(config.data);
//     let response = null;
//     try {
//       response = await request(null, config);
//       console.log(response);
//       if (response.status) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.log(error);
//       if (error.status === 400) {
//         setTimeout(() => {
//           setUpdate(false);
//           toast.current.show({
//             severity: "error",
//             summary: "Gagal",
//             detail: `Kode ${fm.ord_code} Sudah Digunakan`,
//             life: 3000,
//           });
//         }, 500);
//       } else {
//         setTimeout(() => {
//           setUpdate(false);
//           toast.current.show({
//             severity: "error",
//             summary: "Gagal",
//             detail: "Gagal Memperbarui Data",
//             life: 3000,
//           });
//         }, 500);
//       }
//     }
//   };

//   const checkUnit = (value) => {
//     let selected = {};
//     satuan?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checkProd = (value) => {
//     let selected = {};
//     product?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checkSupp = (value) => {
//     let selected = {};
//     supplier?.forEach((element) => {
//       if (value === element.supplier.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checkPO = (value) => {
//     let selected = {};
//     po?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checkDept = (value) => {
//     let selected = {};
//     dept?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checkpjk = (value) => {
//     let selected = {};
//     pajak?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checkLoc = (value) => {
//     let selected = {};
//     lokasi?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const checRulPay = (value) => {
//     let selected = {};
//     rulesPay?.forEach((element) => {
//       if (value === element.id) {
//         selected = element;
//       }
//     });

//     return selected;
//   };

//   const onSubmit = () => {
//     if (isValid()) {
//       if (isEdit) {
//         setUpdate(true);
//         editODR();
//       } else {
//         setUpdate(true);
//         addODR();
//       }
//     }
//   };

//   const updateFm = (e) => {
//     dispatch({
//       type: SET_CURRENT_FM,
//       payload: e,
//     });
//   };

//   const getSubTotalBarang = () => {
//     let total = 0;
//     fm?.dprod?.forEach((el) => {
//       if (el.nett_price && el.nett_price > 0) {
//         total += parseInt(el.nett_price);
//       } else {
//         total += el.total - (el.total * el.disc) / 100;
//       }
//     });

//     return total;
//   };

//   const formatIdr = (value) => {
//     return `${value}`
//       .replace(".", ",")
//       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//   };

//   const formatDate = (date) => {
//     var d = new Date(`${date}Z`),
//       month = "" + (d.getMonth() + 1),
//       day = "" + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;

//     return [year, month, day].join("-");
//   };

//   const header = () => {
//     return (
//       <h4 className="mb-5">
//         <b>{isEdit ? "Edit" : "Buat"} Pembelian</b>
//       </h4>
//     );
//   };

//   const isValid = () => {
//     // let valid = false;
//     // let errors = {
//     //   code: !order.ord_code || order.ord_code === "",
//     //   date: !order.ord_date || order.ord_date === "",
//     //   sup: !order.sup_id,
//     //   rul: !order.top,
//     //   prod: [],
//     //   jasa: [],
//     // };

//     // order?.dprod.forEach((element, i) => {
//     //   if (i > 0) {
//     //     if (
//     //       element.prod_id ||
//     //       element.location ||
//     //       element.order ||
//     //       element.price
//     //     ) {
//     //       errors.prod[i] = {
//     //         id: !element.prod_id,
//     //         lok: !element.location,
//     //         jum:
//     //           !element.order || element.order === "" || element.order === "0",
//     //         prc:
//     //           !element.price || element.price === "" || element.price === "0",
//     //       };
//     //     }
//     //   } else {
//     //     errors.prod[i] = {
//     //       id: !element.prod_id,
//     //       lok: !element.location,
//     //       jum: !element.order || element.order === "" || element.order === "0",
//     //       prc: !element.price || element.price === "" || element.price === "0",
//     //     };
//     //   }
//     // });

//     // fm?.djasa.forEach((element, i) => {
//     //   if (i > 0) {
//     //     if (element.jasa_id || element.order) {
//     //       errors.jasa[i] = {
//     //         id: !element.jasa_id,
//     //         jum:
//     //           !element.order || element.order === "" || element.order === "0",
//     //       };
//     //     }
//     //   } else {
//     //     errors.jasa[i] = {
//     //       id: !element.jasa_id,
//     //       jum: !element.order || element.order === "" || element.order === "0",
//     //     };
//     //   }
//     // });

//     // if (
//     //   !errors.prod[0].id &&
//     //   !errors.prod[0].lok &&
//     //   !errors.prod[0].jum &&
//     //   !errors.prod[0].prc
//     // ) {
//     //   errors.jasa?.forEach((e) => {
//     //     for (var key in e) {
//     //       e[key] = false;
//     //     }
//     //   });
//     // }

//     // if (fm?.djasa.length) {
//     //   if (!errors.jasa[0]?.id && !errors.jasa[0]?.jum) {
//     //     errors.prod?.forEach((e) => {
//     //       for (var key in e) {
//     //         e[key] = false;
//     //       }
//     //     });
//     //   }
//     // }

//     // let validProduct = false;
//     // let validJasa = false;
//     // errors.prod?.forEach((el) => {
//     //   for (var k in el) {
//     //     validProduct = !el[k];
//     //   }
//     // });
//     // if (!validProduct) {
//     //   errors.jasa.forEach((el) => {
//     //     for (var k in el) {
//     //       validJasa = !el[k];
//     //     }
//     //   });
//     // }

//     // valid =
//     //   !errors.code &&
//     //   !errors.date &&
//     //   !errors.sup &&
//     //   !errors.rul &&
//     //   (validProduct || validJasa);

//     // setError(errors);

//     // if (!valid) {
//     //   window.scrollTo({
//     //     top: 180,
//     //     left: 0,
//     //     behavior: "smooth",
//     //   });
//     // }

//     // return valid;
//   };

//   const body = () => {
//     return (
//       <>
//         {/* Put content body here */}
//         <Toast ref={toast} />

//         <Row className="mb-4">
//           <div className="col-4">
//             <PrimeInput
//               label={"Kode Pembelian"}
//               value={fm.ord_code}
//               onChange={(e) => {
//                 updateFm({ ...fm, ord_code: e.target.value });
//                 let newError = error;
//                 newError.code = false;
//                 setError(newError);
//               }}
//               placeholder="Masukan Kode Pembelian"
//               error={error?.code}
//             />
//           </div>

//           <div className="col-2">
//             <PrimeCalendar
//               label={"Tanggal"}
//               value={new Date(`${fm.ord_date}Z`)}
//               onChange={(e) => {
//                 let result = null;
//                 if (fm.top) {
//                   result = new Date(e.value);
//                   result.setDate(result.getDate() + checRulPay(fm?.top)?.day);
//                   console.log(result);
//                 }
//                 updateFm({ ...fm, ord_date: e.value, due_date: result });

//                 let newError = error;
//                 newError.date = false;
//                 setError(newError);
//               }}
//               placeholder="Pilih Tanggal"
//               showIcon
//               dateFormat="dd-mm-yy"
//               error={error?.date}
//             />
//           </div>

//           <div className="col-12 mt-2">
//             <span className="fs-14">
//               <b>Informasi PO</b>
//             </span>
//             <Divider className="mt-1"></Divider>
//           </div>

//           <div className="col-6">
//             <label className="text-label">No. Pesanan Pembelian</label>
//             <div className="p-inputgroup"></div>
//             <CustomDropdown
//               value={fm.po_id !== null ? checkPO(fm.po_id) : null}
//               onChange={(e) => {
//                 let result = new Date(`${fm.ord_date}Z`);
//                 result.setDate(result.getDate() + checRulPay(e.top?.id)?.day);
//                 updateFm({
//                   ...fm,
//                   po_id: e.id,
//                   top: e.top?.id ?? null,
//                   due_date: result,
//                   sup_id: e.sup_id?.id ?? null,
//                   dep_id: e.preq_id?.req_dep?.id ?? null,
//                   split_inv: e.split_inv,
//                   dprod: e.pprod,
//                   djasa: e.pjasa,
//                 });
//                 let newError = error;
//                 newError.sup = false;
//                 newError.rul = false;
//                 newError.prod[0].id = false;
//                 newError.prod[0].jum = false;
//                 newError.prod[0].prc = false;
//                 newError.jasa[0].id = false;
//                 newError.jasa[0].jum = false;
//                 setError(newError);
//               }}
//               placeholder="Pilih No. Pesanan Pembelian"
//               option={po}
//               label={"[po_code]"}
//             />
//           </div>

//           <div className="col-6">
//             <label className="text-label">Departemen</label>
//             <div className="p-inputgroup"></div>
//             <CustomDropdown
//               value={fm.dep_id !== null ? checkDept(fm.dep_id) : null}
//               option={dept}
//               onChange={(e) => {
//                 updateFm({ ...fm, dep_id: e.id });
//               }}
//               placeholder="Departemen"
//               detail
//               onDetail={() => setShowDept(true)}
//               label={"[ccost_code] ([ccost_name])"}
//               disabled={fm && fm.po_id !== null}
//             />
//           </div>

//           <div className="col-12 mt-2">
//             <span className="fs-14">
//               <b>Informasi Supplier</b>
//             </span>
//             <Divider className="mt-1"></Divider>
//           </div>

//           <div className="col-3">
//             <label className="text-label">Supplier</label>
//             <div className="p-inputgroup"></div>
//             <CustomDropdown
//               value={fm.sup_id !== null ? checkSupp(fm.sup_id) : null}
//               option={supplier}
//               onChange={(e) => {
//                 updateFm({ ...fm, sup_id: e.supplier.id });
//                 let newError = error;
//                 newError.sup = false;
//                 setError(newError);
//               }}
//               placeholder="Pilih Supplier"
//               detail
//               onDetail={() => setShowSupplier(true)}
//               label={"[supplier.sup_code] ([supplier.sup_name])"}
//               disabled={fm && fm.po_id !== null}
//               errorMessage="Supplier Belum Dipilih"
//               error={error?.sup}
//             />
//           </div>

//           <div className="col-3">
//             <label className="text-label">Alamat Supplier</label>
//             <div className="p-inputgroup">
//               <InputText
//                 value={
//                   fm.sup_id !== null
//                     ? checkSupp(fm.sup_id)?.supplier?.sup_address
//                     : ""
//                 }
//                 placeholder="Alamat Supplier"
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="col-3">
//             <PrimeInput
//               label={"No. Telepon"}
//               isNumber
//               value={
//                 fm.sup_id !== null
//                   ? checkSupp(fm.sup_id)?.supplier?.sup_telp1
//                   : ""
//               }
//               placeholder="No. Telepon"
//               disabled
//             />
//           </div>

//           <div className="col-3">
//             <label className="text-label">Jenis Pajak</label>
//             <div className="p-inputgroup">
//               <InputText
//                 value={
//                   fm.sup_id !== null
//                     ? checkpjk(checkSupp(fm.sup_id)?.supplier?.sup_ppn).name
//                     : null
//                 }
//                 placeholder="Jenis Pajak"
//                 disabled
//               />
//             </div>
//           </div>

//           <div className="col-12 mt-2">
//             <span className="fs-14">
//               <b>Informasi Pembayaran</b>
//             </span>
//             <Divider className="mt-1"></Divider>
//           </div>

//           <div className="col-4">
//             <label className="text-label">Syarat Pembayaran</label>
//             <div className="p-inputgroup mt-2"></div>
//             <CustomDropdown
//               value={fm.top !== null ? checRulPay(fm.top) : null}
//               option={rulesPay}
//               onChange={(e) => {
//                 let result = new Date(`${fm.ord_date}Z`);
//                 result.setDate(result.getDate() + e.day);
//                 console.log(result);

//                 updateFm({ ...fm, top: e.id, due_date: result });
//                 let newError = error;
//                 newError.rul = false;
//                 setError(newError);
//               }}
//               placeholder="Pilih Syarat Pembayaran"
//               detail
//               onDetail={() => setShowRulesPay(true)}
//               label={"[name] ([day] Hari)"}
//               errorMessage="Syarat Pembayaran Belum Dipilih"
//               error={error?.rul}
//               disabled={fm && fm.po_id !== null}
//             />
//           </div>

//           <div className="col-4">
//             <label className="text-label">Tanggal Jatuh Tempo</label>
//             <div className="p-inputgroup mt-2">
//               <Calendar
//                 value={new Date(`${fm.due_date}Z`)}
//                 onChange={(e) => {}}
//                 placeholder="Tanggal Jatuh Tempo"
//                 disabled
//                 dateFormat="dd-mm-yy"
//               />
//             </div>
//           </div>
//         </Row>

//         <CustomAccordion
//           tittle={"Pembelian Produk"}
//           defaultActive={true}
//           active={accor.produk}
//           onClick={() => {
//             setAccor({
//               ...accor,
//               produk: !accor.produk,
//             });
//           }}
//           key={1}
//           body={
//             <>
//               <DataTable
//                 responsiveLayout="scroll"
//                 value={fm.dprod?.map((v, i) => {
//                   return {
//                     ...v,
//                     index: i,
//                     // order: v?.order ?? 0,
//                     // price: v?.price ?? 0,
//                     // disc: v?.disc ?? 0,
//                     // total: v?.total ?? 0,
//                   };
//                 })}
//                 className="display w-150 datatable-wrapper header-white no-border"
//                 showGridlines={false}
//                 emptyMessage={() => <div></div>}
//               >
//                 <Column
//                   header="Produk"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <CustomDropdown
//                       value={e.prod_id && checkProd(e.prod_id)}
//                       option={product}
//                       onChange={(u) => {
//                         // looping satuan
//                         let sat = [];
//                         satuan.forEach((element) => {
//                           if (element.id === u.unit.id) {
//                             sat.push(element);
//                           } else {
//                             if (element.u_from?.id === u.unit.id) {
//                               sat.push(element);
//                             }
//                           }
//                         });
//                         setSatuan(sat);

//                         let temp = [...fm.dprod];
//                         temp[e.index].prod_id = u.id;
//                         temp[e.index].unit_id = u.unit?.id;
//                         updateFm({ ...fm, dprod: temp });

//                         let newError = error;
//                         newError.prod[e.index].id = false;
//                         setError(newError);
//                       }}
//                       detail
//                       onDetail={() => {
//                         setCurrentIndex(e.index);
//                         setShowProduk(true);
//                       }}
//                       label={"[name]"}
//                       placeholder="Pilih Produk"
//                       disabled={fm && fm.po_id !== null}
//                       errorMessage="Produk Belum Dipilih"
//                       error={error?.prod[e.index]?.id}
//                     />
//                   )}
//                 />

//                 <Column
//                   header="Satuan"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <CustomDropdown
//                       value={e.unit_id && checkUnit(e.unit_id)}
//                       onChange={(u) => {
//                         let temp = [...fm.dprod];
//                         temp[e.index].unit_id = u.id;
//                         updateFm({ ...fm, dprod: temp });
//                       }}
//                       option={satuan}
//                       detail
//                       onDetail={() => {
//                         setCurrentIndex(e.index);
//                         setShowSatuan(true);
//                       }}
//                       label={"[name]"}
//                       placeholder="Pilih Satuan"
//                       disabled={fm && fm.po_id !== null}
//                     />
//                   )}
//                 />

//                 <Column
//                   header="Lokasi"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <CustomDropdown
//                       value={e.location && checkLoc(e.location)}
//                       onChange={(u) => {
//                         let temp = [...fm.dprod];
//                         temp[e.index].location = u.id;
//                         updateFm({ ...fm, dprod: temp });

//                         let newError = error;
//                         newError.prod[e.index].lok = false;
//                         setError(newError);
//                       }}
//                       option={lokasi}
//                       label={"[name]"}
//                       placeholder="Lokasi"
//                       detail
//                       onDetail={() => {
//                         setCurrentIndex(e.index);
//                         setShowLok(true);
//                       }}
//                       errorMessage="Lokasi Belum Dipilih"
//                       error={error?.prod[e.index]?.lok}
//                     />
//                   )}
//                 />

//                 <Column
//                   header="Jumlah"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <PrimeNumber
//                       value={e.order && e.order}
//                       onChange={(u) => {
//                         let temp = [...fm.dprod];
//                         temp[e.index].order = u.target.value;
//                         temp[e.index].total =
//                           temp[e.index].order * temp[e.index].price;
//                         updateFm({ ...fm, dprod: temp });

//                         let newError = error;
//                         newError.prod[e.index].jum = false;
//                         setError(newError);
//                       }}
//                       placeholder="0"
//                       type="number"
//                       min={0}
//                       disabled={fm && fm.po_id !== null}
//                       error={error?.prod[e.index]?.jum}
//                     />
//                   )}
//                 />

//                 <Column
//                   header="Harga Satuan"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <PrimeNumber
//                       value={e.price && e.price}
//                       onChange={(u) => {
//                         let temp = [...fm.dprod];
//                         temp[e.index].price = u.target.value;
//                         temp[e.index].total =
//                           temp[e.index].order * temp[e.index].price;
//                         updateFm({ ...fm, dprod: temp });

//                         let newError = error;
//                         newError.prod[e.index].prc = false;
//                         setError(newError);
//                       }}
//                       placeholder="0"
//                       type="number"
//                       min={0}
//                       disabled={fm && fm.po_id !== null}
//                       error={error?.prod[e.index]?.prc}
//                     />
//                   )}
//                 />

//                 <Column
//                   header="Diskon"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <div className="p-inputgroup">
//                       <InputText
//                         value={e.disc && e.disc}
//                         onChange={(u) => {
//                           let temp = [...fm.dprod];
//                           temp[e.index].disc = u.target.value;
//                           updateFm({ ...fm, dprod: temp });
//                           console.log(temp);
//                         }}
//                         placeholder="0"
//                         type="number"
//                         min={0}
//                         disabled={fm && fm.po_id !== null}
//                       />
//                       <span className="p-inputgroup-addon">%</span>
//                     </div>
//                   )}
//                 />

//                 <Column
//                   header="Harga Nett"
//                   className="align-text-top"
//                   field={""}
//                   body={(e) => (
//                     <div className="p-inputgroup">
//                       <InputText
//                         value={e.nett_price && e.nett_price}
//                         onChange={(u) => {
//                           let temp = [...fm.dprod];
//                           temp[e.index].nett_price = u.target.value;
//                           updateFm({ ...fm, dprod: temp });
//                           console.log(temp);
//                         }}
//                         placeholder="0"
//                         type="number"
//                         min={0}
//                         disabled={fm && fm.po_id !== null}
//                       />
//                     </div>
//                   )}
//                 />

//                 <Column
//                   header="Total"
//                   className="align-text-top"
//                   body={(e) => (
//                     <label className="text-nowrap">
//                       <b>
//                         Rp.{" "}
//                         {`${
//                           e.nett_price && e.nett_price !== 0
//                             ? e.nett_price
//                             : e.total - (e.total * e.disc) / 100
//                         }`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
//                       </b>
//                     </label>
//                   )}
//                 />

//                 <Column
//                   header=""
//                   className="align-text-top"
//                   field={""}
//                   body={(e) =>
//                     e.index === fm.dprod.length - 1 ? (
//                       <Link
//                         onClick={() => {
//                           updateFm({
//                             ...fm,
//                             dprod: [
//                               ...fm.dprod,
//                               {
//                                 id: 0,
//                                 prod_id: null,
//                                 unit_id: null,
//                                 request: null,
//                                 order: null,
//                                 remain: null,
//                                 price: null,
//                                 disc: null,
//                                 nett_price: null,
//                                 total: null,
//                               },
//                             ],
//                           });
//                         }}
//                         className="btn btn-primary shadow btn-xs sharp"
//                         disabled={fm && fm.po_id !== null}
//                       >
//                         <i className="fa fa-plus"></i>
//                       </Link>
//                     ) : (
//                       <Link
//                         onClick={() => {
//                           let temp = [...fm.dprod];
//                           temp.splice(e.index, 1);
//                           updateFm({ ...fm, dprod: temp });
//                         }}
//                         className="btn btn-danger shadow btn-xs sharp"
//                       >
//                         <i className="fa fa-trash"></i>
//                       </Link>
//                     )
//                   }
//                 />
//               </DataTable>
//             </>
//           }
//         />
//       </>
//     );
//   };

//   const footer = () => {
//     return (
//       <div className="mt-5 flex justify-content-end">
//         <div>
//           <PButton
//             label="Batal"
//             onClick={onCancel}
//             className="p-button-text btn-primary"
//           />
//           <PButton
//             label="Simpan"
//             icon="pi pi-check"
//             onClick={onSubmit}
//             autoFocus
//             loading={update}
//           />
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       <Row>
//         <Col className="pt-0">
//           <Card>
//             <Card.Body>
//               {/* {header()} */}
//               {body()}
//               {footer()}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* <DataRulesPay
//         data={rulesPay}
//         loading={false}
//         popUp={true}
//         show={showRulesPay}
//         onHide={() => {
//           setShowRulesPay(false);
//         }}
//         onInput={(e) => {
//           setShowRulesPay(!e);
//         }}
//         onSuccessInput={(e) => {
//           getRulesPay();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowRulesPay(false);
//             updateFm({ ...order, top: e.data.id });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       />

//       <DataPusatBiaya
//         data={dept}
//         loading={false}
//         popUp={true}
//         show={showDept}
//         onHide={() => {
//           setShowDept(false);
//         }}
//         onInput={(e) => {
//           setShowDept(!e);
//         }}
//         onSuccessInput={(e) => {
//           getDept();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowDept(false);
//             updateFm({ ...order, dep_id: e.data.id });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       />

//       <DataSupplier
//         data={supplier}
//         loading={false}
//         popUp={true}
//         show={showSupplier}
//         onHide={() => {
//           setShowSupplier(false);
//         }}
//         onInput={(e) => {
//           setShowSupplier(!e);
//         }}
//         onSuccessInput={(e) => {
//           getSupplier();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowSupplier(false);
//             let temp = [...order.djasa];
//             temp[currentIndex].sup_id = e.data.supplier.id;
//             updateFm({ ...order, sup_id: e.data.supplier.id, djasa: temp });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       />

//       <DataProduk
//         data={product}
//         loading={false}
//         popUp={true}
//         show={showProduk}
//         onHide={() => {
//           setShowProduk(false);
//         }}
//         onInput={(e) => {
//           setShowProduk(!e);
//         }}
//         onSuccessInput={(e) => {
//           getProduct();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowProduk(false);
//             let sat = [];
//             satuan.forEach((element) => {
//               if (element.id === e.data.unit.id) {
//                 sat.push(element);
//               } else {
//                 if (element.u_from?.id === e.data.unit.id) {
//                   sat.push(element);
//                 }
//               }
//             });
//             setSatuan(sat);

//             let temp = [...order.dprod];
//             temp[currentIndex].prod_id = e.data.id;
//             temp[currentIndex].unit_id = e.data.unit?.id;
//             updateFm({ ...order, dprod: temp });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       />

//       <DataJasa
//         data={jasa}
//         loading={false}
//         popUp={true}
//         show={showJasa}
//         onHide={() => {
//           setShowJasa(false);
//         }}
//         onInput={(e) => {
//           setShowJasa(!e);
//         }}
//         onSuccessInput={(e) => {
//           getJasa();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowJasa(false);
//             let temp = [...order.djasa];
//             temp[currentIndex].jasa_id = e.data.jasa.id;
//             updateFm({ ...order, djasa: temp });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       />

//       <DataSatuan
//         data={satuan}
//         loading={false}
//         popUp={true}
//         show={showSatuan}
//         onHide={() => {
//           setShowSatuan(false);
//         }}
//         onInput={(e) => {
//           setShowSatuan(!e);
//         }}
//         onSuccessInput={(e) => {
//           getSatuan();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowSatuan(false);
//             let temp = [...order.dprod];
//             temp[currentIndex].unit_id = e.data.id;

//             let tempj = [...order.djasa];
//             tempj[currentIndex].unit_id = e.data.id;
//             updateFm({ ...order, dprod: temp, djasa: tempj });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       />

//       <DataLokasi
//         data={lokasi}
//         loading={false}
//         popUp={true}
//         show={showLok}
//         onHide={() => {
//           setShowLok(false);
//         }}
//         onInput={(e) => {
//           setShowLok(!e);
//         }}
//         onSuccessInput={(e) => {
//           getSatuan();
//         }}
//         onRowSelect={(e) => {
//           if (doubleClick) {
//             setShowLok(false);
//             let temp = [...order.dprod];
//             temp[currentIndex].location = e.data.id;
//             updateFm({ ...order, dprod: temp });
//           }

//           setDoubleClick(true);

//           setTimeout(() => {
//             setDoubleClick(false);
//           }, 2000);
//         }}
//       /> */}
//     </>
//   );
// };

// export default InputMesin;
