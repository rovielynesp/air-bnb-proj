import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const url = 'http://localhost:5005';

const PendingBookingCard = ({ start, end, price, id, statusChange, setStatusChange }) => {
  async function handleBookingOutcome (outcome) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    };
    try {
      const r = await fetch(`${url}/bookings/${outcome}/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error);
      }
      setStatusChange(statusChange + 1);
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="pendingStartDate"
              aria-label='booking pending start date'
              label="Start Date"
              type="date"
              InputProps={{ readOnly: true }}
              name="startDate"
              value={start}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="pendingEndDate"
              aria-label='booking pending end date'
              label="Start Date"
              type="date"
              InputProps={{ readOnly: true }}
              name="endDate"
              value={end}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <div>
              <b>Total Price: $</b>{price}
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          id='acceptBookingButton'
          aria-label='accept booking'
          onClick={() => handleBookingOutcome('accept')}
          variant="contained"
        >
            Accept
        </Button>
        <Button
          size="small"
          id='declineBookingButton'
          aria-label='decline booking'
          onClick={() => handleBookingOutcome('decline')}
          variant="contained"
        >
            Decline
        </Button>
    </CardActions>
    </Card>
  );
}

PendingBookingCard.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  price: PropTypes.number,
  id: PropTypes.string,
  statusChange: PropTypes.number,
  setStatusChange: PropTypes.func,
};

export default PendingBookingCard;
