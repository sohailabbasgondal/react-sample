import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

function outletStoreUrl(id, url = "default") {
  if (url === "other") {
    return `/store/${auth.getCurrentUser().store_id}/outlet/${id}`;
  } else {
    if (id) return `/store/${auth.getCurrentUser().store_id}/outlets/${id}`;
    else return `/store/${auth.getCurrentUser().store_id}/outlets`;
  }
}

export function getOutlets() {
  return http.get(outletStoreUrl());
}

export function deleteOutlet(outletId) {
  return http.delete(config.apiEndPoint + "/store/1/outlets/" + outletId);
}

export function saveOutlet(outlet) {
  return http.post(outletStoreUrl(), outlet);
}

export function updateOutlet(outlet) {
  return http.put(outletStoreUrl(outlet.id), outlet);
}

export function updateOutletManager(outlet) {
  return http.post(outletStoreUrl(outlet.id, "other"), outlet);
}

export function getOutlet(outletId) {
  return http.get(outletStoreUrl(outletId));
}
