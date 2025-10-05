import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';

const CollectionPage = styled.div`
  min-height: 100vh;
  background: var(--bg-deep);
  padding: 100px 20px 40px;
`;

const Container = styled.div`
  max-width: 1400px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  margin: 0 auto;
`;
const CaptainImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;
  border: 3px solid var(--gold);
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  position: sticky;
  top: 120px;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--gold);
  margin-bottom: 16px;
  text-shadow: 2px 2px 8px rgba(212, 175, 55, 0.3);
`;

const Subtitle = styled.p`
  color: var(--text-dim);
  font-size: 1.1rem;
`;

const ProgressSection = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--gold);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '${props => props.icon}';
    font-size: 2.5rem;
  }
`;

const ProgressCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(18,22,28,0.9) 0%, rgba(25,30,38,0.9) 100%);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 40px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 20px;
  overflow: hidden;
  margin: 16px 0;
  position: relative;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, var(--gold) 0%, #b8860b 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  font-weight: 700;
  color: var(--bg-deep);
`;

const PieceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const PieceCard = styled.div`
  background: ${props => props.owned
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 134, 11, 0.2) 100%)'
    : 'rgba(18,22,28,0.5)'
  };
  border: 2px solid ${props => props.owned ? 'var(--gold)' : 'rgba(212, 175, 55, 0.1)'};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  position: relative;
  opacity: ${props => props.owned ? 1 : 0.5};
`;

const PieceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const PieceName = styled.h3`
  color: ${props => props.owned ? 'var(--gold)' : 'var(--text-dim)'};
  font-size: 1.1rem;
  margin: 0;
  text-transform: capitalize;
`;

const PieceStatus = styled.p`
  color: var(--text-dim);
  font-size: 0.9rem;
  margin: 8px 0 0;
`;

const RarityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const RarityCard = styled.div`
  background: linear-gradient(135deg, rgba(18,22,28,0.9) 0%, rgba(25,30,38,0.9) 100%);
  border: 2px solid ${props => {
    switch(props.rarity) {
      case 'Epic': return '#8B00FF';
      case 'Rare': return '#FFD700';
      case 'Uncommon': return '#00CED1';
      case 'Common': return '#808080';
      default: return 'rgba(212, 175, 55, 0.2)';
    }
  }};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const RarityName = styled.h3`
  color: ${props => {
    switch(props.rarity) {
      case 'Epic': return '#8B00FF';
      case 'Rare': return '#FFD700';
      case 'Uncommon': return '#00CED1';
      case 'Common': return '#808080';
      default: return 'var(--gold)';
    }
  }};
  font-size: 1.3rem;
  margin: 0 0 12px;
`;

const RarityCount = styled.p`
  color: var(--text-dim);
  font-size: 1.1rem;
  margin: 0;
`;

const RewardBanner = styled(motion.div)`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 134, 11, 0.2) 100%);
  border: 2px solid var(--gold);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin-top: 24px;
`;

const RewardText = styled.p`
  color: var(--gold);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;

  span {
    font-size: 2rem;
    display: block;
    margin-top: 8px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--text-dim);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const MyCollection = () => {
  const { address, connected } = useWallet();
  const [puzzleProgress, setPuzzleProgress] = useState(null);
  const [rarityProgress, setRarityProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && address) {
      fetchProgress();
    }
  }, [connected, address]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const [puzzleRes, rarityRes] = await Promise.all([
        fetch(`http://localhost:3001/api/progress/puzzle?wallet_address=${address}`),
        fetch(`http://localhost:3001/api/progress/rarity?wallet_address=${address}`)
      ]);

      const puzzleData = await puzzleRes.json();
      const rarityData = await rarityRes.json();

      setPuzzleProgress(puzzleData);
      setRarityProgress(rarityData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to fetch collection progress');
    } finally {
      setLoading(false);
    }
  };


  const pieceIcons = {
    cipher: '🔐',
    map: '🗺️',
    key: '🔑',
    coordinates: '🧭'
  };

  return (
    <CollectionPage>
      <Container>
        <CaptainImage src="/images/incoming_captain.jpg" alt="Pirate Captain" />

        <ContentWrapper>
          <Header>
            <Title>My Collection</Title>
            <Subtitle>Track your treasure hunt progress</Subtitle>
          </Header>

          {loading ? (
            <EmptyState>
              <EmptyIcon>⏳</EmptyIcon>
              <p>Loading your collection...</p>
            </EmptyState>
          ) : (
            <>
              {/* Puzzle Progress */}
              <ProgressSection>
              <SectionTitle icon="🧩">Puzzle Progress</SectionTitle>
              <ProgressCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 style={{color: 'var(--gold)', marginTop: 0}}>
                  {puzzleProgress?.chapter || 'Chapter 1'}
                </h3>
                <ProgressBar>
                  <ProgressFill
                    initial={{ width: 0 }}
                    animate={{ width: `${puzzleProgress?.progress.percentage || 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    {puzzleProgress?.progress.percentage || 0}%
                  </ProgressFill>
                </ProgressBar>
                <p style={{color: 'var(--text-dim)', margin: '8px 0'}}>
                  {puzzleProgress?.progress.owned || 0} / {puzzleProgress?.progress.total || 4} pieces collected
                </p>

                <PieceGrid>
                  {Object.entries(pieceIcons).map(([type, icon]) => {
                    const piece = puzzleProgress?.pieces?.[type];
                    return (
                      <PieceCard key={type} owned={!!piece}>
                        <PieceIcon>{icon}</PieceIcon>
                        <PieceName owned={!!piece}>{type}</PieceName>
                        <PieceStatus>
                          {piece ? `✓ ${piece.name}` : '✗ Not collected'}
                        </PieceStatus>
                      </PieceCard>
                    );
                  })}
                </PieceGrid>

                {puzzleProgress?.progress.can_submit && (
                  <RewardBanner
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RewardText>
                      🎉 All pieces collected!
                      <span>You can now submit your solution for $750 prize!</span>
                    </RewardText>
                  </RewardBanner>
                )}
              </ProgressCard>
            </ProgressSection>

            {/* Rarity Collection */}
            <ProgressSection>
              <SectionTitle icon="💎">Rarity Collection</SectionTitle>
              <ProgressCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 style={{color: 'var(--gold)', marginTop: 0}}>
                  {rarityProgress?.chapter || 'Chapter 1'}
                </h3>
                <ProgressBar>
                  <ProgressFill
                    initial={{ width: 0 }}
                    animate={{ width: `${rarityProgress?.progress.percentage || 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  >
                    {rarityProgress?.progress.percentage || 0}%
                  </ProgressFill>
                </ProgressBar>
                <p style={{color: 'var(--text-dim)', margin: '8px 0'}}>
                  {rarityProgress?.progress.owned_rarities || 0} / {rarityProgress?.progress.total_rarities || 4} rarities collected
                </p>

                <RarityGrid>
                  {['Common', 'Uncommon', 'Rare', 'Epic'].map((rarity) => {
                    const count = rarityProgress?.collection?.[rarity]?.length || 0;
                    return (
                      <RarityCard key={rarity} rarity={rarity}>
                        <RarityName rarity={rarity}>{rarity}</RarityName>
                        <RarityCount>
                          {count > 0 ? `✓ ${count} owned` : '✗ None owned'}
                        </RarityCount>
                      </RarityCard>
                    );
                  })}
                </RarityGrid>

                {rarityProgress?.progress.can_claim_reward && (
                  <RewardBanner
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RewardText>
                      🏆 Complete rarity set!
                      <span>{rarityProgress.progress.reward}</span>
                    </RewardText>
                  </RewardBanner>
                )}
              </ProgressCard>
            </ProgressSection>
          </>
        )}
        </ContentWrapper>
      </Container>
    </CollectionPage>
  );
};

export default MyCollection;
