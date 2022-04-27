import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { useHistory, } from 'react-router-dom';
import ConfirmDialog from './confirm-popup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoCard from '../pages/details';

const url = 'http://localhost:5005';

export default function MediaCard ({ id, idx }) {
  const [title, setTitle] = useState('');
  const [media, setMedia] = useState('');
  const [availabilities, setAvailabilities] = useState([]);

  // trigger states
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleteTrigger, setDeleteTrigger] = useState(false);

  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [isUnpublishTrigger, setUnpublishTrigger] = useState(false);

  const history = useHistory();

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
  };

  useEffect(async () => {
    console.log('fetching data');
    options.method = 'GET';
    // try fetching the data
    console.log('get:', options);
    const r = await fetch(`${url}/listings/${id}`, options);
    const data = await r.json();
    if (!r.ok) {
      console.log(r);
      throw new Error(data.error)
    } else {
      console.log(data.listing);
    }
  }, []);

  useEffect(async () => {
    if (confirmDelete) {
      options.method = 'DELETE';
      const r = await fetch(`${url}/listings/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error) // replace with error-popup once merged
      } else {
        console.log('deleted!'); // replace with popup
      }
    }
  }, [confirmDelete]);

  useEffect(async () => {
    if (confirmUnpublish) {
      console.log('unpublishing', id);
      options.method = 'PUT';
      const r = await fetch(`${url}/listings/unpublish/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error) // replace with error-popup once merged
      } else {
        setAvailabilities([]);
        console.log('unpublished!'); // replace with popup
      }
    }
  }, [confirmUnpublish]);

  const redirectLive = () => {
    history.push(`/publish/${id}`);
  }

  return (!confirmDelete)
    ? (
      <Grid item xs={12} sm={6} md={4}>
        <Card
          key={idx}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
          <CardMedia
            component="img"
            height="140"
            image={media}
            alt="listing thumbnail"
            aria-label='image of current listing'
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <InfoCard id={id} setTitle={setTitle} setMedia={setMedia} setAvailabilities={setAvailabilities} setReviewList={undefined}/>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={ () => history.push(`/hosted/listings/edit/${id}`) }><EditIcon /></Button>
            <Button size="small" onClick={ () => setDeleteTrigger(true) } id="deleteButton"> <DeleteIcon /> </Button>
            { (availabilities.length === 0)
              ? <Button size="small" onClick={ redirectLive } id="publishButton"> Go Live </Button>
              : <Button size="small" onClick={ () => setUnpublishTrigger(true) }> Unpublish </Button>
            }
          </CardActions>
          <CardActions>
            {(availabilities.length > 0) && <Button size="small" onClick={ () => history.push(`/bookings/view/${id}`) } id="publishButton"> Booking Details </Button>}
          </CardActions>
        </Card>
        { <ConfirmDialog
          trigger={isDeleteTrigger}
          setTrigger={setDeleteTrigger}
          setConfirm={setConfirmDelete}
          errMsg={ 'Are you sure you want to delete this listing?' }
          errTitle={''}
          buttonConfirm={'Delete'}/> }
        { <ConfirmDialog
          trigger={isUnpublishTrigger}
          setTrigger={setUnpublishTrigger}
          setConfirm={setConfirmUnpublish}
          errMsg={ 'Are you sure you want to unpublish this listing?' }
          errTitle={''}
          buttonConfirm={'Unpublish'}/> }
      </Grid>
      )
    : '';
}

MediaCard.propTypes = {
  id: PropTypes.number,
  idx: PropTypes.number
}
