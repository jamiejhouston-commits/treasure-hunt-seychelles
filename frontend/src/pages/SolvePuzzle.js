import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-family: 'Pirata One', cursive;
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: #F4E1A0;
  text-shadow: 0 2px 16px rgba(244, 225, 160, 0.3);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #999;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const PrizeBox = styled(motion.div)`
  background: linear-gradient(135deg, #F4E1A0 0%, #D4AF37 100%);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(244, 225, 160, 0.3);
`;

const PrizeLabel = styled.div`
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PrizeAmount = styled.div`
  color: #1a1a1a;
  font-size: 3rem;
  font-weight: bold;
  font-family: 'Pirata One', cursive;
`;

const InstructionsBox = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const InstructionsTitle = styled.h3`
  color: #F4E1A0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: 'Pirata One', cursive;
`;

const InstructionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  color: #ccc;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 0.75rem;
  padding-left: 2rem;
  position: relative;
  
  &:before {
    content: '${props => props.$number}';
    position: absolute;
    left: 0;
    width: 24px;
    height: 24px;
    background: #F4E1A0;
    color: #1a1a1a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.85rem;
  }
`;

const PuzzleNFTs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
`;

const PuzzleNFTBadge = styled.span`
  background: rgba(244, 225, 160, 0.1);
  border: 1px solid #F4E1A0;
  color: #F4E1A0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
`;

const SubmissionForm = styled.form`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormLabel = styled.label`
  display: block;
  color: #F4E1A0;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  background: #0a0a0a;
  border: 2px solid #333;
  border-radius: 8px;
  color: #fff;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
    border-color: #F4E1A0;
    box-shadow: 0 0 0 3px rgba(244, 225, 160, 0.1);
  }
  
  &::placeholder {
    color: #666;
    text-transform: none;
    letter-spacing: normal;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.25rem;
  font-size: 1.3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #F4E1A0 0%, #D4AF37 100%);
  color: #1a1a1a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Pirata One', cursive;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(244, 225, 160, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(244, 225, 160, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultBox = styled(motion.div)`
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  background: ${props => props.$success ? 
    'linear-gradient(135deg, #06d6a0 0%, #02a676 100%)' : 
    'linear-gradient(135deg, #ef476f 0%, #d62839 100%)'
  };
  border: 2px solid ${props => props.$success ? '#06d6a0' : '#ef476f'};
`;

const ResultTitle = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`;

const ResultMessage = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: white;
`;

const HintBox = styled.div`
  background: rgba(244, 225, 160, 0.05);
  border: 1px dashed #F4E1A0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.6;
`;

export default function SolvePuzzle() {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [puzzleInfo, setPuzzleInfo] = useState(null);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  
  useEffect(() => {
    // Fetch puzzle info
    fetch(`${API_URL}/api/treasure-hunt/info/chapter1`)
      .then(res => res.json())
      .then(data => setPuzzleInfo(data))
      .catch(err => console.error('Error fetching puzzle info:', err));
  }, [API_URL]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      alert('Please enter your answer');
      return;
    }
    
    setIsSubmitting(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_URL}/api/treasure-hunt/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapter: 'chapter1',
          answer: answer.trim(),
          wallet_address: null // No auth required for testnet
        })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Success - keep answer visible
      } else {
        // Wrong answer - clear field for retry
        setTimeout(() => setAnswer(''), 2000);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setResult({
        success: false,
        message: 'Error submitting solution. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTryAgain = () => {
    setResult(null);
    setAnswer('');
  };
  
  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <Title>🏴‍☠️ Solve the Puzzle</Title>
          <Subtitle>
            {puzzleInfo?.title || 'Chapter 1: The Trail Begins'}
          </Subtitle>
          <Subtitle>
            Collect clues from puzzle NFTs and decode the location to claim your prize
          </Subtitle>
        </Header>
        
        <PrizeBox
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PrizeLabel>🏆 Prize Pool</PrizeLabel>
          <PrizeAmount>{puzzleInfo?.prize || '$750 USD'}</PrizeAmount>
          <div style={{ color: '#1a1a1a', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Testnet Reward
          </div>
        </PrizeBox>
        
        <InstructionsBox>
          <InstructionsTitle>How to Solve</InstructionsTitle>
          <InstructionsList>
            <InstructionItem $number="1">
              View NFTs in the Gallery Minted section
            </InstructionItem>
            <InstructionItem $number="2">
              Find the 4 puzzle NFTs (they have puzzle badges)
            </InstructionItem>
            <InstructionItem $number="3">
              Click each NFT to open the Layer Viewer
            </InstructionItem>
            <InstructionItem $number="4">
              Toggle the puzzle layers to reveal hidden clues
            </InstructionItem>
            <InstructionItem $number="5">
              Combine all clues to solve the cipher
            </InstructionItem>
            <InstructionItem $number="6">
              Enter your answer below and submit
            </InstructionItem>
          </InstructionsList>
          
          <PuzzleNFTs>
            <PuzzleNFTBadge>NFT #5</PuzzleNFTBadge>
            <PuzzleNFTBadge>NFT #12</PuzzleNFTBadge>
            <PuzzleNFTBadge>NFT #17</PuzzleNFTBadge>
            <PuzzleNFTBadge>NFT #20</PuzzleNFTBadge>
          </PuzzleNFTs>
        </InstructionsBox>
        
        {result && (
          <ResultBox
            $success={result.success}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResultTitle>
              {result.success ? '🎉 CONGRATULATIONS!' : '❌ Incorrect Answer'}
            </ResultTitle>
            <ResultMessage>
              {result.message}
            </ResultMessage>
            {result.success && result.prize && (
              <div style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                You won: {result.prize}
              </div>
            )}
            {!result.success && result.hint && (
              <HintBox>
                💡 Hint: {result.hint}
              </HintBox>
            )}
            {!result.success && (
              <motion.button
                onClick={handleTryAgain}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 2rem',
                  background: 'white',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            )}
          </ResultBox>
        )}
        
        <SubmissionForm onSubmit={handleSubmit}>
          <FormLabel htmlFor="answer">Your Answer:</FormLabel>
          <AnswerInput
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the location name..."
            disabled={isSubmitting || (result && result.success)}
            autoComplete="off"
          />
          
          <SubmitButton
            type="submit"
            disabled={isSubmitting || !answer.trim() || (result && result.success)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Checking...' : result && result.success ? '✓ Solved!' : 'Submit Answer'}
          </SubmitButton>
          
          <HintBox>
            💡 <strong>Hint:</strong> The answer is a location in Seychelles. You need all four puzzle NFTs
            to decode the cipher. Look for a decoding key, encrypted text, a map, and coordinates.
            <br /><br />
            <strong>Testnet Mode:</strong> Unlimited attempts. No wallet verification required.
          </HintBox>
        </SubmissionForm>
      </ContentWrapper>
    </PageContainer>
  );
}
