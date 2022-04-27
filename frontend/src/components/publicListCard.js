import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useHistory, } from 'react-router-dom';

import InfoCard from '../pages/details';
const url = 'http://localhost:5005';

export default function PublicCard ({ id, idx, bookingStatus }) {
  const [title, setTitle] = useState('');
  const [media, setMedia] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [published, setPublished] = useState(false);

  React.useEffect(async () => {
    if (bookingStatus !== undefined) {
      setIsBooking(true);
    }
    const options = {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
      },
    };
    console.log('getting list data');
    const r = await fetch(`${url}/listings/${id}`, options);
    const data = await r.json();

    if (!r.ok) {
      console.log(r);
      throw new Error(data.error)
    }
    try {
      console.log('details are', data.listing);
      console.log('published for', data.listing.title)
      console.log('published', data.listing.published)
      setPublished(data.listing.published)
      console.log('publihsed state var', published)
    } catch (e) {
      console.log(e);
    }
  }, []);

  const history = useHistory();
  return published
    ? (
    <Grid item xs={12} sm={6} md={4}>
      <Card key={idx} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={media}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <InfoCard id={id} setTitle={setTitle} setMedia={setMedia} setAvailabilities={undefined} setReviewList={undefined}/>
          { (isBooking)
            ? <Typography sx={{ mb: 1.5, mt: 1.5 }}>
                booking status: <Typography color="blue"> {bookingStatus} </Typography>
              </Typography>
            : ' '
          }
        </CardContent>
        <CardActions>
          <Button size="small"
            onClick={ () => history.push(`/listing/${id}`) }>
              More Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
      )
    : '';
}

PublicCard.propTypes = {
  id: PropTypes.number,
  idx: PropTypes.number,
  bookingStatus: PropTypes.string,
  bookingId: PropTypes.number
}
