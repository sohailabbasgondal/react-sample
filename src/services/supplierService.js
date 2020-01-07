import http from "./httpService";
import auth from "./authService";

function supplierStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/suppliers/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/suppliers`;
}

export function getSuppliers() {
  return http.get(supplierStoreUrl());
}

export function deleteSupplier(supplierId) {
  return http.delete(supplierStoreUrl(supplierId));
}

export function saveSupplier(supplier) {
  return http.post(supplierStoreUrl(), supplier);
}

export function updateSupplier(supplier) {
  return http.put(supplierStoreUrl(supplier.id), supplier);
}

export function updateSupplierStatus(supplier) {
  return http.get(
    `/outlet/${auth.getCurrentUser().outlet_id}/suppliers/${supplier.id}/status`
  );
}

export function getSupplier(supplierId) {
  return http.get(supplierStoreUrl(supplierId));
}
