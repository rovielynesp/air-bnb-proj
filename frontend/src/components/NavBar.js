import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useHistory, } from 'react-router-dom';
import Button from '@mui/material/Button';
import AlertDialog from '../components/error-popup';

const url = 'http://localhost:5005';

// NEED TO FIX THIS LINE LATER ON JUST CURRENTLY CRYNG OVER HOW BAD THIS ALL IS
// eslint-disable-next-line react/prop-types
export default function NavBar ({ loggedIn, setLogin }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  console.log('start', anchorEl);
  React.useEffect(() => {
    console.log('in use effect', anchorEl);

    setAnchorEl(null);
  }, []);

  const [isError, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const history = useHistory();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    console.log('inside handle menu', anchorEl);
  };

  const handleClose = () => {
    setAnchorEl(null);
    console.log('insdie handle close', anchorEl);
  };

  async function handleLogout () {
    console.log('trying to logout');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    // try fetching the data
    try {
      const r = await fetch(`${url}/user/auth/logout`, options);
      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error)
      }
      // once data is fetched successfully, we can log the user out
      console.log('user is now logged out!');
      setLogin(false);
      handleClose();
      localStorage.clear(); // remove token and other stored information based on user for logout
      history.push('/');
    } catch (e) {
      setError(true);
      setErrorMsg(e.toString());
      console.log('logout failed');
      console.log(e);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => history.push('/')}>
            AirBrb
          </Typography>
          {
            !loggedIn && (
            <>
            <Button
              type='button'
              color='secondary'
              id='loginButton'
              aria-label='goto login page'
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={() => history.push('/login')}
            >
              Login
            </Button>
            <Button
              type='button'
              color='secondary'
              id='registerButton'
              variant='contained'
              aria-label='goto register page'
              sx={{ mt: 3, mb: 2 }}
              onClick={() => history.push('/register')}
            >
              Register
            </Button>
            </>
            )
          }
          {loggedIn && (
            <div>
              <IconButton
                size="large"
                id='accountBubbleMenu'
                aria-label="account options of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="accountMenu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  id='logoutButton'
                  aria-label='logout of your account'
                  onClick={handleLogout}>Logout</MenuItem>
                {/* close the menu when trying to make a new listing for now */}
                <MenuItem
                  id='createListingButton'
                  aria-label='create a new listing'
                  onClick={() => {
                    history.push('/hosted/listings/create');
                    handleClose();
                  }}>Create a Listing</MenuItem>
                {/* view own listings */}
                <MenuItem
                  id='myListingsButton'
                  aria-label='view your created listings'
                  onClick={() => {
                    history.push('/hosted/listings');
                    handleClose();
                  }}>My Listings</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      { <AlertDialog trigger={isError} setTrigger={setError} errMsg={errorMsg} errTitle={'Logout Failed'}/> }
    </Box>
  );
}
