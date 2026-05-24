import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './Home';
import LiveCommentary from './components/LiveCommentary';
import ProfileUpload from './components/ProfileUpload';
import MatchScore from './components/MatchScore';
import UpdateMatchScore from './components/UpdateMatchScore';
import Scoreboard from './components/Scoreboard';
import Squads from './components/Squads';
import PointsTable from './components/PointsTable';
import Snaps from './components/Snaps';
import Poll from './components/poll';
import Game from './components/Game';
import ProfilePage from './components/ProfilePage';
import MatchHistory from './components/MatchHistory';
import ReelsPage from './components/ReelsPage';

const App = () => {

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/home" />} />

      <Route path="/home" element={<Home />} />
      <Route path="/profilepage" element={<ProfilePage />} />
      <Route path="/poll" element={<Poll />} />
      <Route path="/reelspage" element={<ReelsPage />} />
      <Route path="/game" element={<Game />} />
      <Route path="/snaps" element={<Snaps />} />
      <Route path="/commentary" element={<LiveCommentary />} />
      <Route path="/profile-upload" element={<ProfileUpload />} />
      <Route path="/matchscore" element={<MatchScore />} />
      <Route path="/updatematchscore" element={<UpdateMatchScore />} />
      <Route path="/matchhistory" element={<MatchHistory />} />
      <Route path="/scoreboard" element={<Scoreboard />} />
      <Route path="/squads" element={<Squads />} />
      <Route path="/pointstable" element={<PointsTable />} />

    </Routes>
  );
};

export default App;    