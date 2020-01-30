import http from "./httpService";
import auth from "./authService";

function supplierStoreUrl(id) {
  if (id)
    return `/companies/${auth.getCurrentUser().company_id}/bank-details/${id}`;
  else return `/companies/${auth.getCurrentUser().company_id}/bank-details`;
}

export function getAll() {
  return http.get(supplierStoreUrl());
}

export function deleteSingle(supplierId) {
  return http.delete(supplierStoreUrl(supplierId));
}

export function saveSingle(supplier) {
  return http.post(supplierStoreUrl(), supplier);
}

export function updateSingle(supplier) {
  return http.put(supplierStoreUrl(supplier.id), supplier);
}

export function getSingle(supplierId) {
  return http.get(supplierStoreUrl(supplierId));
}
