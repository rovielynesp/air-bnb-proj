import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import AlertDialog from '../components/error-popup';
import Select from '@mui/material/Select';

const url = 'http://localhost:5005';
const ratings = [
  {
    value: 1,
    label: '1 (lowest)',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5 (highest)',
  },
];

const LeaveReview = ({ listingId, bookingId, setReviewAdd, reviewAdd }) => {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  async function sendReview () {
    // build things required for the actual fetch here
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        review: {
          userEmail: localStorage.getItem('email'),
          rating: rating,
          comment: comment,
        }
      }),
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/listings/${listingId}/review/${bookingId}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error);
      }
      setReviewAdd(reviewAdd + 1);
      setErrorMsg('Review Posted!');
      setError(true);
      setRating(0);
      setComment('');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Box>
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', my: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Leave a Review!
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Typography variant="h6" color="text.secondary">Rating</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={rating}
                onChange={ (e) => setRating(e.target.value) }
                label="Rating"
              >
                {ratings.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <TextField
            label="Review"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={ (e) => setComment(e.target.value) }
          />
        </CardContent>
        <CardActions>
          <Button size="small"
          onClick={ () => sendReview() }
          >
            Post
          </Button>
        </CardActions>
        { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={''}/> }
      </Card>

    </Box>
  )
}

export default LeaveReview;

LeaveReview.propTypes = {
  listingId: PropTypes.string,
  bookingId: PropTypes.number,
  setReviewAdd: PropTypes.func,
  reviewAdd: PropTypes.number,
}
