import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getSingle, updateSingle } from "../../services/vehicleService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import auth from "../../services/authService";
import { Link } from "react-router-dom";
import { getAll } from "../../services/visaService";

class VehicleEditForm extends Form {
  state = {
    data: {
      visa_id: "",
      name: "",
      mobile: "",
      cost: "",
      plat_number: ""
    },
    visas: [],
    errors: {}
  };

  schema = {
    id: Joi.string(),
    plat_number: Joi.string()
      .required()
      .label("Plate Number"),
    visa_id: Joi.number()
      .allow("")
      .label("Visa Account"),
    name: Joi.string()
      .allow()
      .label("Name"),
    mobile: Joi.string()
      .allow()
      .label("Mobile"),
    cost: Joi.number()
      .required()
      .label("Cost")
  };

  async populateAccount() {
    try {
      const accountId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: account } = await getSingle(accountId);

      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(account) });

      const { data: visasAccounts } = await getAll();
      const visas = [{ id: "", name: "Select" }, ...visasAccounts];
      this.setState({ visas });
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
      visa_id: account.visa.id ? account.visa.id : "",
      name: account.name ? account.name : "",
      mobile: account.mobile ? account.mobile : "",
      cost: account.cost,
      plat_number: account.plat_number
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
      this.props.history.push("/vehicles-accounts");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.visa_id)
          errors.visa_id = ex.response.data.errors.visa_id;

        if (ex.response.data.errors.plat_number)
          errors.plat_number = ex.response.data.errors.plat_number;

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.mobile)
          errors.mobile = ex.response.data.errors.mobile;

        if (ex.response.data.errors.cost)
          errors.cost = ex.response.data.errors.cost;

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
        <TableTitle title="Update vehicle account" icon="tag" />
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
                    {this.renderInput("plat_number", "Plate Number", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderSelect(
                      "visa_id",
                      "Select visa account (optional)",
                      this.state.visas
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("name", "Name", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("mobile", "Mobile", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("cost", "Cost", "text")}
                  </Table.Cell>
                  <Table.Cell width="8"></Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Update")}
                    <Link
                      to="/vehicles-accounts"
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

export default VehicleEditForm;
