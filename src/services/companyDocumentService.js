import http from "./httpService";
import auth from "./authService";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data"
  }
};

function supplierStoreUrl(id) {
  if (id)
    return `/companies/${auth.getCurrentUser().company_id}/documents/${id}`;
  else return `/companies/${auth.getCurrentUser().company_id}/documents`;
}

export function getAll() {
  return http.get(supplierStoreUrl());
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
