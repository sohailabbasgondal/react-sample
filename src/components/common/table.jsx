import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import { Table } from "semantic-ui-react";

const RenderTable = ({ columns, sortColumn, onSort, data }) => {
  return (
    <Table celled padded>
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} data={data} />
    </Table>
  );
};

export default RenderTable;
