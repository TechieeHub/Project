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
import InfoIcon from '@mui/icons-material/Info';
import Drawer from '@mui/material/Drawer';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAnomalyValue } from "../../Store/excelSlice";
import { Slider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

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
  ); // Initialize slider value first
  const location = useLocation();

  const dispatch = useDispatch();
  const anomalyValue = useSelector((state) => state.excel.anomalyValue);
  const excelData = useSelector((state) => state.excel.data);

  // Update local storage and redux store when slider value changes
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

  // Determine the current tab based on the path
  const currentTab = pages.findIndex((page) => page.path === location.pathname);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#484848', paddingLeft: 0, paddingRight: 0, fontFamily: 'Roboto' }}>
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
                      backgroundColor: 'white',
                      fontFamily: 'Roboto'
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
                        color: location.pathname === page.path ? 'white' : 'white',
                        fontFamily: 'Roboto'
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

            {/* Info Icon Button */}
            <IconButton color="inherit" onClick={handleDrawerOpen} sx={{ marginLeft: "1rem" }}>
              <InfoIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Side Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>

          {/* Close Button */}
          <IconButton onClick={handleDrawerClose} sx={{ alignSelf: "flex-end" }}>
           <CloseIcon/>
          </IconButton>
      <Box sx={{ marginRight: "15px", fontSize: "15px", color: "grey", fontFamily: 'Roboto', padding:"1rem" }}>
          Last refresh: {new Date().toLocaleString()}
        </Box>
        <Box
          sx={{
            width: "350px", // Adjust the width of the drawer
            height: "auto", // Reduce the height to fit the content
            padding: "20px", // Add padding for better spacing inside the drawer
            display: "flex",
            flexDirection: "column", // Stack the contents vertically
            alignItems: "flex-start", // Align items to the start of the drawer
            gap: "20px", // Add gap between the elements
          }}
        >
        

          <Typography sx={{ fontWeight: "550", fontFamily: 'Roboto' }}>
            Threshold:  {sliderValue}%
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
              marginLeft:"1rem"
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
