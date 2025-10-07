import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { useNFT } from '../contexts/NFTContext';
import toast from 'react-hot-toast';

const MarketplacePage = styled.div`
  min-height: 100vh;
  background: var(--bg-deep);
  padding: 100px 20px 40px;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const InfoSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 80px;
  text-align: center;
`;

const InfoHeadline = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--gold);
  margin-bottom: 16px;
  line-height: 1.2;
`;

const InfoSubtitle = styled.p`
  color: var(--text-dim);
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto 48px;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
`;

const FeatureCard = styled.div`
  background: linear-gradient(135deg, rgba(18,22,28,0.9) 0%, rgba(25,30,38,0.9) 100%);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 32px 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--gold);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.2);
  }
`;

const FeatureTitle = styled.h3`
  color: var(--gold);
  font-size: 1.5rem;
  margin: 0 0 12px;
  font-weight: 700;
`;

const FeatureText = styled.p`
  color: var(--text-dim);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const HowItWorksSection = styled.div`
  background: linear-gradient(135deg, rgba(18,22,28,0.6) 0%, rgba(25,30,38,0.6) 100%);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const HowItWorksTitle = styled.h3`
  color: var(--gold);
  font-size: 1.8rem;
  margin: 0 0 24px;
  font-weight: 700;
  text-align: center;
`;

const StepsList = styled.ol`
  list-style: none;
  counter-reset: step-counter;
  padding: 0;
  margin: 0 0 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Step = styled.li`
  counter-increment: step-counter;
  position: relative;
  padding-left: 50px;
  margin-bottom: 20px;
  color: var(--text-dim);
  font-size: 1.1rem;
  line-height: 1.6;

  &::before {
    content: counter(step-counter);
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    height: 32px;
    background: var(--gold);
    color: var(--bg-deep);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const MysteryNote = styled.p`
  color: var(--gold);
  font-style: italic;
  font-size: 1.1rem;
  margin: 24px 0 0;
  text-align: center;
`;

const StartBrowsingButton = styled.a`
  display: inline-block;
  background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
  color: var(--bg-deep);
  padding: 16px 48px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
  }
`;

const PriceTag = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(184, 134, 11, 0.2) 100%);
  border: 2px solid var(--gold);
  border-radius: 12px;
  padding: 12px 24px;
  margin-top: 16px;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gold);
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, var(--gold) 0%, #b8860b 100%)' : 'transparent'};
  color: ${props => props.active ? 'var(--bg-deep)' : 'var(--gold)'};
  border: 2px solid var(--gold);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
    color: var(--bg-deep);
    transform: translateY(-2px);
  }
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 40px;
`;

const NFTCard = styled(motion.div)`
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
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.5);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const NFTInfo = styled.div`
  padding: 20px;
`;

const NFTName = styled.h3`
  color: var(--gold);
  font-size: 1.3rem;
  margin: 0 0 12px;
`;

const NFTRarity = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: ${props => {
    switch(props.rarity) {
      case 'Epic': return 'rgba(139, 0, 255, 0.2)';
      case 'Rare': return 'rgba(255, 215, 0, 0.2)';
      case 'Uncommon': return 'rgba(0, 206, 209, 0.2)';
      case 'Common': return 'rgba(128, 128, 128, 0.2)';
      default: return 'rgba(212, 175, 55, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.rarity) {
      case 'Epic': return '#8B00FF';
      case 'Rare': return '#FFD700';
      case 'Uncommon': return '#00CED1';
      case 'Common': return '#808080';
      default: return 'var(--gold)';
    }
  }};
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const NFTDetail = styled.p`
  color: var(--text-dim);
  font-size: 0.9rem;
  margin: 8px 0;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gold);
`;

const BuyButton = styled.button`
  background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
  color: var(--bg-deep);
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(212, 175, 55, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SoldBadge = styled.div`
  background: rgba(139, 0, 0, 0.3);
  color: #ff6b6b;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: var(--text-dim);
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: var(--text-dim);
`;

const Marketplace = () => {
  const { address, connected } = useWallet();
  const { nfts, loading } = useNFT();
  const [filter, setFilter] = useState('all');
  const [purchasing, setPurchasing] = useState(null);

  const PRICE_PER_NFT = 200; // $200 per NFT
  const CREATOR_WALLET = 'rLUEXYuLiQptky37CqLcm9USQpPiz5rkpD'; // Your wallet

  const handlePurchase = async (nft) => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (nft.current_owner) {
      toast.error('This NFT is already sold');
      return;
    }

    setPurchasing(nft.token_id);

    try {
      // In a real implementation, this would:
      // 1. Create XRPL payment transaction of $200 worth of XRP
      // 2. Transfer NFT to buyer
      // 3. Update database with new owner

      const response = await fetch('http://localhost:3001/api/marketplace/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nft_token_id: nft.token_id,
          buyer_wallet: address,
          seller_wallet: CREATOR_WALLET,
          price_xrp: PRICE_PER_NFT
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Successfully purchased ${nft.name}!`);
        // Refresh NFT list
        window.location.reload();
      } else {
        toast.error(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    if (filter === 'all') return true;
    if (filter === 'available') return !nft.current_owner;
    if (filter === 'sold') return !!nft.current_owner;
    return nft.rarity === filter;
  });

  return (
    <MarketplacePage>
      <Container>
        <Header>
          <Title>Treasure Marketplace</Title>
          <Subtitle>
            Purchase exclusive La Buse treasure NFTs. Unique Seychellois artwork with hidden puzzles and real rewards.
          </Subtitle>
          <PriceTag>$200 per NFT</PriceTag>
        </Header>

        <InfoSection>
          <InfoHeadline>Seychellois Art. Hidden Puzzles. Real Prizes.</InfoHeadline>
          <InfoSubtitle>
            Each NFT is unique artwork generated from authentic Seychellois paintings.
            Select pieces contain hidden layers with encrypted puzzles leading to actual rewards.
          </InfoSubtitle>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureTitle>Collectible Art</FeatureTitle>
              <FeatureText>
                Unique digital artwork trained on genuine Seychellois master paintings.
                Choose the piece you want.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureTitle>Hidden Layers</FeatureTitle>
              <FeatureText>
                Some NFTs contain encrypted puzzle layers beneath the surface.
                Only discoverable after purchase when you connect your wallet.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureTitle>Real Prizes</FeatureTitle>
              <FeatureText>
                Solve the puzzles, win cash rewards. Prizes increase with each chapter.
              </FeatureText>
            </FeatureCard>
          </FeaturesGrid>

          <HowItWorksSection>
            <HowItWorksTitle>How It Works</HowItWorksTitle>
            <StepsList>
              <Step>Browse the gallery below</Step>
              <Step>Choose the artwork you want</Step>
              <Step>Connect your wallet</Step>
              <Step>Click "Mint" - the NFT is yours</Step>
              <Step>Check if it has hidden puzzle layers</Step>
            </StepsList>
            <MysteryNote>Not all NFTs contain puzzles. The mystery is part of the hunt.</MysteryNote>
          </HowItWorksSection>

          <StartBrowsingButton href="#nft-gallery">
            START BROWSING ↓
          </StartBrowsingButton>
        </InfoSection>

        <FilterSection id="nft-gallery">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All NFTs
          </FilterButton>
          <FilterButton active={filter === 'available'} onClick={() => setFilter('available')}>
            Available
          </FilterButton>
          <FilterButton active={filter === 'sold'} onClick={() => setFilter('sold')}>
            Sold
          </FilterButton>
          <FilterButton active={filter === 'Common'} onClick={() => setFilter('Common')}>
            Common
          </FilterButton>
          <FilterButton active={filter === 'Uncommon'} onClick={() => setFilter('Uncommon')}>
            Uncommon
          </FilterButton>
          <FilterButton active={filter === 'Rare'} onClick={() => setFilter('Rare')}>
            Rare
          </FilterButton>
          <FilterButton active={filter === 'Epic'} onClick={() => setFilter('Epic')}>
            Epic
          </FilterButton>
        </FilterSection>

        {loading ? (
          <LoadingState>🏴‍☠️ Loading treasure...</LoadingState>
        ) : filteredNFTs.length === 0 ? (
          <EmptyState>
            <h2>No NFTs Found</h2>
            <p>Try a different filter</p>
          </EmptyState>
        ) : (
          <NFTGrid>
            {filteredNFTs.map((nft) => (
              <NFTCard
                key={nft.token_id}
                rarity={nft.rarity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NFTImage
                  src={nft.image_uri || '/placeholder-nft.png'}
                  alt={nft.name}
                />
                <NFTInfo>
                  <NFTName>{nft.name}</NFTName>
                  <NFTRarity rarity={nft.rarity}>{nft.rarity}</NFTRarity>
                  <NFTDetail>Token ID: #{nft.token_id}</NFTDetail>
                  <NFTDetail>Chapter: {nft.chapter}</NFTDetail>

                  <PriceSection>
                    <Price>${PRICE_PER_NFT}</Price>
                    {nft.current_owner ? (
                      <SoldBadge>Sold</SoldBadge>
                    ) : (
                      <BuyButton
                        onClick={() => handlePurchase(nft)}
                        disabled={!connected || purchasing === nft.token_id}
                      >
                        {purchasing === nft.token_id ? 'Purchasing...' : 'Buy Now'}
                      </BuyButton>
                    )}
                  </PriceSection>
                </NFTInfo>
              </NFTCard>
            ))}
          </NFTGrid>
        )}
      </Container>
    </MarketplacePage>
  );
};

export default Marketplace;
