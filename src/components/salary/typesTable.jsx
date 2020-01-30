import React, { Component } from "react";
import RenderTable from "../common/table";
import { Icon, Label } from "semantic-ui-react";
import auth from "../../services/authService";

class SalaryTable extends Component {
  columns = [
    {
      path: "work_date",
      label: "Salary Date",
      width: "7"
    },
    {
      path: "entry_date",
      label: "Entry Date",
      width: "7"
    },

    {
      key: "actions",
      width: "2",
      content: type => (
        <div>
          <Icon
            name="info"
            color="info"
            className="clickable"
            onClick={() => this.props.onDetail(type)}
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

export default SalaryTable;
