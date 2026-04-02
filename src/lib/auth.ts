import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "ww_admin_session";

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "agaunny2000@gmail.com",
    password: process.env.ADMIN_PASSWORD || "wicker123"
  };
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "authenticated";
}

export async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}

export async function signInAdmin(username: string, password: string) {
  const valid = getAdminCredentials();

  if (username !== valid.username || password !== valid.password) {
    return false;
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return true;
}

export async function signOutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
