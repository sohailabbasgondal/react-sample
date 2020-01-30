import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveCompany } from "../../services/companyService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";
import Currency from "../common/currency";
import { Link } from "react-router-dom";

class CompanyForm extends Form {
  state = {
    data: {
      name: "",
      address: "",
      phone: "",
      p_o_box: "",
      fullname: "",
      email: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Company name"),
    address: Joi.string()
      .required()
      .label("Address"),
    phone: Joi.string()
      .required()
      .label("phone"),
    p_o_box: Joi.string().label("P O Box"),
    fullname: Joi.string()
      .required()
      .label("Fullname"),
    email: Joi.string()
      .required()
      .label("Email"),
    password: Joi.string()
      .min(8)
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });
      await saveCompany(this.state.data);
      toast.success("Company has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/companies");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.address)
          errors.address = ex.response.data.errors.address;

        if (ex.response.data.errors.phone)
          errors.phone = ex.response.data.errors.phone;

        if (ex.response.data.errors.p_o_box)
          errors.p_o_box = ex.response.data.errors.p_o_box;

        if (ex.response.data.errors.fullname)
          errors.fullname = ex.response.data.errors.fullname;

        if (ex.response.data.errors.email)
          errors.email = ex.response.data.errors.email;

        if (ex.response.data.errors.password)
          errors.password = ex.response.data.errors.password;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add company" icon="tag" />
        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "50%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">Add company</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row width="8">
                  <Table.Cell>
                    {this.renderInput("name", "Name", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderInput("address", "Address", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    {this.renderInput("phone", "Phone", "text")}
                  </Table.Cell>
                  <Table.Cell>
                    {this.renderInput("p_o_box", "P O Box", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    {this.renderInput("fullname", "User name", "text")}
                  </Table.Cell>
                  <Table.Cell>
                    {this.renderInput("email", "Email", "text")}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    {this.renderInput("password", "Password", "password")}
                  </Table.Cell>
                  <Table.Cell></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Save")}
                    <Link to="/companies" className="ui secondary button">
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

export default CompanyForm;
