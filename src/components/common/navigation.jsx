import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Image, Menu, Dropdown } from "semantic-ui-react";

const Navigation = ({ user }) => {
  const logoUrl = process.env.REACT_APP_URL + "/logo.png";
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <Image
            src={logoUrl}
            style={{ marginRight: "1.5em", height: "30px" }}
          />
        </Menu.Item>

        {user &&
          (user.user_type === "store-manager" ||
            user.user_type === "cashier" ||
            user.user_type === "client" ||
            user.user_type === "waiter") && (
            <Menu.Item>
              <NavLink className="nav-item nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </Menu.Item>
          )}

        {user &&
          (user.user_type === "cashier" ||
            user.user_type === "waiter" ||
            user.user_type === "kitchen") && (
            <Menu.Item>
              <NavLink className="nav-item nav-link" to="/order-queue">
                Orders Queue
              </NavLink>
            </Menu.Item>
          )}

        {user && (user.user_type === "cashier" || user.user_type === "waiter") && (
          <Menu.Item>
            <NavLink className="nav-item nav-link" to="/pos-terminal">
              Terminal
            </NavLink>
          </Menu.Item>
        )}

        {user && user.user_type === "client" && (
          <Menu.Item>
            <NavLink className="nav-item nav-link" to="/outlets">
              Outlets
            </NavLink>
          </Menu.Item>
        )}

        {user && user.user_type === "store-manager" && (
          <React.Fragment>
            <Menu.Item>
              <NavLink className="nav-item nav-link" to="/suppliers">
                Suppliers
              </NavLink>
            </Menu.Item>

            <Dropdown item simple text="Inventory">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/storage-areas">
                    Storage areas
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/categories">
                    Categories
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/items">
                    Items
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown item simple text="Orders">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <i className="dropdown icon" />
                  <span className="text">Suppliers</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <NavLink style={{ color: "#000" }} to="/items">
                        Place orders
                      </NavLink>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <NavLink style={{ color: "#000" }} to="/orders">
                        Orders history
                      </NavLink>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <NavLink style={{ color: "#000" }} to="/receive-orders">
                        Receive orders
                      </NavLink>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="dropdown icon" />
                  <span className="text">Cashiers</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <NavLink style={{ color: "#000" }} to="/cashiers-orders">
                        Orders history
                      </NavLink>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown item simple text="POS">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/menu-types">
                    Menu types
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/menu-items">
                    Menu items
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown item simple text="Users">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/cashiers">
                    Cashiers
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/waiters">
                    Waiters
                  </NavLink>
                </Dropdown.Item>
                <Dropdown.Item>
                  <NavLink style={{ color: "#000" }} to="/kitchens">
                    Kitchen
                  </NavLink>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </React.Fragment>
        )}

        {user && (
          <Menu.Menu position="right">
            <Menu.Item>
              <NavLink to="/profile">{user.name}</NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/logout">Logout</NavLink>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Container>
    </Menu>
  );
};

export default Navigation;
