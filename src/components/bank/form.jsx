import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSingle } from "../../services/bankService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import { Link } from "react-router-dom";

class BankForm extends Form {
  state = {
    data: {
      name: "",
      address: "",
      phone: "",
      account: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Visa Account"),
    address: Joi.string()
      .required()
      .label("Address"),
    phone: Joi.string()
      .required()
      .label("Phone"),
    account: Joi.string()
      .required()
      .label("Account")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveSingle(this.state.data);
      toast.success("Account has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/banks-accounts");
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
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add bank account" icon="tag" />
        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "50%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">Add account</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("name", "Bank Name", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("address", "Address", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("phone", "Phone", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("account", "Account", "text")}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Save")}
                    <Link to="/users" className="ui secondary button">
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

export default BankForm;
