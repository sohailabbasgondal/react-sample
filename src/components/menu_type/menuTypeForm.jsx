import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";

import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import { getMenuTypes, saveMenuType } from "../../services/menuTypeService";

class MenuTypeForm extends Form {
  state = {
    data: {
      name: "",
      parent_id: ""
    },
    menu_types: [],
    imagePreviewUrl: false,
    imageUrl: false,
    errors: {}
  };

  schema = {
    id: Joi.string(),
    parent_id: Joi.string()
      .required()
      .label("Menu type"),
    name: Joi.string()
      .required()
      .label("Menu type name")
  };

  async componentDidMount() {
    const { data } = await getMenuTypes();
    const menu_types = [
      { id: "", name: "Select menu type" },
      { id: 0, name: "Root" },
      ...data
    ];
    this.setState({ menu_types: menu_types });
  }

  doSubmit = async () => {
    try {
      let formData = new FormData();
      formData.append("name", this.state.data.name);
      formData.append("parent_id", this.state.data.parent_id);
      formData.append("thumbnail", this.state.imageUrl);

      this.setState({ blocking: true });
      await saveMenuType(formData);
      this.setState({ blocking: false });
      toast.success("Menu type has been added successfully.");
      this.props.history.push("/menu-types");
    } catch (ex) {
      console.log(ex.response);
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        if (ex.response.data.errors.parent_id)
          errors.parent_id = ex.response.data.errors.parent_id;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  createImage = file => {
    let reader = new FileReader();
    reader.onload = e => {
      this.setState({ imagePreviewUrl: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  onChangeFile = e => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.setState({ imageUrl: files[0] });
    this.createImage(files[0]);
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add menu type" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">Add menu type</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {this.renderSelect(
                    "parent_id",
                    "Parent type",
                    this.state.menu_types
                  )}
                </Table.Cell>
                <Table.Cell>
                  {this.renderInput("name", "Menu type", "text")}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>
                  <input
                    className="input_imagem_artigo"
                    type="file"
                    onChange={this.onChangeFile}
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="imgPreview">
                    {this.state.imagePreviewUrl ? (
                      <img
                        className="add_imagem"
                        name="add_imagem"
                        height="40"
                        src={this.state.imagePreviewUrl}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>{this.renderButton("Save")}</Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </form>
      </BlockUi>
    );
  }
}

export default MenuTypeForm;
