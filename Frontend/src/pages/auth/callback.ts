import type { APIContext } from "astro";
import { setCookies } from "../../lib/auth0";

export const prerender = true;

// https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-authorization-code-flow
export async function GET(context: APIContext) {
  const code = context.url.searchParams.get("code") as string;

  const payload = new URLSearchParams({
    grant_type: "authorization_code",
    redirect_uri: context.url.origin,
    client_id: import.meta.env.AUTH0_CLIENTID,
    client_secret: import.meta.env.AUTH0_SECRET,
    audience: import.meta.env.AUTH0_AUDIENCE,
    code: code,
  });

  const response = await fetch(
    `${import.meta.env.AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    }
  ).then((x) => x.json());
  
  setCookies(context, response);
  

  return context.redirect("/auth/loginsuccess");
}