import http from "./httpService";
import auth from "./authService";

function salaryStoreUrl(id) {
  if (id) return `/clients/${auth.getCurrentUser().client_id}/salaries/${id}`;
  else return `/clients/${auth.getCurrentUser().client_id}/salaries`;
}

export function getSalaries() {
  return http.get(salaryStoreUrl());
}

export function getVisas() {
  return http.get(`/clients/${auth.getCurrentUser().client_id}/visas`);
}

export function verifyDate(data) {
  return http.post(
    `/clients/${auth.getCurrentUser().client_id}/salary/verify-date`,
    data
  );
}

export function deleteSalary(salaryId) {
  return http.delete(salaryStoreUrl(salaryId));
}

export function saveSalary(salary) {
  return http.post(salaryStoreUrl(), salary);
}

export function updateSalary(salary) {
  return http.put(salaryStoreUrl(salary.id), salary);
}

export function updateSalaryStatus(salary) {
  return http.get(
    `/clients/${auth.getCurrentUser().client_id}/salaries/${salary.id}/status`
  );
}

export function getSalary(salaryId) {
  return http.get(salaryStoreUrl(salaryId));
}
