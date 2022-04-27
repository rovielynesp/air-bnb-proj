import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
// import CardMedia from '@mui/material/CardMedia';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertDialog from '../components/error-popup';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import ResolvedBookingCard from '../components/ResolvedBookingCard';
import PendingBookingCard from '../components/PendingBookingCard';

const theme = createTheme();
const url = 'http://localhost:5005';

const BookingView = () => {
  const { id } = useParams();

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [statusChange, setStatusChange] = React.useState(0);
  const [listing, setListing] = React.useState([]);
  const [pendingBookings, setPendingBookings] = React.useState([]);
  const [resolvedBookings, setResolvedBookings] = React.useState([]);
  const [totalProfit, setTotalProfit] = React.useState(0);
  const [totalDaysBooked, setTotalDaysBooked] = React.useState(0);
  const [postedOnDate, setPostedOnDate] = React.useState('yyyy-mm-dd')
  const [numberDaysListed, setNumberDaysListed] = React.useState(0)
  // const [live, setLive] = React.useState(true);

  React.useEffect(async () => {
    // get the listing first, then get booking
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const r = await fetch(`${url}/listings/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error);
      }
      console.log('the listing data is', data.listing)
      setListing(data.listing);
      setPostedOnDate(data.listing.postedOn.substring(0, 10))
      // calculate number of dates listed
      const dateDiff = Math.ceil((new Date().getTime() -
                        new Date(data.listing.postedOn).getTime()) / (1000 * 3600 * 24));
      setNumberDaysListed(dateDiff);
    } catch (e) {
      console.log(e)
      setErrorMsg(e.toString())
      setError(true)
    }
    const getBookingOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    };
    try {
      const r = await fetch(`${url}/bookings`, getBookingOptions);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error);
      }
      if (data.bookings) {
        // gets the pending bookings that match the listing id
        const pending = data.bookings.filter((booking) => {
          if (booking.listingId === id && booking.status === 'pending') {
            return true;
          }
          return false;
        });
        setPendingBookings(pending);

        // get all the other bookings that have a status
        const resolved = data.bookings.filter((booking) => {
          if (booking.listingId === id && booking.status !== 'pending') {
            return true;
          }
          return false;
        });
        setResolvedBookings(resolved);

        // calculate listing profit
        let profit = 0;
        data.bookings.forEach((booking) => {
          profit += parseInt(booking.totalPrice)
        })
        setTotalProfit(profit)

        // calculate listing days booked
        let numDays = 0;
        data.bookings.forEach((booking) => {
          if (booking.dateRange.start.split('-')[0] === '2021' ||
              booking.dateRange.end.split('-')[0] === '2021') {
            numDays += Math.ceil((new Date(booking.dateRange.end).getTime() -
                        new Date(booking.dateRange.start).getTime()) / (1000 * 3600 * 24));
          }
        })
        setTotalDaysBooked(numDays)
      }
    } catch (e) {
      console.log(e)
      setErrorMsg(e.toString())
      setError(true)
    }
  }, [statusChange]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            {listing.title}
          </Typography>
        </Box>

        { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Listing Edit Error'}/> }

        <Grid container spacing={5} sx={{ mt: 3 }}>
          <Grid item xs={12} md={8} sx={{ '& .markdown': { py: 3, }, }}>
            <Typography variant="h5" gutterBottom>
              Listing Details
            </Typography>
            <Divider />
            <Container maxWidth="md">
              <Grid container item spacing={2} className="markdown">
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="postedOnDate"
                          label="Posted On"
                          type="date"
                          InputProps={{ readOnly: true }}
                          name="postedOnDate"
                          value={postedOnDate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <div>
                          <b>Number of Days Live: </b>{numberDaysListed}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div>
                          <b>Annual Profit: $</b>{totalProfit}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div>
                          <b>Total Days Booked in 2021: </b>{totalDaysBooked}
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Container>
            <Typography variant="h5" gutterBottom>
              Resolved Booking History
            </Typography>
            <Divider />
            <Grid container item spacing={2} className="markdown">
              {resolvedBookings.map((booking, idx) => {
                return (
                  <ResolvedBookingCard key={idx}
                    start={booking.dateRange.start.substring(0, 10)}
                    end={booking.dateRange.end.substring(0, 10)}
                    status={booking.status}
                  ></ResolvedBookingCard>);
              })}
            </Grid>
          </Grid>

          <Grid item xs={12} md={8} sx={{ '& .markdown': { py: 3, }, }}>
            <Typography variant="h5" gutterBottom>
              Pending Bookings
            </Typography>
            <Divider />
            <Grid container item spacing={2} className="markdown">
              {pendingBookings.map((booking, idx) => {
                return (
                  <Grid item key={idx} xs={12}>
                    <PendingBookingCard
                      start={booking.dateRange.start.substring(0, 10)}
                      end={booking.dateRange.end.substring(0, 10)}
                      price={booking.totalPrice}
                      id={booking.id}
                      statusChange={statusChange}
                      setStatusChange={setStatusChange}
                      />
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default BookingView;
