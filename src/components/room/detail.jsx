import React, { Component } from "react";
import { getSingle } from "../../services/roomService";
import { getLedgerTypes } from "../../services/roomLedgerTypeService";
import {
  saveSingle,
  getAllLedgers,
  deleteLedger
} from "../../services/roomLedgerService";
import RoomLedgerTable from "./ledgerTable";
import { Table, Grid, Icon, Confirm, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import TableTitle from "../common/tableTitle";
import Form from "../common/form";
import Joi from "joi-browser";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import _ from "lodash";
import SearchTextBox from "../common/searchTextBox";

class RoomDetail extends Form {
  state = {
    visa: {},
    open: false,
    paymentDate: new Date(),
    ledgerTypes: [],
    ledgerType: 1,
    data: {
      payment: ""
    },
    errors: {},
    payments: [],
    pageSize: 10,
    currentPage: 1,
    keyFieldValue: "",
    sortColumn: { path: "id", order: "desc" }
  };

  schema = {
    id: Joi.string(),
    payment: Joi.number()
      .required()
      .label("Payment")
  };

  async getVisaDetail(roomId) {
    try {
      this.setState({ blocking: true });

      const { data: visa } = await getSingle(roomId);

      this.setState({ visa, blocking: false });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    const roomId = this.props.match.params.id;
    await this.getVisaDetail(roomId);

    localStorage.setItem("roomId", roomId);

    const { data: ledgerTypes } = await getLedgerTypes();

    const { data: payments } = await getAllLedgers();

    this.setState({ blocking: false, ledgerTypes, payments });
  }

  handleDeleteLedger = type => {
    this.setState({ openLedger: true, type });
  };

  doDeleteLedger = async () => {
    const type = this.state.type;
    const originalTypes = this.state.payments;
    const payments = originalTypes.filter(o => o.id !== type.id);
    this.setState({ payments, openLedger: false });

    try {
      await deleteLedger(type.id);

      toast.success("Ledger has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This Ledger has already been deleted.");
      }

      this.setState({ types: originalTypes });
    }
  };

  handleUpdateLedger = type => {
    return this.props.history.replace("/rooms-ledgers/" + type.id + "/edit");
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  handleCancelLedger = () => {
    this.setState({ openLedger: false });
  };

  handleChangePaymentDate = date => {
    this.setState({
      paymentDate: date
    });
  };

  updateLedgerType = ledgerType => {
    this.setState({ ledgerType });
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      const data = { ...this.state.data };
      data.room_ledger_type_id = this.state.ledgerType;

      var event = new Date(this.state.paymentDate);
      let date = JSON.stringify(event);
      date = date.slice(1, 11);
      data.payment_date = date;

      await saveSingle(data);

      const { data: payments } = await getAllLedgers();

      toast.success("Ledger has been added successfully.");
      this.setState({
        blocking: false,
        ledgerType: 1,
        data: { payment: "" },
        payments
      });
      this.props.history.push(
        "/rooms-accounts/view/" + localStorage.getItem("roomId")
      );
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.payment)
          errors.payment = ex.response.data.errors.payment;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      payments: allPayments,
      keyFieldValue,
      sortColumn
    } = this.state;

    let filtered = allPayments;
    filtered = keyFieldValue
      ? filtered.filter(
          m =>
            m.room_ledger_type.name
              .toUpperCase()
              .indexOf(keyFieldValue.toUpperCase()) > -1
        )
      : filtered;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const payments = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: payments };
  };

  handleSearching = keyword => {
    this.setState({ keyFieldValue: keyword, currentPage: 1 });
  };

  render() {
    const { visa } = this.state;

    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: payments } = this.getPagedData();

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.openLedger}
          header="Confirmation"
          content="Are you sure, you want to delete the ledger?"
          onCancel={this.handleCancelLedger}
          onConfirm={this.doDeleteLedger}
          size="mini"
        />

        <TableTitle title="Room account detail" icon="tag" />

        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>Visa Account</Table.Cell>
                    <Table.Cell>{visa.visa_id}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Room Number</Table.Cell>
                    <Table.Cell>{visa.room_number}</Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell width={4}>Name</Table.Cell>
                    <Table.Cell>{visa.name}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>Mobile</Table.Cell>
                    <Table.Cell>{visa.mobile}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Rent</Table.Cell>
                    <Table.Cell>{visa.rent}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <TableTitle title="Room account ledgers" icon="tag" />

        <div>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell style={{ paddingBottom: 0 }}>
                  <SearchTextBox onSearchButtonClick={this.handleSearching} />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {/* <Link
                    to="/visas-ledgers-types/new"
                    className="ui primary button"
                  >
                    New Ledger Type
                  </Link> */}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <RoomLedgerTable
          payments={payments}
          sortColumn={sortColumn}
          onDelete={this.handleDeleteLedger}
          onUpdate={this.handleUpdateLedger}
          onSort={this.handleSort}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
          currentPage={currentPage}
        />

        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "35%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">Add payment</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width="16" colSpan="2">
                    <Button.Group>
                      {this.state.ledgerTypes.map(type => (
                        <React.Fragment>
                          <Button
                            positive={
                              this.state.ledgerType === type.id ? true : false
                            }
                            onClick={() => this.updateLedgerType(type.id)}
                          >
                            {type.name}
                          </Button>
                        </React.Fragment>
                      ))}
                      ;
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("payment", "Payment", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    <label>
                      <b>Payment Date</b>
                    </label>
                    <br />
                    <DatePicker
                      selected={this.state.paymentDate}
                      onChange={this.handleChangePaymentDate}
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>{this.renderButton("Add")}</Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <br />
            <br />
          </form>
        </center>
      </BlockUi>
    );
  }
}

export default RoomDetail;
