import http from "./httpService";
import jwtDecode from "jwt-decode";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(
    process.env.REACT_APP_API_AUTH_URL + "/login",
    {
      email,
      password
    }
  );
  localStorage.setItem("token", jwt);
}

export async function refresh() {
  const { data: jwt } = await http.get(
    process.env.REACT_APP_API_AUTH_URL + "/refresh"
  );
  localStorage.setItem("token", jwt);
  window.location = "/dashboard";
}

export function logout() {
  localStorage.removeItem("token");
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem("token");
}

export default {
  login,
  logout,
  getCurrentUser,
  getJwt,
  refresh
};
