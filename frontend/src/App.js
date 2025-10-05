import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import GalleryMinted from './pages/GalleryMinted';
import PreMintGallery from './pages/PreMintGallery';
import NFTDetail from './pages/NFTDetail';
import Puzzle from './pages/Puzzle';
import SolvePuzzle from './pages/SolvePuzzle';
import About from './pages/About';
import Admin from './pages/Admin';
import Offers from './pages/Offers';
import MyCollection from './pages/MyCollection';
import Marketplace from './pages/Marketplace';
import NotFound from './pages/NotFound';

// Styles
import styled, { ThemeProvider } from 'styled-components';
// Global theme CSS is linked via public/index.html

const theme = {
  colors: {
    primary: '#D9B45B', // Gold
    secondary: '#141923', // Dark panel
    background: '#0C0F13', // Deep background
    surface: '#141923', // Panel background
    text: '#EAE7DC', // Ink
    textSecondary: '#C9C6BB', // Dim ink
    accent: '#B7933F', // Gold-2
    success: '#10b981',
    error: '#8B0000', // Blood red
    warning: '#f59e0b'
  },
  fonts: {
    heading: 'Pirata One, Cinzel, serif',
    body: 'Inter, sans-serif'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Helmet>
          <title>Treasure of Seychelles - NFT Treasure Hunt</title>
          <meta name="description" content="Interactive NFT collection featuring 1000 cryptographic clues leading to Olivier Levasseur's lost pirate treasure in the Seychelles archipelago." />
          {/* Ensure theme stylesheet loads at runtime */}
          <link rel="stylesheet" href="/styles/theme.css" />
        </Helmet>
        
        <Header />
        
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery-minted" element={<GalleryMinted />} />
            <Route path="/pre-mint" element={<PreMintGallery />} />
            <Route path="/nft/:tokenId" element={<NFTDetail />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/solve-puzzle" element={<SolvePuzzle />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/my-collection" element={<MyCollection />} />
          <Route path="/marketplace" element={<Marketplace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Main>
        
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;