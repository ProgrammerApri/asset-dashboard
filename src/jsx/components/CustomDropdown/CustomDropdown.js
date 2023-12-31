import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";

function useOutsideAlerter(ref, panel, callback = () => {}) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !panel.current.contains(event.target)
      ) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const useActiveElement = () => {
  const [active, setActive] = useState(document.activeElement);

  const handleFocusIn = (e) => {
    setActive(document.activeElement);
  };

  useEffect(() => {
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return active;
};

// option must array object
const CustomDropdown = ({
  option,
  detail = false,
  onDetail = () => {},
  history = false,
  onShow = () => {},
  label,
  placeholder,
  value,
  error,
  errorMessage,
  onChange = () => {},
  disabled = false,
}) => {
  const [active, setActive] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const panel = useRef(null);
  const list = useRef(null);
  const drop = useRef(null);
  const focusedElement = useActiveElement();

  // useEffect(() => {
  //   if (drop.current &&
  //     !drop.current.contains(focusedElement) &&
  //     !panel.current.contains(focusedElement)) {
  //     triggerPanel(false);
  //   }

  //   if (drop.current === focusedElement) {
  //     triggerPanel(active);
  //   }

  // }, [focusedElement]);

  const [matches, setMatches] = useState(null);

  const triggerPanel = (active) => {
    if (!disabled) {
      setActive(!active);
      if (active) {
        panel.current.style.display = "flex";
        panel.current.style.height = "auto";
        panel.current.style.transition = "height 300ms linear";
        list.current.style.maxHeight = "15rem";
        list.current.style.transition = "max-height 300ms linear";
      } else {
        setTimeout(() => {
          if (panel.current && list.current) {
            panel.current.style.display = "none";
          }
          setFilter("");
        }, 45);
        panel.current.style.height = "0";
        panel.current.style.transition = "height 55ms linear";
        list.current.style.maxHeight = "0";
        list.current.style.transition = "max-height 50ms linear";
      }
      setMatches(option);
    }
  };

  useOutsideAlerter(drop, panel, () => {
    triggerPanel(false);
  });

  const getLabel = (value) => {
    let key = label.match(/(?!=\[)[^\][]*(?=])/g);
    let final = label;
    if (option && value) {
      key
        ?.filter((e) => e != "")
        ?.forEach((e) => {
          if (e.includes(".")) {
            let subkey = e.split(".");
            let subValue = value;
            subkey?.forEach((key) => {
              subValue = subValue[`${key}`];
            });
            // console.log(subValue);
            final = final.replace(e, subValue);
          } else {
            final = final.replace(e, value[`${e}`]);
          }
        });
      final = final.replaceAll("[", "").replaceAll("]", "");
    }
    return final;
  };

  return (
    <>
      <div className="row m-0">
        <div
          ref={drop}
          tabIndex={"0"}
          className="p-dropdown p-component p-inputwrapper w-100"
          onClick={() => {
            triggerPanel(active);
            // drop.current.focus();
            // console.log(active);
            // if (active) {
            //   triggerPanel(active);
            // }
          }}
        >
          {value ? (
            <span className="p-dropdown-label p-inputtext">
              {getLabel(value)}
            </span>
          ) : (
            <span className="p-dropdown-label p-inputtext p-placeholder">
              {placeholder}
            </span>
          )}
          <div
            class="p-dropdown-trigger"
            role="button"
            aria-haspopup="listbox"
            aria-expanded="false"
          >
            <span class="p-dropdown-trigger-icon p-clickable pi pi-chevron-down"></span>
          </div>
        </div>
      </div>
      <div
        style={{ width: `${drop?.current?.offsetWidth}px`, minWidth: "220px" }}
        ref={panel}
        className="row mr-3 mt-0 ml-0 c-dropdown-wrapper"
      >
        <div className="c-dropdown-header">
          <span className="p-input-icon-right d-flex justify-content-between">
            <InputText
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                let match = option?.filter((v) => {
                  for (var k of Object.keys(v)) {
                    if (v[`${k}`]) {
                      if (
                        `${v[`${k}`]}`
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      ) {
                        return v;
                      }
                    }
                  }
                });
                setMatches(match);
              }}
              placeholder="Search"
            />
            <i className="pi pi-search" />
          </span>
        </div>
        <ul ref={list} className="list-group">
          {/* {renderItem()} */}
          {matches !== null
            ? matches?.map((v, index) => {
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setSelected(v);
                      onChange(v);
                      triggerPanel(active);
                    }}
                    className="list-group-item list-group-item-action"
                  >
                    {getLabel(v)}
                  </button>
                );
              })
            : option?.map((v, index) => {
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      setSelected(v);
                      onChange(v);
                      triggerPanel(active);
                    }}
                    className="list-group-item list-group-item-action"
                  >
                    {getLabel(v)}
                  </button>
                );
              })}
          {matches?.length === 0 && (
            <span className="list-group text-center p-4">
              Data tidak ditemukan
            </span>
          )}
          {option === null && (
            <span className="list-group text-center p-4">Tidak ada data</span>
          )}
        </ul>
        {detail && (
          <Button
            label="Tampilkan Detail"
            icon="pi pi-eye"
            onClick={() => {
              triggerPanel(active);
              onDetail();
            }}
            className="p-button-sm p-button-text btn-primary fs-12 text-center vw-100 m-2 center-icon justify-content-center"
          />
        )}
        {history && (
          <Button
            label="Histori Harga"
            icon="pi pi-eye"
            onClick={() => {
              triggerPanel(active);
              onShow();
            }}
            className="p-button-sm p-button-text btn-primary text-center fs-12 vw-100 m-2 center-icon justify-content-center"
          />
        )}
      </div>
      {error && (
        <small id="name-error" className="p-error block">
          <i class="bx bxs-error-circle ml-1"></i> {errorMessage}
        </small>
      )}
    </>
  );
};

export default CustomDropdown;
