import http from "./httpService";
import auth from "./authService";

export function getGeneralReport(companyId) {
  return http.get(`/companies/${companyId}/reports/general`);
}

export function getOrdersBySuppliersReport(outletId) {
  return http.get(`/companies/${outletId}/reports/orders-by-supplier`);
}

export function getPendingOrdersBySuppliersReport(outletId) {
  return http.get(`/companies/${outletId}/reports/pending-orders-by-supplier`);
}

export function getOrdersValueBySuppliersReport(outletId) {
  return http.get(`/companies/${outletId}/reports/orders-value-by-supplier`);
}

export function getItemsByCategoiresReport(outletId) {
  return http.get(`/companies/${outletId}/reports/items-by-categoires`);
}

export function getItemsByStorageAreasReport(outletId) {
  return http.get(`/outlet/${outletId}/reports/items-by-storageareas`);
}

export function getItemsBySuppliersReport(outletId) {
  return http.get(`/outlet/${outletId}/reports/items-by-suppliers`);
}

export function getOrdersByCashiersReport(outletId) {
  return http.get(`/outlet/${outletId}/reports/orders-by-cashiers`);
}

export function getItemsByMenuTypesReport(outletId) {
  return http.get(`/outlet/${outletId}/reports/items-by-menutypes`);
}
export function getItemsCurrentStockAndValueReport(outletId) {
  return http.get(`/outlet/${outletId}/reports/supply-stock-and-value`);
}
