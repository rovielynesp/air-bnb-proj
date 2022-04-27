import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { validate } from 'email-validator';
import AlertDialog from '../components/error-popup';
import { useHistory, } from 'react-router-dom';
import PropTypes from 'prop-types';

const theme = createTheme();
const url = 'http://localhost:5005';

const SignUp = ({ setLogin }) => {
  const [firstName, setFirstName] = React.useState('');
  const [firstNameValid, setfirstNameValid] = React.useState(true);
  const [lastName, setLastName] = React.useState('');
  const [lastNameValid, setLastNameValid] = React.useState(true);
  const [password1, setPassword1] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [passwordValid, setPasswordValid] = React.useState(true);
  const [passwordSame, setPasswordSame] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(true);

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const history = useHistory();

  // checks if the passwords match once user starts typing
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (password1 !== password2) {
        setPasswordSame(false);
      } else {
        setPasswordSame(true);
      }
      console.log(passwordSame);
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [password2])

  async function performRegister () {
    // checks if required input has been filled
    const name = firstName + ' ' + lastName; // TEST
    if (name === '' || email === '' || password1 === '') {
      setError(true);
      setErrorMsg('Please enter your details');
      return;
    }

    // checks if password is the same
    if (password1 !== password2) {
      setError(true);
      setErrorMsg('Password does not match');
      return;
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        email: email,
        password: password1,
        name: name
      }),
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/user/auth/register`, options);
      const data = await r.json();
      if (!r.ok) {
        setError(true);
        setErrorMsg(data.error);
        throw new Error(data.error)
      }
      if (data.token) {
        console.log('the token is', data.token);
        localStorage.setItem('email', email);
        localStorage.setItem('token', data.token);
        setLogin(true);
        history.push('/');
      }
    } catch (e) {
      setEmailValid(false);
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
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              <TextField
                required
                label="First Name"
                id="firstNameInput"
                onBlur={ (e) => {
                  if (firstName.length < 2) {
                    setfirstNameValid(false);
                  } else {
                    setfirstNameValid(true);
                  }
                } }
                value={firstName}
                onChange={ (e) => setFirstName(e.target.value) }
                error={!firstNameValid}
                helperText={!firstNameValid ? 'Invalid First Name' : ' '}
              />
              </Grid>
              <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Last Name"
                id="lastNameInput"
                onBlur={ (e) => {
                  if (lastName.length < 2) {
                    setLastNameValid(false);
                  } else {
                    setLastNameValid(true);
                  }
                } }
                onChange={ (e) => setLastName(e.target.value) }
                value={lastName}
                error={!lastNameValid}
                helperText={!lastNameValid ? 'Invalid Last Name' : ' '}
              />
              </Grid>
              <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                id="emailInput"
                onBlur={ (e) => {
                  if (!validate(email)) {
                    setEmailValid(false);
                  } else {
                    setEmailValid(true);
                  }
                } }
                onChange={ (e) => setEmail(e.target.value) }
                value={email}
                error={!emailValid}
                helperText={!emailValid ? 'Invalid Email' : ' '}
              />
              </Grid>
              <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="password"
                label="Password"
                id="passwordInput"
                onBlur={ () => {
                  if (password1.length < 5) {
                    setPasswordValid(false);
                  } else {
                    setPasswordValid(true);
                  }
                } }
                value={password1}
                onChange={ (e) => setPassword1(e.target.value) }
                error={!passwordValid}
                helperText={!passwordValid ? 'Must be more than 5 characters' : ' '}
              />
              </Grid>
              <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="passwordInput2"
                type="password"
                label="Confirm Password"
                onChange={ (e) => { setPassword2(e.target.value) } }
                value={password2}
                error={!passwordSame}
                helperText={!passwordSame ? 'Password does not match' : ' '}
              />
              </Grid>
            </Grid>
            <Button
              id="registerButton"
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={ performRegister }
            >
              Sign Up
            </Button>
            { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Register Failed'}/> }
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

SignUp.propTypes = {
  setLogin: PropTypes.func,
};

export default SignUp;
