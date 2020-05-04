import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import OrderOption from '../../screens/OrderOption/OrderOption';
import QrLogin from '../../screens/QrLogin/QrLogin'
import EnsureAuthenticated from '../EnsureAuthenticated';
import MenuScreen from '../../screens/MenuScreen/MenuScreen';
import CartScreen from '../../screens/CartScreen/CartScreen';
import OrderSuccessScreen from '../../screens/OrderSuccess/OrderSuccessScreen';
import NavigationBar from '../navigationBar/NavigationBar';
import { connect } from 'react-redux';
import SearchScreen from '../../screens/SearchScreen/SearchScreen';
import CheckoutScreen from '../../screens/CheckoutScreen/CheckoutScreen';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/qr/:locationId?' component={QrLogin} />
        <EnsureAuthenticated>
          <Route exact path='/' render={() => (<Redirect to={{ pathname: '/menu' }} />)} />
          <Route exact path='/order' component={OrderOption}></Route>
          <Route exact path='/menu' component={MenuScreen} />
          <Route exact path='/cart' component={CartScreen} />
          <Route exact path='/search' component={SearchScreen} />
          <Route exact path='/checkout' component={CheckoutScreen} />
          <Route exact path='/success' component={OrderSuccessScreen} />
        </EnsureAuthenticated>
      </Switch>
      {/* <NavigationBar /> */}
    </div>
  );
}

const mapStateToProps = ({ cartItems }: any) => {
  const cart = cartItems.cartItems
  return {
    cart
  }
}

export default connect(mapStateToProps)(App);
