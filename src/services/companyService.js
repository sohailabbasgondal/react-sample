import http from "./httpService";
import auth from "./authService";

function companyStoreUrl(id) {
  if (id) return `/clients/${auth.getCurrentUser().client_id}/companies/${id}`;
  else return `/clients/${auth.getCurrentUser().client_id}/companies`;
}

export function getCompanies() {
  return http.get(companyStoreUrl());
}

export function getCompany(id) {
  return http.get(companyStoreUrl(id));
}

export function deleteCompany(companyId) {
  return http.delete(companyStoreUrl(companyId));
}

export function saveCompany(company) {
  return http.post(companyStoreUrl(), company);
}

export function updateCompany(company) {
  return http.put(companyStoreUrl(company.id), company);
}

export function updateCompanyStatus(supplier) {
  return http.get(
    `/clients/${auth.getCurrentUser().client_id}/companies/${
      supplier.id
    }/status`
  );
}

export function updateCompanyManager(outlet) {
  return http.post(companyStoreUrl(outlet.manager_id, "other"), outlet);
}

export function getComapany(companyId) {
  return http.get(companyStoreUrl(companyId));
}
