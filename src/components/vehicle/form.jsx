import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSingle } from "../../services/vehicleService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import { Link } from "react-router-dom";
import { getAll } from "../../services/visaService";

class VehicleForm extends Form {
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
      .allow("")
      .label("Name"),
    mobile: Joi.string()
      .allow("")
      .label("Mobile"),
    cost: Joi.number()
      .required()
      .label("Cost")
  };

  async componentDidMount() {
    this.setState({ blocking: true });
    const { data: visasAccounts } = await getAll();
    const visas = [{ id: "", name: "Select" }, ...visasAccounts];

    this.setState({ visas, blocking: false });
  }

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveSingle(this.state.data);
      toast.success("Account has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/vehicles-accounts");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.plat_number)
          errors.plat_number = ex.response.data.errors.plat_number;

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.mobile)
          errors.mobile = ex.response.data.errors.mobile;

        if (ex.response.data.errors.cost)
          errors.cost = ex.response.data.errors.cost;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add vehicle account" icon="tag" />
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
                    {this.renderButton("Save")}
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

export default VehicleForm;
