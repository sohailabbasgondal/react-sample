import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import auth from "../../services/authService";

class CompanyDocumentTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "4"
    },
    {
      path: "type",
      label: "Type",
      width: "2"
    },
    {
      path: "attachment",
      label: "Attachment",
      width: "2",

      content: file => (
        <div>
          {file.attachment != "" ? (
            <a
              target="_blank"
              href={
                process.env.REACT_APP_BACKEND_URL +
                "/storage/" +
                file.attachment
              }
            >
              Download
            </a>
          ) : (
            "N / A"
          )}
        </div>
      )
    },

    {
      path: "renewal_date",
      label: "Renewal Date",
      width: "3"
    },
    {
      path: "expiry_date",
      label: "Expiry Date",
      width: "3"
    },

    {
      key: "actions",
      width: "2",
      content: type =>
        auth.getCurrentUser().role === "company" && (
          <div>
            <Icon
              name="trash"
              color="red"
              className="clickable"
              onClick={() => this.props.onDelete(type)}
            />

            <Icon
              name="edit"
              color="blue"
              className="clickable"
              onClick={() => this.props.onUpdate(type)}
            />
          </div>
        )
    }
  ];

  render() {
    const { types, onSort, sortColumn } = this.props;

    return (
      <RenderTable
        columns={this.columns}
        data={types}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CompanyDocumentTable;
