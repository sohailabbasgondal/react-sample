import http from "./httpService";
import auth from "./authService";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data"
  }
};

function supplierStoreUrl(id, vehicle = "") {
  let pVehicleId = "";
  if (vehicle) {
    pVehicleId = vehicle;
  } else {
    pVehicleId = localStorage.getItem("vehicleId");
  }
  if (id) return `/vehicles/${pVehicleId}/documents/${id}`;
  else return `/vehicles/${pVehicleId}/documents`;
}

export function getAll(vehicleId) {
  return http.get(supplierStoreUrl("", vehicleId));
}

export function deleteSingle(supplierId) {
  return http.delete(supplierStoreUrl(supplierId));
}

export function saveSingle(supplier) {
  return http.post(supplierStoreUrl(), supplier, headers);
}

export function updateSingle(menuItem, menuItemId) {
  return http.post(supplierStoreUrl(menuItemId), menuItem, headers);
}

export function getSingle(supplierId) {
  return http.get(supplierStoreUrl(supplierId));
}
