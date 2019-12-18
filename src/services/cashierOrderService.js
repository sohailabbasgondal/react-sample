import http from "./httpService";
import auth from "./authService";

function orderStoreUrl(id) {
  if (id)
    return `/outlet/${auth.getCurrentUser().outlet_id}/cashier-orders/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/cashier-orders`;
}

/* Server calls*/
export function getOrders() {
  return http.get(orderStoreUrl());
}

export function getOrderDetails($id) {
  return http.get(orderStoreUrl($id));
}
