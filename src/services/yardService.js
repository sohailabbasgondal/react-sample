import http from "./httpService";
import auth from "./authService";

function supplierStoreUrl(id) {
  if (id) return `/companies/${auth.getCurrentUser().company_id}/yards/${id}`;
  else return `/companies/${auth.getCurrentUser().company_id}/yards`;
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

export function updateSingleStatus(supplier) {
  return http.get(
    `/companies/${auth.getCurrentUser().company_id}/yards/${supplier.id}/status`
  );
}

export function getSingle(supplierId) {
  return http.get(supplierStoreUrl(supplierId));
}
