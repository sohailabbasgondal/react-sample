import React, { Component } from "react";
import { getOrderDetails } from "../../services/cashierOrderService";
import { Table, Grid } from "semantic-ui-react";
import BlockUi from "react-block-ui";
import OrderTotal from "./orderTotal";
import Currency from "../common/currency";

class CashierOrderInfo extends Component {
  state = {
    order: { user: {}, total_items: [] }
  };

  async getOrderDetail() {
    try {
      this.setState({ blocking: true });
      const orderId = this.props.id;
      const { data: order } = await getOrderDetails(orderId);

      this.setState({ order, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.getOrderDetail();
    this.setState({ blocking: false });
  }

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Grid columns={2} divided style={{ marginTop: "0px" }}>
          <Grid.Row>
            <Grid.Column>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>Order Id</Table.Cell>
                    <Table.Cell>
                      {this.state.order.outlet_order_counter}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Order date</Table.Cell>
                    <Table.Cell>{this.state.order.created_at}</Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell width={4}>Cashier</Table.Cell>
                    <Table.Cell>{this.state.order.user.name}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>
                      <Currency label="Tax" />
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.order.tax ? this.state.order.tax : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Total items</Table.Cell>
                    <Table.Cell>
                      {this.state.order.total_items.length}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>
                      <Currency label="Total price" />
                    </Table.Cell>
                    <Table.Cell>
                      <OrderTotal
                        key={this.props.id}
                        items={this.state.order.total_items}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={5}>Item</Table.HeaderCell>

              <Table.HeaderCell width={2}>Quantity</Table.HeaderCell>
              <Table.HeaderCell width={3}>
                <Currency label="Price when order" />
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                <Currency label="Total" />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.order.total_items.map(item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.menu_item.name}</Table.Cell>

                <Table.Cell>{item.qty}</Table.Cell>
                <Table.Cell>{item.price_when_order}</Table.Cell>
                <Table.Cell>
                  {Number(item.qty * item.price_when_order)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </BlockUi>
    );
  }
}

export default CashierOrderInfo;
