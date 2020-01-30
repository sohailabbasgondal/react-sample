import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSingle } from "../../services/visaService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import { Link } from "react-router-dom";

class VisaForm extends Form {
  state = {
    daily_salary_options: [
      { id: "", name: "Select option" },
      { id: 0, name: "No" },
      { id: 1, name: "Yes" }
    ],
    salary_type_options: [
      { id: "", name: "Select option" },
      { id: "fixed", name: "Fixed" },
      { id: "hourly", name: "Hourly" }
    ],
    data: {
      cost: "",
      passport_number: "",
      identification_id: "",
      mobile: "",
      name: "",
      ref_name: "",
      ref_mobile: "",
      daily_salary_entry: "",
      salary_type: "",
      salary: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    cost: Joi.number()
      .required()
      .label("Cost"),
    passport_number: Joi.string()
      .required()
      .label("Passport"),
    identification_id: Joi.string()
      .required()
      .label("Identification Id"),
    mobile: Joi.string()
      .required()
      .label("Mobile"),
    name: Joi.string()
      .required()
      .label("Name"),
    ref_name: Joi.string().label("Reference name"),
    ref_mobile: Joi.string().label("Reference mobile"),
    daily_salary_entry: Joi.number()
      .required()
      .label("Daily salary entry"),
    salary_type: Joi.string()
      .allow("")
      .label("Salary type"),
    salary: Joi.number()
      .allow("")
      .label("Salary")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveSingle(this.state.data);
      toast.success("Account has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/visas-accounts");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.cost)
          errors.cost = ex.response.data.errors.cost;

        if (ex.response.data.errors.passport_number)
          errors.passport_number = ex.response.data.errors.passport_number;

        if (ex.response.data.errors.identification_id)
          errors.identification_id = ex.response.data.errors.identification_id;

        if (ex.response.data.errors.mobile)
          errors.mobile = ex.response.data.errors.mobile;

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.ref_name)
          errors.ref_name = ex.response.data.errors.ref_name;

        if (ex.response.data.errors.ref_mobile)
          errors.ref_mobile = ex.response.data.errors.ref_mobile;

        if (ex.response.data.errors.daily_salary_entry)
          errors.daily_salary_entry =
            ex.response.data.errors.daily_salary_entry;

        if (ex.response.data.errors.salary_type)
          errors.salary_type = ex.response.data.errors.salary_type;

        if (ex.response.data.errors.salary)
          errors.salary = ex.response.data.errors.salary;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add visa account" icon="tag" />
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
                    {this.renderInput("cost", "Cost", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("passport_number", "Passport", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput(
                      "identification_id",
                      "Emirates Id",
                      "text"
                    )}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("mobile", "Mobile", "text")}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("name", "Name", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("ref_name", "Reference Name", "text")}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderInput("ref_mobile", "Reference Mobile", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderSelect(
                      "daily_salary_entry",
                      "Daily Salary Entry",
                      this.state.daily_salary_options
                    )}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell width="8">
                    {this.renderSelect(
                      "salary_type",
                      "Salary Type",
                      this.state.salary_type_options
                    )}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {" "}
                    {this.renderInput("salary", "Salary", "text")}
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Save")}
                    <Link to="/visas-accounts" className="ui secondary button">
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

export default VisaForm;
