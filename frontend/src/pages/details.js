import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import AlertDialog from '../components/error-popup';

// ICONS:
import SingleBedIcon from '@mui/icons-material/SingleBed';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import ReviewsIcon from '@mui/icons-material/Reviews';
import BathroomIcon from '@mui/icons-material/Bathroom';

const url = 'http://localhost:5005';

export default function InfoCard ({ id, setTitle, setMedia, setAvailabilities, setReviewList, reviewAdd }) {
  const [price, setPrice] = useState(0);
  const [address, setAddr] = useState('');
  const [bathrooms, setBathrooms] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [ratings, setRatings] = useState(0);

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const options = {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
    },
  };

  useEffect(async () => {
    try {
      console.log('fetching data');
      const r = await fetch(`${url}/listings/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        console.log(r);
        setError(true);
        setErrorMsg(data.error);
        throw new Error(data.error);
      }
      console.log('result is', data.listing);
      setAddr(`${data.listing.address.addr} ${data.listing.address.city}`);
      setTitle(data.listing.title);
      setMedia(data.listing.thumbnail);
      setPrice(data.listing.price);
      setRooms(data.listing.metadata.rooms.length);
      setBathrooms(data.listing.metadata.bathrooms);
      setReviews(data.listing.reviews.length);
      console.log('reviews', data.listing.reviews);
      let sum = 0;
      data.listing.reviews.forEach((r1) => {
        sum += parseInt(r1.rating);
      });
      console.log('SUM AVE', sum);
      const average = Math.round(sum / data.listing.reviews.length);
      setRatings(data.listing.reviews.length > 0 ? average : 0);
      if (setAvailabilities !== undefined) {
        setAvailabilities(data.listing.availability);
      }
      if (setReviewList !== undefined) {
        setReviewList(data.listing.reviews);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [reviewAdd]);

  return (
    <Grid rowSpacing={1} container>

      <Grid item xs={6} md={3}>
        <LocationOnIcon />
      </Grid>
      <Grid item xs={6} md={9}>
        {address}
      </Grid>

      {/* Price */}
      <Grid item xs={6} md={3}>
        <AttachMoneyIcon />
      </Grid>
      <Grid item xs={6} md={9}>
        {price}
      </Grid>

      {/* Number of Bedrooms */}
      <Grid item xs={6} md={3}>
        <Typography variant="h7" align="left" color="text.secondary">
          <SingleBedIcon />
        </Typography>
      </Grid>
      <Grid item xs={6} md={9}>
        <Typography variant="h7" align="left" color="text.secondary">
          {rooms}
        </Typography>
      </Grid>

      {/* Number of Bathrooms */}
      <Grid item xs={6} md={3}>
        <Typography variant="h7" align="left" color="text.secondary">
          <BathroomIcon />
        </Typography>
      </Grid>
      <Grid item xs={6} md={9}>
        {bathrooms}
      </Grid>

      {/* Number of SVG Ratings */}
      <Grid item xs={6} md={3}>
        <Typography variant="h7" align="left" color="text.secondary">
          <StarIcon />
        </Typography>
      </Grid>
      <Grid item xs={6} md={9}>
          {ratings}
      </Grid>

      {/* Number of Reviews */}
      <Grid item xs={6} md={3}>
        <Typography variant="h7" align="left" color="text.secondary">
          <ReviewsIcon />
        </Typography>
      </Grid>
      <Grid item xs={6} md={9}>
        {reviews}
      </Grid>
      { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Retrieving Data Failed'}/> }
    </Grid>
  )
}

InfoCard.propTypes = {
  id: PropTypes.number,
  setTitle: PropTypes.func,
  setMedia: PropTypes.func,
  setAvailabilities: PropTypes.func,
  setReviewList: PropTypes.func,
  reviewAdd: PropTypes.number
}
