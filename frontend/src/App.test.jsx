import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { shallow } from 'enzyme';
import SignUp from './pages/sign-up';
import Login from './pages/Login'

test('renders learn react link', () => {
  render(<App />);
  shallow(<SignUp />);
  shallow(<Login />);
});
