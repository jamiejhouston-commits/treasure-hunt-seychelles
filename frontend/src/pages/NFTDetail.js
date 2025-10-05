import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNFT } from '../contexts/NFTContext';
import { useWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NFTDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const NFTImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  color: ${props => props.theme.colors.primary};
  border: 2px solid #333333;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageButton = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const InfoSection = styled.div``;

const NFTHeader = styled.div`
  margin-bottom: 2rem;
`;

const NFTTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const NFTSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.2rem;
  line-height: 1.6;
`;

const NFTMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const MetaLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const MetaValue = styled.div`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 1.1rem;
`;

const RarityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => {
    const rarityColors = {
      Common: 'rgba(100, 100, 100, 0.2)',
      Uncommon: 'rgba(34, 197, 94, 0.2)',
      Rare: 'rgba(59, 130, 246, 0.2)',
      Epic: 'rgba(168, 85, 247, 0.2)',
      Legendary: 'rgba(234, 179, 8, 0.2)'
    };
    return rarityColors[props.rarity] || 'rgba(100, 100, 100, 0.2)';
  }};
  color: ${props => {
    const rarityColors = {
      Common: '#666666',
      Uncommon: '#22c55e',
      Rare: '#3b82f6',
      Epic: '#a855f7',
      Legendary: '#eab308'
    };
    return rarityColors[props.rarity] || '#666666';
  }};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
`;

const PriceSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CurrentPrice = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PriceLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PriceValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  font-family: 'Cinzel', serif;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #d4af37 0%, #f5d976 100%);
    color: #000000;
    border: none;
    
    &:hover {
      background: linear-gradient(135deg, #f5d976 0%, #d4af37 100%);
      transform: translateY(-2px);
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary};
      color: #000000;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AttributesSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AttributeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const AttributeCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const AttributeName = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const AttributeValue = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const ClueSection = styled.div`
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ClueText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.error};
`;

const OfferModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
`;

const OfferModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
`;

const OfferForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OfferInput = styled.input`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

function NFTDetail() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { fetchNFT, createOffer, acceptOffer } = useNFT();
  const { isConnected, address, submitTransaction } = useWallet();
  
  const [nft, setNFT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  useEffect(() => {
    const loadNFT = async () => {
      try {
        setLoading(true);
        const nftData = await fetchNFT(tokenId);
        setNFT(nftData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      loadNFT();
    }
  }, [tokenId, fetchNFT]);

  const handleMakeOffer = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }

    try {
      setSubmittingOffer(true);
      
      // Create the offer transaction
      const offerTx = {
        TransactionType: 'NFTokenCreateOffer',
        Account: address,
        NFTokenID: tokenId,
        Amount: (parseFloat(offerAmount) * 1000000).toString(), // Convert XRP to drops
        Flags: 1 // Buy offer
      };

      // Submit through wallet
      const result = await submitTransaction(offerTx);
      
      if (result.success) {
        // Store offer in backend
        await createOffer({
          tokenId: tokenId,
          offerAmount: parseFloat(offerAmount),
          buyerAddress: address,
          txHash: result.txid
        });
        
        setShowOfferModal(false);
        setOfferAmount('');
        toast.success('Offer created successfully!');
      }
    } catch (error) {
      console.error('Failed to create offer:', error);
      toast.error(`Failed to create offer: ${error.message}`);
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await acceptOffer(offerId);
      toast.success('Offer accepted!');
      // Reload NFT data
      const nftData = await fetchNFT(tokenId);
      setNFT(nftData);
    } catch (error) {
      toast.error(`Failed to accept offer: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingState>Loading NFT details...</LoadingState>
      </DetailContainer>
    );
  }

  if (error) {
    return (
      <DetailContainer>
        <ErrorState>
          <h2>Error Loading NFT</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/gallery')}>
            Back to Gallery
          </button>
        </ErrorState>
      </DetailContainer>
    );
  }

  if (!nft) {
    return (
      <DetailContainer>
        <ErrorState>
          <h2>NFT Not Found</h2>
          <p>The requested NFT could not be found.</p>
          <button onClick={() => navigate('/gallery')}>
            Back to Gallery
          </button>
        </ErrorState>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton to="/gallery">
        ← Back to Gallery
      </BackButton>

      <NFTDetailGrid>
        <ImageSection>
          <NFTImage>
            {nft.metadata?.image ? (
              <img 
                src={nft.metadata.image}
                alt={nft.metadata?.name || `Clue #${nft.sequence}`}
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.dataset.fallback !== 'done') {
                    el.dataset.fallback = 'done';
                    el.src = `http://localhost:3001/real/images/${nft.sequence}.png?v=${Date.now()}`;
                  } else {
                    el.style.display = 'none';
                  }
                }}
              />
            ) : (
              '🗺️'
            )}
          </NFTImage>
          
          <ImageControls>
            <ImageButton>🔍 View Full Size</ImageButton>
            <ImageButton>📥 Download</ImageButton>
          </ImageControls>
        </ImageSection>

        <InfoSection>
          <NFTHeader>
            <NFTTitle>{nft.metadata?.name || `Treasure Clue #${nft.sequence}`}</NFTTitle>
            <NFTSubtitle>
              {nft.metadata?.description || 'A mysterious clue leading to the legendary treasure of Olivier Levasseur.'}
            </NFTSubtitle>
          </NFTHeader>

          <NFTMeta>
            <MetaItem>
              <MetaLabel>Token ID</MetaLabel>
              <MetaValue>#{nft.sequence}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Rarity</MetaLabel>
              <MetaValue>
                <RarityBadge rarity={nft.rarity}>
                  ✨ {nft.rarity}
                </RarityBadge>
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Owner</MetaLabel>
              <MetaValue>
                {(() => {
                  const isChapterVIMinted = nft.sequence >= 6001 && nft.sequence <= 6020; // fallback temporary
                  const isMinted = !!nft.nftokenId || nft.status === 'minted' || isChapterVIMinted;
                  if (nft.currentOwner) return `${nft.currentOwner.slice(0, 6)}...${nft.currentOwner.slice(-4)}`;
                  return isMinted ? 'Minted' : 'Unminted';
                })()}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Status</MetaLabel>
              <MetaValue>
                {(() => {
                  const isChapterVIMinted = nft.sequence >= 6001 && nft.sequence <= 6020; // fallback temporary
                  const isMinted = !!nft.nftokenId || nft.status === 'minted' || isChapterVIMinted;
                  if (nft.for_sale) return 'Available';
                  if (nft.currentOwner) return 'Sold';
                  return isMinted ? 'Minted' : 'Unminted';
                })()}
              </MetaValue>
            </MetaItem>
          </NFTMeta>

          {nft.currentOffer && (
            <PriceSection>
              <CurrentPrice>
                <PriceLabel>Current Price</PriceLabel>
                <PriceValue>{nft.currentOffer.amount} XRP</PriceValue>
              </CurrentPrice>
              
              <ActionButtons>
                {nft.currentOwner === address ? (
                  <ActionButton primary disabled>
                    You Own This NFT
                  </ActionButton>
                ) : (
                  <>
                    <ActionButton
                      primary
                      onClick={() => handleAcceptOffer(nft.currentOffer.id)}
                    >
                      💰 Buy Now
                    </ActionButton>
                    <ActionButton
                      onClick={() => setShowOfferModal(true)}
                    >
                      🤝 Make Offer
                    </ActionButton>
                  </>
                )}
              </ActionButtons>
            </PriceSection>
          )}

          {nft.clue && (
            <ClueSection>
              <SectionTitle>🧩 Cryptographic Clue</SectionTitle>
              <ClueText>{nft.clue}</ClueText>
            </ClueSection>
          )}

          {nft.attributes && nft.attributes.length > 0 && (
            <AttributesSection>
              <SectionTitle>📊 Attributes</SectionTitle>
              <AttributeGrid>
                {nft.attributes.map((attr, index) => (
                  <AttributeCard key={index}>
                    <AttributeName>{attr.trait_type}</AttributeName>
                    <AttributeValue>{attr.value}</AttributeValue>
                  </AttributeCard>
                ))}
              </AttributeGrid>
            </AttributesSection>
          )}
        </InfoSection>
      </NFTDetailGrid>

      {/* Offer Modal */}
      {showOfferModal && (
        <OfferModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setShowOfferModal(false)}
        >
          <OfferModalContent>
            <h3 style={{ color: '#d4af37', marginBottom: '1rem' }}>
              Make an Offer
            </h3>
            <OfferForm onSubmit={handleMakeOffer}>
              <OfferInput
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Offer amount in XRP"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                required
              />
              <ActionButtons>
                <ActionButton
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="submit"
                  primary
                  disabled={submittingOffer}
                >
                  {submittingOffer ? 'Submitting...' : 'Submit Offer'}
                </ActionButton>
              </ActionButtons>
            </OfferForm>
          </OfferModalContent>
        </OfferModal>
      )}
    </DetailContainer>
  );
}

export default NFTDetail;