import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getSingle, updateSingle } from "../../services/roomService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import auth from "../../services/authService";
import { Link } from "react-router-dom";

class RoomEditForm extends Form {
  state = {
    data: {
      room_number: "",
      name: "",
      mobile: "",
      rent: ""
    },
    errors: {}
  };

  schema = {
    room_number: Joi.string()
      .required()
      .label("Ledger type"),
    name: Joi.string()
      .required()
      .label("Name"),
    mobile: Joi.string()
      .required()
      .label("Mobile"),
    rent: Joi.number()
      .required()
      .label("Rent")
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
      room_number: account.room_number,
      name: account.name,
      mobile: account.room_number,
      rent: account.rent
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
      this.props.history.push("/rooms-accounts");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.room_number)
          errors.room_number = ex.response.data.errors.room_number;

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.mobile)
          errors.mobile = ex.response.data.errors.mobile;

        if (ex.response.data.errors.rent)
          errors.rent = ex.response.data.errors.rent;

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
        <TableTitle title="Update room account" icon="tag" />
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
                    Update ledger type
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("room_number", "Room Number", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("name", "Incharge Name", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("mobile", "Incharge Mobile", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("rent", "Rent", "text")}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Update")}
                    <Link to="/rooms-accounts" className="ui secondary button">
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

export default RoomEditForm;
