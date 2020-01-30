import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSingle } from "../../services/yardService";
import { getAll } from "../../services/visaService";
import Select from "../common/select";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import { Link } from "react-router-dom";

class YardForm extends Form {
  state = {
    data: {
      visa_id: "",
      name: "",
      mobile: "",
      rent: ""
    },
    visas: [],
    errors: {}
  };

  schema = {
    id: Joi.string(),
    visa_id: Joi.number()
      .allow("")
      .label("Visa Account"),
    name: Joi.string()
      .allow("")
      .label("Name"),
    mobile: Joi.string()
      .allow("")
      .label("Mobile"),
    rent: Joi.number()
      .required()
      .label("Rent")
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
      this.props.history.push("/yards-accounts");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.visa_id)
          errors.visa_id = ex.response.data.errors.visa_id;

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
        <TableTitle title="Add yard account" icon="tag" />
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
                  <Table.Cell width="16" colSpan="2">
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
                    {this.renderInput("rent", "Rent", "text")}
                  </Table.Cell>
                  <Table.Cell width="8"></Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Save")}
                    <Link to="/yards-accounts" className="ui secondary button">
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

export default YardForm;
