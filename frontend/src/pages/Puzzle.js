import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNFT } from '../contexts/NFTContext';
import { useWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';

const PuzzlePage = styled.div`
  min-height: 100vh;
  background: var(--bg-deep);
`;

const PuzzleBanner = styled.section`
  position: relative;
  height: 42vh;
  background: 
    linear-gradient(rgba(12,15,19,0.65), rgba(12,15,19,0.85)),
    image-set(
      url('/themes/seychelles/puzzle_banner.avif') 1x,
      url('/themes/seychelles/puzzle_banner.webp') 1x
    );
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  /* Add vignette effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%);
    pointer-events: none;
  }
  
  /* Fallback for browsers that don't support image-set */
  @supports not (background-image: image-set(url('test.webp') 1x)) {
    background: 
      linear-gradient(rgba(12,15,19,0.65), rgba(12,15,19,0.85)),
      url('/themes/seychelles/puzzle_banner.webp');
  }
  
  @media (max-width: 768px) {
    height: 35vh;
  }
`;

const BannerContent = styled.div`
  text-align: center;
  z-index: 10;
  position: relative;
`;

const BannerTitle = styled.h1`
  font-family: 'Pirata One', cursive;
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: #F4E1A0;
  text-shadow: 0 2px 16px var(--shadow), 0 0 20px rgba(242, 193, 90, 0.25);
  margin-bottom: 1rem;
  
  /* Lantern glow effect */
  text-shadow: 0 0 20px rgba(242, 193, 90, 0.25), 0 2px 16px var(--shadow);
`;

const BannerSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--ink-dim);
  text-shadow: 0 1px 8px rgba(0,0,0,0.7);
`;

const PuzzleContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const PuzzleHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PuzzleTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const PuzzleSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CryptogramSection = styled.div`
  background: radial-gradient(circle at center, var(--bg-panel) 0%, #0E1218 100%);
  border: 1px solid rgba(217, 180, 91, 0.18);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  backdrop-filter: blur(8px);
  
  /* Candle pulse effects in corners */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(242, 193, 90, 0.8) 0%, transparent 70%);
    animation: candlePulse 7s ease-in-out infinite;
  }
  
  &::before {
    top: 12px;
    left: 12px;
  }
  
  &::after {
    bottom: 12px;
    right: 12px;
  }
  
  @keyframes candlePulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
`;

const CryptogramTitle = styled.h2`
  font-family: 'Pirata One', cursive;
  color: var(--gold);
  font-size: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0 0 20px rgba(242, 193, 90, 0.25);
`;

const CryptogramText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  line-height: 2;
  color: ${props => props.theme.colors.text};
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid ${props => props.theme.colors.primary};
  white-space: pre-line;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: 1px;
  }
`;

const HintsSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  font-family: 'Cinzel', serif;
  color: ${props => props.theme.colors.primary};
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HintsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const HintCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const HintTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HintText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const SolutionSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
`;

const SolutionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SolutionLabel = styled.label`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const SolutionInput = styled.textarea`
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: #666666;
    font-family: 'Inter', sans-serif;
  }
`;

const CoordinatesInput = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoordinateField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CoordinateInput = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 2px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #d4af37 0%, #f5d976 100%);
  color: #000000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #f5d976 0%, #d4af37 100%);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: 3rem;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ProgressCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const ProgressNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  font-family: 'Cinzel', serif;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const WalletPrompt = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const ConnectButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: #000000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #f5d976;
  }
`;

const RecentSubmissions = styled.div`
  margin-top: 3rem;
`;

const SubmissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmissionItem = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

const SubmissionInfo = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const SubmissionStatus = styled.div`
  color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  font-weight: 600;
`;

function Puzzle() {
  const { submitSolution, isSubmittingSolution } = useNFT();
  const { isConnected, connect, address } = useWallet();
  
  const [solution, setSolution] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submissions, setSubmissions] = useState([]);

  // Load previous submissions
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('puzzle_submissions');
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!solution.trim()) {
      toast.error('Please enter your solution');
      return;
    }

    if (!latitude || !longitude) {
      toast.error('Please enter the coordinates');
      return;
    }

    try {
      const solutionData = {
        chapter: 'chapter1',
        answer: solution.trim(),
        wallet_address: address || null
      };

      const result = await submitSolution(solutionData);
      
      // Add to local submissions history
      const newSubmission = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        solution: solution.trim(),
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        success: result.success
      };
      
      const updatedSubmissions = [newSubmission, ...submissions.slice(0, 9)]; // Keep last 10
      setSubmissions(updatedSubmissions);
      localStorage.setItem('puzzle_submissions', JSON.stringify(updatedSubmissions));
      
      if (result.success) {
        // Clear form on success
        setSolution('');
        setLatitude('');
        setLongitude('');
      }
      
    } catch (error) {
      console.error('Failed to submit solution:', error);
    }
  };

  const hints = [
    {
      icon: '🗺️',
      title: 'Geographic Clues',
      text: 'The Seychelles archipelago consists of 115 islands. Look for references to specific islands, bays, or landmarks mentioned in historical records.'
    },
    {
      icon: '🔢',
      title: 'Numerical Patterns',
      text: 'La Buse\'s cryptogram contains numbers that may represent coordinates, distances, or compass bearings. Consider different numerical systems used in the 18th century.'
    },
    {
      icon: '📜',
      title: 'Historical Context',
      text: 'Research Olivier Levasseur\'s known activities, his crew, and the political situation in the Indian Ocean during 1721-1730.'
    },
    {
      icon: '🧩',
      title: 'Cryptographic Methods',
      text: 'The original cryptogram uses a substitution cipher. Look for patterns, repeated sequences, and consider multiple layers of encoding.'
    },
    {
      icon: '⚓',
      title: 'Maritime References',
      text: 'Pirates used nautical terms and measurements. Familiarize yourself with 18th-century sailing terminology and navigation methods.'
    },
    {
      icon: '💎',
      title: 'Treasure Markers',
      text: 'Look for symbols or phrases that might indicate the final resting place: crosses, religious references, or distinctive geographical features.'
    }
  ];

  const originalCryptogram = `APORLNMERDSPMD
ETSEUDLNDENAVN
TACDRIXXHIENYH
ONEAETMCELSEA
HUAIEXTNRPRMN
NEAOIHOAEINHS
TOPCDETAULEGS
INERDTEMGNEDS
SDLORTIADEHUL
ERARNFNMAED
ANLLLRDMLHD
RNDDNSENTTDE
YARESNTEDXSH
NHREEAORHE
ELLEOHSHHAR
TRREOLEEE
TAREDOPOD`;

  return (
    <PuzzlePage className="puzzle-page">
      {/* Background animation layers */}
      <div className="bg-layer fog-layer fog-layer--page" aria-hidden="true" style={{opacity: 0.12}} />
      
      <PuzzleBanner>
        <BannerContent>
          <BannerTitle>The Treasure Puzzle</BannerTitle>
          <BannerSubtitle>Decode the 300-year-old mystery</BannerSubtitle>
        </BannerContent>
      </PuzzleBanner>
      
      <PuzzleContainer>

      <PuzzleHeader>
        <PuzzleTitle>Decode La Buse&rsquo;s Challenge</PuzzleTitle>
        <PuzzleSubtitle>
          This is the same cipher Levasseur hurled into the crowd in 1730. Study the cryptogram, scour the hints,
          and submit the co-ordinates you believe unlock his hidden vault. Every clue on-chain nudges you closer.
        </PuzzleSubtitle>
      </PuzzleHeader>

      {!isConnected && (
        <WalletPrompt>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>
            🔐 Wallet Required
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            You need to connect your XUMM wallet to submit solutions and potentially 
            receive the treasure NFT reward.
          </p>
          <ConnectButton onClick={connect}>
            Connect XUMM Wallet
          </ConnectButton>
        </WalletPrompt>
      )}

      <CryptogramSection>
        <CryptogramTitle>
          📜 La Buse's Original Cryptogram
        </CryptogramTitle>
        <CryptogramText>{originalCryptogram}</CryptogramText>
        <p style={{ 
          marginTop: '1rem', 
          fontStyle: 'italic', 
          color: '#cccccc' 
        }}>
          "Find my treasure, he who can!" - Olivier Levasseur's final words before execution (1730)
        </p>
      </CryptogramSection>

      <ProgressSection>
        <SectionTitle>🏆 Treasure Hunt Progress</SectionTitle>
        <ProgressGrid>
          <ProgressCard>
            <ProgressNumber>300</ProgressNumber>
            <ProgressLabel>Years Unsolved</ProgressLabel>
          </ProgressCard>
          <ProgressCard>
            <ProgressNumber>{submissions.length}</ProgressNumber>
            <ProgressLabel>Your Attempts</ProgressLabel>
          </ProgressCard>
          <ProgressCard>
            <ProgressNumber>∞</ProgressNumber>
            <ProgressLabel>Possible Solutions</ProgressLabel>
          </ProgressCard>
          <ProgressCard>
            <ProgressNumber>1</ProgressNumber>
            <ProgressLabel>Winner Takes All</ProgressLabel>
          </ProgressCard>
        </ProgressGrid>
      </ProgressSection>

      <HintsSection>
        <SectionTitle>💡 Cryptographic Hints</SectionTitle>
        <HintsGrid>
          {hints.map((hint, index) => (
            <HintCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <HintTitle>
                {hint.icon} {hint.title}
              </HintTitle>
              <HintText>{hint.text}</HintText>
            </HintCard>
          ))}
        </HintsGrid>
      </HintsSection>

      <SolutionSection>
        <SectionTitle>🎯 Submit Your Solution</SectionTitle>
        
        <SolutionForm onSubmit={handleSubmit}>
          <div>
            <SolutionLabel htmlFor="solution">
              Decrypted Message or Interpretation:
            </SolutionLabel>
            <SolutionInput
              id="solution"
              placeholder="Enter your decrypted text, interpretation, or reasoning here..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              required
            />
          </div>

          <div>
            <SolutionLabel>Treasure Location Coordinates:</SolutionLabel>
            <CoordinatesInput>
              <CoordinateField>
                <label>Latitude (°S)</label>
                <CoordinateInput
                  type="number"
                  step="any"
                  placeholder="-4.6796"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </CoordinateField>
              <CoordinateField>
                <label>Longitude (°E)</label>
                <CoordinateInput
                  type="number"
                  step="any"
                  placeholder="55.4919"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </CoordinateField>
            </CoordinatesInput>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#999', 
              marginTop: '0.5rem' 
            }}>
              Enter coordinates in decimal degrees. Seychelles range: Lat -3° to -10°, Lon 46° to 56°
            </p>
          </div>

          <SubmitButton
            type="submit"
            disabled={!isConnected || isSubmittingSolution}
          >
            {isSubmittingSolution ? (
              <>⏳ Verifying Solution...</>
            ) : (
              <>🏴‍☠️ Submit Solution</>
            )}
          </SubmitButton>
        </SolutionForm>
      </SolutionSection>

      {submissions.length > 0 && (
        <RecentSubmissions>
          <SectionTitle>📋 Your Recent Submissions</SectionTitle>
          <SubmissionsList>
            {submissions.map((submission) => (
              <SubmissionItem key={submission.id}>
                <SubmissionInfo>
                  {new Date(submission.timestamp).toLocaleString()} - 
                  Lat: {submission.coordinates.latitude}, Lon: {submission.coordinates.longitude}
                </SubmissionInfo>
                <SubmissionStatus success={submission.success}>
                  {submission.success ? '✅ Correct!' : '❌ Incorrect'}
                </SubmissionStatus>
              </SubmissionItem>
            ))}
          </SubmissionsList>
        </RecentSubmissions>
      )}
      </PuzzleContainer>
    </PuzzlePage>
  );
}

export default Puzzle;