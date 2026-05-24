import React, { useState, useEffect, useRef , useCallback, useMemo} from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import Navbar from "./Navbar";
import Bowlers from "./Bowlers";
const Scoreboard = () => {
  // State variables
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    runs: "",
    balls: "",
    fours: "",
    sixes: "",
    note: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
 const [drawerOpen, setDrawerOpen] = useState(false);
  const [heads, setHeads] = useState(() => Number(localStorage.getItem('heads')) || 0);
  const [tails, setTails] = useState(() => Number(localStorage.getItem('tails')) || 0);
  const coinRef = useRef(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

const handleLogout = () => {
  localStorage.removeItem('authenticated'); // Remove persisted auth
  window.location.reload(); // Reload to reflect the logout state (optional)
};

  // Firestore reference to scoreboard collection
 const scoreboardRef = useMemo(() => collection(db, "matches", "matched", "Scoreboard"), []);
const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(scoreboardRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch players.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [scoreboardRef]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);


useEffect(() => {
  fetchPlayers();
}, [fetchPlayers]);

  // Handle input changes in the form
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open add new player dialog
  const openDialog = () => {
    setEditingIndex(null);
    setForm({ name: "", runs: "", balls: "", fours: "", sixes: "", note: "" });
    setDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Validate required fields (note is optional)
  const isFormValid = () => {
    const { name, runs, balls, fours, sixes } = form;
    return (
      name.trim() !== "" &&
      runs !== "" &&
      balls !== "" &&
      fours !== "" &&
      sixes !== ""
    );
  };

  // Add new player or update existing one
  const addOrUpdatePlayer = async () => {
    if (!isFormValid()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields (note is optional).",
        severity: "warning",
      });
      return;
    }

    const playerData = {
      ...form,
      runs: Number(form.runs),
      balls: Number(form.balls),
      fours: Number(form.fours),
      sixes: Number(form.sixes),
    };

    setLoading(true);
    try {
      if (editingIndex !== null) {
        // Update existing player
        const playerToUpdate = players[editingIndex];
        const playerDoc = doc(scoreboardRef, playerToUpdate.id);
        await updateDoc(playerDoc, playerData);
        const updatedPlayers = [...players];
        updatedPlayers[editingIndex] = { ...playerToUpdate, ...playerData };
        setPlayers(updatedPlayers);
      } else {
        // Add new player
        const docRef = await addDoc(scoreboardRef, playerData);
        setPlayers((prev) => [...prev, { id: docRef.id, ...playerData }]);
      }
      closeDialog();
      setForm({ name: "", runs: "", balls: "", fours: "", sixes: "", note: "" });
      setEditingIndex(null);
      setSnackbar({
        open: true,
        message: "Player saved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving player:", error);
      setSnackbar({
        open: true,
        message: "Error saving player.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit player handler: prefill form and open dialog
  const handleEdit = (index) => {
    const player = players[index];
    setForm({
      name: player.name || "",
      runs: player.runs || "",
      balls: player.balls || "",
      fours: player.fours || "",
      sixes: player.sixes || "",
      note: player.note || "",
    });
    setEditingIndex(index);
    setDialogOpen(true);
  };

  // Confirm delete dialog open
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  // Delete confirmed handler
  const handleDeleteConfirmed = async () => {
    const index = deleteIndex;
    const player = players[index];
    setLoading(true);
    try {
      if (player.id) {
        await deleteDoc(doc(scoreboardRef, player.id));
        setPlayers((prev) => prev.filter((_, i) => i !== index));
        setSnackbar({
          open: true,
          message: "Player deleted.",
          severity: "info",
        });
      }
    } catch (error) {
      console.error("Failed to delete player:", error);
      setSnackbar({
        open: true,
        message: "Error deleting player.",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  };
// const clearBatters = async () => {
//   if (!window.confirm("Are you sure you want to clear all batters?")) return;

//   setLoading(true);
//   try {
//     const snapshot = await getDocs(scoreboardRef);
//     const deletePromises = snapshot.docs.map((docSnap) =>
//       deleteDoc(doc(scoreboardRef, docSnap.id))
//     );
//     await Promise.all(deletePromises);
//     setPlayers([]);
//     setSnackbar({
//       open: true,
//       message: "All batters cleared successfully!",
//       severity: "success",
//     });
//   } catch (error) {
//     console.error("Error clearing batters:", error);
//     setSnackbar({
//       open: true,
//       message: "Failed to clear batters.",
//       severity: "error",
//     });
//   } finally {
//     setLoading(false);
//   }
// };
const clearBatters = async () => {
  setLoading(true);
  try {
    const snapshot = await getDocs(scoreboardRef);
    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(scoreboardRef, docSnap.id))
    );
    await Promise.all(deletePromises);
    setPlayers([]);
    setSnackbar({
      open: true,
      message: "All batters cleared successfully!",
      severity: "success",
    });
  } catch (error) {
    console.error("Error clearing batters:", error);
    setSnackbar({
      open: true,
      message: "Failed to clear batters.",
      severity: "error",
    });
  } finally {
    setLoading(false);
    setClearDialogOpen(false); // Close the dialog
  }
};

  return (

   
    <div>   <Navbar
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          heads={heads}
          tails={tails}
          setHeads={setHeads}
          setTails={setTails}
          coinRef={coinRef}
          onLogout={handleLogout}
        />
    <Box sx={{ width: { xs: "100%", sm: "90%", md: 900 }, mx: "auto", mt: 10 }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ bgcolor: "#d12828", borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Loading spinner */}
      {loading && (
        <Box textAlign="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {/* Scoreboard Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Batsman</b>
              </TableCell>
              <TableCell align="center">
                <b>Runs</b>
              </TableCell>
              <TableCell align="center">
                <b>Balls</b>
              </TableCell>
              <TableCell align="center">
                <b>4s</b>
              </TableCell>
              <TableCell align="center">
                <b>6s</b>
              </TableCell>
                <TableCell align="center"><b>SR</b></TableCell>  {/* ➕ Strike Rate */}
  <TableCell align="center"><b>Avg</b></TableCell> 
              <TableCell align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player, index) => (
            <TableRow key={player.id || index}>
  <TableCell>
    <Typography
      variant="body2"
      fontWeight={player.note === "not out" ? "bold" : 400}
    >
      {player.name}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {player.note}
    </Typography>
  </TableCell>

  <TableCell align="center">{player.runs}</TableCell>
  <TableCell align="center">{player.balls}</TableCell>
  <TableCell align="center">{player.fours}</TableCell>
  <TableCell align="center">{player.sixes}</TableCell>

  {/* ➕ Strike Rate */}
  <TableCell align="center">
    {player.balls > 0
      ? ((player.runs / player.balls) * 100).toFixed(2)
      : '0.00'}
  </TableCell>

  {/* ➕ Average */}
  <TableCell align="center">
    {player.note?.toLowerCase() === "not out"
      ? '-'
      : (player.balls > 0 ? (player.runs / 1).toFixed(2) : '0.00')}
  </TableCell>

  <TableCell align="center">
    <IconButton size="small" onClick={() => handleEdit(index)}>
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={() => confirmDelete(index)}
      color="error"
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </TableCell>
</TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Player Dialog */}
     <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
  <DialogTitle>
    {editingIndex !== null ? "Edit Player" : "Add New Player"}
  </DialogTitle>

  <DialogContent>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <TextField
          label="Runs"
          name="runs"
          value={form.runs}
          onChange={handleChange}
          type="number"
          fullWidth
          required
          inputProps={{ min: 0 }}
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <TextField
          label="Balls"
          name="balls"
          value={form.balls}
          onChange={handleChange}
          type="number"
          fullWidth
          required
          inputProps={{ min: 0 }}
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <TextField
          label="4s"
          name="fours"
          value={form.fours}
          onChange={handleChange}
          type="number"
          fullWidth
          required
          inputProps={{ min: 0 }}
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <TextField
          label="6s"
          name="sixes"
          value={form.sixes}
          onChange={handleChange}
          type="number"
          fullWidth
          required
          inputProps={{ min: 0 }}
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
          fullWidth
          placeholder='e.g., "not out" or "bowled"'
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      {/* ➕ Auto-calculated SR */}
      <Grid item xs={6} sm={3}>
        <TextField
          label="SR"
          value={
            form.balls && Number(form.balls) > 0
              ? ((Number(form.runs) / Number(form.balls)) * 100).toFixed(2)
              : "0.00"
          }
          fullWidth
          variant="outlined"
          InputProps={{ readOnly: true }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>

      {/* ➕ Auto-calculated Average */}
      <Grid item xs={6} sm={3}>
        <TextField
          label="Avg"
          value={
            form.note?.toLowerCase() === "not out"
              ? "-"
              : Number(form.runs || 0).toFixed(2)
          }
          fullWidth
          variant="outlined"
          InputProps={{ readOnly: true }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Grid>
    </Grid>
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
    <Button
      onClick={closeDialog}
      variant="outlined"
      sx={{ bgcolor: '#d12828', borderRadius: '10px', color: 'white' }}
    >
      Cancel
    </Button>
    <Button
      sx={{ bgcolor: 'black', borderRadius: '10px' }}
      onClick={addOrUpdatePlayer}
      variant="contained"
      disabled={loading}
    >
      {editingIndex !== null ? "Update" : "Add"}
    </Button>
  </DialogActions>
</Dialog>


      {/* Delete Confirmation Dialog */}
     <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 1,
      minWidth: 250,
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 'bold',
      fontSize: '1.35rem',
      color: 'error.main',
    }}
  >
    Confirm Deletion
  </DialogTitle>
  <DialogContent>
    <Typography sx={{ fontSize: '1rem', mb: 1 }}>
      Are you sure you want to delete this player? This action cannot be undone.
    </Typography>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
      variant="outlined"
      color="primary"
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        px: 3,
        fontWeight: 500,
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleDeleteConfirmed}
      color="error"
      variant="contained"
      disabled={loading}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        px: 3,
        fontWeight: 600,
        boxShadow: 2,
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>


      {/* Add Player Button */}
<Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  mt={3}
  mb={2}
>
  <Button
    variant="contained"
    onClick={openDialog}
    startIcon={<PersonAddIcon />}
    sx={{
     width: '160px',
      backgroundColor: "black",
      color: "#fff",
      textTransform: "none",
      fontWeight: 600,
      borderRadius: 2,
      px: 3,
      py: 1,
      boxShadow: 3,
      mr: 2, // margin between buttons
    }}
  >
    Add Player
  </Button>

 <Button
  variant="outlined"
  onClick={() => setClearDialogOpen(true)}
  sx={{
    width: '165px',
    borderColor: "#d12828",
    color: "#d12828",
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 2,
    px: 3,
    py: 1,
    boxShadow: 3,
  }}
>
  Clear All
</Button>

</Box>

<Dialog
  open={clearDialogOpen}
  onClose={() => setClearDialogOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 1,
      minWidth: 250,
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 'bold',
      fontSize: '1.35rem',
      color: 'error.main',
    }}
  >
    Confirm 
  </DialogTitle>

  <DialogContent>
    <Typography sx={{ fontSize: '1rem', mb: 1 }}>
      Are you sure you want to delete <strong>all batters</strong>? This action cannot be undone.
    </Typography>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setClearDialogOpen(false)}
      variant="outlined"
      color="primary"
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        px: 3,
        fontWeight: 500,
      }}
    >
      Cancel
    </Button>

    <Button
      onClick={clearBatters}
      color="error"
      variant="contained"
      disabled={loading}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        px: 3,
        fontWeight: 600,
        boxShadow: 2,
      }}
    >
      Clear All
    </Button>
  </DialogActions>
</Dialog>

    </Box>
    <Bowlers/>
        </div>
  );
};

export default Scoreboard;
