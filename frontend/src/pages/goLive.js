import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AlertDialog from '../components/error-popup';
import { useHistory, useParams } from 'react-router-dom';
// import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';

const theme = createTheme();
const url = 'http://localhost:5005';

const PublishListing = () => {
  const { id } = useParams();
  const [isError, setError] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [availabilities, setAvailabilities] = React.useState([{
    start: '',
    end: ''
  }]);

  const history = useHistory();

  const handleChange = (index, prop, e) => {
    const newAvail = [...availabilities];
    newAvail[index][prop] = e.target.value;
    setAvailabilities(newAvail);
  };

  const addSlots = () => {
    const newAvail = [...availabilities];
    newAvail.push({
      start: undefined,
      end: undefined
    });
    setAvailabilities(newAvail);
  }

  const removeSlot = (idx) => {
    if (availabilities.length === 1) {
      setErrMsg('Enter atleast one availabile time slot');
      setError(true);
    } else {
      const newAvail = [...availabilities];
      newAvail.splice(idx, 1);
      setAvailabilities(newAvail);
      console.log('slot removed!');
    }
  }

  const performBack = () => {
    history.push('/hosted/listings');
  }

  async function performLive () {
    let valid = true;

    availabilities.map((a) => {
      if (a.start === null || a.end === null) {
        setErrMsg('Please fill all slots or remove unwanted slots');
        setError(true);
        valid = false;
      }
      return a;
    });

    // if not all details are filled; break function
    if (!valid) {
      return;
    }

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ availability: availabilities })
    };

    // try fetching the data
    try {
      const r = await fetch(`${url}/listings/publish/${id}`, options);
      const data = await r.json();
      if (!r.ok) {
        setErrMsg(data.error);
        setError(true);
        throw new Error(data.error);
      }
      console.log(`${id} is going live!`, availabilities);
      console.log(availabilities[0].start);
      history.push('/hosted/listings');
    } catch (e) {
      setError(true);
      setErrMsg(e.toString());
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
            Availabilities
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
              { availabilities.map((dateTuple, idx) => {
                return <Grid container spacing={2} key={idx}>
                  <Grid item xs={12} sm={5.5}>
                  <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={availabilities[idx].start}
                    onChange={(e) => handleChange(idx, 'start', e)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  </Grid>
                  <Grid item xs={12} sm={5.5}>
                    <TextField
                      id="date"
                      label="End Date"
                      type="date"
                      value={availabilities[idx].end}
                      onChange={(e) => handleChange(idx, 'end', e)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Button
                      onClick={ () => removeSlot(idx) }
                    >
                      <DeleteOutlineIcon/>
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                  </Grid>
                </Grid>
              }) }
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={ addSlots }
            >
              Add More
            </Button>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                fullWidth
                onClick={performBack}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={ performLive }
                >
                Go Live
              </Button>
              </Grid>
            </Grid>
          </Box>
          { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errMsg} errTitle={''}/> }
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default PublishListing;
