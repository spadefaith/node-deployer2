import { $, component$ } from "@builder.io/qwik";
import zod, { z } from "zod";
import {
  Form,
  RequestEvent,
  routeAction$,
  zod$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { login } from "~/server/modules/admin/auth/controller";
import { request } from "http";
import { getFormData } from "~/utils";
import { isServer } from "@builder.io/qwik/build";
import CacheServerService from "~/services/CacheServerService";
import moment from "moment";

const _cache = new CacheServerService("auth");

export const useLogin = routeAction$(
  async (
    creds: { username: string; password: string },
    { cookie, redirect, url }
  ) => {
    try {
      const get = await _cache.getStore(creds.username, true);
      const expiration = moment().add(3, "hours").format("YYYY-MM-DD HH:mm:ss");

      if (!get) {
        await _cache.setStore(creds.username, {
          retry: 1,
          expired: expiration,
        });
      } else {
        const { retry, expired } = get;
        const retryN = Number(retry);
        const isExpired = moment().isAfter(moment(expired));

        if (retryN + 1 > 3) {
          if (isExpired) {
            await _cache.setStore(creds.username, {
              retry: 1,
              expired: expiration,
            });
          } else {
            throw new Error("disable login");
          }
        } else {
          await _cache.setStore(creds.username, {
            retry: retryN + 1,
            expired: get.expired,
          });
        }
      }

      const token = await login(creds);

      cookie.set("x-token", token, { secure: false, httpOnly: true });

      await _cache.destroyStore(creds.username);

      return { success: true, redirect: new URL("/account", url).toString() };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  zod$({
    username: z.string(),
    password: z.string(),
  })
);

export default component$(() => {
  const action = useLogin();

  const submitHandler = $(async (e) => {
    if (isServer) {
      return;
    }
    const data = getFormData(e.target);
    const {
      value: { success, redirect },
    } = (await action.submit(data)) || {};

    if (success) {
      window.location.href = redirect;
    }
  });
  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "600px",
        width: "100%",
        paddingTop: "5rem",
      }}
    >
      <h1>Deployer</h1>
      <br />
      <form onSubmit$={submitHandler} preventdefault:submit>
        <div data-mdb-input-init class="form-outline mb-4">
          <input
            type="text"
            id="username"
            name="username"
            class="form-control"
          />
          <label class="form-label" for="username">
            Username
          </label>
        </div>

        <div data-mdb-input-init class="form-outline mb-4">
          <input
            type="password"
            id="password"
            name="password"
            class="form-control"
          />
          <label class="form-label" for="password">
            Password
          </label>
        </div>
        {action?.value?.success == false ? (
          <p>{action?.value?.message || "failed login"}</p>
        ) : (
          <></>
        )}
        <br />
        <button
          data-mdb-ripple-init
          type="submit"
          class="btn btn-primary btn-block"
        >
          Sign in
        </button>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Deployer login",
  meta: [
    {
      name: "description",
      content: "Application Deployer - docker compose",
    },
  ],
};
