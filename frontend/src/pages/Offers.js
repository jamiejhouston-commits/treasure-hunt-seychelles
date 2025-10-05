import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import toast from 'react-hot-toast';

const OffersPage = styled.div`
  min-height: 100vh;
  background: var(--bg-deep);
  padding: 100px 20px 40px;
`;

const Container = styled.div`
  max-width: 1200px;
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
  font-size: 1.1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
`;

const Tab = styled.button`
  background: ${props => props.active ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  border: none;
  color: ${props => props.active ? 'var(--gold)' : 'var(--text-dim)'};
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? 'var(--gold)' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: var(--gold);
    background: rgba(212, 175, 55, 0.05);
  }
`;

const OffersList = styled.div`
  display: grid;
  gap: 24px;
`;

const OfferCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(18,22,28,0.9) 0%, rgba(25,30,38,0.9) 100%);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 24px;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const NFTImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid rgba(212, 175, 55, 0.3);
`;

const OfferInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NFTName = styled.h3`
  color: var(--gold);
  font-size: 1.3rem;
  margin: 0;
`;

const OfferDetail = styled.p`
  color: var(--text-dim);
  margin: 0;
  font-size: 0.95rem;
`;

const WalletAddress = styled.span`
  color: var(--gold);
  font-family: monospace;
  font-size: 0.9rem;
`;

const OfferType = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: rgba(212, 175, 55, 0.15);
  color: var(--gold);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const OfferActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.primary ? `
    background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
    color: var(--bg-deep);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
    }
  ` : `
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: var(--gold);

    &:hover {
      background: rgba(212, 175, 55, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const Offers = () => {
  const { address, connected } = useWallet();
  const [activeTab, setActiveTab] = useState('received');
  const [offersReceived, setOffersReceived] = useState([]);
  const [offersSent, setOffersSent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && address) {
      fetchOffers();
    }
  }, [connected, address, activeTab]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'received'
        ? `/api/trading/offers-received?wallet_address=${address}`
        : `/api/trading/offers-sent?wallet_address=${address}`;

      const response = await fetch(`http://localhost:3001${endpoint}`);
      const data = await response.json();

      if (activeTab === 'received') {
        setOffersReceived(data.offers || []);
      } else {
        setOffersSent(data.offers || []);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/trading/accept-offer/${offerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Offer accepted! NFT transferred.');
        fetchOffers();
      } else {
        toast.error(data.error || 'Failed to accept offer');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      toast.error('Failed to accept offer');
    }
  };

  const handleDeclineOffer = async (offerId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/trading/decline-offer/${offerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Offer declined');
        fetchOffers();
      } else {
        toast.error(data.error || 'Failed to decline offer');
      }
    } catch (error) {
      console.error('Error declining offer:', error);
      toast.error('Failed to decline offer');
    }
  };

  if (!connected) {
    return (
      <OffersPage>
        <Container>
          <EmptyState>
            <EmptyIcon>🔒</EmptyIcon>
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to view your offers</p>
          </EmptyState>
        </Container>
      </OffersPage>
    );
  }

  const offers = activeTab === 'received' ? offersReceived : offersSent;

  return (
    <OffersPage>
      <Container>
        <Header>
          <Title>Trading Offers</Title>
          <Subtitle>Manage your NFT trade offers</Subtitle>
        </Header>

        <TabContainer>
          <Tab
            active={activeTab === 'received'}
            onClick={() => setActiveTab('received')}
          >
            Offers Received ({offersReceived.length})
          </Tab>
          <Tab
            active={activeTab === 'sent'}
            onClick={() => setActiveTab('sent')}
          >
            Offers Sent ({offersSent.length})
          </Tab>
        </TabContainer>

        {loading ? (
          <EmptyState>
            <EmptyIcon>⏳</EmptyIcon>
            <p>Loading offers...</p>
          </EmptyState>
        ) : offers.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <h2>No Offers</h2>
            <p>
              {activeTab === 'received'
                ? "You haven't received any offers yet"
                : "You haven't sent any offers yet"}
            </p>
          </EmptyState>
        ) : (
          <OffersList>
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NFTImage
                  src={offer.nft?.image_uri || '/placeholder-nft.png'}
                  alt={offer.nft?.name}
                />

                <OfferInfo>
                  <NFTName>{offer.nft?.name}</NFTName>
                  <OfferDetail>
                    Rarity: <strong>{offer.nft?.rarity}</strong>
                  </OfferDetail>
                  <OfferDetail>
                    {activeTab === 'received' ? 'From' : 'To'}: {' '}
                    <WalletAddress>
                      {activeTab === 'received' ? offer.from_wallet : offer.to_wallet}
                    </WalletAddress>
                  </OfferDetail>
                  <div>
                    <OfferType>{offer.offer_type}</OfferType>
                    {offer.xrp_amount > 0 && (
                      <OfferDetail style={{marginTop: '8px'}}>
                        Amount: {offer.xrp_amount} XRP
                      </OfferDetail>
                    )}
                    {offer.trade_nft_token_id && (
                      <OfferDetail style={{marginTop: '8px'}}>
                        Trade NFT: {offer.tradeNFT?.name}
                      </OfferDetail>
                    )}
                  </div>
                  {offer.message && (
                    <OfferDetail style={{fontStyle: 'italic'}}>
                      "{offer.message}"
                    </OfferDetail>
                  )}
                </OfferInfo>

                {activeTab === 'received' && offer.status === 'pending' && (
                  <OfferActions>
                    <ActionButton
                      primary
                      onClick={() => handleAcceptOffer(offer.id)}
                    >
                      Accept
                    </ActionButton>
                    <ActionButton onClick={() => handleDeclineOffer(offer.id)}>
                      Decline
                    </ActionButton>
                  </OfferActions>
                )}

                {activeTab === 'sent' && (
                  <OfferActions>
                    <OfferDetail>
                      Status: <strong>{offer.status}</strong>
                    </OfferDetail>
                  </OfferActions>
                )}
              </OfferCard>
            ))}
          </OffersList>
        )}
      </Container>
    </OffersPage>
  );
};

export default Offers;
