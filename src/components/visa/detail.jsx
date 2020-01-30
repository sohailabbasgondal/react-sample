import React, { Component } from "react";
import { getSingle } from "../../services/visaService";
import { getAll, deleteSingle } from "../../services/visaDocumentService";
import { getLedgerTypes } from "../../services/visaLedgerTypeService";
import {
  saveSingle,
  getAllLedgers,
  deleteLedger
} from "../../services/visaLedgerService";
import VisaLedgerTable from "./ledgerTable";
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

class VisaDetail extends Form {
  state = {
    visa: {},
    visaId: "",
    documents: [],
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

  async getVisaDetail(visaId) {
    try {
      this.setState({ blocking: true });

      const { data: visa } = await getSingle(visaId);

      this.setState({ visa, blocking: false, visaId });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    const visaId = this.props.match.params.id;
    await this.getVisaDetail(visaId);

    localStorage.setItem("visaId", visaId);

    const { data: documents } = await getAll(visaId);
    this.setState({ documents });

    const { data: ledgerTypes } = await getLedgerTypes();

    const { data: payments } = await getAllLedgers();

    this.setState({ blocking: false, ledgerTypes, payments });
  }

  handleDelete = type => {
    this.setState({ open: true, type });
  };

  handleDeleteLedger = type => {
    this.setState({ openLedger: true, type });
  };

  doDelete = async () => {
    const type = this.state.type;
    const originalTypes = this.state.documents;
    const documents = originalTypes.filter(o => o.id !== type.id);
    this.setState({ documents, open: false });

    try {
      await deleteSingle(type.id);

      toast.success("Document has been deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.success("This Document has already been deleted.");
      }

      this.setState({ types: originalTypes });
    }
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

  handleUpdate = type => {
    return this.props.history.replace("/visas-documents/" + type.id + "/edit");
  };

  handleUpdateLedger = type => {
    return this.props.history.replace("/visas-ledgers/" + type.id + "/edit");
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
      data.visa_ledger_type_id = this.state.ledgerType;

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
      this.props.history.push("/visas-accounts/view/" + this.state.visaId);
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
            m.visa_ledger_type.name
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
    const url = "/visas-accounts/" + this.state.visaId + "/document/new/";
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data: payments } = this.getPagedData();

    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <Confirm
          open={this.state.open}
          header="Confirmation"
          content="Are you sure, you want to delete the document?"
          onCancel={this.handleCancel}
          onConfirm={this.doDelete}
          size="mini"
        />

        <Confirm
          open={this.state.openLedger}
          header="Confirmation"
          content="Are you sure, you want to delete the ledger?"
          onCancel={this.handleCancelLedger}
          onConfirm={this.doDeleteLedger}
          size="mini"
        />

        <TableTitle title="Visa account detail" icon="tag" />

        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Table definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>Cost</Table.Cell>
                    <Table.Cell>{visa.cost}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Passport</Table.Cell>
                    <Table.Cell>{visa.passport_number}</Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell width={4}>Emirates Id</Table.Cell>
                    <Table.Cell>{visa.identification_id}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Mobile</Table.Cell>
                    <Table.Cell>{visa.mobile}</Table.Cell>
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
                    <Table.Cell width={4}>Reference Name</Table.Cell>
                    <Table.Cell>{visa.ref_name}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Reference Mobile</Table.Cell>
                    <Table.Cell>{visa.ref_mobile}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Daily Salary Entry</Table.Cell>
                    <Table.Cell>
                      {visa.daily_salary_entry == 0 ? "No" : "Yes"}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Salary Type</Table.Cell>
                    <Table.Cell>{visa.salary_type}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Salary</Table.Cell>
                    <Table.Cell>{visa.salary}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <TableTitle title="Visa account documents" icon="tag" />
        <Link to={url} className="ui primary button">
          New Document
        </Link>
        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={5}>Name</Table.HeaderCell>
              <Table.HeaderCell width={2}>Attachment Type</Table.HeaderCell>
              <Table.HeaderCell width={3}>Attachment</Table.HeaderCell>
              <Table.HeaderCell width={2}>Renewal Date</Table.HeaderCell>
              <Table.HeaderCell width={2}>Expiry Date</Table.HeaderCell>
              <Table.HeaderCell width={2}></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.documents.map(document => (
              <Table.Row key={document.id}>
                <Table.Cell>{document.name}</Table.Cell>

                <Table.Cell>{document.type}</Table.Cell>
                <Table.Cell>
                  {document.attachment != "" ? (
                    <a
                      target="_blank"
                      href={
                        process.env.REACT_APP_BACKEND_URL +
                        "/storage/" +
                        document.attachment
                      }
                    >
                      Download
                    </a>
                  ) : (
                    "N / A"
                  )}
                </Table.Cell>
                <Table.Cell>{document.renewal_date}</Table.Cell>
                <Table.Cell>{document.expiry_date}</Table.Cell>
                <Table.Cell>
                  <div>
                    <Icon
                      name="trash"
                      color="red"
                      className="clickable"
                      onClick={() => this.handleDelete(document)}
                    />

                    <Icon
                      name="edit"
                      color="blue"
                      className="clickable"
                      onClick={() => this.handleUpdate(document)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <TableTitle title="Visa account ledgers" icon="tag" />

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
        <VisaLedgerTable
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

export default VisaDetail;
