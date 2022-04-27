import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertDialog from '../components/error-popup';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InfoCard from '../pages/details';
import Grid from '@mui/material/Grid';
import DisplayReview from '../components/displayReviews';
import LeaveReview from '../components/leaveReview';
import BookingCreate from '../components/BookingCreate';

const theme = createTheme();
const url = 'http://localhost:5005';

const ViewPage = () => {
  const { id } = useParams();

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  // data
  const [title, setTitle] = React.useState('');
  const [media, setMedia] = React.useState('');
  const [bookingId, setBookingId] = React.useState(0);
  const [isBooking, setBooking] = React.useState(false);
  const [reviewAdd, setReviewAdd] = React.useState(0);
  const [reviewList, setReviewList] = React.useState([]);
  const [isOwner, setIsOwner] = React.useState(false);
  const [isLive, setIsLive] = React.useState(false);

  React.useEffect(async () => {
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
      setErrorMsg(data.error);
      throw new Error(data.error);
    }
    if (data.bookings) {
      const userEmail = localStorage.getItem('email');
      const toSort = [];
      // gets the booking that only the user made
      data.bookings.map((booking) => {
        if (booking.owner === userEmail && booking.listingId === id) {
          setBookingId(booking.id);
          setBooking(true);
          return booking.id;
        }
        return toSort;
      });
    }
    const listingop = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const r = await fetch(`${url}/listings/${id}`, listingop);
      const data = await r.json();
      if (!r.ok) {
        setErrorMsg(data.error);
        throw new Error(data.error);
      }
      if (data.listing) {
        const userEmail = localStorage.getItem('email');
        if (data.listing.owner === userEmail) {
          setIsOwner(true)
        }
        setIsLive(data.listing.published)
      }
    } catch (e) {
      setError(true)
      setErrorMsg(e.toString());
    }
  }, []);

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
              {title}
            </Typography>
          <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              image={media}
            />
          </Card>
        </Box>

        { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Listing Edit Error'}/> }

        <Grid container spacing={5} sx={{ mt: 3 }}>
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              '& .markdown': {
                py: 3,
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Divider />
            <Grid className="markdown">
              <InfoCard id={id} setTitle={setTitle} setMedia={setMedia} setAvailabilities={undefined} setReviewList={setReviewList} reviewAdd={reviewAdd} />
            </Grid>
            </Grid>
          {
            !isOwner && isLive && !isBooking &&
            (<Grid
              item
              xs={12}
              md={8}
              sx={{
                '& .markdown': {
                  py: 3,
                },
              }}
            >
            <Typography variant="h6" gutterBottom>
              Create Booking
            </Typography>
            <Divider />
            <BookingCreate id={id} />
          </Grid>)
          }
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              '& .markdown': {
                py: 3,
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            <Divider />
            {
              (isBooking)
                ? <LeaveReview listingId={id} bookingId={bookingId} setReviewAdd={setReviewAdd} reviewAdd={reviewAdd} />
                : ''
            }
            {
              (reviewList.length === 0)
                ? <Typography variant="p" gutterBottom sx={{ pt: 1 }}>
                    No reviews :(
                  </Typography>
                : reviewList.map((review, idx) => {
                  return <DisplayReview key={idx} userEmail={review.userEmail} rating={review.rating} comment={review.comment}/>
                })
            }
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default ViewPage;
