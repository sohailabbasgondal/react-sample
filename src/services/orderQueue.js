import http from "./httpService";
import auth from "./authService";

function cashierOrderUrl(status) {
  return `/outlet/${
    auth.getCurrentUser().outlet_id
  }/cashier-orders/status/${status}`;
}

function cashierOrderUpdateUrl(orderId) {
  return `/outlet/${
    auth.getCurrentUser().outlet_id
  }/cashier-orders/${orderId}/update`;
}

export function getOrders(status) {
  return http.get(cashierOrderUrl(status));
}

export function updateOrder(orderId, data) {
  return http.put(cashierOrderUpdateUrl(orderId), data);
}
