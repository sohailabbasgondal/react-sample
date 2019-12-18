import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { saveMenuItem } from "../../services/menuItemService";
import { toast } from "react-toastify";
import BlockUi from "react-block-ui";
import TableTitle from "../common/tableTitle";
import { Table } from "semantic-ui-react";
import { getMenuTypes } from "../../services/menuTypeService";

class MenuItemForm extends Form {
  state = {
    data: {
      menu_type_id: "",
      name: "",
      price: ""
    },
    menu_types: [],
    imagePreviewUrl: false,
    imageUrl: false,
    errors: {}
  };

  schema = {
    id: Joi.string(),
    menu_type_id: Joi.string()
      .required()
      .label("Menu type"),
    name: Joi.string()
      .required()
      .label("Menu item name"),
    price: Joi.number()
      .required()
      .label("Price")
  };

  async componentDidMount() {
    const { data } = await getMenuTypes();
    const menu_types = [{ id: "", name: "All Menu types" }, ...data];
    this.setState({ menu_types: menu_types });
  }

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

  doSubmit = async () => {
    try {
      this.setState({ blocking: true });

      let formData = new FormData();
      formData.append("name", this.state.data.name);
      formData.append("price", this.state.data.price);
      formData.append("menu_type_id", this.state.data.menu_type_id);
      formData.append("thumbnail", this.state.imageUrl);

      await saveMenuItem(formData);
      this.setState({ blocking: false });
      toast.success("Menu item has been added successfully.");
      this.props.history.push("/menu-items");
    } catch (ex) {
      if (ex.response && ex.response.status === 422) {
        const errors = { ...this.state.errors };

        if (ex.response.data.errors.name)
          errors.name = ex.response.data.errors.name;

        this.setState({ errors, blocking: false });
        //toast.warning("check validation errors.");
      }
    }
  };

  render() {
    return (
      <BlockUi tag="div" blocking={this.state.blocking}>
        <TableTitle title="Add menu item" icon="tag" />
        <form onSubmit={this.handleSubmit} className="ui error form">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colspan="3">Add menu item</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={6}>
                  {this.renderSelect(
                    "menu_type_id",
                    "Menu type",
                    this.state.menu_types
                  )}
                </Table.Cell>
                <Table.Cell width={5}>
                  {this.renderInput("name", "Menu item", "text")}
                </Table.Cell>
                <Table.Cell width={5}>
                  {this.renderInput("price", "Price", "text")}
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
                <Table.Cell></Table.Cell>
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

export default MenuItemForm;
