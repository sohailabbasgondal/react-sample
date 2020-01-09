import http from "./httpService";
import auth from "./authService";

let orderItems = [];

export function initilizeData() {
  orderItems.length = 0;
  let item = {};
  item.id = 1;
  item.title = "Number of outlets";
  item.qty = 1;
  item.price = auth.getCurrentUser().outlet_price;
  item.total = auth.getCurrentUser().outlet_price;
  item.removeDeleteIcon = true;

  orderItems.push(item);
  return orderItems;
}

export function checkIfSubscribed() {
  if (
    auth.getCurrentUser().subscription_id === null ||
    auth.getCurrentUser().subscription_id === ""
  ) {
    return false;
  }
  return true;
}

export function getOrderItems() {
  return orderItems;
}

export function getPaymentPlatforms() {
  return auth.getCurrentUser().platforms;
}

export function getOrderTotal() {
  let order = 0;
  orderItems.map(item => (order = order + Number(item.price * item.qty)));

  return order;
}

export function saveOrderItem(item) {
  let itemInDb = orderItems.find(m => m.id === item.id) || {};

  let currentState;
  if (item.decrement == 1) {
    currentState = itemInDb.qty + 1;
  } else {
    currentState = itemInDb.qty - 1;
    if (currentState <= 1) {
      currentState = 1;
    }
  }
  itemInDb.qty = currentState;
  itemInDb.total = itemInDb.price * currentState;
  itemInDb.decrement = "";

  return itemInDb;
}

/* server calls */
export function payNow(token) {
  orderItems[0].token = token;
  return http.post("/payments/pay ", orderItems);
}

export function subscriptionInfo() {
  return http.get("/payments/subscription-info");
}

export function cancelSubscription() {
  return http.get("/payments/cancel-subscription");
}
