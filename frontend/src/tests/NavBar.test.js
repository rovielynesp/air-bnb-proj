import React from 'react';
import NavBar from '../components/NavBar';
import { shallow } from 'enzyme';

const noop = () => {};

describe('rendering components', () => {
  it('renders NavBar without crashing', () => {
    shallow(<NavBar loggedIn={true} setLoggedIn={noop} />);
  })
});

const loggedInNavBar = shallow(<NavBar loggedIn={true} setLoggedIn={noop} />);
const loggedOutNavBar = shallow(<NavBar loggedIn={false} setLoggedIn={noop} />);

describe('check that various components of the NavBar render', () => {
  it('displays register button when user is not logged in', () => {
    expect(loggedOutNavBar.find('#registerButton'));
  });

  it('displays login button when user is not logged in', () => {
    expect(loggedOutNavBar.find('#loginButton'));
  });

  it('displays account bubble when user logged in', () => {
    expect(loggedInNavBar.find('#accountBubbleMenu'));
  });
});

describe('check labels of login & register buttons', () => {
  it('login button has proper aria-label', () => {
    expect(loggedOutNavBar
      .find('#loginButton')
      .props()['aria-label'])
      .toEqual('goto login page');
  });

  it('register button has proper aria-label', () => {
    expect(loggedOutNavBar
      .find('#registerButton')
      .props()['aria-label'])
      .toEqual('goto register page');
  });
});

describe('check labels of account menu', () => {
  const acctBubbleBtn = loggedInNavBar.find('#accountBubbleMenu');
  const acctMenu = loggedInNavBar.find('#accountMenu');

  it('menu button has proper aria-label', () => {
    expect(acctBubbleBtn
      .props()['aria-label'])
      .toEqual('account options of current user');
  });

  it('menu button has aria popup indication', () => {
    expect(acctBubbleBtn
      .props()['aria-haspopup'])
      .toEqual('true');
  });

  it('menu has different dropdown options', () => {
    expect(acctMenu.find('#logoutButton'));
    expect(acctMenu.find('#myListingsButton'));
    expect(acctMenu.find('#createListingButton'));
  });

  it('logout menu field has proper aria-label', () => {
    expect(acctMenu
      .find('#logoutButton')
      .props()['aria-label'])
      .toEqual('logout of your account');
  });

  it('view listings menu field has proper aria-label', () => {
    expect(acctMenu
      .find('#myListingsButton')
      .props()['aria-label'])
      .toEqual('view your created listings');
  });

  it('create listing menu field has proper aria-label', () => {
    expect(acctMenu
      .find('#createListingButton')
      .props()['aria-label'])
      .toEqual('create a new listing');
  });
});
