import React, { Component } from "react";

import {
  getMenuTypes,
  getMenuDataItems,
  saveMenuDataItem,
  updateMenuDataItem,
  updateMenuDataProductItem,
  updateMenuDataOuterItem,
  getOrderItems,
  deleteOrderItem,
  saveOrderItem,
  getOrderTotal,
  deleteAllOrderItem,
  saveOrderToServer,
  updateMenuDataCombinedItem,
  loadMainMenuData,
  calculateTax,
  calculateGrandTotal,
  populateEditOrder,
  deleteMenuData,
  updateOrderToServer
} from "../../services/terminalService";
import { getOrderDetails } from "../../services/cashierOrderService";
import ReactToPrint from "react-to-print";
import {
  Grid,
  Image,
  Card,
  Table,
  Button,
  Statistic,
  Label,
  Form
} from "semantic-ui-react";
import BlockUi from "react-block-ui";
import Counter from "../order/counter";
import { toast } from "react-toastify";
import auth from "../../services/authService";

import Printing from "../order/printing";
import Currency from "../common/currency";

class Terminal extends Component {
  state = {
    menu_types: [],
    visible_menu_types: [],
    orderItems: getOrderItems(),
    show: "none",
    orderType: "dine-in",
    back: "root",
    paymentType: "cash",
    user: [],
    editOrderId: ""
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    if (this.props.match.params.id) {
      const { data: order } = await getOrderDetails(this.props.match.params.id);
      populateEditOrder(order.total_items);
      this.setState({ editOrderId: order.id, orderType: order.order_type });
    } else {
      deleteAllOrderItem();
    }
    this.setState({ user });
    this.setState({ blocking: true });
    deleteMenuData();
    const { data: menu_types } = await getMenuTypes();
    let visible_menu_types = saveMenuDataItem(menu_types);
    this.setState({
      blocking: false,
      menu_types: getMenuDataItems(),
      visible_menu_types
    });
  }

  handleOrderItemDelete = id => {
    deleteOrderItem(id);
    this.loadOrderItems();
  };

  handleOrderItemUpdate = (qty, total, id) => {
    const item = { qty: qty, total: total, id: id };
    saveOrderItem(item);
    this.loadOrderItems();
  };

  cardVisibility() {
    if (this.state.orderItems.length === 0) return "none";
    return "block";
  }

  saveOrder = async () => {
    this.setState({ blocking: true });

    let msg = "";
    let data = {
      items: this.state.orderItems,
      orderType: this.state.orderType,
      orderTotal: getOrderTotal(),
      orderTax: calculateTax(auth.getCurrentUser().tax)
    };

    if (this.state.editOrderId) {
      data._method = "PUT";
      await updateOrderToServer(data, this.state.editOrderId);
      msg = "Order has been updated successfully.";
    } else {
      await saveOrderToServer(data);
      msg = "Order has been placed successfully.";
    }

    this.setState({ blocking: false });
    toast.success(msg);
    deleteAllOrderItem();
    this.loadOrderItems();
    this.handleBack();
    this.setState({ orderType: "dine-in" });
  };

  handleIncrement = item => {
    item.decrement = 0;
    saveOrderItem(item);
    this.loadOrderItems();
  };

  loadOrderItems() {
    const orderItems = getOrderItems();
    this.setState({ orderItems });
  }

  handleDecrement = item => {
    item.decrement = 1;
    saveOrderItem(item);
    this.loadOrderItems();
  };

  handleType = type => {
    if (type.price) {
      this.handleIncrement(type);
    } else {
      this.setState({ show: true });
      if (type.children == undefined && type.items == undefined) {
        let visible_menu_types = updateMenuDataOuterItem(type.id);
        this.setState({ visible_menu_types });
      } else if (type.children !== undefined && type.items !== undefined) {
        let visible_menu_types = updateMenuDataCombinedItem(
          type.children,
          type.items
        );
        this.setState({ visible_menu_types });
      } else if (type.children != undefined && type.children.length > 0) {
        let visible_menu_types = updateMenuDataItem(type.children);
        this.setState({ visible_menu_types });
      } else if (type.items != undefined && type.items.length > 0) {
        let visible_menu_types = updateMenuDataProductItem(type.items);
        this.setState({ visible_menu_types });
      }
    }
  };

  handleBack = () => {
    if (this.state.back === "root") {
      let visible_menu_types = loadMainMenuData(this.state.menu_types);
      this.setState({ visible_menu_types, show: "none" });
    }
  };

  updateOrderType = orderType => {
    this.setState({ orderType });
  };

  updatePaymentType = paymentType => {
    this.setState({ paymentType });
  };

  cancelOrder = () => {
    this.setState({ editOrderId: "" });
    deleteAllOrderItem();
    this.loadOrderItems();
    this.handleBack();
  };

  render() {
    const { user } = this.state;

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={6} style={{ paddingRight: "40px" }}>
              <center
                style={{
                  display: user.user_type == "cashier" ? "block" : "none"
                }}
              >
                <Button.Group>
                  <Button
                    positive={this.state.orderType === "dine-in" ? true : false}
                    onClick={() => this.updateOrderType("dine-in")}
                  >
                    Dine-in
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={
                      this.state.orderType === "delivery" ? true : false
                    }
                    onClick={() => this.updateOrderType("delivery")}
                  >
                    Delivery
                  </Button>
                </Button.Group>

                <Button.Group style={{ marginLeft: "14px" }}>
                  <Button
                    positive={this.state.paymentType === "cash" ? true : false}
                    onClick={() => this.updatePaymentType("cash")}
                  >
                    Cash
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={this.state.paymentType === "card" ? true : false}
                    onClick={() => this.updatePaymentType("card")}
                  >
                    Card
                  </Button>
                  <Button.Or text="or" />
                  <Button
                    positive={this.state.paymentType === "both" ? true : false}
                    onClick={() => this.updatePaymentType("both")}
                  >
                    Both
                  </Button>
                </Button.Group>
              </center>
              <Card style={{ display: this.cardVisibility(), width: "100%" }}>
                <Card.Content>
                  <Label circular color="blue" floating>
                    {this.state.orderItems.length}
                  </Label>
                  <Table>
                    <Table.Body>
                      {this.state.orderItems.map(item => (
                        <Counter
                          item={item}
                          key={item.id}
                          onDelete={this.handleOrderItemDelete}
                          onUpdate={this.handleOrderItemUpdate}
                          onIncrement={this.handleIncrement}
                          onDecrement={this.handleDecrement}
                        />
                      ))}
                    </Table.Body>
                  </Table>

                  <Form>
                    <Grid columns={3} padded>
                      <Grid.Column>
                        <Statistic color="green" size="tiny">
                          <Statistic.Value>
                            <Currency label="" />
                            {getOrderTotal()}
                          </Statistic.Value>
                          <Statistic.Label>Sub Total</Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                      <Grid.Column>
                        <Statistic color="green" size="tiny">
                          <Statistic.Value>
                            <Currency label="" />
                            {calculateTax(auth.getCurrentUser().tax)}
                          </Statistic.Value>
                          <Statistic.Label>Tax</Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                      <Grid.Column>
                        <Statistic color="green" size="tiny">
                          <Statistic.Value>
                            <Currency label="" />
                            {calculateGrandTotal(auth.getCurrentUser().tax)}
                          </Statistic.Value>
                          <Statistic.Label>Total</Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                    </Grid>

                    <Grid columns={3} padded>
                      <Grid.Column>
                        {" "}
                        <Button secondary onClick={this.cancelOrder}>
                          Cancel
                        </Button>
                      </Grid.Column>
                      <Grid.Column>
                        <Button primary onClick={this.saveOrder}>
                          {this.state.editOrderId == "" ? "Submit" : "Update"}
                        </Button>
                      </Grid.Column>
                      <Grid.Column>
                        <ReactToPrint
                          trigger={() => (
                            <Button
                              style={{
                                display:
                                  user.user_type == "cashier" ? "block" : "none"
                              }}
                              secondary
                            >
                              Print
                            </Button>
                          )}
                          content={() => this.componentRef}
                        />
                      </Grid.Column>
                    </Grid>
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column width={10}>
              <Grid columns={6}>
                {this.state.visible_menu_types.map(item => (
                  <Grid.Column key={item.id}>
                    <Image
                      style={{
                        cursor: "pointer"
                      }}
                      bordered
                      size="large"
                      label={{
                        color: "orange",
                        content: item.price
                          ? item.price + " " + item.name
                          : " " + item.name,
                        ribbon: false
                      }}
                      src={
                        item.thumbnail === ""
                          ? "/white-image.png"
                          : process.env.REACT_APP_BACKEND_URL +
                            "/storage/" +
                            item.thumbnail
                      }
                      onClick={() => this.handleType(item)}
                    />
                  </Grid.Column>
                ))}
                <Grid.Column key="back">
                  <Image
                    style={{
                      cursor: "pointer",
                      display: this.state.show
                    }}
                    bordered
                    size="large"
                    src={"/back.png"}
                    onClick={this.handleBack}
                  />
                </Grid.Column>
              </Grid>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br /> <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <Printing
                order={this.state.orderItems}
                total={getOrderTotal()}
                tax={calculateTax(auth.getCurrentUser().tax)}
                grand={calculateGrandTotal(auth.getCurrentUser().tax)}
                ref={el => (this.componentRef = el)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </BlockUi>
    );
  }
}

export default Terminal;
