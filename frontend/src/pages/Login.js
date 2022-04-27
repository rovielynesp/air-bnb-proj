import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory, } from 'react-router-dom';
import AlertDialog from '../components/error-popup';
import PropTypes from 'prop-types';

const theme = createTheme();
const url = 'http://localhost:5005';

const Login = ({ setLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isEmailValid, setEmailValid] = React.useState(true);
  const [isPasswordValid, setPasswordValid] = React.useState(true);

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const history = useHistory();

  async function performLogin () {
    if (!email || !password) {
      setEmailValid(!!email);
      setPasswordValid(!!password);
      setError(true);
      setErrorMsg('Please enter your details');
      return;
    }
    // build things required for the actual fetch here
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ email, password }),
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/user/auth/login`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error)
      }
      // once data is fetched successfully, we can log the user in
      if (data.token) {
        console.log('the token is', data.token);
        setLogin(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        history.push('/listings');
      } else {
        setEmailValid(false);
        setPasswordValid(false);
      }
    } catch (e) {
      setLogin(false);
      setEmailValid(false);
      setPasswordValid(false);
      setError(true);
      setErrorMsg(e.toString());
      console.log(e);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='emailInput'
              aria-label='account email field'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              error={!isEmailValid}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              aria-label='account password field'
              type='password'
              id='passwordInput'
              autoComplete='current-password'
              error={!isPasswordValid}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type='button'
              fullWidth
              id='signInButton'
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={() => performLogin()}
            >
              Sign In
            </Button>
          { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Login Failed'}/> }
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

Login.propTypes = {
  setLogin: PropTypes.func,
};

export default Login;
