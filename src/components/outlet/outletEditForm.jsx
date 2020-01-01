import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getOutlet, updateOutlet } from "../../services/outletService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";

class OutletEditForm extends Form {
  state = {
    data: {
      name: "",
      city: "",
      address: "",
      zip: "",
      phone: "",
      emails: "",
      currency_symbol: "",
      tax_percentage: ""
    },
    errors: {}
  };

  schema = {
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
    currency_symbol: Joi.string()
      .required()
      .label("Currency symbol"),
    tax_percentage: Joi.number()
      .required()
      .label("Tax")
  };

  async populateOutlet() {
    try {
      const outletId = this.props.match.params.id;
      const { data: outlet } = await getOutlet(outletId);
      this.setState({ data: this.mapToViewModel(outlet) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateOutlet();
  }

  mapToViewModel(outlet) {
    return {
      name: outlet.name,
      city: outlet.city,
      address: outlet.address,
      zip: outlet.zip,
      phone: outlet.phone,
      emails: outlet.emails,
      currency_symbol: outlet.currency_symbol,
      tax_percentage: outlet.tax_percentage
    };
  }

  doSubmit = async () => {
    try {
      const outletId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(outletId);
      this.setState({ blocking: true });
      await updateOutlet(data);
      toast.success("Outlet has been updated successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/outlets");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Edit outlet" icon="tag" />
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
                  {this.renderInput(
                    "currency_symbol",
                    "Currency symbol",
                    "text"
                  )}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput("tax_percentage", "Tax", "text")}
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

export default OutletEditForm;
