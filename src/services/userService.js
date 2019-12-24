import http from "./httpService";
import auth from "./authService";

function userStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/accounts/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/accounts`;
}

function outletUserUrl(userType) {
  return `/outlet/${auth.getCurrentUser().outlet_id}/accounts/user/${userType}`;
}

export function getUsers($userType) {
  return http.get(outletUserUrl($userType));
}

export function deleteUser(userId) {
  return http.delete(userStoreUrl(userId));
}

export function saveUser(user, userType) {
  user.user_type = userType;
  return http.post(userStoreUrl(), user);
}

export function updateUser(user) {
  return http.put(userStoreUrl(user.id), user);
}

export function getUser(userId) {
  return http.get(userStoreUrl(userId));
}
