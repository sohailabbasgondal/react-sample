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

import Currency from "./common/currency";

class Dashboard extends Component {
  state = {
    report: { outlet_account: [] },
    totalUsers: 0,
    dashboard: "client",
    outletid: ""
  };

  async componentDidMount() {
    if (auth.getCurrentUser().role === "company") {
      this.setState({ dashboard: "company" });
      this.loadDashboard(auth.getCurrentUser().company_id);
    } else if (auth.getCurrentUser().role === "client") {
    }
  }

  loadDashboard = async companyId => {
    this.setState({
      blocking: true,
      show: "none",
      dashboard: "company",
      companyId: companyId
    });
    const { data: report } = await getGeneralReport(companyId);

    // const { data: supplierOrdersReportData } = await getOrdersBySuppliersReport(
    //   outletId
    // );
    // this.barChart(
    //   supplierOrdersReportData.suppliers,
    //   supplierOrdersReportData.orders,
    //   supplierOrdersReportData.colors,
    //   "bySupplierOrdersCount",
    //   "Number of orders by suppliers"
    // );

    // const {
    //   data: supplierOrdersValueReportData
    // } = await getOrdersValueBySuppliersReport(outletId);
    // this.barChart(
    //   supplierOrdersValueReportData.suppliers,
    //   supplierOrdersValueReportData.orders,
    //   supplierOrdersValueReportData.colors,
    //   "bySupplierOrdersValueCount",
    //   "Value of orders by suppliers"
    // );

    // const {
    //   data: itemsByCategoiresReportData
    // } = await getItemsByCategoiresReport(outletId);
    // this.barChart(
    //   itemsByCategoiresReportData.categoires,
    //   itemsByCategoiresReportData.items,
    //   itemsByCategoiresReportData.colors,
    //   "byCategoriesItemsCount",
    //   "Number of items by categoires"
    // );

    // const {
    //   data: itemsByStorageAreasReportData
    // } = await getItemsByStorageAreasReport(outletId);
    // this.barChart(
    //   itemsByStorageAreasReportData.storage_areas,
    //   itemsByStorageAreasReportData.items,
    //   itemsByStorageAreasReportData.colors,
    //   "byStorageAreasItemsCount",
    //   "Number of items by storage areas"
    // );

    // const {
    //   data: itemsBySuppliersReportData
    // } = await getItemsBySuppliersReport(outletId);
    // this.barChart(
    //   itemsBySuppliersReportData.suppliers,
    //   itemsBySuppliersReportData.items,
    //   itemsBySuppliersReportData.colors,
    //   "bySuppliersItemsCount",
    //   "Number of items by suppliers"
    // );

    // const {
    //   data: pendingOrdersBySuppliersReportData
    // } = await getPendingOrdersBySuppliersReport(outletId);
    // this.barChart(
    //   pendingOrdersBySuppliersReportData.suppliers,
    //   pendingOrdersBySuppliersReportData.orders,
    //   pendingOrdersBySuppliersReportData.colors,
    //   "bySuppliersPendingOrdersCount",
    //   "Number of pending orders by suppliers"
    // );

    // const {
    //   data: ordersByCashiersReportData
    // } = await getOrdersByCashiersReport(outletId);
    // this.barChart(
    //   ordersByCashiersReportData.cashiers,
    //   ordersByCashiersReportData.orders,
    //   ordersByCashiersReportData.colors,
    //   "byCashiersOrdersCount",
    //   "Number of orders by cashiers"
    // );

    // const {
    //   data: menuItemsByMenuItemsTypesReportData
    // } = await getItemsByMenuTypesReport(outletId);
    // this.barChart(
    //   menuItemsByMenuItemsTypesReportData.menu_types,
    //   menuItemsByMenuItemsTypesReportData.items,
    //   menuItemsByMenuItemsTypesReportData.colors,
    //   "byMeuItemsItemsCount",
    //   "Number of menu items by menu types"
    // );

    // const {
    //   data: itemsCurrentStocksAndValue
    // } = await getItemsCurrentStockAndValueReport(outletId);

    // this.barChart(
    //   itemsCurrentStocksAndValue.items,
    //   itemsCurrentStocksAndValue.value,
    //   itemsCurrentStocksAndValue.colors,
    //   "bySuppliesCurrentStockAndValue",
    //   "Suppiles current stock and value"
    // );

    this.setState({ report, blocking: false });
    this.totalUsers();
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

  totalUsers = () => {
    let total = 0;

    // this.state.report.company_account.map(account =>
    //    total = total + 1;
    // );
    this.setState({ totalUsers: 3 });
  };

  loadCustomerDashboard = () => {
    this.setState({ dashboard: "customer" });
  };

  render() {
    let { report, totalUsers, dashboard, outletid } = this.state;
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Statistics" icon="tag" />
        <div style={{ display: dashboard == "company" ? "block" : "none" }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Rooms</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="orange">
                      <Statistic.Value>{report.room_count}</Statistic.Value>
                      <Statistic.Label>Total Accounts</Statistic.Label>
                    </Statistic>

                    <Statistic color="orange">
                      <Statistic.Value>
                        {report.room_ledger_type_count}
                      </Statistic.Value>
                      <Statistic.Label>Ledger Types</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Vehicles</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="blue">
                      <Statistic.Value>{report.vehicle_count}</Statistic.Value>
                      <Statistic.Label>Total Accounts</Statistic.Label>
                    </Statistic>

                    <Statistic color="blue">
                      <Statistic.Value>
                        {report.vehicle_ledger_type_count}
                      </Statistic.Value>
                      <Statistic.Label>Ledger Types</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Visas</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="yellow">
                      <Statistic.Value>{report.visa_count}</Statistic.Value>
                      <Statistic.Label>Total Accounts</Statistic.Label>
                    </Statistic>

                    <Statistic color="yellow">
                      <Statistic.Value>
                        {report.visa_ledger_type_count}
                      </Statistic.Value>
                      <Statistic.Label>Ledger Types</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Yards</Message.Header>

                  <Statistic.Group widths="2">
                    <Statistic color="yellow">
                      <Statistic.Value>{report.yard_count}</Statistic.Value>
                      <Statistic.Label>Total Accounts</Statistic.Label>
                    </Statistic>

                    <Statistic color="yellow">
                      <Statistic.Value>
                        {report.yard_ledger_type_count}
                      </Statistic.Value>
                      <Statistic.Label>Ledger Types</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Users</Message.Header>

                  <Statistic.Group widths="1">
                    <Statistic color="brown">
                      <Statistic.Value>
                        {report.company_account_count}
                      </Statistic.Value>
                      <Statistic.Label>Total</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>

              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Banks</Message.Header>

                  <Statistic.Group widths="1">
                    <Statistic color="white">
                      <Statistic.Value>
                        {report.company_bank_detail_count}
                      </Statistic.Value>
                      <Statistic.Label>Total</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>

              <Grid.Column width={4}>
                <Message>
                  <Message.Header>Documents</Message.Header>

                  <Statistic.Group widths="1">
                    <Statistic color="red">
                      <Statistic.Value>
                        {report.company_document_count}
                      </Statistic.Value>
                      <Statistic.Label>Total</Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                </Message>
              </Grid.Column>
            </Grid.Row>

            {/*<Grid.Row>
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
            </Grid.Row>*/}
          </Grid>
        </div>
      </BlockUi>
    );
  }
}

export default Dashboard;
