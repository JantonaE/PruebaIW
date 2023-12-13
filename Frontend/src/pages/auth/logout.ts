import type { APIContext } from "astro";
import cookies from "../../cookies";
import { setUser } from "@pages/auth/auth";

export async function post(context: APIContext) {
  context.cookies.delete(cookies.accessToken, { path: "/" });
  context.cookies.delete(cookies.refreshToken, { path: "/" });

  // https://auth0.com/docs/api/authentication#logout
  const payload = new URLSearchParams({
    client_id: import.meta.env.AUTH0_CLIENTID,
    returnTo: context.url.origin,
  });

  setUser(null);
  
  return context.redirect(
    `${import.meta.env.AUTH0_DOMAIN}/v2/logout?${payload}`
  );
}
