import React, { Component } from "react";
import { getOrderDetails } from "../../services/orderService";
import { Table, Grid, Button, Input } from "semantic-ui-react";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import InvoiceOrderItem from "./invoiceOrderItem";
import {
  saveOrderItems,
  getReceivedOrderItems,
  updateOrderItem,
  deleteOrderItem
} from "../../services/receiveOrderService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Form from "../common/form";
import Joi from "joi-browser";

class InvoiceOrder extends Form {
  state = {
    order: { supplier: {}, total_items: [] },
    receivedOrder: [],
    invoiceDate: new Date(),
    data: {
      invoiceId: "",
      tax: "",
      shipping: ""
    },
    errors: {}
  };

  schema = {
    invoiceId: Joi.string()
      .required()
      .label("Invoice Id"),
    tax: Joi.number()
      .required()
      .label("Tax"),
    shipping: Joi.number()
      .required()
      .label("Shipping")
  };

  async getOrderDetail() {
    try {
      this.setState({ blocking: true });
      const orderId = this.props.match.params.id;
      const { data: order } = await getOrderDetails(orderId);

      order.total_items.map(item => saveOrderItems(item));
      const receivedOrder = getReceivedOrderItems();

      this.setState({ order, receivedOrder, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.getOrderDetail();
    this.setState({ blocking: false });
  }

  handleConfirm = (itemId, checked) => {
    let checkBoxVal;
    if (checked) {
      checkBoxVal = 1;
    } else {
      checkBoxVal = 0;
    }
    updateOrderItem(itemId, checkBoxVal, "confirm");
    this.loadOrderItems();
  };

  handleDelete = item => {
    deleteOrderItem(item);
    this.loadOrderItems();
  };

  handleQtyUpdate = (itemId, val) => {
    updateOrderItem(itemId, val, "qty");
    this.loadOrderItems();
  };

  handlePriceUpdate = (itemId, val) => {
    updateOrderItem(itemId, val, "price");
    this.loadOrderItems();
  };

  loadOrderItems() {
    const receivedOrder = getReceivedOrderItems();
    this.setState({ receivedOrder });
  }

  doSubmit = () => {
    console.log(this.state.receivedOrder);
  };

  reloadScreen() {
    window.location.reload();
  }

  handleChangePicker = date => {
    this.setState({
      invoiceDate: date
    });
  };

  handleInvoice = val => {
    this.setState({
      invoiceId: val.value
    });
  };

  handleTax = val => {
    this.setState({
      tax: val.value
    });
  };

  handleShipping = val => {
    this.setState({
      shipping: val.value
    });
  };

  render() {
    let pageHeader = `${this.state.order.supplier.name} Invoice`;
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title={pageHeader} icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Button
                  className="ui secondary button"
                  onClick={() =>
                    this.props.history.push(
                      `/receive-orders/view/${this.props.match.params.id}`
                    )
                  }
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="ui secondary button"
                  onClick={this.reloadScreen}
                >
                  Reset all changes
                </Button>
              </Grid.Column>

              <Grid.Column width={4} style={{ textAlign: "right" }}>
                {this.renderButton("Confirm Order")}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={2} divided style={{ marginTop: "0px" }}>
            <Grid.Row>
              <Grid.Column>
                <Table definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={4}>Invoice #</Table.Cell>
                      <Table.Cell>
                        {this.renderInput("invoiceId", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>Invoice date</Table.Cell>
                      <Table.Cell>
                        <DatePicker
                          selected={this.state.invoiceDate}
                          onChange={this.handleChangePicker}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>Total</Table.Cell>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column>
                <Table definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={4}>Tax</Table.Cell>
                      <Table.Cell>
                        {this.renderInput("tax", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell width={4}>Shipping</Table.Cell>
                      <Table.Cell>
                        {this.renderInput("shipping", "", "text")}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </form>

        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Item code</Table.HeaderCell>
              <Table.HeaderCell width={3}>Item name</Table.HeaderCell>
              <Table.HeaderCell width={2}>Item unit</Table.HeaderCell>
              <Table.HeaderCell width={1}>Order qty</Table.HeaderCell>
              <Table.HeaderCell width={2}>Price</Table.HeaderCell>
              <Table.HeaderCell width={2}>Total</Table.HeaderCell>
              <Table.HeaderCell width={2}>Received</Table.HeaderCell>
              <Table.HeaderCell width={1}>Confirm</Table.HeaderCell>
              <Table.HeaderCell width={1}>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.receivedOrder.map(item => (
              <InvoiceOrderItem
                key={item.id}
                onConfirm={this.handleConfirm}
                onDelete={this.handleDelete}
                onQtyUpdate={this.handleQtyUpdate}
                onPriceUpdate={this.handlePriceUpdate}
                item={item}
              />
            ))}
          </Table.Body>
        </Table>
      </BlockUi>
    );
  }
}

export default InvoiceOrder;
