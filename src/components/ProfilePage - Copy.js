import React, { useEffect, useRef, useState } from 'react';
import {
    Box, Typography, IconButton, TextField, Button, Grid, Snackbar, Button as MUIButton
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Navbar from './Navbar';

import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Footer from './Footer';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import InputAdornment from '@mui/material/InputAdornment';
import { GlobalStyles } from '@mui/material';

const ProfilePage = (onLogout ) => {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [snack, setSnack] = useState(false);
    const [heads, setHeads] = useState(() => Number(localStorage.getItem('heads')) || 0);
    const [tails, setTails] = useState(() => Number(localStorage.getItem('tails')) || 0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const coinRef = useRef(null);
const startDate = new Date('2025-06-01');
const today = new Date();

// Calculate time difference in milliseconds and convert to days
const msPerDay = 1000 * 60 * 60 * 24;
const daysInRow = Math.floor((today - startDate) / msPerDay) + 1;

// Points and matches
const experiencePoints = daysInRow * 90;
const totalMatches = daysInRow * 3;

// Get today's date (day of the month)
const todayDate = today.getDate();
const calendarDays = Array.from({ length: todayDate }, (_, i) => i + 1);

const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        phone: '',
        team: '',
        playerName: '',
        email: '',
        uid: '',
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        ...data,
                        email: currentUser.email,
                        uid: currentUser.uid,
                    });
                } else {
                    setFormData(prev => ({
                        ...prev,
                        email: currentUser.email,
                        uid: currentUser.uid,
                    }));
                }
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            if (!user) return;
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                ...formData,
                email: user.email,
                uid: user.uid
            });
            setSnack(true);
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };
<GlobalStyles
  styles={{
    '@keyframes twinkle': {
      '0%, 100%': { opacity: 0.9 },
      '50%': { opacity: 0.3 },
    },
  }}
/>

    return (
        <>
            <Navbar
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                heads={heads}
                tails={tails}
                setHeads={setHeads}
                setTails={setTails}
                coinRef={coinRef}
                onLogout={handleLogout}
            />

<Box
  sx={{
    backgroundColor: 'white',
    minHeight: '100vh',
    color: 'black',
    pt: 10,
    px: { xs: 1, sm: 2, md: 4 },
    overflowX: 'hidden',
    width: '130%', // updated to full screen width
    position: 'relative', // required for zIndex to work
    zIndex: 1, // ensures it appears above other elements with lower z-index
    ml:-7
  }}
>





<Box
  sx={{
    width: '70%',
    maxWidth: 420,
    mx: 'auto',
    mb: 4,
    px: 3,
    py: 2,
    borderRadius: 4,
    boxShadow: 'none',
    backgroundColor: '#fff'
  }}
>
  {/* Profile Info */}
  <Box display="flex" alignItems="center" gap={2} mb={2}>
    <img
      src="assets/avatarp.avif"
      alt="avatar"
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ccc'
      }}
    />
    <Box>
      <Typography variant="h6" fontWeight={600}>{formData.name || 'User'}</Typography>
      <Typography variant="body2" color="text.secondary">{formData.email}</Typography>
      <Typography variant="caption" color="primary" fontWeight={600}>
        🏆 League: Spl Member
      </Typography>
    </Box>
  </Box>

  {/* Progress */}
  <Box mb={2}>
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>My Current Progress</Typography>
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Typography variant="body2">Days in Row</Typography>
      <Typography fontWeight="bold" color="orange">{daysInRow} Days</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Typography variant="body2">Experience:</Typography>
      <Typography fontWeight="bold">{experiencePoints} Points</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between">
      <Typography variant="body2">Total Matches:</Typography>
      <Typography fontWeight="bold" color="#4caf50">{totalMatches} Matches</Typography>
    </Box>
  </Box>

  {/* Rewards */}
   <Box
                    sx={{
                        maxWidth: 700,
                        mx: 'auto',
                        backgroundColor: 'transparent',
                        p: 3,
                        borderRadius: 3,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        ml:-7
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ mb: '2%' , ml:-12}}> Account Info  </Typography>
                   <Grid
  container
  spacing={2}
  justifyContent="center"
  sx={{
    borderRadius: '12px',
    padding: 3,
    background: '##87B0BE',
    
  }}
>
  {/* Disabled Fields */}
  {[
    { label: 'Email', name: 'email', value: formData.email },
    { label: 'User ID (UID)', name: 'uid', value: formData.uid },
  ].map((field, idx) => (
    <Grid item xs={12} key={idx}>
    <TextField
  label={field.label}
  name={field.name}
  value={field.value}
  disabled
 
  size="small"
  variant="standard"
  InputLabelProps={{
    shrink: true,
  }}
 sx={{
        width:'28vh',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        '& .MuiInputBase-root': {
          borderBottom: '1.5px solid #b39ddb', // always visible underline
        },
        '& .MuiInputBase-input': {
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          fontSize: '0.95rem',
          color: '#222',
          paddingY: '6px',
        },
        '& .MuiInputLabel-root': {
          color: '#673ab7',
          fontWeight: 500,
          fontSize: '0.85rem',
        },
        '& .MuiInputBase-root:hover': {
          borderBottom: '1.5px solid #9575cd',
        },
        '& .MuiInputBase-root.Mui-focused': {
          borderBottom: '2px solid #7e57c2',
        },
      }}
/>

    </Grid>
  ))}

  {/* Editable Fields */}
{[
  { label: 'Full Name', name: 'name' },
  { label: 'Date of Birth', name: 'dob', type: 'date', inputProps: { shrink: true } },
  { label: 'Phone Number', name: 'phone' },
  { label: 'Team Name', name: 'team' },
  { label: 'Player Name', name: 'playerName' },
].map((field, index) => (
  <Grid item xs={field.name === 'name' || field.name === 'dob' ? 12 : 6} key={index}>
    <TextField
      label={field.label}
      name={field.name}
      type={field.type || 'text'}
      value={formData[field.name]}
      onChange={handleChange}
      
      size="small"
      variant="standard"
      InputLabelProps={{
        shrink: true,
        ...field.inputProps,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {/* Add any icons or images */}
          </InputAdornment>
        ),
        disableUnderline: false,
      }}
      sx={{
        width:'28vh',
        backgroundColor: 'transparent',
        borderRadius: '8px',
        '& .MuiInputBase-root': {
          borderBottom: '1.5px solid #b39ddb', // always visible underline
        },
        '& .MuiInputBase-input': {
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          fontSize: '0.95rem',
          color: '#222',
          paddingY: '6px',
        },
        '& .MuiInputLabel-root': {
          color: '#673ab7',
          fontWeight: 500,
          fontSize: '0.85rem',
        },
        '& .MuiInputBase-root:hover': {
          borderBottom: '1.5px solid #9575cd',
        },
        '& .MuiInputBase-root.Mui-focused': {
          borderBottom: '2px solid #7e57c2',
        },
      }}
    />
  </Grid>
))}

</Grid>


<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',   // center the buttons horizontally
    alignItems: 'center',       // align vertically in case of height mismatch
    gap: 2,                      // space between buttons
    mt: 3,
    flexWrap: 'nowrap',          // prevent wrapping to keep in a single row
    ml:7
  }}
>
  <Button
    onClick={handleUpdate}
    variant="contained"
    sx={{
      width: 170,
      textTransform: 'none',
      background: 'linear-gradient(135deg, #1976d2, #004ba0)',
      color: 'white',
      fontWeight: 600,
      borderRadius: '8px',
      px: 3,
      height: 45,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      '&:hover': {
        background: 'linear-gradient(135deg, #004ba0, #002b80)',
      },
    }}
  >
    Update Profile
  </Button>

  <MUIButton
    variant="outlined"
    onClick={async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        localStorage.removeItem('authenticated');
        if (onLogout) onLogout();
        navigate('/userlogin');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }}
    endIcon={<ArrowForwardIcon />}
    sx={{
      width: 120,
      height: 50,
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.85rem',
      borderRadius: '14px',
      color: 'white',
      background: 'linear-gradient(145deg, rgb(206, 68, 68), rgb(221, 72, 72)) border-box',
      border: '2px solid transparent',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      boxShadow: '0 4px 6px rgba(98, 78, 255, 0.2)',
      transition: 'all 0.3s ease-in-out',
    }}
  >
    Logout
  </MUIButton>
</Box>

                    <Box mt={5} ml={6}>
                    <Box
  sx={{
    position: 'relative',
    width: '110%',
    maxWidth: 350,
    mx: 'auto',
    mb: 6,
    px: 3,
    py: 2,
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    overflow: 'hidden',
    border: '4px solid black',
    ml:-1,

    // Glowing Snake Border Effect
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: 4,
      zIndex: 1,
      background: 'linear-gradient(45deg,rgb(255, 255, 255),rgb(255, 255, 255),#37f0fa)',
      backgroundSize: '400% 400%',
      animation: 'glowSnake 3s linear infinite',
      mask: 'linear-gradient(#0000 0 0) content-box, linear-gradient(#000 0 0)',
      WebkitMask: 'linear-gradient(#0000 0 0) content-box, linear-gradient(#000 0 0)',
      maskComposite: 'exclude',
      WebkitMaskComposite: 'destination-out',
      padding: '4px',
    },

    '@keyframes glowSnake': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },

    // Stars if needed (optional)
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
      background: 'transparent',
      boxShadow: `
        30px 30px white,
        60px 90px white,
        90px 120px #ddd,
        120px 60px #ccc,
        150px 180px #fff,
        200px 100px #eee,
        250px 40px white
      `,
      animation: 'twinkleStars 2s infinite ease-in-out',
      filter: 'blur(0.6px) brightness(2)',
    },

    '@keyframes twinkleStars': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.3 },
    },
  }}
>
  <Box sx={{ position: 'relative', zIndex: 2 }}>
    <Typography variant="h6" align="center" gutterBottom>
      Days Till Now 
    </Typography>

    <Typography
      variant="h3"
      align="center"
      fontWeight={700}
      mb={1}
      sx={{ color: 'black' }}
    >
      {daysInRow}
    </Typography>

    <Typography variant="caption" align="center" display="block">
      Started: June 1, 2025
    </Typography>

    <Box mt={2}>
      <Typography variant="caption">
        Period: June 1, 2025 -{' '}
        {today.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1} mt={1}>
        {calendarDays.map((day) => {
          const isToday = day === today.getDate();
          return (
            <Box
              key={day}
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                textAlign: 'center',
                lineHeight: '30px',
                backgroundColor: '#2196f3',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.8rem',
                border: isToday ? '2px solid red' : 'none',ml:13
              }}
            >
              {day}
            </Box>
          );
        })}
      </Box>
    </Box>

    <Box mt={2}>
      <Typography variant="subtitle2">
        Current Streak
      </Typography>
      <Typography variant="body2">
        Days the App Started: <strong>{daysInRow} DAYS</strong>
      </Typography>
      <Typography variant="caption">
        Period: June 1, 2025 -{' '}
        {today.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Typography>
    </Box>
  </Box>
</Box>
                        <Typography  fontWeight="bold" gutterBottom style={{marginBottom:"10px", fontSize:'18px'}}>Social Media</Typography>
                        <Box display="flex" gap={3} ml={4}>
                        
                            <IconButton href="https://youtube.com" target="_blank" color="error"><YouTubeIcon /></IconButton>
                            <IconButton href="https://facebook.com" target="_blank" color="primary"><FacebookIcon /></IconButton>
                            <IconButton href="https://www.instagram.com/stricbuzz?utm_source=qr&igsh=YnpodG42dG5lbGtn" target="_blank" sx={{ color: '#e1306c' }}><InstagramIcon /></IconButton>
                            <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#1DA1F2' }}><TwitterIcon /></IconButton>
                        </Box>
                    </Box>
                </Box>
</Box>



{/* Calendar Section */}



              
            </Box>

            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)} message="Profile updated successfully!" />
            <Footer />
        </>
    );
};

export default ProfilePage;
