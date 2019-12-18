import http from "./httpService";
import auth from "./authService";

const config = {
  headers: {
    "Content-Type": "multipart/form-data"
  }
};

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
  return http.post(menuTypeStoreUrl(), menuType, config);
}

export function updateMenuType(menuType, menuTypeId) {
  return http.post(menuTypeStoreUrl(menuTypeId), menuType, config);
}

export function getMenuType(menuTypeId) {
  return http.get(menuTypeStoreUrl(menuTypeId));
}
