import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveSingle } from "../../services/companyDocumentService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import { Table } from "semantic-ui-react";
import TableTitle from "../common/tableTitle";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

class CompanyDocumentForm extends Form {
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

  doSubmit = async () => {
    try {
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

      await saveSingle(formData);
      toast.success("Document has been added successfully.");
      this.setState({ blocking: false });
      this.props.history.push("/company-documents");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.attachment_type_options)
          errors.attachment_type_options =
            ex.response.data.errors.attachment_type_options;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

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

  createImage = file => {
    let reader = new FileReader();
    // reader.onload = e => {
    //   this.setState({ imagePreviewUrl: e.target.result });
    // };
    reader.readAsDataURL(file);
  };

  onChangeFile = e => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.setState({ imageUrl: files[0] });
    //this.createImage(files[0]);
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add company document" icon="tag" />
        <center>
          <form
            onSubmit={this.handleSubmit}
            className="ui error form"
            style={{ width: "50%" }}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">Add document</Table.HeaderCell>
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
                    {this.renderButton("Save")}
                    <Link
                      to="/company-documents"
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

export default CompanyDocumentForm;
