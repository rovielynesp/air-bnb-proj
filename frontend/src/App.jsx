import React from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/sign-up';
import ListingsCreate from './pages/ListingsCreate';
import NavBar from './components/NavBar';
import UserListings from './pages/userListings';
import PublishListing from './pages/goLive';
import PublicListings from './pages/publicListings';
import BookingView from './pages/BookingView';
import ListingsEdit from './pages/ListingsEdit';
import ViewPage from './pages/viewListing';
import Search from './components/Search'
import BookingCreate from './components/BookingCreate';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

function App () {
  // this needs to be triggered anytime locastorage changes
  const [loggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    localStorage.getItem('token') && setLoggedIn(true);
  }, []);
  return (
  <>
    <Router>
      <NavBar loggedIn={loggedIn} setLogin={setLoggedIn}/>
      <Switch>
        <Route path="/login">
          <Login setLogin={setLoggedIn}/>
        </Route>
        <Route path="/register">
          <SignUp setLogin={setLoggedIn}/>
        </Route>
        <Route path="/hosted/listings/create">
          <ListingsCreate />
        </Route>
        <Route path="/hosted/listings/edit/:id">
          <ListingsEdit />
        </Route>
        <Route path="/listings">
          <PublicListings isLoggedIn={loggedIn} />
        </Route>
        {/* this route is for debugging purposes only - will remove once search is fully implemented */}
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/hosted/listings">
          <UserListings />
        </Route>
        <Route path="/bookings/view/:id">
          <BookingView />
        </Route>
        {/* path for testings booking create component - will delete later */}
        <Route path="/booking/create">
          <BookingCreate />
        </Route>
        {/* add future routes here */}
        <Route path="/publish/:id">
          <PublishListing />
        </Route>
        <Route path="/listing/:id">
          <ViewPage />
        </Route>
        <Route path="/">
          {/* redirect to empty listings page for now until we create inital landing */}
          <Redirect to="/listings"/>
        </Route>
      </Switch>
    </Router>
  </>
  );
}

export default App;
