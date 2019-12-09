import React, { Component } from "react";

class OrderTotal extends Component {
  calculateOrderTotal = () => {
    let total = 0;
    this.props.items.map(
      item => (total = total + Number(item.price_when_order * item.qty))
    );
    return total;
  };

  render() {
    return this.calculateOrderTotal();
  }
}

export default OrderTotal;
