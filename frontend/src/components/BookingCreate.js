import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useHistory, } from 'react-router-dom';
import AlertDialog from '../components/error-popup';
import PropTypes from 'prop-types';
const theme = createTheme();
const url = 'http://localhost:5005';

const BookingCreate = ({ id }) => {
  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isBooked, setBooked] = React.useState(false);
  const [bookingMsg, setBookingMsg] = React.useState('');
  const [values, setValues] = React.useState({
    // dateFrom: new Date().toLocaleDateString('en-CA'),
    dateFrom: undefined,
    dateTo: undefined,
  });

  const handleValueChange = (prop) => (event) => {
    console.log('isnide handle values change')
    setValues({ ...values, [prop]: event.target.value });
  };

  console.log('values inside form are', values);

  async function performCreateBooking () {
    // get availabilities
    if (values.dateFrom > values.dateTo) {
      setErrorMsg('Ending date should be after starting date of booking');
      setError(true);
      return;
    }
    console.log('can continue to try and make the booking')
    // build things required for the actual fetch here
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', },
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/listings/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error)
      }
      // once data is fetched successfully, we can log the user in
      if (data.listing) {
        console.log('the data is', data)
        console.log('the listing is', data.listing);
        console.log('availabilities are', data.listing.availability);
        const availabilities = data.listing.availability;
        const validAvail = availabilities.filter((a) => {
          console.log('curr time period is', a);
          const st = a.start.substring(0, 10)
          const en = a.end.substring(0, 10)
          return (st <= values.dateFrom && values.dateTo <= en);
        })
        if (validAvail.length > 0) {
          // make a booking here
          // calculate price for booking here
          const x = values.dateFrom.split('-');
          const y = values.dateTo.split('-');
          const date1 = new Date(x[0], (x[1] - 1), x[2]);
          const date2 = new Date(y[0], (y[1] - 1), y[2]);
          const bookingLength = Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
          console.log('bookinglength is', bookingLength)
          const price = parseInt(bookingLength) * parseInt(data.listing.price);
          console.log('price is', price)
          const body = {
            dateRange: {
              start: values.dateFrom,
              end: values.dateTo,
            },
            totalPrice: price,
          }
          const bookingOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body),
          }
          try {
            const r = await fetch(`${url}/bookings/new/${id}`, bookingOptions);
            const data = await r.json();
            if (!r.ok) {
              throw new Error(data.error)
            }
            // booking was made here
            console.log('you have successfully made your booking!')
            setBookingMsg('Your booking has been confirmed')
            setBooked(true);
          } catch (e) {
            setError(true);
            setErrorMsg(e.toString());
            console.log('error while making booking', e);
          }
        } else {
          setError(true);
          setErrorMsg('Booking is not listed for between that time period');
        }
      }
    } catch (e) {
      setError(true);
      setErrorMsg(e.toString());
      console.log(e);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='sm'>
        <Box
          component='main'
          noValidate
          sx={{ mt: 3 }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
              id="date"
              label="Starting Date"
              type="date"
              value={values.dateFrom}
              onChange={handleValueChange('dateFrom')}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Grid>
            <Grid item xs={6}>
              <TextField
              id="date"
              label="Ending Date"
              type="date"
              value={values.dateTo}
              onChange={handleValueChange('dateTo')}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='button'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                onClick={() => performCreateBooking()}
              >
                Create Booking
              </Button>
            </Grid>
          </Grid>

        { <AlertDialog
          trigger={isError}
          setTrigger={setError}
          errMsg={errorMsg}
          errTitle={'Booking Error'}/>
        }
        { <AlertDialog
          trigger={isBooked}
          setTrigger={setBooked}
          errMsg={bookingMsg}
          errTitle={'Booking Confirmation'}/>
        }
        </Box>
      </Container>
    </ThemeProvider>
  );
}

BookingCreate.propTypes = {
  id: PropTypes.string,
};

export default BookingCreate;
