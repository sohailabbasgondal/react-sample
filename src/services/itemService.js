import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

function itemStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/items/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/items`;
}

export function getItems() {
  return http.get(itemStoreUrl());
}

export function deleteItem(itemId) {
  return http.delete(itemStoreUrl(itemId));
}

export function saveItem(item) {
  return http.post(itemStoreUrl(), item);
}

export function updateItem(item) {
  return http.put(itemStoreUrl(item.id), item);
}

export function getItem(item) {
  return http.get(itemStoreUrl(item));
}
