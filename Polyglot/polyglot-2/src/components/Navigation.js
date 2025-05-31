import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lime, purple, common } from '@mui/material/colors';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';


const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#FFFFFF',
  
    },
  },
});



const pages = ['Home', 'VocabLists', 'Test',];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigateTo = (page) => {
    if (page === "Home") {
      navigate("/")
    } else if (page === "Logout") {
      logout()
    } else {
      navigate(`/${page}`)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color={user ? "primary" : "secondary"}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ width: '100%' }}>
            {user ? (
              <>
                {/* === Small Screens: Menu Icon === */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                  <IconButton
                    size="large"
                    aria-label="menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                  >
                    {pages.map((page) => (
                      <MenuItem key={page} onClick={() => {
                        handleCloseNavMenu();
                        navigateTo(page);
                      }}>
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* === Small Screens: Centered Title === */}
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="#"
                  sx={{
                    flexGrow: 1,
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  Polyglot
                </Typography>

                {/* === Large Screens: Left Nav Buttons === */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'flex-start' }}>
                  {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={() => {
                        handleCloseNavMenu();
                        navigateTo(page);
                      }}
                      sx={{ my: 2, color: 'inherit', display: 'block' }}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>

                {/* === Large Screens: Center Title === */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center' }}>
                  <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    Polyglot
                  </Typography>
                </Box>

                {/* === Large Screens: Right Avatar === */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="User" src="" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* === User Menu === */}
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => {
                      handleCloseUserMenu();
                      navigateTo(setting);
                    }}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              // === Guest View: Centered "Polyglot" ===
              <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href="#"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                  onClick={() => navigate("/")}
                >
                  Polyglot
                </Typography>
              </Box>
            )}
        </Toolbar>
      </Container>
    </AppBar>
  </ThemeProvider>
);
}
export default Navigation;
