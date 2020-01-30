import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getSingle, updateSingle } from "../../services/bankService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import auth from "../../services/authService";
import { Link } from "react-router-dom";

class BankEditForm extends Form {
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
    visa_id: Joi.number().label("Visa Account"),
    name: Joi.string()
      .required()
      .label("Account"),
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

  async populateAccount() {
    try {
      const accountId = this.props.match.params.id;

      this.setState({ blocking: true });
      const { data: account } = await getSingle(accountId);

      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(account) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateAccount();
  }

  mapToViewModel(account) {
    return {
      name: account.name,
      address: account.address,
      phone: account.phone,
      account: account.account
    };
  }

  doSubmit = async () => {
    try {
      const ledgerTypeId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(ledgerTypeId);
      this.setState({ blocking: true });
      await updateSingle(data);
      this.setState({ blocking: false });
      toast.success("Account has been updated successfully.");
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
        <TableTitle title="Update banks account" icon="tag" />
        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "50%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">
                    Update account
                  </Table.HeaderCell>
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
                    {this.renderButton("Update")}
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

export default BankEditForm;
