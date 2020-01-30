import http from "./httpService";
import auth from "./authService";

function userStoreUrl(id) {
  if (id)
    return `/companies/${auth.getCurrentUser().company_id}/accounts/${id}`;
  else return `/companies/${auth.getCurrentUser().company_id}/accounts`;
}

export function getUsers() {
  return http.get(userStoreUrl());
}

export function deleteUser(userId) {
  return http.delete(userStoreUrl(userId));
}

export function saveUser(user) {
  return http.post(userStoreUrl(), user);
}

export function updateUser(user) {
  return http.put(userStoreUrl(user.id), user);
}

export function getUser(userId) {
  return http.get(userStoreUrl(userId));
}
