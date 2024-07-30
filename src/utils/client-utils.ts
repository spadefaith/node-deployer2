import { isServer } from "@builder.io/qwik/build";
import ClientStore from "./cookie";

export const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows() ||
      []
    );
  },
};

export const getWindowWidth = () => {
  const [mobileType] = isMobile.any();

  return mobileType ? window.screen.width : window.innerWidth;
};

export async function gotPhoto(name, file) {
  const storage = new ClientStore();
  return new Promise((res) => {
    const reader = new FileReader();
    reader.onload = function (base64) {
      res(base64.target.result);
    };
    reader.readAsDataURL(file);
  }).then((base64) => {
    const storageName = "_files";
    const files: any = storage.get(storageName);
    if (files == null) {
      storage.put(storageName, { [name]: { file: base64, name: file.name } });
    } else {
      files[name] = {
        file: base64,
        name: file.name,
      };
      storage.put(storageName, files);
    }
  });
}
// Saved to localstorage

export function retrieveImages() {
  const storageName = "_files";
  const storage = new ClientStore();
  const files: any = storage.get(storageName);
  if (files == null) {
    return {};
  }

  return Object.keys(files).reduce((accu, name) => {
    const item = files[name];
    const { file: base64, name: fileName } = item;
    if (base64) {
      const base64Parts = base64.split(",");
      const fileFormat = base64Parts[0].split(";")[1];
      const fileContent = base64Parts[1];
      const file = new File([fileContent], fileName, { type: fileFormat });
      accu[name] = { file, base64 };
    }
    return accu;
  }, {});
}
// Retreived file object

export const processInsuredData = (insured) => {
  return Object.keys(insured).reduce((accu, key, index) => {
    if (key.includes("insured_")) {
      const [a, b] = key.split("|");
      const [c, d] = a.split("_");

      const i = Number(d);
      if (!isNaN(i)) {
        if (!accu[i - 1]) {
          accu[i - 1] = {};
        }

        accu[i - 1][b] = insured[key];
      }
    } else {
      if (!accu[0]) {
        accu[0] = {};
      }

      accu[0][key] = insured[key];
    }

    return accu;
  }, []);
};

export function downloadLocalFile(name, type, content) {
  const file = new Blob([content], {
    type,
  });
  const href = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  a.target = "_blank";

  a.click();
  URL.revokeObjectURL(href);
}

export const sanitize = (str) =>
  decodeURIComponent(String(str).replace(/<.*>/, ""));

export function getFormData<T>(
  form: HTMLFormElement,
  opts?: { trim?: boolean; json?: boolean }
): T {
  const o = {
    trim: false,
    json: true,
  };
  if (opts && opts.trim != undefined) {
    o.trim = opts.trim;
  }

  if (opts && opts.json != undefined) {
    o.json = opts.json;
  }

  const formData = new FormData(form);
  const data: any = {};
  const isTrim = o.trim;

  [...form.elements].forEach((item: any) => {
    const value = sanitize(item["value"]);
    if (item["name"]) {
      if (item["type"] == "checkbox") {
        item["checked"] && (data[item["name"]] = item["checked"]);
      } else if (item["type"] == "file") {
        console.log(item["files"]);
        data[item["name"]] = item["files"][0];
      } else if (isTrim && value != "") {
        data[item["name"]] = value;
      } else if (!isTrim) {
        data[item["name"]] = value;
      }
    }
  });

  delete data.PreventChromeAutocomplete;

  if (o.json == false) {
    Object.keys(data).forEach((key) => {
      if (!formData.has(key)) {
        formData.append(key, data[key]);
      }
    });

    return formData as T;
  }

  return data as T;
}

export const getControlValue = (control) => {
  let value = sanitize(control["value"]);
  if (control["type"] == "checkbox") {
    if (!control["checked"]) {
      value = null;
    }
  } else if (control["type"] == "file") {
    value = control["files"][0];
  }

  return value;
};

export const initGlobal = <T>(name, value?) => {
  if (isServer) {
    return;
  }

  if (value) {
    window[name] = value;
  }
  return window[name] as T;
};

export const restructureControls = (data, update?) => {
  return data.map((item) => {
    item.properties.forEach(({ key, value }) => {
      item[key] = value;
    });

    if (update && update[item.name]) {
      item.value = update[item.name];
    }

    return item;
  });
};

export const mergeTo = (value, obj) => {
  if (isFalsy(value)) {
    return {};
  }

  return obj || {};
};

export function isFalsy(val, len?) {
  if (!val) {
    return true;
  }
  const isNumber = val.constructor.name == "Number";
  const isString = val.constructor.name == "String";

  if (isNumber) {
    return !val;
  } else if (isString) {
    if (len) {
      return val == "undefined" || val == "null" || val.length <= len;
    }
    return val == "undefined" || val == "null";
  }
  return false;
}

export const parseMedia = (obj) => {
  //   {
  //     "data": {
  //         "id": 9,
  //         "attributes": {
  //             "name": "Subtract.svg",
  //             "alternativeText": null,
  //             "caption": null,
  //             "width": 20,
  //             "height": 20,
  //             "formats": null,
  //             "hash": "Subtract_e89567f449",
  //             "ext": ".svg",
  //             "mime": "image/svg+xml",
  //             "size": 0.34,
  //             "url": "/uploads/Subtract_e89567f449.svg",
  //             "previewUrl": null,
  //             "provider": "local",
  //             "provider_metadata": null,
  //             "createdAt": "2024-07-11T11:14:09.716Z",
  //             "updatedAt": "2024-07-11T11:14:20.990Z"
  //         }
  //     }
  // }
  const data = obj?.data;

  return data;
};
