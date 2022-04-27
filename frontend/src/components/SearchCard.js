import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const url = 'http://localhost:5005';

export default function SearchCard ({ id, idx }) {
  const [title, setTitle] = useState('');
  const [media, setMedia] = useState('');
  const [price, setPrice] = useState(0);
  const [address, setAddr] = useState('');
  const [bathrooms, setBathrooms] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [ratings, setRatings] = useState(0);

  //   const history = useHistory();

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
  };

  useEffect(async () => {
    console.log('fetching data');
    options.method = 'GET';
    // try fetching the data
    console.log('get:', options);
    const r = await fetch(`${url}/listings/${id}`, options);
    const data = await r.json();
    if (!r.ok) {
      console.log(r);
      throw new Error(data.error)
    } else {
      console.log(data.listing);
      setAddr(`${data.listing.address.addr} ${data.listing.address.city}`);
      setTitle(data.listing.title);
      setMedia(data.listing.thumbnail);
      setPrice(data.listing.price);
      setRooms(data.listing.metadata.rooms.length);
      setBathrooms(data.listing.metadata.bathrooms);
      setReviews(data.listing.reviews.length);
      setRatings(1);
      if (data.listing.availability.length > 0) {
        // setLive(true);
        console.log('availabilities for lsiting exist')
      }
    }
  }, []);

  return (
      <Grid item xs={12} sm={6} md={4}>
        <Card key={idx} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardMedia
            component="img"
            height="140"
            image={media}
            alt="listing thumbnail"
            aria-label='image of current listing'
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>

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
              <Grid item xs={6} md={5}>
                <Typography variant="h7" align="left" color="text.secondary">
                  Bedrooms:
                </Typography>
              </Grid>
              <Grid item xs={6} md={7}>
                <Typography variant="h7" align="left" color="text.secondary">
                  {rooms}
                </Typography>
              </Grid>

              {/* Number of Bathrooms */}
              <Grid item xs={6} md={5}>
                <Typography variant="h7" align="left" color="text.secondary">
                  Bathrooms:
                </Typography>
              </Grid>
              <Grid item xs={6} md={7}>
                {bathrooms}
              </Grid>

              {/* Number of SVG Ratings */}
              <Grid item xs={6} md={5}>
                <Typography variant="h7" align="left" color="text.secondary">
                  Ratings:
                </Typography>
              </Grid>
              <Grid item xs={6} md={7}>
                  {ratings}
              </Grid>

              {/* Number of Reviews */}
              <Grid item xs={6} md={5}>
                <Typography variant="h7" align="left" color="text.secondary">
                  Reviews:
                </Typography>
              </Grid>
              <Grid item xs={6} md={7}>
                {reviews}
              </Grid>

            </Grid>

          </CardContent>

        </Card>
      </Grid>
  );
}

SearchCard.propTypes = {
  id: PropTypes.number,
  idx: PropTypes.number
}
