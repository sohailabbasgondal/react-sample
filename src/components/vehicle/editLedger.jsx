import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getLedger, updateSingle } from "../../services/vehicleLedgerService";
import { getLedgerTypes } from "../../services/vehicleLedgerTypeService";

import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table, Button } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import auth from "../../services/authService";
import { Link } from "react-router-dom";

class VisaLedgerEditForm extends Form {
  state = {
    imageUrl: false,
    paymentDate: new Date(),
    ledgerType: 1,
    data: {
      payment: ""
    },
    errors: {},
    ledgerTypes: []
  };

  schema = {
    payment: Joi.number()
      .required()
      .label("Payment")
  };

  async populateLedger() {
    try {
      const accountId = this.props.match.params.id;

      this.setState({ blocking: true });
      const { data: ledger } = await getLedger(accountId);

      const { data: ledgerTypes } = await getLedgerTypes();

      this.setState({
        paymentDate: new Date(ledger.payment_date),
        ledgerType: ledger.vehicle_ledger_type.id,
        data: {
          payment: ledger.payment
        },
        blocking: false,
        ledgerTypes
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateLedger();
  }

  handleChangePaymentDate = date => {
    this.setState({
      paymentDate: date
    });
  };

  doSubmit = async () => {
    try {
      const ledgerTypeId = this.props.match.params.id;

      this.setState({ blocking: true });

      const data = { ...this.state.data };
      data.id = parseInt(ledgerTypeId);

      var event = new Date(this.state.paymentDate);

      var utcDate = new Date(
        Date.UTC(
          event.getFullYear(),
          event.getMonth(),
          event.getDate(),
          event.getHours(),
          event.getMinutes()
        )
      );
      let date = JSON.stringify(utcDate);

      date = date.slice(1, 11);
      data.payment_date = date;

      data._method = "PUT";

      data.vehicle_ledger_type_id = this.state.ledgerType;

      await updateSingle(data);
      this.setState({ blocking: false });
      toast.success("Ledger has been updated successfully.");
      const visaId = localStorage.getItem("vehicleId");
      this.props.history.push("/vehicles-accounts/view/" + visaId);
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.address)
          errors.address = ex.response.data.errors.address;

        if (ex.response.data.errors.phone)
          errors.phone = ex.response.data.errors.phone;

        if (ex.response.data.errors.account)
          errors.account = ex.response.data.errors.account;

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    if (auth.getCurrentUser().role != "company") {
      return "Your are authorized to perform this action.";
    }
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update vehicle ledger" icon="tag" />
        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "50%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">Update ledger</Table.HeaderCell>
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
                  <Table.Cell>
                    {this.renderButton("Update")}
                    <Link
                      to={`/vehicles-accounts/view/${this.props.match.params.id}`}
                      className="ui secondary button"
                    >
                      Back
                    </Link>
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </form>
        </center>
      </BlockUi>
    );
  }
}

export default VisaLedgerEditForm;
