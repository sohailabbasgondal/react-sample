import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

class OutletsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      width: "3",
      content: outlet => (
        <Link to={`/outlets/view/${outlet.id}`}>{outlet.name}</Link>
      )
    },
    { path: "city", label: "City", width: "2" },
    { path: "address", label: "Address", width: "3" },
    { path: "zip", label: "Zip", width: "2" },
    { path: "phone", label: "Phone", width: "2" },
    //{ path: "emails", label: "Emails" },
    { path: "createdDate", label: "Created date", width: "2" },
    {
      key: "action",
      width: "2",
      content: outlet => (
        <div>
          <Icon
            name="trash"
            color="red"
            className="clickable"
            onClick={() => this.props.onDelete(outlet)}
          />

          <Icon
            name="edit"
            color="blue"
            className="clickable"
            onClick={() => this.props.onUpdate(outlet)}
          />

          <Icon
            name="user"
            color="green"
            className="clickable"
            onClick={() => this.props.onUpdateManager(outlet)}
          />
        </div>
      )
    }
  ];

  render() {
    const { outlets, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={outlets}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default OutletsTable;
