import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PublicCard from '../components/publicListCard';
import PostBookingsCard from '../components/getBookings';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Search from '../components/Search';

const theme = createTheme();
const url = 'http://localhost:5005';

export default function PublicListings ({ isLoggedIn }) {
  const [listings, setListings] = useState([]);

  useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    // try fetching the data
    const r = await fetch(`${url}/listings`, options);
    const data = await r.json();
    if (!r.ok) {
      throw new Error(data.error)
    }
    if (data.listings) {
      const toSort = data.listings;
      toSort.sort(function (a, b) {
        const titleA = a.title.toUpperCase(); // ignore upper and lowercase
        const titleB = b.title.toUpperCase(); // ignore upper and lowercase
        if (titleA < titleB) {
          return -1;
        } else if (titleA > titleB) {
          return 1;
        } else {
          return 0;
        }
      });
      // const res = toSort.filter((l) => checkPublished(l.id))
      setListings(toSort)
    }
  }, []);

  useEffect(() => {
    console.log('alphabetical order of all listings', listings);
  }, [listings])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container sx={{ pt: 3 }}>
          <Search />
        </Container>
        {
          (isLoggedIn)
            ? <PostBookingsCard />
            : ' '
        }
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 3,
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
              All Live Listings
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            { listings.map((listing, idx) => {
              return <PublicCard id={listing.id} key={idx} bookingStatus={undefined}/>
            }) }
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}

PublicListings.propTypes = {
  isLoggedIn: PropTypes.bool
}
