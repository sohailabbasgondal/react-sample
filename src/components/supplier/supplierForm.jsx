import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSupplier } from "../../services/supplierService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";

class SupplierForm extends Form {
  state = {
    data: {
      name: "",
      phone: "",
      emails: "",
      min_order_value: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Supplier name"),
    phone: Joi.string()
      .required()
      .label("Phone"),
    emails: Joi.string()
      .required()
      .label("emails"),
    min_order_value: Joi.number()
      .required()
      .label("Min order value")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveSupplier(this.state.data);
      toast.success("Supplier has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/suppliers");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.phone)
          errors.phone = ex.response.data.errors.phone;

        if (ex.response.data.errors.emails)
          errors.emails = ex.response.data.errors.emails;

        if (ex.response.data.errors.min_order_value)
          errors.min_order_value = ex.response.data.errors.min_order_value;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add supplier" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="2">Add supplier</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row width="8">
                <Table.Cell>
                  {this.renderInput("name", "Supplier name", "text")}
                </Table.Cell>
                <Table.Cell width="8">
                  {this.renderInput("phone", "Phone", "text")}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  {this.renderInput("emails", "Emails", "text")}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput(
                    "min_order_value",
                    "Min order value",
                    "text"
                  )}
                </Table.Cell>
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

export default SupplierForm;
