import CookieStore from "./cookie";
import RecursiveIterator from "recursive-iterator";
import moment, { type Moment } from "moment";
import momentTimezone from "moment-timezone";
import { isServer } from "@builder.io/qwik/build";

export const Now = (dt?: string) => {
  if (dt) {
    return momentTimezone.tz(
      moment(dt).utc().format("YYYY-MM-DD HH:mm"),
      "Asia/Manila"
    );
  } else {
    return moment().tz("Asia/Manila");
  }
};

export const utcToTimezone = (dt, tz) => {
  return momentTimezone.utc(dt as any).tz(tz);
};

export const momentToCron = (moment: Moment) => {
  return `${moment.minute()} ${moment.hour()} ${moment.date()} ${moment.month() + 1} *`;
};

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

export const sanitize = (str) =>
  decodeURIComponent(String(str).replace(/<.*>/, ""));

export function createUrl(url, params) {
  try {
    let rawUrl = new URL(url);
    url = `${rawUrl.origin}${rawUrl.pathname}`;

    for (let [key, value] of rawUrl.searchParams) {
      params[key] = value;
    }
  } catch (err) {}

  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      let value = params[key];
      if (typeof value != "string") {
        value = JSON.stringify(value);
      }
      searchParams.append(key, value);
    }
  }

  if (url) {
    return `${url}?${searchParams.toString()}`;
  }
  return searchParams.toString();
}

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

export function searchQueryToObj<T>(str) {
  const url = `http://localhost:1000?${str}`;

  const urlObj = new URL(url);

  const obj = {};

  for (let [key, value] of urlObj.searchParams.entries()) {
    obj[key] = value;
  }

  return obj as T;
}

export async function Fetch<T>(url, conf = {} as any) {
  try {
    const store = new CookieStore();
    const token = store.getToken();

    conf.headers = {
      "x-token": token,
      ...(conf.headers || {}),
    };
    const response = await fetch(url, {
      ...conf,
      credentials: "include",
    });
    if (response.status == 401) {
      throw new Error("unauthorized");
    }
    const json = await response.json();

    if (json.status != undefined && json.status == 0) {
      throw new Error(json.message);
    }

    return json;
  } catch (err) {
    if (
      err.message == 401 ||
      (err.message && err.message.includes && err.message.includes("jwt"))
    ) {
      return console.error("unauthorized");
    }

    throw err;
  }
}

export const getFormOptions = async function (items, opts?) {
  let mutateControl = await formControlWalker(cloneObj(items), async (item) => {
    const { relation, tag } = item;

    if (relation) {
      const { path, attributes, defaultValue } = relation;

      const params: any = {};

      attributes && (params.attributes = attributes);
      defaultValue && (params.defaultValue = defaultValue);

      const resp = await Fetch(createUrl(`${location.origin}${path}`, params));

      if (resp.status) {
        item.options = resp.data;
      }
    }

    return item;
  });

  return formControlWalker(mutateControl, async (item) => {
    return item;
  });
};

export const plotFormData = async function (items, obj) {
  const concat = (array, level) => {
    return array.reduce((accu, iter, index) => {
      if (index == level) {
        accu += iter;
      }

      return accu;
    }, "");
  };
  const flat = {};
  for (const { node, path } of new RecursiveIterator(obj)) {
    if (
      ["boolean", "number", "string"].includes(typeof node) ||
      (typeof node == "object" && node == null)
    ) {
      const key = concat(path, 0);

      flat[key] = node;
    }
  }

  return formControlWalker(cloneObj(items), async (item) => {
    if (flat[item.name] != undefined) {
      item.value = flat[item.name];
    }

    return item;
  });
};

export const formControlWalker = (items, callback) => {
  const loop = (items, callback) =>
    Promise.all(
      JSON.parse(JSON.stringify(items)).map(async (item) => {
        const { relation, tag, options } = item;
        if (["group", "row"].includes(tag)) {
          if (item.relation) {
            return callback({
              ...item,
              children: await loop(
                (item.children || []).map((item) => {
                  if (options && options[item.name]) {
                    item.value = options[item.name];
                  }

                  return item;
                }),
                callback
              ),
            });
          } else {
            return callback({
              ...item,
              children: await loop(item.children || [], callback),
            });
          }
        }

        return callback(item);
      })
    );

  return loop(items, callback);
};

export const cloneObj = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    return obj;
  }
};

export function sortedQueryString(object) {
  let keys = Object.keys(object);
  let sorted = keys.sort();
  let string = "";
  sorted.forEach((key, index) => {
    let value = object[key];
    if (value) {
      if (index == sorted.length - 1) {
        string += `${key}=${value}`;
      } else {
        string += `${key}=${value}&`;
      }
    }
  });

  return string;
}

export const initGlobal = <T>(name, value?) => {
  if (isServer) {
    return;
  }

  if (value) {
    window[name] = value;
  }
  return window[name] as T;
};

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
