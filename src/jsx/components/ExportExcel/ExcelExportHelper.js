import React from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import PrimeSingleButton from "src/jsx/components/PrimeSingleButton/PrimeSingleButton";

const ExcelExportHelper = ({ json, filename, sheetname }) => {
  class StringIdGenerator {
    constructor(chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      this._chars = chars;
      this._nextId = [0];
    }

    next() {
      const r = [];
      for (const char of this._nextId) {
        r.unshift(this._chars[char]);
      }
      this._increment();
      return r.join("");
    }

    _increment() {
      for (let i = 0; i < this._nextId.length; i++) {
        const val = ++this._nextId[i];
        if (val >= this._chars.length) {
          this._nextId[i] = 0;
        } else {
          return;
        }
      }
      this._nextId.push(0);
    }

    *[Symbol.iterator]() {
      while (true) {
        yield this.next();
      }
    }
  }

  const createDownLoadData = () => {
    handleExport().then((url) => {
      console.log(url);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", `${filename}.xlsx`);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);

    console.log(buf);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const handleExport = () => {
    let final = [];
    let width = {};
    let style = [];
    json.forEach((el) => {
      let idColumn = new StringIdGenerator();
      let title = [];
      let column = {};
      let data = [];
      let cs = {};
      let acs = [];
      let ads = [];
      el.columns.forEach((col) => {
        let id = idColumn.next();
        column[id] = col.title;
        width[id] = col.width.wch;
        cs[id] = col.style;
      });
      title.push(column);
      acs.push(cs);
      el.data.forEach((d) => {
        let val = {};
        let ds = {};
        let idData = new StringIdGenerator();
        d.forEach((e) => {
          let idD = idData.next();
          val[idD] = e.value;
          ds[idD] = e.style;
        });
        data.push(val);
        ads.push(ds);
      });

      final = final.concat(title).concat(data);
      style = style.concat(acs).concat(ads);
    });

    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(final, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, sheetname);

    const workbookBlob = workbook2blob(wb);

    return addStyle(workbookBlob, { width: width, style: style });
  };

  const addStyle = (workbookBlob, properties) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        for (const key in properties.width) {
          sheet.column(key).width(properties.width[key]);
        }
        properties.style.forEach((el, i) => {
          for (const key in el) {
            let range = key + (i + 1) + ":" + key + (i + 1);
            sheet.range(range).style({
              horizontalAlignment: el[key]?.alignment?.horizontal,
              verticalAlignment: el[key]?.alignment?.vertical,
              bold: el[key]?.font?.bold ?? false,
              fontSize: Number(el[key]?.font?.sz ?? "14"),
              fill: el[key]?.fill?.fgColor?.rgb,
            });
          }
        });
      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return (
    <PrimeSingleButton
      label="Excel"
      icon={<i class="pi pi-file-excel px-2"></i>}
      onClick={() => {
        createDownLoadData();
      }}
    />
  );
};

export default ExcelExportHelper;
