import React, { Component } from "react";
import { Card, Feed } from "semantic-ui-react";
import Counter from "./counter";
import { getOrderItems, deleteOrderItem } from "../../services/orderService";

class Order extends Component {
  state = {
    items: getOrderItems()
  };

  handleDelete = id => {
    deleteOrderItem(id);
    const items = getOrderItems();
    this.setState({ items });
  };

  render() {
    return (
      <Card style={{ display: this.cardVisibility(), width: "100%" }}>
        <Card.Content>
          <Card.Header>Order Detail</Card.Header>
        </Card.Content>
        <Card.Content>
          <Feed>
            {this.state.items.map(item => (
              <div>
                <Counter
                  item={item}
                  key={item.id}
                  onDelete={this.handleDelete}
                />
              </div>
            ))}
          </Feed>
        </Card.Content>
      </Card>
    );
  }
  cardVisibility() {
    console.log(this.state.items.length + "gondal");
    if (this.state.items.length === 0) return "none";
    return "block";
  }
}

export default Order;
