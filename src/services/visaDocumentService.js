import http from "./httpService";
import auth from "./authService";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data"
  }
};

function supplierStoreUrl(id, visa = "") {
  let pVisaId = "";
  if (visa) {
    pVisaId = visa;
  } else {
    pVisaId = localStorage.getItem("visaId");
  }
  if (id) return `/visas/${pVisaId}/documents/${id}`;
  else return `/visas/${pVisaId}/documents`;
}

export function getAll(visaId) {
  return http.get(supplierStoreUrl("", visaId));
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
