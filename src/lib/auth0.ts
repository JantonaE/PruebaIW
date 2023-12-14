import type { APIContext } from "astro";
import cookies from "../cookies";
import { setUser } from "./auth";

// https://auth0.com/docs/api/authentication#refresh-token
async function refreshAccessToken(refresh_token: string) {
  const payload = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: import.meta.env.AUTH0_CLIENTID,
    client_secret: import.meta.env.AUTH0_CLIENTSECRET,
    refresh_token,
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
  return response;
}
interface TokenPayload {
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}
export function setCookies(context: APIContext, response: TokenPayload) {
  if (context != undefined && context.cookies != undefined && response != undefined && response.access_token != undefined) {
    context.cookies.set(cookies.accessToken, response.access_token.toString(), {
      path: "/",
      expires: new Date(Date.now() + response.expires_in),
    });
    context.cookies.set(cookies.refreshToken, response.refresh_token as string, {
      path: "/",
    });


    // Replace 'your-auth0-domain' with your Auth0 domain
    const auth0Domain = import.meta.env.AUTH0_DOMAIN;
    const accessToken = response.access_token.toString();

    // Make a request to the /userinfo endpoint
    fetch(`${auth0Domain}/userinfo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        console.log('User Information:', userData);
        setUser(userData);
      })
      .catch((error) => {
        console.error('Error fetching user information:', error);
      });

  }

}

export async function getAccessToken(context: APIContext): Promise<string> {
  if (context != undefined && context.cookies != undefined) {
    if (!context.cookies.has(cookies.accessToken)) {
      const refreshToken = context.cookies.get(cookies.refreshToken)
        .value as string;
      const response = await refreshAccessToken(refreshToken);
      setCookies(context, response);
    }

    return context.cookies.get(cookies.accessToken).value as string;
  }

  return "";

}

export function isLoggedIn(context: APIContext) {
  return context.cookies.has(cookies.refreshToken);
}
