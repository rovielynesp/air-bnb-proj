import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PublicCard from '../components/publicListCard';
import Box from '@mui/material/Box';

const url = 'http://localhost:5005';

export default function PostBookingsCard () {
  const [bookingList, setBookings] = useState([]);

  // generates the list of all the bookings if user is logged in
  useEffect(async () => {
    console.log('token is', localStorage.getItem('token'));

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    };

    const r = await fetch(`${url}/bookings`, options);
    const data = await r.json();
    if (!r.ok) {
      throw new Error(data.error);
    }
    if (data.bookings) {
      const userEmail = localStorage.getItem('email');
      const dummy = data.bookings.filter((booking) => {
        return (booking.owner === userEmail)
      });
      setBookings(dummy);
      console.log('alphabetical order of all bookings', bookingList);
      console.log('dummy list is', dummy);
    }
  }, []);

  return (
    <Box
    sx={{
      bgcolor: 'background.paper',
      pt: 2,
      pb: 6,
    }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Current Bookings
        </Typography>
      </Container>
      <Container sx={{ py: 8 }} maxWidth="md">
      {/* End hero unit */}
      <Grid container spacing={4}>
        {
          (bookingList.length === 0)
            ? <Typography gutterBottom variant="h5" component="div"> No current bookings </Typography>
            : bookingList.map((booking, idx) => {
              console.log('public card called')
              return <PublicCard id={parseInt(booking.listingId)} key={idx} bookingStatus={booking.status} isBookedByUser={true}/>
            })
        }
      </Grid>
    </Container>
  </Box>
  );
}
