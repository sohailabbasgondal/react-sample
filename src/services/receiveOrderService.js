import http from "./httpService";
import auth from "./authService";

const receivedOrderItems = [];

// order items functions
export function saveOrderItems(item) {
  let itemInDb = receivedOrderItems.find(m => m.id === item.item_id) || {};
  if (!itemInDb.id) {
    itemInDb.id = item.item_id;
    itemInDb.code = item.item.code;
    itemInDb.name = item.item.name;
    itemInDb.unit = item.item.unit.name;
    itemInDb.qty = item.qty;
    itemInDb.price = item.price_when_order;
    itemInDb.received = item.qty;
    itemInDb.confirmed = 0;

    receivedOrderItems.push(itemInDb);
    return itemInDb;
  }
}

export function updateOrderItem(itemId, qty, type) {
  let itemInDb = receivedOrderItems.find(m => m.id === itemId);

  if (type === "qty") {
    itemInDb.received = qty;
  }
  if (type === "confirm") {
    itemInDb.confirmed = qty;
  }

  if (type === "price") {
    itemInDb.price = qty;
  }
  console.log(receivedOrderItems);
}

export function getReceivedOrderItems() {
  return receivedOrderItems;
}

export function deleteOrderItem(id) {
  let itemInDb = receivedOrderItems.find(m => m.id === id);
  receivedOrderItems.splice(receivedOrderItems.indexOf(itemInDb), 1);
  return itemInDb;
}
