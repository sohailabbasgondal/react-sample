import http from "./httpService";
import auth from "./authService";

const orderItems = [];

function orderStoreUrl(id) {
  if (id) return `/outlet/${auth.getCurrentUser().outlet_id}/orders/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/orders`;
}

export function getOrderItems() {
  return orderItems;
}

export function getOrderItem(id) {
  return orderItems.find(m => m.id === id);
}

export function getOrderTotal() {
  let order = 0;
  orderItems.map(item => (order = order + Number(item.total)));

  return order;
}

export function saveOrderToServer(data) {
  return http.post(orderStoreUrl(), data);
}

export function saveOrderItem(item) {
  let itemInDb = orderItems.find(m => m.id === item.id) || {};

  if (!itemInDb.id && item.decrement == 0) {
    itemInDb.id = item.id;
    itemInDb.qty = 1;
    itemInDb.title = item.name;
    itemInDb.price = item.price;
    itemInDb.total = item.price;
    orderItems.push(itemInDb);
  } else {
    let currentState;
    if (item.decrement == 0) {
      currentState = itemInDb.qty + 1;
    } else {
      currentState = itemInDb.qty - 1;
      if (currentState == 0) {
        deleteOrderItem(itemInDb.id);
      }
    }
    itemInDb.qty = currentState;
    itemInDb.total = itemInDb.price * currentState;
    itemInDb.decrement = "";
  }

  return itemInDb;
}

export function deleteOrderItem(id) {
  let itemInDb = orderItems.find(m => m.id === id);
  orderItems.splice(orderItems.indexOf(itemInDb), 1);
  return itemInDb;
}
