import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateRecipePage from './pages/CreateRecipePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes/create" element={<CreateRecipePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
