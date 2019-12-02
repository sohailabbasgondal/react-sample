import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

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
  return http.post(menuItemStoreUrl(), menuItem);
}

export function updateMenuItem(menuItem) {
  return http.put(menuItemStoreUrl(menuItem.id), menuItem);
}

export function getMenuItem(menuItemId) {
  return http.get(menuItemStoreUrl(menuItemId));
}
