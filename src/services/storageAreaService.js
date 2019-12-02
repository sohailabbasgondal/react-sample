import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

function storageAreaStoreUrl(id) {
  if (id)
    return `/outlet/${auth.getCurrentUser().outlet_id}/storage-areas/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/storage-areas`;
}

export function getStorageAreas() {
  return http.get(storageAreaStoreUrl());
}

export function deleteStorageArea(storageAreaId) {
  return http.delete(storageAreaStoreUrl(storageAreaId));
}

export function saveStorageArea(storageArea) {
  return http.post(storageAreaStoreUrl(), storageArea);
}

export function updateStorageArea(storageArea) {
  return http.put(storageAreaStoreUrl(storageArea.id), storageArea);
}

export function getStorageArea(storageAreaId) {
  return http.get(storageAreaStoreUrl(storageAreaId));
}
