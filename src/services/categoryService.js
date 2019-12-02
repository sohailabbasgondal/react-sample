import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

function categoryStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/categories/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/categories`;
}

export function getCategories() {
  return http.get(categoryStoreUrl());
}

export function deleteCategory(categoryId) {
  return http.delete(categoryStoreUrl(categoryId));
}

export function saveCateogry(category) {
  return http.post(categoryStoreUrl(), category);
}

export function updateCategory(category) {
  return http.put(categoryStoreUrl(category.id), category);
}

export function getCategory(category) {
  return http.get(categoryStoreUrl(category));
}
