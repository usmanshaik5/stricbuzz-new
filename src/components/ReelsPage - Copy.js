import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import Footer from './Footer';
import Navbar from './Navbar';
import { getAuth, signOut } from 'firebase/auth';

const API_KEY = 'AIzaSyDJaymJudWufZtM4Z0IfERbF8ooclbI24U';
const CHANNEL_HANDLE = '@ICC';
const REELS_PER_LOAD = 10;

const parseDuration = (iso) => {
  const match = iso?.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  const min = parseInt(match?.[1] || '0', 10);
  const sec = parseInt(match?.[2] || '0', 10);
  return min * 60 + sec;
};

const ReelsPage = () => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [uploadPlaylistId, setUploadPlaylistId] = useState('');
  const [heads, setHeads] = useState(() => Number(localStorage.getItem('heads')) || 0);
  const [tails, setTails] = useState(() => Number(localStorage.getItem('tails')) || 0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const coinRef = useRef(null);
  const videoRefs = useRef([]);
  const auth = getAuth();

  const fetchShorts = useCallback(async (playlistId, isLoadMore = false) => {
    if (!playlistId || loading) return;

    setLoading(true);

    try {
      const playlistRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet,contentDetails',
          playlistId,
          maxResults: 20,
          pageToken: nextPageToken,
          key: API_KEY,
        },
      });

      const items = playlistRes.data.items || [];
      const videoIds = items.map(i => i.contentDetails.videoId).join(',');

      const detailsRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'contentDetails',
          id: videoIds,
          key: API_KEY,
        },
      });

      const newShorts = items
        .map((item) => {
          const detail = detailsRes.data.items.find(v => v.id === item.contentDetails.videoId);
          const seconds = parseDuration(detail?.contentDetails?.duration);
          return {
            id: item.contentDetails.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            seconds,
          };
        })
        .filter(v => v.seconds && v.seconds <= 75)
        .slice(0, REELS_PER_LOAD);

      setVideos(prev => [...prev, ...newShorts]);
      setNextPageToken(playlistRes.data.nextPageToken || '');
    } catch (err) {
      console.error('Error loading shorts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, nextPageToken]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          const iframe = videoRefs.current[index];
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: entry.isIntersecting ? 'playVideo' : 'pauseVideo',
              }),
              '*'
            );
          }
        });
      },
      { threshold: 0.75 }
    );

    videoRefs.current.forEach((iframe) => {
      if (iframe) observer.observe(iframe);
    });

    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    const getUploadsPlaylist = async () => {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'contentDetails',
          forHandle: CHANNEL_HANDLE,
          key: API_KEY,
        },
      });

      const id = res.data.items[0].contentDetails.relatedPlaylists.uploads;
      setUploadPlaylistId(id);
      fetchShorts(id);
    };

    getUploadsPlaylist();
  }, [fetchShorts]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
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
          minHeight: '100vh',
          bgcolor: 'black',
          color: 'white',
          scrollSnapType: 'y mandatory',
        }}
      >
        {videos.map((video, idx) => (
          <Box
            key={video.id}
            sx={{
              scrollSnapAlign: 'start',
              position: 'relative',
              width: '100%',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                maxWidth: 430,
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <iframe
                ref={(el) => (videoRefs.current[idx] = el)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  inset: 0,
                }}
                src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&controls=0&modestbranding=1&rel=0&mute=1&loop=1&playlist=${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  px: 2,
                  py: 2,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                }}
              >
                <Typography fontSize={14} fontWeight="bold">
                  {video.title}
                </Typography>
                <Typography fontSize={12} color="gray">
                  🎥 {video.channel}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        {nextPageToken && (
          <Box textAlign="center" py={3}>
            <Button
              onClick={() => fetchShorts(uploadPlaylistId, true)}
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{
                width: '200px',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1976d2, #004ba0)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3,
                mx: 1,
                mt: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #004ba0, #002b80)',
                },
              }}
            >
              {loading ? 'Loading...' : 'Load More Shorts'}
            </Button>
          </Box>
        )}
      </Box>

      <Footer />
    </div>
  );
};

export default ReelsPage;
