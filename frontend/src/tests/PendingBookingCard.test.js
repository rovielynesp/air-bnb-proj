import React from 'react';
import PendingBookingCard from '../components/PendingBookingCard';
import { shallow } from 'enzyme';

const values = {
  start: '2021-11-19',
  end: '2021-11-30',
  price: '100',
  id: undefined,
  statusChange: 0,
  setStatusChange: jest.fn(),
}

describe('rendering components', () => {
  it('renders PendingBookingCard without crashing', () => {
    shallow(<PendingBookingCard props={ values } />);
  })
});

const pendingCard = shallow(<PendingBookingCard props={ values } />);

describe('check that various components of the PendingBookingCard render', () => {
  it('displays accept button', () => {
    expect(pendingCard.find('#acceptBookingButton'));
  });

  it('displays decline button', () => {
    expect(pendingCard.find('#declineBookingButton'));
  });

  it('displays pending start date', () => {
    expect(pendingCard.find('#pendingStartDate'));
  });

  it('displays pending ending date', () => {
    expect(pendingCard.find('#pendingEndDate'));
  });
});

describe('check labels of all components', () => {
  it('displays accept button', () => {
    expect(pendingCard
      .find('#acceptBookingButton')
      .props()['aria-label'])
      .toEqual('accept booking')
  });

  it('displays decline button', () => {
    expect(pendingCard
      .find('#declineBookingButton')
      .props()['aria-label'])
      .toEqual('decline booking')
  });

  it('displays pending start date', () => {
    expect(pendingCard
      .find('#pendingStartDate')
      .props()['aria-label'])
      .toEqual('booking pending start date')
  });

  it('displays pending ending date', () => {
    expect(pendingCard
      .find('#pendingEndDate')
      .props()['aria-label'])
      .toEqual('booking pending end date')
  });
});
