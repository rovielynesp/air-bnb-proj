import * as React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const ResolvedBookingCard = ({ start, end, status }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
      <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="startDate"
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
              id="endDate"
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
              <b>Status: </b>{status}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

ResolvedBookingCard.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
  status: PropTypes.string,
};

export default ResolvedBookingCard;
