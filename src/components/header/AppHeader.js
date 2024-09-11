import * as React from 'react';
import { useState, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAnomalyValue } from "../../Store/excelSlice";
import { Slider } from "@mui/material";

const pages = [
  { name: 'Dashboard', path: '/' },
  { name: 'Accounts', path: '/accounts' },
  { name: 'Admin', path: '/admin' }
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const AppHeader = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(
    localStorage.getItem("anomalyDataValue")
      ? parseInt(localStorage.getItem("anomalyDataValue"), 10)
      : 10
  );
  const location = useLocation();

  const dispatch = useDispatch();
  const anomalyValue = useSelector((state) => state.excel.anomalyValue);

  useEffect(() => {
    dispatch(setAnomalyValue(sliderValue));
    localStorage.setItem("anomalyValue", JSON.stringify(sliderValue));
  }, [dispatch, sliderValue]);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    localStorage.setItem("anomalyDataValue", newValue);
  };

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
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Filter out 'Admin' tab if pathname is not '/admin'
  const filteredPages = location.pathname === '/admin'
    ? pages
    : pages.filter(page => page.path !== '/admin');

  // Determine the current tab based on the filtered pages
  const currentTab = filteredPages.findIndex((page) => page.path === location.pathname);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#484848', paddingLeft: 0, paddingRight: 0, fontFamily: 'Roboto' }}>
        <Container maxWidth>
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                aria-label="navigation tabs"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'white',
                    fontFamily: 'Roboto'
                  },
                }}
              >
                {filteredPages.map((page, index) => (
                  <Tab
                    key={page.name}
                    component={Link}
                    to={page.path}
                    label={page.name}
                    sx={{
                      color: location.pathname === page.path ? 'white' : 'white',
                      fontFamily: 'Roboto'
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Typography sx={{ cursor: 'pointer' }}>Welcome</Typography>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Ishan Gupta">IG</Avatar>
                  </IconButton>
                </Tooltip>
              </Box>

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

            {/* Info Icon Button */}
            <IconButton color="inherit" onClick={handleDrawerOpen} sx={{ marginLeft: "1rem" }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Conditional Side Drawer */}
     
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
          <IconButton onClick={handleDrawerClose} sx={{ alignSelf: "flex-end" }}>
            <CloseIcon sx={{margin: "1rem"}} />
          </IconButton>
          <Box sx={{ marginRight: "15px", fontSize: "15px", color: "grey", fontFamily: 'Roboto', padding: "1rem" }}>
            Last refresh: {new Date().toLocaleString()}
          </Box>
          <Box
            sx={{
              width: "350px",
              height: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <Typography sx={{ fontWeight: "550", fontFamily: 'Roboto' }}>
              Threshold: {sliderValue}%
            </Typography>
            <Slider
              value={sliderValue}
              onChange={handleSliderChange}
              min={0}
              max={100}
              aria-labelledby="continuous-slider"
              sx={{
                color: "grey",
                width: "90%",
                marginLeft: "1rem"
              }}
              marks={[
                { value: 0, label: "0" },
                { value: 100, label: "100" },
              ]}
            />
          </Box>
        </Drawer>
      
    </>
  );
};

export default AppHeader;
