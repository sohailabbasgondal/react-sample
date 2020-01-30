import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getComapany, updateCompany } from "../../services/companyService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import Currency from "../common/currency";
import { Link } from "react-router-dom";

class CompanyEditForm extends Form {
  state = {
    data: {
      name: "",
      address: "",
      phone: "",
      p_o_box: ""
    },
    errors: {}
  };

  schema = {
    name: Joi.string()
      .required()
      .label("Company name"),
    address: Joi.string()
      .required()
      .label("Address"),
    phone: Joi.string()
      .required()
      .label("phone"),
    p_o_box: Joi.string().label("P O Box")
  };

  async populateCompany() {
    try {
      const companyId = this.props.match.params.id;
      this.setState({ blocking: true });
      const { data: company } = await getComapany(companyId);
      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(company) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateCompany();
  }

  mapToViewModel(company) {
    return {
      name: company.name,
      address: company.address,
      phone: company.phone,
      p_o_box: company.p_o_box
    };
  }

  doSubmit = async () => {
    try {
      const companyId = this.props.match.params.id;

      const data = { ...this.state.data };
      data.id = parseInt(companyId);
      this.setState({ blocking: true });
      await updateCompany(data);
      this.setState({ blocking: false });
      toast.success("Company has been updated successfully.");
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

        this.setState({ errors, blocking: false });
        // toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Update company" icon="tag" />
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
                    update company
                  </Table.HeaderCell>
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
                    {this.renderButton("Update")}
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

export default CompanyEditForm;
