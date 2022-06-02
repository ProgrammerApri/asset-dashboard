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

// option must array object
const CustomDropdown = ({
  option,
  detail = false,
  onDetail = () => {},
  label,
  placeholder,
  value,
  onChange = () => {},
}) => {
  const [active, setActive] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const panel = useRef(null);
  const list = useRef(null);
  const drop = useRef(null);

  const defaultOptions = [];
  for (let i = 0; i < 10; i++) {
    defaultOptions.push(`option ${i}`);
    defaultOptions.push(`suggesstion ${i}`);
    defaultOptions.push(`advice ${i}`);
  }

  const [matches, setMatches] = useState(null);

  const triggerPanel = (active) => {
    setActive(!active);
    if (active) {
      panel.current.style.display = "flex";
      panel.current.style.height = "auto";
      panel.current.style.transition = "height 300ms linear";
      list.current.style.maxHeight = "15rem";
      list.current.style.transition = "max-height 300ms linear";
    } else {
      setTimeout(() => {
        panel.current.style.display = "none";
        setFilter("");
        setMatches(option);
      }, 45);
      panel.current.style.height = "0";
      panel.current.style.transition = "height 55ms linear";
      list.current.style.maxHeight = "0";
      list.current.style.transition = "max-height 50ms linear";
    }
  };

  useOutsideAlerter(drop, panel, () => {
    triggerPanel(false);
  });

  const getLabel = (value) => {
    let key = label.match(/(?<=\[)[^\][]*(?=])/g);
    let final = label;
    key.forEach((e) => {
      final = final.replace(e, value[`${e}`]);
    });
    final = final.replaceAll("[", "").replaceAll("]", "");
    console.log(final);
    return final;
  };
  // useEffect(() => {
  //   setMatches(option);
  // }, [matches]);

  return (
    <>
      <div className="row m-0">
        <div
          ref={drop}
          className="p-dropdown p-component p-inputwrapper vw-100"
          onClick={() => {
            triggerPanel(active);
          }}
        >
          {value ? (
            <span className="p-dropdown-label p-inputtext">
              {getLabel(selected)}
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
      <div ref={panel} className="row mr-3 mt-0 ml-0 c-dropdown-wrapper">
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
                      triggerPanel(false);
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
                      triggerPanel(false);
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
              onDetail();
              triggerPanel(false);
            }}
            className="p-button-sm p-button-text btn-primary text-center vw-100 m-2 center-icon justify-content-center"
          />
        )}
      </div>
    </>
  );
};

export default CustomDropdown;
