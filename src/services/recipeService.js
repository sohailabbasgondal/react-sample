import http from "./httpService";
import config from "../config.json";
import auth from "./authService";

function recipeStoreUrl(menu_item, id) {
  if (id)
    return `/outlet/${
      auth.getCurrentUser().outlet_id
    }/menu-item/${menu_item}/servings/${id}`;
  else
    return `/outlet/${
      auth.getCurrentUser().outlet_id
    }/menu-item/${menu_item}/servings`;
}

export function getServings(menu_item) {
  return http.get(recipeStoreUrl(menu_item));
}

export function deleteServing(menu_item, id) {
  return http.delete(recipeStoreUrl(menu_item, id));
}

export function saveServing(menu_item) {
  return http.post(recipeStoreUrl(menu_item.menu_item_id), menu_item);
}
