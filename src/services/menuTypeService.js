import http from "./httpService";
import auth from "./authService";

function menuTypeStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/menu-types/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/menu-types`;
}

export function getMenuTypes() {
  return http.get(menuTypeStoreUrl());
}

export function deleteMenuType(menuTypeId) {
  return http.delete(menuTypeStoreUrl(menuTypeId));
}

export function saveMenuType(menuType) {
  return http.post(menuTypeStoreUrl(), menuType);
}

export function updateMenuType(menuType) {
  return http.put(menuTypeStoreUrl(menuType.id), menuType);
}

export function getMenuType(menuTypeId) {
  return http.get(menuTypeStoreUrl(menuTypeId));
}
