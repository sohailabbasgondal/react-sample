import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSingle } from "../../services/roomService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import { Link } from "react-router-dom";

class RoomForm extends Form {
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
    id: Joi.string(),
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

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveSingle(this.state.data);
      toast.success("Account has been added successfully.");
      this.setState({ blocking: false });
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
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add room account" icon="tag" />
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
                    {this.renderButton("Save")}
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

export default RoomForm;
