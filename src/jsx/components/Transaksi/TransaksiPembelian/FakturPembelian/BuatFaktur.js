import React, { useState, useEffect, useRef } from "react";
import { request, endpoints } from "src/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "react-bootstrap";
import { Button as PButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "primereact/calendar";
import CustomAccordion from "src/jsx/components/Accordion/Accordion";
import { InputSwitch } from "primereact/inputswitch";
import { SET_CURRENT_INV } from "src/redux/actions";
import { SelectButton } from "primereact/selectbutton";

const data = {};




const BuatFaktur = ({ onCancel }) => {
  const inv = useSelector((state) => state.inv.current);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const toast = useRef(null);
  const [isEdit, setEdit] = useState(false);
  const [isRp, setRp] = useState(false);
  const [isRpJasa, setRpJasa] = useState(false);
  const dispatch = useDispatch();
  const [accor, setAccor] = useState({
    produk: true,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const editinv = async () => {
    const config = {
      ...endpoints.editinvtur,
      endpoint: endpoints.editinvtur.endpoint + currentItem.id,
      data: {
        cus_code: currentItem.customer.cus_code,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setUpdate(false);
        toast.current.show({
          severity: "error",
          summary: "Gagal",
          detail: "Gagal Memperbarui Data",
          life: 3000,
        });
      }, 500);
    }
  };

  const addinv = async () => {
    const config = {
      ...endpoints.addinvtur,
      data: {
        cus_code: currentItem.customer.cus_code,
      },
    };
    console.log(config.data);
    let response = null;
    try {
      response = await request(null, config);
      console.log(response);
      if (response.status) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "info",
            summary: "Berhasil",
            detail: "Data Berhasil Diperbarui",
            life: 3000,
          });
        }, 500);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: `Kode ${currentItem.customer.cus_code} Sudah Digunakan`,
            life: 3000,
          });
        }, 500);
      } else {
        setTimeout(() => {
          setUpdate(false);
          toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Gagal Memperbarui Data",
            life: 3000,
          });
        }, 500);
      }
    }
  };

  const onSubmit = () => {
    if (isEdit) {
      setUpdate(true);
      editinv();
    } else {
      setUpdate(true);
      addinv();
    }
  };

  const updateINV = (e) => {
    dispatch({
      type: SET_CURRENT_INV,
      payload: e,
    });
  };

  const header = () => {
    return (
      <h4 className="mb-5">
        <b>Buat Faktur Pembelian</b>
      </h4>
    );
  };

  const body = () => {
    return (
      <>
        {/* Put content body here */}
        <Toast ref={toast} />

        <Row className="mb-4">
          <div className="col-4">
            <label className="text-label">Tanggal</label>
            <div className="p-inputgroup">
              <Calendar
                value={new Date(`${inv.do_date}Z`)}
                onChange={(e) => {
                  updateINV({ ...inv, do_date: e.value });
                }}
                placeholder="Pilih Tanggal"
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">No. Faktur Pembelian</label>
            <div className="p-inputgroup">
              <InputText
                value={inv.do_code}
                onChange={(e) => updateINV({ ...inv, do_code: e.target.value })}
                placeholder="Masukan No. Faktur"
              />
            </div>
          </div>

          <div className="col-4">
            <label className="text-label">No. Pembelian</label>
            <div className="p-inputgroup">
              <Dropdown
                // value={inv.dep_id !== null ? checkDept(Do.dep_id) : null}
                // options={dept}
                // onChange={(e) => {
                //   updateINV({ ...Do, dep_id: e.value.id });
                // }}
                placeholder="No. Pembelian"
                optionLabel="ccost_name"
                filter
                filterBy="ccost_name"
                // valueTemplate={valueDeptTemp}
                // itemTemplate={deptTemp}
              />
              <PButton
                onClick={() => {
                  //   setShowDept(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-3">
            <label className="text-label">Supplier</label>
            <div className="p-inputgroup">
              <Dropdown
                // value={Do.sup_id !== null ? checkSupp(Do.sup_id) : null}
                // options={supplier}
                // onChange={(e) => {
                //   updateINV({ ...Do, sup_id: e.value.supplier.id });
                // }}
                optionLabel="supplier.sup_name"
                placeholder="Pilih Supplier"
                filter
                filterBy="supplier.sup_name"
                // itemTemplate={suppTemp}
                // valueTemplate={valueSupTemp}
              />
              <PButton
                onClick={() => {
                  //   setShowSupplier(true);
                }}
              >
                <i class="bx bx-food-menu"></i>
              </PButton>
            </div>
          </div>

          <div className="col-3">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                // value={
                //   Do.sup_id !== null
                //     ? checkSupp(Do.sup_id)?.supplier?.sup_address
                //     : ""
                // }
                placeholder="Alamat Supplier"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                // value={
                //   Do.sup_id !== null
                //     ? checkSupp(Do.sup_id)?.supplier?.sup_telp1
                //     : ""
                // }
                placeholder="Kontak Person"
                disabled
              />
            </div>
          </div>

          <div className="col-3">
            <label className="text-label"></label>
            <div className="p-inputgroup mt-2">
              <InputText
                // value={
                //   Do.sup_id !== null
                //     ? checkpjk(checkSupp(Do.sup_id)?.supplier?.sup_ppn).name
                //     : null
                // }
                placeholder="Jenis Pajak"
                disabled
              />
            </div>
          </div>

          <div className="col-12">
            <label className="text-label">Keterangan</label>
            <div className="p-inputgroup mt-2">
              <InputTextarea
                // value={
                //   Do.sup_id !== null
                //     ? checkpjk(checkSupp(Do.sup_id)?.supplier?.sup_ppn).name
                //     : null
                // }
                placeholder="Masukan Keterangan"
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Ppn (%)</label>
            <div className="p-inputgroup mt-2">
              <InputText
                // value={
                //   Do.sup_id !== null
                //     ? checkpjk(checkSupp(Do.sup_id)?.supplier?.sup_ppn).name
                //     : null
                // }
                placeholder="Nilai Ppn(%)"
                disabled
              />
            </div>
          </div>

          <div className="col-6">
            <label className="text-label">Faktur Pajak</label>
            <div className="p-inputgroup mt-2">
              <InputText
                // value={
                //   Do.sup_id !== null
                //     ? checkpjk(checkSupp(Do.sup_id)?.supplier?.sup_ppn).name
                //     : null
                // }
                placeholder="Masukan Faktur Pajak"
              />
            </div>
          </div>
        </Row>

        <CustomAccordion
          tittle={"Detail Pesanan Produk"}
          defaultActive={true}
          active={accor.produk}
          onClick={() => {
            setAccor({
              ...accor,
              produk: !accor.produk,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="scroll"
                value={inv.dprod?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    price: v?.price ?? 0,
                    disc: v?.disc ?? 0,
                    total: v?.total ?? 0,
                  };
                })}
                className="display w-150 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Barcode"
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.prod_id && checkProd(e.prod_id)}
                        // options={product}
                        // onChange={(u) => {
                        //   console.log(e.value);
                        //   let temp = [...Do.dprod];
                        //   temp[e.index].prod_id = u.value.id;
                        //   temp[e.index].unit_id = u.value.unit?.id;
                        //   updateINV({ ...Do, dprod: temp });
                        // }}
                        placeholder="Barcode Produk"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Produk"
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.prod_id && checkProd(e.prod_id)}
                        // options={product}
                        // onChange={(u) => {
                        //   console.log(e.value);
                        //   let temp = [...Do.dprod];
                        //   temp[e.index].prod_id = u.value.id;
                        //   temp[e.index].unit_id = u.value.unit?.id;
                        //   updateINV({ ...Do, dprod: temp });
                        // }}
                        placeholder="Produk"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  // style={{
                  //   minWidth: "10rem",
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.unit_id && checkUnit(e.unit_id)}
                        placeholder="Satuan Produk"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Pesanan"
                  style={{
                    width: "5rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.order && e.order}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Jumlah"
                  style={{
                    width: "5rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.order && e.order}
                        // onChange={(u) => {
                        //   let temp = [...Do.dprod];
                        //   temp[e.index].order = u.target.value;
                        //   temp[e.index].total =
                        //     temp[e.index].order * temp[e.index].price;
                        //   updateINV({ ...Do, dprod: temp });
                        //   console.log(temp);
                        // }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Sisa"
                  style={{
                    width: "5rem",
                  }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.order && e.order}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  // style={{
                  //   minWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.price && e.price}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Lokasi"
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <Dropdown
                        // value={e.prod_id && checkProd(e.prod_id)}
                        // options={product}
                        // onChange={(u) => {
                        //   console.log(e.value);
                        //   let temp = [...Do.dprod];
                        //   temp[e.index].prod_id = u.value.id;
                        //   temp[e.index].unit_id = u.value.unit?.id;
                        //   updateINV({ ...Do, dprod: temp });
                        // }}
                        placeholder="Pilih Lokasi"
                        optionLabel="name"
                        filter
                        filterBy="name"
                        // valueTemplate={valueProd}
                        // itemTemplate={prodTemp}
                      />
                      <PButton
                        onClick={() => {
                          //   setShowProduk(true);
                        }}
                      >
                        <i class="bx bx-food-menu"></i>
                      </PButton>
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  // style={{
                  //   maxWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.disc && e.disc}
                        // onChange={(u) => {
                        //   let temp = [...Do.dprod];
                        //   temp[e.index].disc = u.target.value;
                        //   updateINV({ ...Do, dprod: temp });
                        //   console.log(temp);
                        // }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header="Harga Nett"
                  // style={{
                  //   minWidth: "10rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.nett_price && e.nett_price}
                        // onChange={(u) => {
                        //   let temp = [...Do.dprod];
                        //   temp[e.index].nett_price = u.target.value;
                        //   updateINV({ ...Do, dprod: temp });
                        //   console.log(temp);
                        // }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  // style={{
                  //   minWidth: "12rem",
                  // }}
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>
                        Rp.{" "}
                        {`${
                          e.nett_price && e.nett_price !== 0
                            ? e.nett_price
                            : e.total - (e.total * e.disc) / 100
                        }`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                      </b>
                    </label>
                  )}
                />
              </DataTable>
            </>
          }
        />

        <CustomAccordion
          tittle={"Detail Pesanan Jasa"}
          defaultActive={false}
          active={accor.jasa}
          onClick={() => {
            setAccor({
              ...accor,
              jasa: !accor.jasa,
            });
          }}
          key={1}
          body={
            <>
              <DataTable
                responsiveLayout="scroll"
                value={inv.djasa?.map((v, i) => {
                  return {
                    ...v,
                    index: i,
                    price: v?.price ?? 0,
                    disc: v?.disc ?? 0,
                    total: v?.total ?? 0,
                  };
                })}
                className="display w-170 datatable-wrapper header-white no-border"
                showGridlines={false}
                emptyMessage={() => <div></div>}
              >
                <Column
                  header="Supplier"
                  // style={{
                  //   width: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.sup_id && checkSupp(e.sup_id)}
                        placeholder="Supplier"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Jasa"
                  // style={{
                  //   width: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.jasa_id && checkJasa(e.jasa_id)}
                        placeholder="Jasa"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Satuan"
                  // style={{
                  //   maxWidth: "12rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.unit_id && checkUnit(e.unit_id)}
                        placeholder="Satuan"
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Pesanan"
                  // style={{
                  //   maxWidth: "15rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.order && e.order}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Harga Satuan"
                  // style={{
                  //   width: "25rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        value={e.price && e.price}
                        onChange={(u) => {}}
                        placeholder="0"
                        type="number"
                        min={0}
                        disabled
                      />
                    </div>
                  )}
                />

                <Column
                  header="Diskon"
                  // style={{
                  //   width: "25rem",
                  // }}
                  field={""}
                  body={(e) => (
                    <div className="p-inputgroup">
                      <InputText
                        // value={e.disc && e.disc}
                        // onChange={(u) => {
                        //   let temp = [...Do.djasa];
                        //   temp[e.index].disc = u.target.value;
                        //   updateINV({ ...Do, djasa: temp });
                        //   console.log(temp);
                        // }}
                        placeholder="0"
                        type="number"
                        min={0}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  )}
                />

                <Column
                  header="Total"
                  // style={{
                  //   minWidth: "12rem",
                  // }}
                  body={(e) => (
                    <label className="text-nowrap">
                      <b>
                        {`Rp. ${e.total - (e.total * e.disc) / 100}`.replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1."
                        )}
                      </b>
                    </label>
                  )}
                />
              </DataTable>
            </>
          }
        />

        <div className="row ml-0 mr-0 mb-0 mt-6 justify-content-between">
          <div>
            <div className="row ml-1">
              {inv.djasa.length > 0 && inv.dprod.length > 0 && (
                <div className="d-flex col-12 align-items-center">
                  <label className="mt-1">{"Pisah Faktur"}</label>
                  <InputSwitch
                    className="ml-4"
                    checked={inv.split_inv}
                    onChange={(e) => {
                      // if (e.value) {
                      //   updateINV({
                      //     ...Do,
                      //     split_inv: e.value,
                      //     total_disc: null,
                      //   });
                      // } else {
                      //   updateINV({
                      //     ...Do,
                      //     split_inv: e.value,
                      //     prod_disc: null,
                      //     jasa_disc: null,
                      //   });
                      // }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="row justify-content-right col-6">
            <div className="col-6">
              <label className="text-label">
                {inv.split_inv ? "Sub Total Barang" : "Sub Total"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {inv.split_inv ? (
                  <b>
                    Rp.
                    {/* {formatIdr(getSubTotalBarang())} */}
                  </b>
                ) : (
                  <b>
                    Rp.
                    {/* {formatIdr(getSubTotalBarang() + getSubTotalJasa())} */}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {inv.split_inv ? "DPP Barang" : "DPP"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {inv.split_inv ? (
                  <b>
                    Rp.
                    {/* {formatIdr(getSubTotalBarang())} */}
                  </b>
                ) : (
                  <b>
                    Rp.
                    {/* {formatIdr(getSubTotalBarang() + getSubTotalJasa())} */}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {inv.split_inv ? "Pajak Atas Barang (11%)" : "Pajak (11%)"}
              </label>
            </div>

            <div className="col-6">
              <label className="text-label">
                {inv.split_inv ? (
                  <b>
                    Rp.
                    {/* {formatIdr((getSubTotalBarang() * 11) / 100)} */}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {/* {formatIdr(
                      ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                    )} */}
                  </b>
                )}
              </label>
            </div>

            <div className="col-6 mt-3">
              <label className="text-label">Diskon Tambahan</label>
            </div>

            <div className="col-6">
              <div className="p-inputgroup">
                <PButton
                  label="Rp."
                  className={`${isRp ? "" : "p-button-outlined"}`}
                  onClick={() => setRp(true)}
                />
                <InputText
                  // value={
                  //   inv.split_inv
                  //     ? isRp
                  //       ? (getSubTotalBarang() * Do.prod_disc) / 100
                  //       : inv.prod_disc
                  //     : isRp
                  //     ? ((getSubTotalBarang() + getSubTotalJasa()) *
                  //         Do.total_disc) /
                  //       100
                  //     : Do.total_disc
                  // }
                  placeholder="Diskon"
                  type="number"
                  min={0}
                  onChange={(e) => {
                    // if (Do.split_inv) {
                    //   let disc = 0;
                    //   if (isRp) {
                    //     disc = (e.target.value / getSubTotalBarang()) * 100;
                    //   } else {
                    //     disc = e.target.value;
                    //   }
                    //   updateINV({ ...Do, prod_disc: disc });
                    // } else {
                    //   let disc = 0;
                    //   if (isRp) {
                    //     disc =
                    //       (e.target.value /
                    //         (getSubTotalBarang() + getSubTotalJasa())) *
                    //       100;
                    //   } else {
                    //     disc = e.target.value;
                    //   }
                    //   updateINV({ ...Do, total_disc: disc });
                    // }
                  }}
                />
                <PButton
                  className={`${isRp ? "p-button-outlined" : ""}`}
                  onClick={() => setRp(false)}
                >
                  {" "}
                  <b>%</b>{" "}
                </PButton>
              </div>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            <div className="col-6">
              <label className="text-label">
                <b>Total Pembayaran</b>
              </label>
            </div>

            <div className="col-6">
              <label className="text-label fs-16">
                {inv.split_inv ? (
                  <b>
                    Rp.{" "}
                    {/* {formatIdr(
                      getSubTotalBarang() + (getSubTotalBarang() * 11) / 100
                    )} */}
                  </b>
                ) : (
                  <b>
                    Rp.{" "}
                    {/* {formatIdr(
                      getSubTotalBarang() +
                        getSubTotalJasa() +
                        ((getSubTotalBarang() + getSubTotalJasa()) * 11) / 100
                    )} */}
                  </b>
                )}
              </label>
            </div>

            <div className="col-12">
              <Divider className="ml-12"></Divider>
            </div>

            {inv.split_inv ? (
              <>
                {/* <div className="row justify-content-right col-12 mt-4"> */}
                <div className="col-6 mt-4">
                  <label className="text-label">Sub Total Jasa</label>
                </div>

                <div className="col-6 mt-4">
                  <label className="text-label">
                    <b>
                      Rp.
                      {/* {formatIdr(getSubTotalJasa())} */}
                    </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">DPP Jasa</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>
                      Rp.
                      {/* {formatIdr(getSubTotalJasa())} */}
                    </b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label">Pajak Atas Jasa (2%)</label>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>
                      Rp.
                      {/* {formatIdr((getSubTotalJasa() * 2) / 100)} */}
                    </b>
                  </label>
                </div>

                <div className="col-6 mt-3">
                  <label className="text-label">Diskon Tambahan</label>
                </div>

                <div className="col-6">
                  <div className="p-inputgroup">
                    <PButton
                      label="Rp."
                      className={`${isRpJasa ? "" : "p-button-outlined"}`}
                      onClick={() => setRpJasa(true)}
                    />
                    <InputText
                      // value={
                      //   isRpJasa
                      //     ? (getSubTotalJasa() * Do.jasa_disc) / 100
                      //     : Do.jasa_disc
                      // }
                      placeholder="Diskon"
                      type="number"
                      min={0}
                      onChange={(e) => {
                        // let disc = 0;
                        // if (isRpJasa) {
                        //   disc = (e.target.value / getSubTotalJasa()) * 100;
                        // } else {
                        //   disc = e.target.value;
                        // }
                        // updateINV({ ...Do, jasa_disc: disc });
                      }}
                    />
                    <PButton
                      className={`${isRpJasa ? "p-button-outlined" : ""}`}
                      onClick={() => setRpJasa(false)}
                    >
                      {" "}
                      <b>%</b>{" "}
                    </PButton>
                  </div>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>

                <div className="col-6">
                  <label className="text-label">
                    <b>Total Pembayaran</b>
                  </label>
                </div>

                <div className="col-6">
                  <label className="text-label fs-16">
                    <b>
                      Rp.{" "}
                      {/* {formatIdr(
                        getSubTotalJasa() + (getSubTotalJasa() * 2) / 100
                      )} */}
                    </b>
                  </label>
                </div>

                <div className="col-12">
                  <Divider className="ml-12"></Divider>
                </div>
                {/* </div> */}
              </>
            ) : null}
          </div>
        </div>
      </>
    );
  };

  const footer = () => {
    return (
      <div className="mt-5 flex justify-content-end">
        <div>
          <PButton
            label="Batal"
            onClick={onCancel}
            className="p-button-text btn-primary"
          />
          <PButton
            label="Simpan"
            icon="pi pi-check"
            onClick={onSubmit}
            autoFocus
            loading={update}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {header()}
      {body()}
      {footer()}
    </>
  );
};

export default BuatFaktur;
