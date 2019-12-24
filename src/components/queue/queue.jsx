import React, { Component } from "react";

import { getOrders, updateOrder } from "../../services/orderQueue";
import { Card, Table, Button } from "semantic-ui-react";
import BlockUi from "react-block-ui";
import { toast } from "react-toastify";
import auth from "../../services/authService";

class Queue extends Component {
  state = {
    orders: [],
    user: "",
    orderStatus: 1
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();

    this.setState({ user });
    this.setState({ blocking: true });
    const { data: orders } = await getOrders(1);
    this.setState({
      blocking: false,
      orders
    });
  }

  updateOrderType = async orderStatus => {
    this.setState({ orderStatus });

    this.setState({ blocking: true });
    const { data: orders } = await getOrders(orderStatus);
    this.setState({
      blocking: false,
      orders
    });
  };

  handleOrder = async (orderId, status) => {
    let data = { status: status };
    this.setState({ blocking: true });
    await updateOrder(orderId, data);
    if (status == 3) {
      status = 2;
    }
    const { data: orders } = await getOrders(status);

    this.setState({
      blocking: false,
      orders,
      orderStatus: status
    });
    toast.success("Order has been updated successfully.");
  };

  render() {
    const { user } = this.state;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <div style={{ marginBottom: "10px" }}>
          <Button.Group>
            <Button
              positive={this.state.orderStatus == 1 ? true : false}
              onClick={() => this.updateOrderType(1)}
            >
              New Orders
            </Button>
            <Button.Or text="or" />
            <Button
              positive={this.state.orderStatus == 2 ? true : false}
              onClick={() => this.updateOrderType(2)}
            >
              Inprogress
            </Button>
          </Button.Group>
        </div>

        <Card.Group>
          {this.state.orders.map(order => (
            <Card width={4}>
              <Card.Content>
                <Card.Header>
                  <div>
                    ORD#{order.id} - ({order.order_type})
                  </div>
                  <div style={{ float: "right" }}>
                    {order.status == 1
                      ? "Unprepared"
                      : order.status == 2
                      ? "Preparing"
                      : "Prepared"}
                  </div>
                </Card.Header>
                <Card.Meta>By: {order.user.name}</Card.Meta>
                <Card.Description>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Qty</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {order.total_items.map(item => (
                        <Table.Row>
                          <Table.Cell>{item.menu_item.name}</Table.Cell>
                          <Table.Cell>{item.qty}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                {order.status == 1 ? (
                  <Button
                    className="fluid"
                    onClick={() => this.handleOrder(order.id, 2)}
                    color="green"
                  >
                    Start Preparing
                  </Button>
                ) : (
                  <Button
                    color="yellow"
                    className="fluid"
                    onClick={() => this.handleOrder(order.id, 3)}
                  >
                    Finish Prepartion
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </BlockUi>
    );
  }
}

export default Queue;
