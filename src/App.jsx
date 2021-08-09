import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import ServiceProvider from "./services/contex-provider/ServiceProvider";
import HomePage from "./pages/home/HomePage";
import AccountsPage from "./pages/accounts/AcccountsPage";
import UsersPage from "./pages/users/UsersPage";
import RestaurantsPage from "./pages/restaurants/RestaurantsPage";
import DriversPage from "./pages/drivers/DriversPage";
import Activate from "./pages/activate/Activate";

function App() {
  return (
    <BrowserRouter>
      <ServiceProvider>
        <Switch>
          <Route exact path={["/", "/home"]} component={HomePage} />
          <Route path="/users" component={UsersPage} />
          <Route path="/drivers" component={DriversPage} />
          <Route path="/restaurants" component={RestaurantsPage} />
          <Route path="/account" component={AccountsPage} />
          <Route path="/activate/:token" component={Activate} />
        </Switch>
      </ServiceProvider>
    </BrowserRouter>
  );
}

export default App;
