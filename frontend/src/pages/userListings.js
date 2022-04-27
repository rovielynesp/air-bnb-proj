import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MediaCard from '../components/listingCard';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
const url = 'http://localhost:5005';

export default function UserListings () {
  const [myListings, setMyListings] = useState([]);
  useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    };
    // try fetching the data
    const r = await fetch(`${url}/listings`, options);
    const data = await r.json();
    const userEmail = localStorage.getItem('email');
    console.log('useremail is:', userEmail);
    if (!r.ok) {
      throw new Error(data.error)
    }
    if (data.listings) {
      console.log('all data:', data.listings);
      const myList = [];
      data.listings.map((listing) => {
        if (listing.owner === userEmail) {
          myList.push(listing.id);
        }
        return myList;
      });
      console.log('collected list:', myList);
      setMyListings(myList);
      console.log('stateList', myListings);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
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
              My Listings
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            { myListings.map((id, idx) => {
              return <MediaCard id={id} key={idx} />
            }) }
            {/* <MediaCard id={710540931} /> */}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
