import React from 'react';
import MediaCard from '../components/listingCard';
import { shallow } from 'enzyme';

describe('rendering components', () => {
  it('renders NavBar without crashing', () => {
    shallow(<MediaCard />);
  })
});

const mediaCard = shallow(<MediaCard />);
describe('check that various components of the NavBar render', () => {
  it('displays edit button', () => {
    expect(mediaCard.find('#editButton'));
  });

  it('displays delete button', () => {
    expect(mediaCard.find('#deleteButton'));
  });
});
