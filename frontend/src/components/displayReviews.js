import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import PropTypes from 'prop-types';

// ICONS
import StarIcon from '@mui/icons-material/Star';

const DisplayReview = ({ userEmail, rating, comment }) => {
  return (
    <Box>
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', my: 2 }}>
        <CardContent>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              { [...Array(rating)].map((e, i) => {
                return <StarIcon key={i}/>
              }) }
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h7" align="left" color="text.secondary">
                Posted by: {userEmail}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="p" align="left">
                {comment}
              </Typography>
            </Grid>
          </Grid>

        </CardContent>
      </Card>

    </Box>
  )
}

export default DisplayReview;

DisplayReview.propTypes = {
  userEmail: PropTypes.string,
  rating: PropTypes.number,
  comment: PropTypes.string
}
