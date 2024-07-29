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
