import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const pages = [
  { name: 'Accounts', path: '/' },
  { name: 'Summary and Visualization', path: '/charts' },
  { name: 'Admin', path: '/admin' }
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const AppHeader = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const location = useLocation(); // Get the current path

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

  const excelData = useSelector((state) => state.excel.data);

  // Determine the current tab based on the path
  const currentTab = pages.findIndex((page) => page.path === location.pathname);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#484848' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {excelData?.length > 0 && (
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                aria-label="navigation tabs"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'yellow', 
                  },
                }}
              >
                {pages.map((page, index) => (
                  <Tab
                    key={page.name}
                    component={Link}
                    to={page.path}
                    label={page.name}
                    sx={{
                      color: location.pathname === page.path ? 'yellow' : 'white',
                    }}
                  />
                ))}
              </Tabs>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Ishan" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default AppHeader;
