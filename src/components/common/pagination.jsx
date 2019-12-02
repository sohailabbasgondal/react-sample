import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Table, Menu } from "semantic-ui-react";

const Pagination = props => {
  const { itemsCount, currentPage, pageSize, onPageChange } = props;
  console.log(currentPage);
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <Table style={{ border: "0px" }}>
      <Table.Body>
        <Table.Row>
          <Table.HeaderCell>
            <Menu floated="right" pagination>
              {pages.map(page => (
                <Menu.Item
                  as="a"
                  key={page}
                  className={
                    page === currentPage ? "page-item active" : "page-item"
                  }
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Menu.Item>
              ))}
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};
export default Pagination;
