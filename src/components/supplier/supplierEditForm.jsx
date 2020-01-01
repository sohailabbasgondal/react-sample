import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getSupplier, updateSupplier } from "../../services/supplierService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import Currency from "../common/currency";

class SupplierEditForm extends Form {
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

  async populateSupplier() {
    try {
      const supplierId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: supplier } = await getSupplier(supplierId);
      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(supplier) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateSupplier();
  }

  mapToViewModel(supplier) {
    return {
      name: supplier.name,
      phone: supplier.phone,
      emails: supplier.emails,
      min_order_value: supplier.min_order_value
    };
  }

  doSubmit = async () => {
    try {
      const supplierId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(supplierId);
      this.setState({ blocking: true });
      await updateSupplier(data);
      this.setState({ blocking: false });
      toast.success("Supplier has been updated successfully.");
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
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update supplier" icon="tag" />
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
                    <Currency label="Min order value" />,
                    "text"
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{this.renderButton("Update")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default SupplierEditForm;
