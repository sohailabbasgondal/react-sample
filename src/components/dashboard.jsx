import React, { Component } from "react";
import {
  Statistic,
  Grid,
  Message,
  Button,
  Table,
  Header,
  Label
} from "semantic-ui-react";
import {
  getGeneralReport,
  getOrdersBySuppliersReport,
  getOrdersValueBySuppliersReport,
  getItemsByCategoiresReport,
  getItemsByStorageAreasReport,
  getItemsBySuppliersReport,
  getPendingOrdersBySuppliersReport,
  getOrdersByCashiersReport,
  getItemsByMenuTypesReport,
  getItemsCurrentStockAndValueReport
} from "../services/reportService";
import Chart from "chart.js";
import BlockUi from "react-block-ui";
import TableTitle from "./common/tableTitle";
import auth from "../services/authService";

import {
  subscriptionInfo,
  cancelSubscription
} from "../services/billingOrderService";
import Currency from "./common/currency";

class Dashboard extends Component {
  state = {
    report: { outlet_account: [] },
    totalCashiers: 0,
    totalWaiters: 0,
    dashboard: "customer",
    outletid: "",
    subscription: { plan: {}, trial_start: " " }
  };

  async componentDidMount() {
    if (auth.getCurrentUser().user_type === "store-manager") {
      this.setState({ dashboard: "outlet" });
      this.loadDashboard(auth.getCurrentUser().outlet_id);
    }

    if (auth.getCurrentUser().user_type === "client") {
      this.loadSubscriptionData();
    }
  }

  loadSubscriptionData = async () => {
    this.setState({
      blocking: true
    });
    const { data: subscription } = await subscriptionInfo();
    this.setState({ subscription, blocking: false });
  };

  loadDashboard = async outletId => {
    this.setState({
      blocking: true,
      show: "none",
      dashboard: "outlet",
      outletid: outletId
    });
    const { data: report } = await getGeneralReport(outletId);

    const { data: supplierOrdersReportData } = await getOrdersBySuppliersReport(
      outletId
    );
    this.barChart(
      supplierOrdersReportData.suppliers,
      supplierOrdersReportData.orders,
      supplierOrdersReportData.colors,
      "bySupplierOrdersCount",
      "Number of orders by suppliers"
    );

    const {
      data: supplierOrdersValueReportData
    } = await getOrdersValueBySuppliersReport(outletId);
    this.barChart(
      supplierOrdersValueReportData.suppliers,
      supplierOrdersValueReportData.orders,
      supplierOrdersValueReportData.colors,
      "bySupplierOrdersValueCount",
      "Value of orders by suppliers"
    );

    const {
      data: itemsByCategoiresReportData
    } = await getItemsByCategoiresReport(outletId);
    this.barChart(
      itemsByCategoiresReportData.categoires,
      itemsByCategoiresReportData.items,
      itemsByCategoiresReportData.colors,
      "byCategoriesItemsCount",
      "Number of items by categoires"
    );

    const {
      data: itemsByStorageAreasReportData
    } = await getItemsByStorageAreasReport(outletId);
    this.barChart(
      itemsByStorageAreasReportData.storage_areas,
      itemsByStorageAreasReportData.items,
      itemsByStorageAreasReportData.colors,
      "byStorageAreasItemsCount",
      "Number of items by storage areas"
    );

    const {
      data: itemsBySuppliersReportData
    } = await getItemsBySuppliersReport(outletId);
    this.barChart(
      itemsBySuppliersReportData.suppliers,
      itemsBySuppliersReportData.items,
      itemsBySuppliersReportData.colors,
      "bySuppliersItemsCount",
      "Number of items by suppliers"
    );

    const {
      data: pendingOrdersBySuppliersReportData
    } = await getPendingOrdersBySuppliersReport(outletId);
    this.barChart(
      pendingOrdersBySuppliersReportData.suppliers,
      pendingOrdersBySuppliersReportData.orders,
      pendingOrdersBySuppliersReportData.colors,
      "bySuppliersPendingOrdersCount",
      "Number of pending orders by suppliers"
    );

    const {
      data: ordersByCashiersReportData
    } = await getOrdersByCashiersReport(outletId);
    this.barChart(
      ordersByCashiersReportData.cashiers,
      ordersByCashiersReportData.orders,
      ordersByCashiersReportData.colors,
      "byCashiersOrdersCount",
      "Number of orders by cashiers"
    );

    const {
      data: menuItemsByMenuItemsTypesReportData
    } = await getItemsByMenuTypesReport(outletId);
    this.barChart(
      menuItemsByMenuItemsTypesReportData.menu_types,
      menuItemsByMenuItemsTypesReportData.items,
      menuItemsByMenuItemsTypesReportData.colors,
      "byMeuItemsItemsCount",
      "Number of menu items by menu types"
    );

    const {
      data: itemsCurrentStocksAndValue
    } = await getItemsCurrentStockAndValueReport(outletId);

    this.barChart(
      itemsCurrentStocksAndValue.items,
      itemsCurrentStocksAndValue.value,
      itemsCurrentStocksAndValue.colors,
      "bySuppliesCurrentStockAndValue",
      "Suppiles current stock and value"
    );

    this.setState({ report, blocking: false });
    this.totalCashiers();
    this.totalWaiters();
  };

  barChart(labels, data, colors, container, title) {
    var ctx = document.getElementById(container);
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  totalCashiers = () => {
    let total = 0;

    this.state.report.outlet_account.map(account =>
      account.outlet_account.user_type == "cashier" ? (total = total + 1) : ""
    );
    this.setState({ totalCashiers: total });
  };
  totalWaiters = () => {
    let total = 0;
    this.state.report.outlet_account.map(account =>
      account.outlet_account.user_type == "waiter" ? (total = total + 1) : ""
    );
    this.setState({ totalWaiters: total });
  };

  loadCustomerDashboard = () => {
    this.setState({ dashboard: "customer" });
  };

  handleCancelSubscription = async () => {
    this.setState({ blocking: true });

    await cancelSubscription();
    auth.refresh();

    this.setState({ blocking: false });
  };

  render() {
    let {
      report,
      totalWaiters,
      totalCashiers,
      dashboard,
      outletid,
      subscription
    } = this.state;
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        {auth.getCurrentUser().user_type === "client" ? (
          <div style={{ marginBottom: "10px" }}>
            <Button.Group>
              {auth.getCurrentUser().outlets.map(outlet => (
                <React.Fragment>
                  <Button
                    id={`outlet${outlet.id}`}
                    positive={
                      dashboard == "outlet" && outletid == outlet.id
                        ? true
                        : false
                    }
                    onClick={() => this.loadDashboard(outlet.id)}
                  >
                    {outlet.name} Dashboard
                  </Button>
                  <Button.Or text="or" />
                </React.Fragment>
              ))}
              <Button
                onClick={this.loadCustomerDashboard}
                positive={dashboard == "customer" ? true : false}
              >
                Customer Dashboard
              </Button>
            </Button.Group>
          </div>
        ) : (
          ""
        )}
        <div style={{ display: dashboard == "outlet" ? "block" : "none" }}>
          <TableTitle title="Statistics" icon="tag" />
          <Grid>
            <Grid.Row>
              <Grid.Column width={5}>
                <Message>
                  <Message.Header>Suppliers Statistics</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="orange">
                      <Statistic.Value>22</Statistic.Value>
                      <Statistic.Label>Categories</Statistic.Label>
                    </Statistic>

                    <Statistic color="orange">
                      <Statistic.Value>{report.supplier_count}</Statistic.Value>
                      <Statistic.Label>Suppliers</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={6}>
                <Message>
                  <Message.Header>Inventory Statistics</Message.Header>

                  <Statistic.Group widths="3">
                    <Statistic color="blue">
                      <Statistic.Value>
                        {report.storage_area_count}
                      </Statistic.Value>
                      <Statistic.Label>Storage Areas</Statistic.Label>
                    </Statistic>

                    <Statistic color="blue">
                      <Statistic.Value>{report.category_count}</Statistic.Value>
                      <Statistic.Label>Categories</Statistic.Label>
                    </Statistic>

                    <Statistic color="blue">
                      <Statistic.Value>{report.item_count}</Statistic.Value>
                      <Statistic.Label>Items</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={5}>
                <Message>
                  <Message.Header>Suppliers Orders Statistics</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="yellow">
                      <Statistic.Value>
                        {report.supplier_new_orders}
                      </Statistic.Value>
                      <Statistic.Label>New Orders</Statistic.Label>
                    </Statistic>

                    <Statistic color="yellow">
                      <Statistic.Value>
                        {report.supplier_received_orders}
                      </Statistic.Value>
                      <Statistic.Label>Received Orders</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={5}>
                <Message>
                  <Message.Header>Point Of Sale</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="olive">
                      <Statistic.Value>
                        {report.menu_type_count}
                      </Statistic.Value>
                      <Statistic.Label>Menu Types</Statistic.Label>
                    </Statistic>

                    <Statistic color="olive">
                      <Statistic.Value>
                        {report.menu_item_count}
                      </Statistic.Value>
                      <Statistic.Label>Menu Items</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={6}>
                <Message>
                  <Message.Header>Cashiers Orders Statistics</Message.Header>

                  <Statistic.Group widths="3">
                    <Statistic color="green">
                      <Statistic.Value>
                        {report.cashier_new_orders}
                      </Statistic.Value>
                      <Statistic.Label>New Orders</Statistic.Label>
                    </Statistic>

                    <Statistic color="green">
                      <Statistic.Value>
                        {report.cashier_inprogress_orders}
                      </Statistic.Value>
                      <Statistic.Label>In progress</Statistic.Label>
                    </Statistic>

                    <Statistic color="green">
                      <Statistic.Value>
                        {report.cashier_completed_orders}
                      </Statistic.Value>
                      <Statistic.Label>Completed Orders</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={5}>
                <Message>
                  <Message.Header>Users</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="teal">
                      <Statistic.Value>{totalCashiers}</Statistic.Value>
                      <Statistic.Label>Cashiers</Statistic.Label>
                    </Statistic>

                    <Statistic color="teal">
                      <Statistic.Value>{totalWaiters}</Statistic.Value>
                      <Statistic.Label>Waiters</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
            </Grid.Row>
            <TableTitle title="Supplier orders" icon="tag" />
            <Grid.Row>
              <Grid.Column width={8}>
                <canvas id="bySupplierOrdersCount"></canvas>
              </Grid.Column>

              <Grid.Column width={8}>
                <canvas id="bySupplierOrdersValueCount"></canvas>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <canvas id="bySuppliersPendingOrdersCount"></canvas>
              </Grid.Column>

              <Grid.Column width={8}></Grid.Column>
            </Grid.Row>
            <TableTitle title="Supplier items" icon="tag" />

            <Grid.Row>
              <Grid.Column width={8}>
                <canvas id="byCategoriesItemsCount"></canvas>
              </Grid.Column>

              <Grid.Column width={8}>
                <canvas id="byStorageAreasItemsCount"></canvas>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <canvas id="bySuppliersItemsCount"></canvas>
              </Grid.Column>

              <Grid.Column width={8}></Grid.Column>
            </Grid.Row>
            <TableTitle title="Point of sale" icon="tag" />
            <Grid.Row>
              <Grid.Column width={8}>
                <canvas id="byCashiersOrdersCount"></canvas>
              </Grid.Column>

              <Grid.Column width={8}>
                <canvas id="byMeuItemsItemsCount"></canvas>
              </Grid.Column>
            </Grid.Row>
            <TableTitle title="Supplies currnet stock and value" icon="tag" />
            <Grid.Row>
              <Grid.Column width={16}>
                <canvas id="bySuppliesCurrentStockAndValue"></canvas>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div
          style={{
            display:
              dashboard === "customer" && auth.getCurrentUser().subscription_id
                ? "block"
                : "none"
          }}
        >
          <TableTitle title="Subscription detail" icon="tag" />
          <Table celled padded>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell singleLine width={3}>
                  Product/Service
                </Table.HeaderCell>
                <Table.HeaderCell width={3}>Price</Table.HeaderCell>
                <Table.HeaderCell width={2}>Billing cycle</Table.HeaderCell>
                <Table.HeaderCell width={2}>Due date</Table.HeaderCell>
                <Table.HeaderCell width={3}>Status</Table.HeaderCell>
                <Table.HeaderCell width={3}></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {subscription.plan.nickname}
                  <br />
                  No of outlets: {subscription.quantity}
                </Table.Cell>
                <Table.Cell>
                  <Currency val="" />
                  {Number(
                    (subscription.quantity * subscription.plan.amount) / 100
                  )}
                  <br />
                  <Label>
                    {auth.getCurrentUser().card_type}
                    <Label.Detail>
                      {" "}
                      {auth.getCurrentUser().card_digits}
                    </Label.Detail>
                  </Label>
                </Table.Cell>
                <Table.Cell>{subscription.plan.interval}</Table.Cell>
                <Table.Cell>{subscription.upcoming_invoice}</Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      display:
                        subscription.trial_start &&
                        subscription.status != "canceled"
                          ? "block"
                          : "none"
                    }}
                  >
                    Trial started: {subscription.trial_start}
                    <br />
                    Trial end: {subscription.trial_end}
                  </div>
                  <div
                    style={{
                      display:
                        subscription.trial_start &&
                        subscription.status === "canceled"
                          ? "none"
                          : "block"
                    }}
                  >
                    <Label color="green">{subscription.status}</Label>
                  </div>

                  <div
                    style={{
                      display:
                        subscription.status === "canceled" ? "block" : "none"
                    }}
                  >
                    <Label color="red">Cancelled</Label>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    style={{
                      display:
                        subscription.status != "canceled" ? "block" : "none"
                    }}
                    onClick={this.handleCancelSubscription}
                    content="Cancel subscription"
                    primary
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </BlockUi>
    );
  }
}

export default Dashboard;
