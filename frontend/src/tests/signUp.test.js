import React from 'react';
import SignUp from '../pages/sign-up';
import { shallow } from 'enzyme';

// helper function to simulate change on form
//  source: Jack Franklin's Testing React #10: testing forms in enzyme (youtube)
const simulateChangeOnForm = (wrapper, id, val) => {
  const field = wrapper.find(id);
  field.simulate('change', { target: { value: val } });
  return wrapper.find(id);
}

const signUpForm = shallow(<SignUp />);

describe('rendering components', () => {
  it('renders register without crashing', () => {
    shallow(<SignUp />);
  })
});

describe('filling out form', () => {
  const data = {
    firstName: 'Rov',
    lastName: 'Esp',
    email: 'rov@mail.com',
    password: '12345'
  }

  it('lets me type a name', () => {
    const lastName = simulateChangeOnForm(signUpForm, '#lastNameInput', data.lastName);
    const firstName = simulateChangeOnForm(signUpForm, '#firstNameInput', data.firstName);
    expect(lastName.props().value).toEqual(data.lastName);
    expect(firstName.props().value).toEqual(data.firstName);
  });

  it('lets me type an email', () => {
    const email = simulateChangeOnForm(signUpForm, '#emailInput', data.email);
    expect(email.props().value).toEqual(data.email);
  });

  it('lets me type passwords', () => {
    const password1 = simulateChangeOnForm(signUpForm, '#passwordInput', data.password);
    const password2 = simulateChangeOnForm(signUpForm, '#passwordInput2', data.password);
    expect(password1.props().value).toEqual(data.password);
    expect(password2.props().value).toEqual(data.password);
  })
});
