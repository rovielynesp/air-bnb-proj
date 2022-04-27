import React from 'react';
import ConfirmDialog from '../components/confirm-popup';
import { shallow } from 'enzyme';

const noop = () => {};

describe('rendering components', () => {
  it('renders NavBar without crashing', () => {
    shallow(<ConfirmDialog
      trigger={true}
      setTrigger={noop}
      setConfirm={noop}
      errMsg={ '' }
      errTitle={''}
      buttonConfirm={''}/>);
  })
});

const closeFn = jest.fn();
const confirmFn = jest.fn();
const popup = shallow(<ConfirmDialog
  trigger={true}
  setTrigger={closeFn}
  setConfirm={confirmFn}
  errMsg={'Are you sure you want to delete?'}
  errTitle={'Delete Listing'}
  buttonConfirm={'Delete'}/>
);

describe('check close button works to close the popup', () => {
  it('calls the trigger function', () => {
    popup.find('#triggerButton').simulate('click');
    expect(closeFn).toBeCalledTimes(1);
  })
  it('calls the confirmation function', () => {
    popup.find('#confirmButton').simulate('click');
    expect(confirmFn).toBeCalledTimes(1);
  })
});

describe('displays correct details', () => {
  it('displays the correct title', () => {
    expect(
      popup.find('#alert-dialog-title')
        .text()
    ).toBe('Delete Listing');
  });
});

describe('displays correct details', () => {
  it('displays the correct title', () => {
    expect(
      popup.find('#alert-dialog-title')
        .text()
    ).toBe('Delete Listing');
  });
});
