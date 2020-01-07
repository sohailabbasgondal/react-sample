import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

const headers = {
  headers: {
    "Content-Type": "multipart/form-data"
  }
};

function menuItemStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/menu-items/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/menu-items`;
}

export function getMenuItems() {
  return http.get(menuItemStoreUrl());
}

export function deleteMenuItem(menuItemId) {
  return http.delete(menuItemStoreUrl(menuItemId));
}

export function saveMenuItem(menuItem) {
  return http.post(menuItemStoreUrl(), menuItem, headers);
}

export function updateMenuItem(menuItem, menuItemId) {
  return http.post(menuItemStoreUrl(menuItemId), menuItem, headers);
}

export function updateMenuItemStatus(menuItem) {
  return http.get(
    `/outlet/${auth.getCurrentUser().outlet_id}/menu-items/${
      menuItem.id
    }/status`
  );
}

export function getMenuItem(menuItemId) {
  return http.get(menuItemStoreUrl(menuItemId));
}
