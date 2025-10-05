import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const NotFoundContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const NotFoundContent = styled(motion.div)`
  max-width: 600px;
`;

const NotFoundIcon = styled.div`
  font-size: 8rem;
  margin-bottom: 2rem;
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const NotFoundTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: clamp(3rem, 8vw, 6rem);
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  animation: ${shake} 0.5s ease-in-out;
`;

const NotFoundSubtitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  font-family: 'Cinzel', serif;
`;

const NotFoundMessage = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 3rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #d4af37 0%, #f5d976 100%);
    color: #000000;
    
    &:hover {
      background: linear-gradient(135deg, #f5d976 0%, #d4af37 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
      text-decoration: none;
      color: #000000;
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary};
      color: #000000;
      transform: translateY(-2px);
      text-decoration: none;
    }
  `}
`;

const TreasureHint = styled(motion.div)`
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const HintTitle = styled.h4`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Cinzel', serif;
`;

const HintText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  font-style: italic;
`;

const ErrorCode = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.5;
  
  @media (max-width: 768px) {
    position: static;
    margin-top: 2rem;
  }
`;

function NotFound() {
  const treasureHints = [
    "Not all who wander are lost, but this page certainly is...",
    "Even the greatest pirates sometimes sail off course.",
    "Perhaps this URL is as mysterious as La Buse's cryptogram?",
    "The treasure you seek is not on this page, but the journey continues...",
    "404 - A number even more elusive than Levasseur's coordinates."
  ];

  const randomHint = treasureHints[Math.floor(Math.random() * treasureHints.length)];

  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ErrorCode>Error: HTTP 404</ErrorCode>
        
        <NotFoundIcon>🏴‍☠️</NotFoundIcon>
        
        <NotFoundTitle>404</NotFoundTitle>
        
        <NotFoundSubtitle>Treasure Not Found</NotFoundSubtitle>
        
        <NotFoundMessage>
          Ahoy! It seems you've sailed into uncharted waters. The page you're looking for 
          has vanished like Olivier Levasseur's legendary treasure - but unlike his gold, 
          we can help you find your way back to familiar shores.
        </NotFoundMessage>
        
        <ActionButtons>
          <ActionButton to="/" primary>
            🏠 Return Home
          </ActionButton>
          <ActionButton to="/gallery">
            🎨 View Gallery
          </ActionButton>
          <ActionButton to="/puzzle">
            🧩 Solve Puzzle
          </ActionButton>
        </ActionButtons>
        
        <TreasureHint
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <HintTitle>
            💡 Pirate's Wisdom
          </HintTitle>
          <HintText>
            "{randomHint}"
          </HintText>
        </TreasureHint>
      </NotFoundContent>
    </NotFoundContainer>
  );
}

export default NotFound;