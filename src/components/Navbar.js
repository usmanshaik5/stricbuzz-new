// src/Navbar.js
import React, { } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem, ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  Box, Divider,
  Button as MUIButton,
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../images/menu.png';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
const Navbar = ({

  drawerOpen,
  setDrawerOpen,
  heads,
  tails,
  setHeads,
  setTails,
  coinRef,
}) => {

  const resetGame = () => {
    if (coinRef?.current) coinRef.current.style.animation = 'none';
    setHeads(0);
    setTails(0);
  };

  const navigate = useNavigate();
  const navItems = [
    { label: 'Home', path: '/' },
    // { label: 'Poll', path: '/Poll' },
    { label: 'Commentary', path: '/commentary' },
    { label: 'Scoreboard', path: '/scoreboard' },
    { label: 'PointsTable', path: '/pointstable' },
    { label: 'Squads', path: '/squads' }
  ];
  return (
    <>
      <AppBar position="fixed" style={{ background: 'white', zIndex: 1300, top: -10, left: 0, right: 0, height: "70px" }}>

        <Toolbar>
          <IconButton edge="start" sx={{ color: 'black' }} onClick={() => setDrawerOpen(true)}>
            <img
              src={menuIcon}
              alt="Menu"
              width="24"
              height="24"
              style={{ marginTop: 22 }}
            />
          </IconButton>



          <div
            className="custom-navbar"
            style={{
              display: 'flex',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              padding: '10px 0',
              borderBottom: 'none',
              scrollbarWidth: 'none', marginTop: 22
            }}
          >
            {navItems.map(({ label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                style={{
                  padding: '8px 16px',
                  fontWeight: window.location.pathname === path ? 'bold' : 'normal',
                  color: 'black',
                  borderBottom:
                    window.location.pathname === path ? '3px solid #d32f2f' : '3px solid transparent',
                  fontSize: '16px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: '0.3s ease',
                }}
              >
                {label}
              </div>
            ))}
          </div>


        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            height: '120vh',
            marginTop: '-15px',
            width: 210,
            borderRadius: '0 20px 20px 0',
            overflowX: 'hidden', // Prevent side scroll inside drawer
          },
        }}
        ModalProps={{
          keepMounted: true, // Optional: improves performance on mobile
        }}
      >


        <Box width={300} padding={2} ml={-2} borderRadius={40}>
          <Box mt={-0.6} mb={1} pb={1} style={{ borderBottom: 'none' }}>
            <Box display="flex" alignItems="center" gap={1.5} pl={2} py={1}>
              <SettingsIcon sx={{ color: '#2c3e50', fontSize: 26 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  fontFamily: "'Segoe UI', sans-serif",
                  fontSize: '1.25rem',
                  letterSpacing: 0.5,
                }}
              >
                Settings
              </Typography>
            </Box>

          </Box>

          <List component="nav" sx={{ px: 2, pt: 2 }}>
            <ListItem button onClick={() => navigate('/profilepage')}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AccountCircleIcon sx={{ color: '#0E1F27', fontSize: 28 }} />
              </ListItemIcon>
              <ListItemText primary="Profile" primaryTypographyProps={{ sx: { fontWeight: 500 } }} />
            </ListItem>

            <ListItem button onClick={() => navigate('/snaps')}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <ImageIcon sx={{ color: '#e91e63', fontSize: 26 }} />
              </ListItemIcon>
              <ListItemText primary="Snaps" primaryTypographyProps={{ sx: { fontWeight: 500 } }} />
            </ListItem>

            <ListItem button onClick={() => navigate('/game')}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SportsCricketIcon sx={{ color: '#1e88e5' }} />
              </ListItemIcon>
              <ListItemText primary="Game" primaryTypographyProps={{ sx: { fontWeight: 500 } }} />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            <ListItem button component="a" href="https://www.youtube.com/results?search_query=cricket+highlights" target="_blank">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <YouTubeIcon sx={{ color: '#FF0000' }} />
              </ListItemIcon>
              <ListItemText primary="YouTube" primaryTypographyProps={{ sx: { fontWeight: 500 } }} />
            </ListItem>

            <ListItem button component="a" href="https://www.instagram.com/stricbuzz?utm_source=qr&igsh=YnpodG42dG5lbGtn" target="_blank">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <InstagramIcon sx={{ color: '#E1306C' }} />
              </ListItemIcon>
              <ListItemText primary="Instagram" primaryTypographyProps={{ sx: { fontWeight: 500 } }} />
            </ListItem>

            <ListItem button component="a" href="https://twitter.com/search?q=cricket" target="_blank">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <TwitterIcon sx={{ color: '#1DA1F2' }} />
              </ListItemIcon>
              <ListItemText primary="Twitter" primaryTypographyProps={{ sx: { fontWeight: 500 } }} />
            </ListItem>
          </List>

          {/* Social Icons (YouTube, Instagram, Twitter) remain same */}



          {/* Divider between nav and settings */}
          <Box sx={{ borderTop: '1px solid #ccc', mx: 2, my: 2, mt: 1 }} />

          {/* Profile & Settings */}
          <List sx={{ px: 2, marginTop: -2 }}>




            <List sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={`Total Flips: ${heads + tails}`}
                  primaryTypographyProps={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Heads: ${heads}`}
                  primaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={`Tails: ${tails}`}
                  primaryTypographyProps={{ fontSize: '0.85rem' }}
                />
              </ListItem>
            </List>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, ml: 1 }}>
              <MUIButton
                variant="outlined"
                onClick={resetGame}
                sx={{
                  fontWeight: 600,
                  height: '40px',
                  width: '100px',
                  textTransform: 'none',
                  fontSize: '0.79rem', // smaller text
                  borderRadius: '14px', // slightly less rounded
                  py: 1,                // less vertical padding
                  px: 1.5,              // less horizontal padding
                  color: '#4a3aff',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(145deg, #4a3aff, #624eff) border-box',
                  border: '2px solid transparent',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  boxShadow: '0 4px 6px rgba(98, 78, 255, 0.2)', // smaller shadow
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'black',
                    color: '#fff',
                    boxShadow: '0 6px 10px rgba(98, 78, 255, 0.4)',
                  },
                }}
              >
                Clear Stats
              </MUIButton>




            </Box>

          </List>

        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
