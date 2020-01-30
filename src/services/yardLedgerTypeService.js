import http from "./httpService";
import auth from "./authService";

function supplierStoreUrl(id) {
  if (id)
    return `/companies/${
      auth.getCurrentUser().company_id
    }/yards-ledger-types/${id}`;
  else
    return `/companies/${auth.getCurrentUser().company_id}/yards-ledger-types`;
}

export function getLedgerTypes() {
  return http.get(supplierStoreUrl());
}

export function deleteLedgerType(supplierId) {
  return http.delete(supplierStoreUrl(supplierId));
}

export function saveLedgerType(supplier) {
  return http.post(supplierStoreUrl(), supplier);
}

export function updateLedgerType(supplier) {
  return http.put(supplierStoreUrl(supplier.id), supplier);
}

export function updateLedgerTypeStatus(supplier) {
  return http.get(
    `/companies/${auth.getCurrentUser().company_id}/yards-ledger-types/${
      supplier.id
    }/status`
  );
}

export function getLedgerType(supplierId) {
  return http.get(supplierStoreUrl(supplierId));
}
