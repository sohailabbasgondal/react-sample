import React, { Component } from "react";
import Dashboard from "./components/dashboard";
import { Route, Redirect, Switch } from "react-router-dom";
import NotFound from "./components/notfound";

import Navigation from "./components/common/navigation";
import Orders from "./components/orders";
import LoginForm from "./components/loginForm";

import Outlets from "./components/outlet/outlets";
import OutletForm from "./components/outlet/outletForm";
import OutletEditForm from "./components/outlet/outletEditForm";
import OutletDetails from "./components/outlet/outletdetails";

import Suppliers from "./components/supplier/suppliers";
import SupplierForm from "./components/supplier/supplierForm";
import SupplierEditForm from "./components/supplier/supplierEditForm";
import OutletEditManagerForm from "./components/outlet/outletManagerEditForm";

import StorageAreas from "./components/storage_area/storageAreas";
import StorageAreaForm from "./components/storage_area/storageAreaForm";
import StorageAreaEditForm from "./components/storage_area/storageAreaEditForm";

import Categories from "./components/category/categories";
import CategoryForm from "./components/category/categoryForm";
import CategoryEditForm from "./components/category/categoryEditForm";

import SupplierItems from "./components/supplier_item/supplierItems";
import SupplierItemForm from "./components/supplier_item/supplierItemForm";
import SupplierItemEditForm from "./components/supplier_item/supplierItemEditForm";
import SupplierItemDetail from "./components/supplier_item/supplierItemDetail";

import MenuTypes from "./components/menu_type/menuTypes";
import MenuTypeForm from "./components/menu_type/menuTypeForm";
import MenuTypeEditForm from "./components/menu_type/menuTypeEditForm";

import MenuItems from "./components/menu_item/menuItems";
import MenuItemForm from "./components/menu_item/menuItemForm";
import MenuItemEditForm from "./components/menu_item/menuItemEditForm";

import SupplierOrders from "./components/supplier_order/supplierOrders";
import SupplierOrderDetail from "./components/supplier_order/supplierOrderDetail";
import ReceiveOrders from "./components/receive_order/receiveOrders";
import ReceiveOrderDetail from "./components/receive_order/receiveOrderDetail";
import InvoiceOrder from "./components/receive_order/invoiceOrder";

import Cashiers from "./components/cashier/cashiers";
import CashierForm from "./components/cashier/cashierForm";
import CashierEditForm from "./components/cashier/cashierEditForm";

import Waiters from "./components/waiter/waiters";
import WaiterForm from "./components/waiter/waiterForm";
import WaiterEditForm from "./components/waiter/waiterEditForm";

import Kitchens from "./components/kitchen/kitchens";
import KitchenForm from "./components/kitchen/kitchenForm";
import KitchenEditForm from "./components/kitchen/kitchenEditForm";

import CashierOrders from "./components/cashier_order/cashierOrders";
import CashierOrderDetail from "./components/cashier_order/cashierOrderDetail";

import Terminal from "./components/terminal/terminal";

import Queue from "./components/queue/queue";

import Recipes from "./components/recipe/recipes";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-block-ui/style.css";
import "./App.css";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";
import { Container } from "semantic-ui-react";

class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        {user && <Navigation user={user} />}
        <ToastContainer />

        <Container style={{ marginTop: "6em", width: "96%" }}>
          <Switch>
            <ProtectedRoute
              path="/dashboard/:outlet"
              exact
              component={Dashboard}
            />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            {/* menu items recipes */}
            <ProtectedRoute
              exact
              path="/menu-items/:id/recipe"
              component={Recipes}
            />
            {/* Outlets routes */}
            <ProtectedRoute exact path="/outlets/:id" component={OutletForm} />
            <ProtectedRoute
              path="/outlets/:id/edit"
              component={OutletEditForm}
            />
            <ProtectedRoute
              component={OutletDetails}
              path="/outlets/view/:id"
              exact
            />
            <ProtectedRoute
              exact
              path="/outlets/:id/manager-edit/:uid"
              component={OutletEditManagerForm}
            />
            <ProtectedRoute component={Outlets} path="/outlets" />
            {/* Suppliers routes */}
            <ProtectedRoute
              exact
              path="/suppliers/:id"
              component={SupplierForm}
            />
            <ProtectedRoute
              path="/suppliers/:id/edit"
              component={SupplierEditForm}
            />
            <ProtectedRoute path="/suppliers" component={Suppliers} />
            {/* storage areas */}
            <ProtectedRoute
              exact
              path="/storage-areas/:id"
              component={StorageAreaForm}
            />
            <ProtectedRoute
              path="/storage-areas/:id/edit"
              component={StorageAreaEditForm}
            />
            <ProtectedRoute path="/storage-areas" component={StorageAreas} />
            {/* categories */}
            <ProtectedRoute
              exact
              path="/categories/:id"
              component={CategoryForm}
            />
            <ProtectedRoute
              path="/categories/:id/edit"
              component={CategoryEditForm}
            />
            <ProtectedRoute path="/categories" component={Categories} />
            {/* items */}
            <ProtectedRoute
              exact
              path="/items/:id"
              component={SupplierItemForm}
            />
            <ProtectedRoute
              exact
              path="/items/:id/edit"
              component={SupplierItemEditForm}
            />
            <ProtectedRoute
              exact
              path="/items/view/:id"
              component={SupplierItemDetail}
            />
            <ProtectedRoute exact path="/items" component={SupplierItems} />
            {/* menu tyes */}
            <ProtectedRoute
              exact
              path="/menu-types/:id"
              component={MenuTypeForm}
            />
            <ProtectedRoute
              path="/menu-types/:id/edit"
              component={MenuTypeEditForm}
            />
            <ProtectedRoute path="/menu-types" component={MenuTypes} />
            {/* menu items */}
            <ProtectedRoute
              exact
              path="/menu-items/:id"
              component={MenuItemForm}
            />
            <ProtectedRoute
              path="/menu-items/:id/edit"
              component={MenuItemEditForm}
            />
            <ProtectedRoute path="/menu-items" component={MenuItems} />
            <ProtectedRoute
              path="/orders/view/:id"
              component={SupplierOrderDetail}
            />
            <ProtectedRoute path="/orders" component={SupplierOrders} />

            <ProtectedRoute
              path="/receive-orders/invoice/:id"
              component={InvoiceOrder}
            />
            <ProtectedRoute
              path="/receive-orders/view/:id"
              component={ReceiveOrderDetail}
            />
            <ProtectedRoute path="/receive-orders" component={ReceiveOrders} />

            {/* cashiers routes */}
            <ProtectedRoute
              exact
              path="/cashiers/:id"
              component={CashierForm}
            />
            <ProtectedRoute
              path="/cashiers/:id/edit"
              component={CashierEditForm}
            />
            <ProtectedRoute path="/cashiers" component={Cashiers} />

            {/* waiters routes */}
            <ProtectedRoute exact path="/waiters/:id" component={WaiterForm} />
            <ProtectedRoute
              path="/waiters/:id/edit"
              component={WaiterEditForm}
            />
            <ProtectedRoute path="/waiters" component={Waiters} />

            {/* kitchens routes */}
            <ProtectedRoute
              exact
              path="/kitchens/:id"
              component={KitchenForm}
            />
            <ProtectedRoute
              path="/kitchens/:id/edit"
              component={KitchenEditForm}
            />
            <ProtectedRoute path="/kitchens" component={Kitchens} />

            {/* pos terminal */}
            <ProtectedRoute
              path="/cashiers-orders/view/:id"
              component={CashierOrderDetail}
            />
            <ProtectedRoute path="/cashiers-orders" component={CashierOrders} />
            {/* pos terminal */}
            <ProtectedRoute path="/pos-terminal" component={Terminal} />
            {/* order queue */}
            <ProtectedRoute path="/order-queue" component={Queue} />
            {/* outlet settings */}

            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
