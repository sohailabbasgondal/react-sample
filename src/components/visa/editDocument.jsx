import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getSingle, updateSingle } from "../../services/visaDocumentService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import auth from "../../services/authService";
import { Link } from "react-router-dom";

class VisaDocumentEditForm extends Form {
  state = {
    imageUrl: false,
    renewalDate: new Date(),
    expiryDate: new Date(),
    attachment_type_options: [
      { id: "", name: "Select option" },
      { id: "simple", name: "Simple" },
      { id: "complex", name: "Complex" }
    ],
    data: {
      name: "",
      attachment_type_option: ""
    },
    errors: {}
  };

  schema = {
    id: Joi.string(),
    name: Joi.string()
      .required()
      .label("Name"),
    attachment_type_option: Joi.string()
      .required()
      .label("Attachment Type")
    // renewalDate: Joi.string().label("Renewal Date"),
    // expiryDate: Joi.string().label("Expiry Date")
  };

  async populateAccount() {
    try {
      const accountId = this.props.match.params.id;

      this.setState({ blocking: true });
      const { data: account } = await getSingle(accountId);

      this.setState({ blocking: false });
      this.setState({ data: this.mapToViewModel(account) });

      const dateData = this.mapingData(account);

      this.setState({
        renewalDate: new Date(dateData.renewalDate),
        expiryDate: new Date(dateData.expiryDate)
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  mapingData(account) {
    return {
      renewalDate: account.renewal_date,
      expiryDate: account.expiry_date
    };
  }

  async componentDidMount() {
    await this.populateAccount();
  }

  handleChangeRenewal = date => {
    this.setState({
      renewalDate: date
    });
  };

  handleChangeExpiry = date => {
    this.setState({
      expiryDate: date
    });
  };

  mapToViewModel(account) {
    return {
      name: account.name,
      attachment_type_option: account.type
    };
  }

  doSubmit = async () => {
    try {
      const ledgerTypeId = this.props.match.params.id;

      // const data = { ...this.state.data };
      // data.id = parseInt(ledgerTypeId);
      this.setState({ blocking: true });

      let formData = new FormData();
      formData.append("name", this.state.data.name);
      formData.append("type", this.state.data.attachment_type_option);
      formData.append("attachment", this.state.imageUrl);

      var event = new Date(this.state.renewalDate);
      let date = JSON.stringify(event);
      date = date.slice(1, 11);
      formData.append("renewal_date", date);

      event = new Date(this.state.expiryDate);
      date = JSON.stringify(event);
      date = date.slice(1, 11);
      formData.append("expiry_date", date);
      formData.append("_method", "PUT");

      await updateSingle(formData, ledgerTypeId);
      this.setState({ blocking: false });
      toast.success("Document has been updated successfully.");
      const visaId = localStorage.getItem("visaId");
      this.props.history.push("/visas-accounts/view/" + visaId);
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

        if (ex.response.data.errors.account)
          errors.account = ex.response.data.errors.account;

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
        <TableTitle title="Update visa document" icon="tag" />
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
                    {this.renderInput("name", "Document Name", "text")}
                  </Table.Cell>
                  <Table.Cell width="8">
                    {this.renderSelect(
                      "attachment_type_option",
                      "Attachment Type",
                      this.state.attachment_type_options
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width="8">
                    <label>
                      <b>Attachment</b>
                    </label>
                    <input
                      className="input_imagem_artigo"
                      type="file"
                      onChange={this.onChangeFile}
                    />
                  </Table.Cell>
                  <Table.Cell width="8">
                    <label>
                      <b>Renewal Date</b>
                    </label>
                    <br />
                    <DatePicker
                      selected={this.state.renewalDate}
                      onChange={this.handleChangeRenewal}
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell width="8">
                    <label>
                      <b>Expiry Date</b>
                    </label>
                    <br />
                    <DatePicker
                      selected={this.state.expiryDate}
                      onChange={this.handleChangeExpiry}
                    />
                  </Table.Cell>
                  <Table.Cell width="8"></Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell>
                    {this.renderButton("Update")}
                    <Link
                      to={`/visas-accounts/view/${this.props.match.params.id}`}
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

export default VisaDocumentEditForm;
