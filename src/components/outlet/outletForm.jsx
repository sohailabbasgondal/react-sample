import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveOutlet } from "../../services/outletService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";

class OutletForm extends Form {
  state = {
    data: {
      name: "",
      city: "",
      address: "",
      zip: "",
      phone: "",
      emails: "",
      contact_person: "",
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Outlet name"),
    city: Joi.string()
      .required()
      .label("City"),
    address: Joi.string()
      .required()
      .label("Address"),
    zip: Joi.string()
      .required()
      .label("Zip"),
    phone: Joi.string()
      .required()
      .label("phone"),
    emails: Joi.string()
      .required()
      .label("emails"),
    contact_person: Joi.string()
      .required()
      .label("name"),
    email: Joi.string()
      .required()
      .label("email"),
    password: Joi.string()
      .required()
      .label("password")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveOutlet(this.state.data);
      toast.success("Outlet has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/outlets");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.email)
          errors.email = ex.response.data.errors.email;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add outlet" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Add outlet</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Outlet name", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("city", "City", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("address", "Address", "text")}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput("zip", "Zip", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("phone", "Phone", "text")}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput("emails", "Emails", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("contact_person", "Manager name", "text")}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput("email", "Manager email", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("password", "Password", "password")}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{this.renderButton("Save")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default OutletForm;
