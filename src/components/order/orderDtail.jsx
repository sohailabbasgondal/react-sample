import React, { Component } from "react";
import { getOrderDetails } from "../../services/orderService";
import { Table, Grid } from "semantic-ui-react";
import BlockUi from "react-block-ui";
import OrderTotal from "../order/orderTotal";

class OrderDetail extends Component {
  state = {
    order: { supplier: {}, total_items: [] }
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
                    <Table.Cell width={4}>Order delivery date</Table.Cell>
                    <Table.Cell>
                      {this.state.order.order_delivery_date}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Message</Table.Cell>
                    <Table.Cell>
                      {this.state.order.message
                        ? this.state.order.message
                        : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Supplier</Table.Cell>
                    <Table.Cell>{this.state.order.supplier.name}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Total items</Table.Cell>
                    <Table.Cell>
                      {this.state.order.total_items.length}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Total price</Table.Cell>
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
            <Grid.Column>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>Invoice #</Table.Cell>
                    <Table.Cell>
                      {this.state.order.doc_invoice_number
                        ? this.state.order.doc_invoice_number
                        : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Invoice date</Table.Cell>
                    <Table.Cell>
                      {this.state.order.doc_invoice_date
                        ? this.state.order.doc_invoice_date
                        : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Invoice file</Table.Cell>
                    <Table.Cell>
                      {this.state.order.invoice_file}
                      {this.state.order.invoice_file
                        ? this.state.order.invoice_file
                        : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Tax</Table.Cell>
                    <Table.Cell>
                      {this.state.order.tax ? this.state.order.tax : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Shipping</Table.Cell>
                    <Table.Cell>
                      {this.state.order.shipping
                        ? this.state.order.shipping
                        : "N/A"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}></Table.Cell>
                    <Table.Cell>&nbsp;</Table.Cell>
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
              <Table.HeaderCell width={2}>Unit</Table.HeaderCell>
              <Table.HeaderCell width={2}>Product code</Table.HeaderCell>
              <Table.HeaderCell width={2}>Quantity</Table.HeaderCell>
              <Table.HeaderCell width={3}>Price when order</Table.HeaderCell>
              <Table.HeaderCell width={2}>Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.order.total_items.map(item => (
              <Table.Row>
                <Table.Cell>{item.item.name}</Table.Cell>
                <Table.Cell>{item.item.unit.name}</Table.Cell>
                <Table.Cell>{item.item.code}</Table.Cell>
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

export default OrderDetail;
