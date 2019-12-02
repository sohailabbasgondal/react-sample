import React, { Component } from "react";

const OrderDetails = ({ match }) => {
  return <h1>Order Details {match.params.id}</h1>;
};

export default OrderDetails;
