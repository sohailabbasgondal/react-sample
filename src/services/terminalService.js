import http from "./httpService";
import auth from "./authService";

const menuData = [];
const visibleMenuData = [];
const orderItems = [];

/* memory order */

export function getOrderItems() {
  return orderItems;
}

export function deleteOrderItem(id) {
  let itemInDb = orderItems.find(m => m.id === id);
  orderItems.splice(orderItems.indexOf(itemInDb), 1);
  return itemInDb;
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

export function getOrderTotal() {
  let order = 0;
  orderItems.map(item => (order = order + Number(item.total)));

  return order;
}

export function deleteAllOrderItem() {
  orderItems.length = 0;
}

/* server side */
function menuTypeStoreUrl(id) {
  if (id)
    return `/outlet/${
      auth.getCurrentUser().outlet_id
    }/terminal-menu-types/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/terminal-menu-types`;
}

function orderStoreUrl(id) {
  if (id)
    return `/outlet/${auth.getCurrentUser().outlet_id}/cashier-orders/${id}`;
  else return `/outlet/${auth.getCurrentUser().outlet_id}/cashier-orders`;
}

export function getMenuTypes() {
  return http.get(menuTypeStoreUrl());
}

export function saveOrderToServer(data) {
  return http.post(orderStoreUrl(), data);
}

/* menu and items handling */
export function getMenuDataItems() {
  return menuData;
}

export function saveMenuDataItem(data) {
  visibleMenuData.length = 0;
  for (const [index, value] of data.entries()) {
    let itemInDb = {};
    itemInDb.id = value.id;
    itemInDb.name = value.name;
    itemInDb.items = value.items;
    itemInDb.children = value.children;
    itemInDb.parent = value.parent;
    itemInDb.thumbnail = value.thumbnail;

    menuData.push(itemInDb);
    if (value.parent == null) {
      visibleMenuData.push(itemInDb);
    }
  }
  return visibleMenuData;
}

export function loadMainMenuData(data) {
  visibleMenuData.length = 0;
  for (const [index, value] of data.entries()) {
    let itemInDb = {};
    itemInDb.id = value.id;
    itemInDb.name = value.name;
    itemInDb.items = value.items;
    itemInDb.children = value.children;
    itemInDb.parent = value.parent;
    itemInDb.thumbnail = value.thumbnail;

    if (value.parent == null) {
      visibleMenuData.push(itemInDb);
    }
  }
  return visibleMenuData;
}

export function updateMenuDataItem(data) {
  visibleMenuData.length = 0;
  for (const [index, value] of data.entries()) {
    let itemInDb = {};
    itemInDb.id = value.id;
    itemInDb.name = value.name;
    itemInDb.items = value.items;
    itemInDb.children = value.children;
    itemInDb.parent = value.parent;
    itemInDb.thumbnail = value.thumbnail;
    visibleMenuData.push(itemInDb);
  }
  return visibleMenuData;
}

export function updateMenuDataProductItem(data) {
  visibleMenuData.length = 0;
  populateData(data);
  return visibleMenuData;
}

export function updateMenuDataOuterItem(id) {
  visibleMenuData.length = 0;
  let itemInDb = menuData.find(m => m.id === id) || {};

  populateData(itemInDb.items);
  return visibleMenuData;
}

export function updateMenuDataCombinedItem(types, items) {
  visibleMenuData.length = 0;
  populateData(items);
  populateData(types);

  return visibleMenuData;
}

function populateData(data) {
  for (const [index, value] of data.entries()) {
    let itemInDb = {};
    itemInDb.id = value.id;
    itemInDb.name = value.name;
    itemInDb.price = value.price ? value.price : "";
    itemInDb.thumbnail = value.thumbnail;
    visibleMenuData.push(itemInDb);
  }
}
