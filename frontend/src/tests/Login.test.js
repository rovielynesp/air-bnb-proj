import React from 'react';
import Login from '../pages/Login';
import { shallow } from 'enzyme';

describe('rendering components', () => {
  it('renders login page without crashing', () => {
    shallow(<Login />);
  })
});

describe('check labels of text fields', () => {
  const login = shallow(<Login />);
  it('email field has proper aria-label', () => {
    expect(login
      .find('#emailInput')
      .props()['aria-label'])
      .toEqual('account email field');
  });

  it('password field has proper aria-label', () => {
    expect(login
      .find('#passwordInput')
      .props()['aria-label'])
      .toEqual('account password field');
  });
});

describe('check both text fields are required for the form', () => {
  const login = shallow(<Login />);
  it('email field is required for form submission', () => {
    expect(login
      .find('#emailInput')
      .props().required)
      .toEqual(true);
  });

  it('password field is required for form submission', () => {
    expect(login
      .find('#passwordInput')
      .props().required)
      .toEqual(true);
  });
});
