import http from "./httpService";
import config from "../config.json";

function unitsStoreUrl() {
  return `/units`;
}

export function getUnits() {
  return http.get(unitsStoreUrl());
}
