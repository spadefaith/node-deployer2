import CookieStore from "./cookie";
import RecursiveIterator from "recursive-iterator";
import moment, { type Moment } from "moment";
import momentTimezone from "moment-timezone";
import { isServer } from "@builder.io/qwik/build";
import path from "node:path";

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

export function createUrl(url, params) {
  try {
    const rawUrl = new URL(url);
    url = `${rawUrl.origin}${rawUrl.pathname}`;

    for (const entries of rawUrl.searchParams) {
      const key = entries[0];
      const value = entries[1];
      params[key] = value;
    }
  } catch (err) {
    console.log(err);
  }

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

export function searchQueryToObj<T>(str) {
  const url = `http://localhost:1000?${str}`;

  const urlObj = new URL(url);

  const obj = {};

  for (const entries of urlObj.searchParams.entries()) {
    const key = entries[0];
    const value = entries[1];
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
  const mutateControl = await formControlWalker(
    cloneObj(items),
    async (item) => {
      const { relation, tag } = item;

      if (relation) {
        const { path, attributes, defaultValue } = relation;

        const params: any = {};

        attributes && (params.attributes = attributes);
        defaultValue && (params.defaultValue = defaultValue);

        const resp = await Fetch(
          createUrl(`${location.origin}${path}`, params)
        );

        if (resp.status) {
          item.options = resp.data;
        }
      }

      return item;
    }
  );

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
  const keys = Object.keys(object);
  const sorted = keys.sort();
  let string = "";
  sorted.forEach((key, index) => {
    const value = object[key];
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

export function getModule(pathname) {
  const isInclude = (path) => pathname.includes(path);
  if (isInclude("/app")) {
    return "app";
  } else if (isInclude("/app/env")) {
    return "env";
  } else if (isInclude("/account")) {
    return "account";
  } else if (isInclude("/role")) {
    return "role";
  }
}
