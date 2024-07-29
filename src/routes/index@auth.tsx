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

export const useLogin = routeAction$(
  async (
    creds: { username: string; password: string },
    { cookie, redirect, url }
  ) => {
    try {
      const token = await login(creds);
      console.log(14, token);

      cookie.set("x-token", token, { secure: false, httpOnly: true });

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
