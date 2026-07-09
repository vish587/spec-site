// Auth gate for the whole site: branded login page + signed session cookie.
// Set credentials in Netlify: Site settings → Environment variables
//   AUTH_USER  = login email
//   AUTH_PASS  = login password
// Rotating AUTH_PASS invalidates every existing session (it signs the cookies).

import { loginPage } from "./lib/login-page.ts";

const COOKIE_NAME = "liftrex_session";
const SESSION_HOURS = 8;

export default async (request: Request, context: any) => {
  const user = Deno.env.get("AUTH_USER");
  const pass = Deno.env.get("AUTH_PASS");

  // Fail closed: if credentials aren't configured, block everything.
  if (!user || !pass) {
    return new Response("Site not configured: set AUTH_USER and AUTH_PASS environment variables.", {
      status: 503,
    });
  }

  const url = new URL(request.url);
  const secure = url.protocol === "https:";

  if (url.pathname === "/login") {
    if (request.method === "POST") {
      return handleLogin(await request.formData(), user, pass, secure);
    }
    if (await hasValidSession(request, user, pass)) {
      return redirect("/");
    }
    return new Response(loginPage({ error: url.searchParams.has("error") }), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  if (url.pathname === "/logout") {
    return redirect("/login", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`);
  }

  if (await hasValidSession(request, user, pass)) {
    return context.next();
  }

  // Browsers get the login page; non-HTML requests get a plain 401.
  if (request.headers.get("accept")?.includes("text/html")) {
    return redirect("/login");
  }
  return new Response("Authentication required.", { status: 401 });
};

async function handleLogin(form: FormData, user: string, pass: string, secure: boolean): Promise<Response> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!(timingSafeEqual(email, user) && timingSafeEqual(password, pass))) {
    return redirect("/login?error=1");
  }

  const expires = String(Date.now() + SESSION_HOURS * 3600_000);
  const token = `${expires}.${await sign(expires, user, pass)}`;
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}${secure ? "; Secure" : ""}`;
  return redirect("/", cookie);
}

async function hasValidSession(request: Request, user: string, pass: string): Promise<boolean> {
  const raw = (request.headers.get("cookie") ?? "")
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!raw) return false;

  const dot = raw.indexOf(".");
  if (dot < 0) return false;
  const expires = raw.slice(0, dot);
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;

  return timingSafeEqual(raw.slice(dot + 1), await sign(expires, user, pass));
}

// HMAC the expiry with the credentials so cookies can't be forged or extended.
async function sign(expires: string, user: string, pass: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(`${user}:${pass}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`liftrex-session:${expires}`));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function redirect(location: string, cookie?: string): Response {
  const headers = new Headers({ location });
  if (cookie) headers.set("set-cookie", cookie);
  return new Response(null, { status: 303, headers });
}

// Constant-time string comparison to avoid timing attacks.
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length === bb.length ? 0 : 1;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ab[i % ab.length] ?? 0) ^ (bb[i % bb.length] ?? 0);
  }
  return diff === 0;
}
