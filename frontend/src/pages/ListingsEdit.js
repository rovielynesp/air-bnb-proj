import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import MenuItem from '@mui/material/MenuItem';
import { fileToDataUrl } from '../utils/helpers';
import AlertDialog from '../components/error-popup';
import { useParams, useHistory } from 'react-router-dom';

const url = 'http://localhost:5005';

const theme = createTheme();

const propertyTypes = [
  {
    value: 'Apartment',
    label: 'Apartment',
  },
  {
    value: 'House',
    label: 'House',
  },
  {
    value: 'Hotel',
    label: 'Hotel',
  },
  {
    value: 'Share House',
    label: 'Share House',
  },
];

const ListingsEdit = () => {
  const history = useHistory();
  const { id } = useParams();

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [hasAutoSubmitted, setHasAutoSubmitted] = React.useState(false);
  const [canSubmit, setCanSubmit] = React.useState(false);
  const [bedrooms, setBedrooms] = React.useState([]);
  const [address, setAddress] = React.useState({ addr: '', city: '' });
  const [metadata, setMetadata] = React.useState({
    type: '',
    rooms: [],
    bathrooms: 0,
    amenities: '',
  });
  const [values, setValues] = React.useState({
    title: '',
    address: {},
    price: 0,
    thumbnail: '',
    metadata: {},
  });

  React.useEffect(async () => {
    // build things required for the actual fetch here
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/listings/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error)
      }
      // once data is fetched successfully, we've can populate all value fields
      console.log('the data from the initial call is', data);
      console.log('data.listing is', data.listing);

      setValues({ ...values, title: data.listing.title });
      setValues({ ...values, price: data.listing.price });
      setValues({ ...values, thumbnail: data.listing.thumbnail });

      console.log('the address from the fetch call is', data.listing.address);
      setAddress(data.listing.address);
      setMetadata(data.listing.metadata);
      setBedrooms(metadata.rooms);
    } catch (e) {
      setError(true);
      setErrorMsg(e.toString());
      console.log(e);
    }
  }, []);

  React.useEffect(() => {
    const newVals = { ...values };
    newVals.metadata = metadata;
    setValues(newVals);
    console.log('updating values because metadata was changed');
    console.log('the values are now', values);
  }, [metadata]);

  React.useEffect(() => {
    const newMetadata = { ...metadata };
    newMetadata.rooms = bedrooms;
    setMetadata(newMetadata);
    console.log('updating values because bedrooms was changed');
  }, [bedrooms]);

  React.useEffect(() => {
    const newVals = { ...values };
    newVals.address = address;
    setValues(newVals);
    console.log('updating values because address was changed');
  }, [address]);

  React.useEffect(() => {
    if (!values.title || !values.price || !address.addr || !address.city || !values.thumbnail) {
      setCanSubmit(false);
    } else {
      setCanSubmit(true);
    }
  }, [values]);

  React.useEffect(() => {
    if (canSubmit) {
      console.log('about to autosave changes')
      performListingsEdit();
      setHasAutoSubmitted(true);
    } else {
      setHasAutoSubmitted(false);
    }
  }, [canSubmit, values]);

  const handleRoomDetailsChange = (e, idx) => {
    const { name, value } = e.target;
    const updatedBedrooms = [...bedrooms];
    updatedBedrooms[idx][name] = value;
    setBedrooms(updatedBedrooms);
  }

  const handleAddBedroom = () => {
    console.log('trying to add another bedroom field');
    setBedrooms([...bedrooms, { queen: 0, king: 0, single: 0 }]);
  };

  const handleRemoveBedroom = (idx) => {
    console.log('trying to remove a bedroom field at index', idx);
    const updatedBedrooms = [...bedrooms];
    updatedBedrooms.splice(idx, 1);
    setBedrooms(updatedBedrooms);
  };

  const handleAddressChange = (prop) => (event) => {
    setAddress({ ...address, [prop]: event.target.value });
    setValues({ ...values, address: address });
  }

  const handleChange = (prop) => (event) => {
    if (prop === 'thumbnail') {
      console.log('the file is ', event.target.files[0]);
      const thumbnailPromise = fileToDataUrl(event.target.files[0]);
      thumbnailPromise.then((img) => {
        setValues({ ...values, [prop]: img });
      }).catch(() => {
        setError(true);
        setErrorMsg('Image is invalid');
      })
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
    console.log('values inside form are', values);
  };

  const handleMetadataChange = (prop) => (event) => {
    setMetadata({ ...metadata, [prop]: event.target.value });
    setValues({ ...values, metadata: metadata });
  };

  async function performListingsEdit () {
    if (!values.title || !values.price || !address.addr || !address.city || !values.thumbnail) {
      setError(true);
      setErrorMsg('Please all required details');
      return;
    }
    // build things required for the actual fetch here
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(values),
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/listings/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error)
      }
      // once data is fetched successfully, we've updated the listing! :)
      console.log('you\'ve updated the listing successfully! :)');
    } catch (e) {
      setError(true);
      setErrorMsg(e.toString());
      console.log(e);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Edit Existing Listing
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="property title"
                  name="title"
                  required
                  fullWidth
                  value={values.title}
                  onChange={handleChange('title')}
                  id="title"
                  label="Title"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                label="Price per Night"
                id="price"
                required
                fullWidth
                type="number"
                value={values.price}
                onChange={handleChange('price')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                autoFocus
              />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={address.addr}
                  onChange={handleAddressChange('addr')}
                  id="address"
                  label="Address"
                  name="addr"
                  autoComplete="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={address.city}
                  onChange={handleAddressChange('city')}
                  id="City"
                  label="City"
                  name="city"
                  autoComplete="City"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  id="bathrooms"
                  label="Number of Bathrooms"
                  name="bathrooms"
                  value={metadata.bathrooms}
                  onChange={handleMetadataChange('bathrooms')}
                  autoComplete="bathrooms"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="Amenities"
                  label="Amenities"
                  name="Amenities"
                  autoComplete="Amenities"
                  value={metadata.amenities}
                  onChange={handleMetadataChange('amenities')}
                  helperText="Add any additional amenities that this property has to offer!"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-select-property" // need help with this n the metadata update stuff
                  select
                  label="Select Property Type"
                  value={metadata.type}
                  onChange={handleMetadataChange('type')}
                  helperText="Please select your property type"
                >
                  {propertyTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  onChange={handleChange('thumbnail')}
                  type="file"
                />
                <label htmlFor="raised-button-file">
                  <Button
                    variant="outlined"
                    component="span">
                    Upload Thumbnail
                  </Button>
                </label>
                {values.thumbnail && (
                  <DoneOutlineIcon style={{ minWidth: '40px' }}/>
                )}
              </Grid>
              {/* dynamically display the number n type for rooms */}
              {bedrooms.map((val, idx) => {
                return (
                  <>
                  <Grid container item xs={12} >
                    <div>Room {idx + 1} Details:</div>
                  </Grid>
                  <Grid container spacing={2} item xs={12} key={idx}>
                    <Grid item xs={3}>
                      <TextField
                        autoComplete="number of queen"
                        name="queen"
                        required
                        fullWidth
                        type="number"
                        value={val.queen}
                        onChange={e => handleRoomDetailsChange(e, idx)}
                        id="queenBed"
                        label="Queen"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        autoComplete="number of king"
                        name="king"
                        value={val.king}
                        required
                        fullWidth
                        type="number"
                        onChange={e => handleRoomDetailsChange(e, idx)}
                        id="KingBed"
                        label="King"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        autoComplete="number of single"
                        name="single"
                        value={val.single}
                        required
                        fullWidth
                        onChange={e => handleRoomDetailsChange(e, idx)}
                        id="SingleBed"
                        type="number"
                        label="Single"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        onClick={() => handleRemoveBedroom(idx)}
                      >
                        Remove Room
                      </Button>
                    </Grid>
                  </Grid>
                  </>
                )
              })}
              <Grid item >
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={handleAddBedroom}
                >
                  Add Room
                </Button>
              </Grid>
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              disabled={!canSubmit}
              onClick={() => {
                performListingsEdit();
                history.push('/hosted/listings');
              }}
              sx={{ mt: 3, mb: 2 }}
            >
              Update Listing
            </Button>
            {hasAutoSubmitted && <div>Changes have been autosaved!</div>}
          </Box>
        </Box>
        { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Listing Edit Error'}/> }
      </Container>
    </ThemeProvider>
  );
}

export default ListingsEdit;
