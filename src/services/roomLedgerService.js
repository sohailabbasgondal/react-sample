import http from "./httpService";
import auth from "./authService";

function supplierStoreUrl(id) {
  const pVisaId = localStorage.getItem("roomId");

  if (id) return `/rooms/${pVisaId}/ledgers/${id}`;
  else return `/rooms/${pVisaId}/ledgers`;
}

export function getAllLedgers() {
  return http.get(supplierStoreUrl());
}

export function deleteLedger(supplierId) {
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
    `/rooms/${auth.getCurrentUser().company_id}/ledgers/${supplier.id}/status`
  );
}

export function getLedger(supplierId) {
  return http.get(supplierStoreUrl(supplierId));
}
