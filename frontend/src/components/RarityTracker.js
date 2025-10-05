import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TrackerContainer = styled(motion.div)`
  background: rgba(20, 25, 35, 0.95);
  border: 1px solid rgba(217, 180, 91, 0.35);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const TrackerTitle = styled.h3`
  font-family: 'Pirata One', cursive;
  font-size: 1.8rem;
  color: #F4E1A0;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 12px rgba(244, 225, 160, 0.3);
`;

const RarityRow = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RarityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RarityLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.$color};
`;

const RarityIcon = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${props => props.$color};
  display: inline-block;
  box-shadow: 0 2px 8px ${props => props.$color}66;
`;

const RarityCount = styled.div`
  font-size: 1rem;
  color: #ccc;
  font-weight: 600;

  span {
    color: ${props => props.$color};
    font-weight: bold;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProgressBarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.$color}, ${props => props.$color}dd);
  border-radius: 6px;
  box-shadow: 0 0 12px ${props => props.$color}88;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const CompletionBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #F4E1A0 0%, #D4AF37 100%);
  color: #1a1a1a;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 1rem;
  box-shadow: 0 4px 16px rgba(244, 225, 160, 0.4);

  &:not(:first-of-type) {
    margin-top: 0.5rem;
  }
`;

const CompletionSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(217, 180, 91, 0.25);
  text-align: center;
`;

const CompletionTitle = styled.h4`
  font-family: 'Pirata One', cursive;
  color: #F4E1A0;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const BonusGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const RARITY_CONFIG = {
  'Epic': {
    color: '#9d4edd',
    total: 2,
    bonus: '$500'
  },
  'Rare': {
    color: '#3a86ff',
    total: 4,
    bonus: '$200'
  },
  'Uncommon': {
    color: '#06d6a0',
    total: 6,
    bonus: '$100'
  },
  'Common': {
    color: '#8d99ae',
    total: 8,
    bonus: null
  }
};

export default function RarityTracker({ nfts = [] }) {
  const rarityProgress = useMemo(() => {
    const counts = {
      'Epic': 0,
      'Rare': 0,
      'Uncommon': 0,
      'Common': 0
    };

    nfts.forEach(nft => {
      const rarity = nft.art_rarity || nft.rarity;
      if (counts.hasOwnProperty(rarity)) {
        counts[rarity]++;
      }
    });

    return counts;
  }, [nfts]);

  const completedSets = useMemo(() => {
    const completed = [];
    Object.entries(RARITY_CONFIG).forEach(([rarity, config]) => {
      if (rarityProgress[rarity] >= config.total && config.bonus) {
        completed.push({ rarity, ...config });
      }
    });

    // Check for complete collection
    const hasAllNFTs = Object.entries(RARITY_CONFIG).every(
      ([rarity, config]) => rarityProgress[rarity] >= config.total
    );

    if (hasAllNFTs) {
      completed.push({
        rarity: 'Complete Set',
        color: '#FFD700',
        bonus: '$1,000',
        isComplete: true
      });
    }

    return completed;
  }, [rarityProgress]);

  const totalCollected = useMemo(() => {
    return Object.values(rarityProgress).reduce((sum, count) => sum + count, 0);
  }, [rarityProgress]);

  const totalNFTs = Object.values(RARITY_CONFIG).reduce((sum, config) => sum + config.total, 0);

  return (
    <TrackerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TrackerTitle>🏴‍☠️ Your Collection Progress</TrackerTitle>

      <div style={{ marginBottom: '2rem', textAlign: 'center', color: '#ccc' }}>
        <span style={{ fontSize: '1.5rem', color: '#F4E1A0', fontWeight: 'bold' }}>
          {totalCollected} / {totalNFTs}
        </span>
        {' '}NFTs Collected
      </div>

      {Object.entries(RARITY_CONFIG).map(([rarity, config]) => {
        const collected = rarityProgress[rarity];
        const progress = Math.min((collected / config.total) * 100, 100);
        const isComplete = collected >= config.total;

        return (
          <RarityRow key={rarity}>
            <RarityHeader>
              <RarityLabel $color={config.color}>
                <RarityIcon $color={config.color} />
                {rarity}
              </RarityLabel>
              <RarityCount $color={config.color}>
                <span>{collected}</span> / {config.total}
                {isComplete && ' ✓'}
              </RarityCount>
            </RarityHeader>
            <ProgressBarContainer>
              <ProgressBarFill
                $color={config.color}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </ProgressBarContainer>
          </RarityRow>
        );
      })}

      {completedSets.length > 0 && (
        <CompletionSection>
          <CompletionTitle>🎉 Completed Sets & Bonuses</CompletionTitle>
          <BonusGrid>
            {completedSets.map((set, index) => (
              <CompletionBadge
                key={set.rarity}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, type: 'spring' }}
              >
                {set.isComplete ? '👑' : '⭐'} {set.rarity} Set Complete - Bonus: {set.bonus}
              </CompletionBadge>
            ))}
          </BonusGrid>
        </CompletionSection>
      )}
    </TrackerContainer>
  );
}
