import React from 'react';
import ListingsCreate from '../pages/ListingsCreate';
import { shallow } from 'enzyme';

describe('rendering components', () => {
  it('renders listingsCreate page without crashing', () => {
    shallow(<ListingsCreate />);
  })
});

describe('check mandatory fields in form have required prop', () => {
  const listingsCreate = shallow(<ListingsCreate />);
  it('title field is required for form submission', () => {
    expect(listingsCreate
      .find('#title')
      .props().required)
      .toEqual(true);
  });

  it('price field is required for form submission', () => {
    expect(listingsCreate
      .find('#price')
      .props().required)
      .toEqual(true);
  });

  it('address line field is required for form submission', () => {
    expect(listingsCreate
      .find('#address')
      .props().required)
      .toEqual(true);
  });

  it('city field is required for form submission', () => {
    expect(listingsCreate
      .find('#city')
      .props().required)
      .toEqual(true);
  });
});

describe('check aria labels of all text fields', () => {
  const listingsCreate = shallow(<ListingsCreate />);
  it('title field has proper aria-label', () => {
    expect(listingsCreate
      .find('#title')
      .props()['aria-label'])
      .toEqual('enter property title');
  });

  it('price field has proper aria-label', () => {
    expect(listingsCreate
      .find('#price')
      .props()['aria-label'])
      .toEqual('enter property price per night');
  });

  it('bathrooms field has proper aria-label', () => {
    expect(listingsCreate
      .find('#bathrooms')
      .props()['aria-label'])
      .toEqual('enter number of bathrooms');
  });

  it('address line field has proper aria-label', () => {
    expect(listingsCreate
      .find('#address')
      .props()['aria-label'])
      .toEqual('enter property address');
  });

  it('city field has proper aria-label', () => {
    expect(listingsCreate
      .find('#city')
      .props()['aria-label'])
      .toEqual('enter property city');
  });

  it('amenities field has proper aria-label', () => {
    expect(listingsCreate
      .find('#amenities')
      .props()['aria-label'])
      .toEqual('enter property amenities');
  });

  it('amenities field has proper aria-label', () => {
    expect(listingsCreate
      .find('#propertyType')
      .props()['aria-label'])
      .toEqual('select property type');
  });
});
