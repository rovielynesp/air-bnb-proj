import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchCard from '../components/SearchCard';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

const ratings = [
  {
    value: 1,
    label: 'Lowest',
  },
  {
    value: 5,
    label: 'Highest',
  },
];

const theme = createTheme();
const url = 'http://localhost:5005';

const Search = () => {
  const [canSubmit, setCanSubmit] = React.useState(false);
  // const [render, setRender] = React.useState(0);
  // const [setShowFilters] = React.useState(true);
  const [searchResults, setSearchResults] = React.useState([]);
  console.log('search results outside ABOVEEEEEEE ARE', searchResults);
  const [values, setValues] = React.useState({
    search: '',
    minBed: undefined,
    maxBed: undefined,
    // dateFrom: new Date().toLocaleDateString('en-CA'),
    dateFrom: undefined,
    dateTo: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    isHighestToLowest: true,
    render: 1,
    rating: 1,
  });
  React.useEffect(() => {
    console.log('isnide use effect that keeps track of if we can submit')
    if (values.search || values.minPrice || values.maxPrice ||
        values.minBed || values.maxBed || values.dateFrom || values.dateTo || values.rating) {
      setCanSubmit(true)
    } else {
      console.log('user cannot submit')
      console.log(values)
      setCanSubmit(false)
    }
  }, [values])

  async function performSearch () {
    console.log('performListing is called')
    if (!(values.search || values.minPrice || values.maxPrice ||
      values.minBed || values.maxBed || values.dateFrom || values.dateTo || values.rating)) {
      console.log('performListing is early returned')
      console.log(values)
      return;
    }
    console.log('values are', values)
    // otherwise to the actual get call for listings here
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const r = await fetch(`${url}/listings`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error)
      }
      // once data is fetched successfully, we've can populate all value fields
      console.log('the data from the initial call is', data);
      console.log('data.listing is', data.listings);
      // setRawListingResults(data.listings);
      // fetch additional listing results here as well
      const rawListingResults = data.listings;
      if (rawListingResults.length < 1) {
        return;
      }
      // continue to filter the data here
      console.log('filtering data')
      // listing.title.
      // setSearchResults([]);
      const results = [];
      rawListingResults.forEach(async (listing, idx) => {
        console.log('the current listing is', listing);
        console.log('the idx is', idx)

        // first filter title & city regex matches
        // whatever field we have is what we search by
        if (values.search && !listing.title.toLowerCase().includes(values.search.toLowerCase()) &&
            !listing.address.city.toLowerCase().includes(values.search.toLowerCase())) {
          console.log('failed at city/title name match')
          return false;
        }
        if (values.minPrice && parseInt(listing.price) < values.minPrice) {
          console.log('failed at price min match')
          return false;
        }
        // if maxPrice is defined
        if (values.maxPrice && parseInt(listing.price) > values.maxPrice) {
          console.log('failed at price max match')
          return false;
        }
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        // try fetching the data
        try {
          const r = await fetch(`${url}/listings/${listing.id}`, options);
          const data = await r.json();
          if (!r.ok) {
            throw new Error(data.error)
          }
          // once data is fetched successfully, we've can populate all value fields
          console.log('additional data from data.listing is', data.listing);
          const numBedrooms = data.listing.metadata.rooms.length;
          console.log('numBedrooms is', numBedrooms)
          if (values.minBed && numBedrooms < values.minBed) {
            console.log('failed at bed min match')
            return false;
          }
          // if maxBed is defined
          if (values.maxBed && numBedrooms > values.maxBed) {
            console.log('failed at bed max match')
            return false;
          }
          // filter via availabilities here
          const availabilities = data.listing.availability;
          if (values.dateFrom && values.dateTo) {
            const validAvail = availabilities.filter((a) => {
              console.log('curr time period is', a);
              return (a.start <= values.dateFrom && values.dateTo <= a.end);
            })
            if (validAvail.length < 1) {
              return false;
            }
          } else if (!values.dateFrom && values.dateTo) {
            const validAvail = availabilities.filter((a) => {
              console.log('curr time period is', a);
              return (values.dateTo <= a.end);
            })
            if (validAvail.length < 1) {
              return false;
            }
          } else if (values.dateFrom && !values.dateTo) {
            const validAvail = availabilities.filter((a) => {
              console.log('curr time period is', a);
              return (a.start <= values.dateFrom);
            })
            if (validAvail.length < 1) {
              return false;
            }
          }
          // NEED TO FILTER VIA RATINGS HERE
          results.push(listing);
          // setShowFilters(true);
          // setSearchResults([...searchResults, listing]);
        } catch (e) {
          console.log(e);
          return null;
        }
      })
      if (values.rating === 1) {
        results.sort((a, b) => {
          let sumA = 0;
          a.reviews.forEach((r1) => {
            sumA += parseInt(r1.rating);
          });
          console.log('suma', sumA);
          const avgA = a.reviews.length > 0 ? Math.round(sumA / a.reviews.length) : 0;

          let sumB = 0;
          a.reviews.forEach((r1) => {
            sumB += parseInt(r1.rating);
          });
          console.log('sumB', sumB);
          const avgB = a.reviews.length > 0 ? Math.round(sumB / a.reviews.length) : 0;

          if (avgA < avgB) {
            return -1;
          } else if (avgA > avgB) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        results.sort((a, b) => {
          let sumA = 0;
          a.reviews.forEach((r1) => {
            sumA += parseInt(r1.rating);
          });
          console.log('suma', sumA);
          const avgA = a.reviews.length > 0 ? Math.round(sumA / a.reviews.length) : 0;

          let sumB = 0;
          a.reviews.forEach((r1) => {
            sumB += parseInt(r1.rating);
          });
          console.log('sumB', sumB);
          const avgB = a.reviews.length > 0 ? Math.round(sumB / a.reviews.length) : 0;

          if (avgA > avgB) {
            return -1;
          } else if (avgA < avgB) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      // then filter min/max price
      console.log('final filtered search results are', results);
      setSearchResults(results);
      // setRender(render + 1)handleChangeRender
      handleChangeRender('render')
      console.log('search results inside function', searchResults);
    } catch (e) {
      console.log(e);
    }
  }
  console.log('search results outside func below', searchResults);

  const handleChangeRender = (prop) => {
    setValues({ ...values, [prop]: values.render + 1 });
  }

  const handleValueChange = (prop) => (event) => {
    console.log('isnide handle values change')
    setValues({ ...values, [prop]: event.target.value });
    console.log('values inside form are', values);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='md'>
        <CssBaseline />
        <Card sx={{ p: 3 }}>
          <Typography
              component="h1"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Search
            </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                    fullWidth
                    id="search"
                    label="Enter title or city"
                    name="search"
                    value={values.search}
                    onChange={handleValueChange('search')}
                    autoComplete="search"
                  />
              </Grid>
              <Grid item xs={1} alignItems="center" justifyContent="center">
                <IconButton
                  disabled={!canSubmit}
                  type='button'
                  onClick={() => {
                    performSearch();
                  }}>
                  <SearchIcon />
                </IconButton>
              </Grid>
              <Grid item xs={3} alignItems="center" justifyContent="center">
                <label htmlFor="raised-button-file">
                  <Button
                    variant="outlined"
                    disabled={!canSubmit}
                    onClick={handleValueChange('render')}
                    component="span">
                    Show Results
                  </Button>
                </label>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={2} alignItems="center" justifyContent="center">
                  <TextField
                      fullWidth
                      id="minPrice"
                      label="Min Price"
                      type="number"
                      name="minPrice"
                      value={values.minPrice}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      autoFocus
                      onChange={handleValueChange('minPrice')}
                      autoComplete="minPrice"
                    />
                </Grid>
                <Grid item xs={2} alignItems="center" justifyContent="center">
                  <TextField
                    fullWidth
                    id="maxPrice"
                    type="number"
                    label="Max Price"
                    name="maxPrice"
                    value={values.maxPrice}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    autoFocus
                    onChange={handleValueChange('maxPrice')}
                    autoComplete="maxPrice"
                  />
                </Grid>
                <Grid item xs={3} alignItems="center" justifyContent="center">
                  <TextField
                      fullWidth
                      id="minBed"
                      label="Min Bedrooms"
                      type="number"
                      name="minBed"
                      value={values.minBed}
                      onChange={handleValueChange('minBed')}
                      autoComplete="minBed"
                    />
                </Grid>
                <Grid item xs={3} alignItems="center" justifyContent="center">
                  <TextField
                    fullWidth
                    id="maxBed"
                    type="number"
                    label="Max Bedrooms"
                    name="maxBed"
                    value={values.maxBed}
                    onChange={handleValueChange('maxBed')}
                    autoComplete="maxBed"
                  />
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4} alignItems="center" justifyContent="center">
                  <TextField
                      fullWidth
                      id="dateFrom"
                      label="Date From"
                      type="date"
                      name="dateFrom"
                      value={values.dateFrom}
                      onChange={handleValueChange('dateFrom')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                </Grid>
                <Grid item xs={4} alignItems="center" justifyContent="center">
                  <TextField
                    fullWidth
                    id="dateTo"
                    type="date"
                    label="Date To"
                    name="dateTo"
                    value={values.dateTo}
                    onChange={handleValueChange('dateTo')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    select
                    value={values.rating}
                    label='Ratings'
                    onChange={handleValueChange('rating')}
                    helperText="Please select search order"
                  >
                    {ratings.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>

      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4} key={values.render}>
          { searchResults.map((res, idx) => {
            console.log('looking at listen at index,', idx)
            return (
            <>
              <SearchCard id={res.id} key={idx} />
              <div id={values.render}></div>
            </>
            )
          }) }
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Search;
