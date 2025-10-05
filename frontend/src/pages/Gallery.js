import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNFT } from '../contexts/NFTContext';
import LayerViewer from '../components/LayerViewer';

const GalleryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const GalleryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`;

const GalleryTitle = styled.h1`
  font-family: 'Pirata One', cursive;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #F4E1A0;
  text-shadow: 0 2px 16px var(--shadow);
  margin-bottom: 1rem;
  
  /* Add glint effect */
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.18) 12%, transparent 25%) no-repeat;
  background-size: 200% 100%;
  animation: goldGlint 16s linear infinite;
  -webkit-background-clip: text;
  background-clip: text;
`;

const GallerySubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--ink-dim);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const RopeDivider = styled.div`
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    var(--gold-2) 0px,
    var(--gold) 8px,
    var(--gold-2) 16px
  );
  border-radius: 2px;
  margin: 32px auto;
  max-width: 200px;
  opacity: 0.7;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid #333333;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  min-width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: #666666;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const PriceRangeInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.8rem;
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  border: 1px solid #666666;
  color: #666666;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #333333;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
`;

const NFTGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const NFTCard = styled(motion.div)`
  background: 
    linear-gradient(135deg, rgba(217, 180, 91, 0.08) 0%, rgba(20, 25, 35, 0.95) 100%),
    url('/themes/seychelles/parchment_texture.webp');
  background-size: auto, 300px 300px;
  background-repeat: no-repeat, repeat;
  border: 1px solid rgba(217, 180, 91, 0.35);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 24px rgba(217, 180, 91, 0.18);
    border-color: rgba(217, 180, 91, 0.6);
  }
`;

const NFTImage = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: ${props => props.theme.colors.primary};
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const RarityCornerBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.$color || '#8d99ae'}ee;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
  backdrop-filter: blur(4px);
  border: 1px solid ${props => props.$color || '#8d99ae'};
`;

const PuzzleBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 215, 0, 0.9);
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
  backdrop-filter: blur(4px);
`;

const NFTInfo = styled.div`
  padding: 1.5rem;
`;

const NFTTitle = styled.h3`
  font-family: 'Pirata One', cursive;
  color: var(--gold);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 8px rgba(217, 180, 91, 0.15);
`;

const NFTRarity = styled.div`
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
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const NFTPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #333333;
`;

const PriceLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const PriceValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 1.1rem;
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const LoadingCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333333;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const LoadingImage = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
`;

const LoadingInfo = styled.div`
  padding: 1.5rem;
  
  .line {
    height: 1rem;
    background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    
    &.short { width: 60%; }
    &.medium { width: 80%; }
    &.long { width: 100%; }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const PageButton = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? '#000000' : props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: #000000;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RARITY_COLORS = {
  'Epic': '#9d4edd',
  'Rare': '#3a86ff',
  'Uncommon': '#06d6a0',
  'Common': '#8d99ae'
};

function Gallery({ hideStatus = false, hideFilters = false }) {
  const { 
    nfts, 
    totalNFTs, 
    totalPages, 
    filters, 
    pagination, 
    isLoadingNFTs,
    setFilters, 
    setPagination,
    resetFilters 
  } = useNFT();
  
  const [sortBy, setSortBy] = useState('oldest');
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Initialize filters for main gallery - show all NFTs by default
  useEffect(()=>{
    if(!hideFilters){
      // Show all NFTs (minted + pre-minted) by default
      setFilters({ minted: null, chapter: null }); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  const handlePriceRangeChange = () => {
    const range = priceRange.min || priceRange.max ? [priceRange.min, priceRange.max] : null;
    setFilters({ priceRange: range });
  };

  const handlePageChange = (page) => {
    setPagination({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    resetFilters();
    setPriceRange({ min: '', max: '' });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const currentPage = pagination.page;
    const total = totalPages;
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (currentPage >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    
    return pages;
  };

  if (isLoadingNFTs && nfts.length === 0) {
    return (
      <GalleryContainer>
        <GalleryHeader>
          <GalleryTitle>NFT Gallery</GalleryTitle>
          <GallerySubtitle>Loading treasure clues...</GallerySubtitle>
        </GalleryHeader>
        
        <LoadingGrid>
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index}>
              <LoadingImage />
              <LoadingInfo>
                <div className="line medium"></div>
                <div className="line short"></div>
                <div className="line long"></div>
              </LoadingInfo>
            </LoadingCard>
          ))}
        </LoadingGrid>
      </GalleryContainer>
    );
  }

  return (
    <div className="gallery-page">
      {/* Background animation layers */}
      <div className="bg-layer fog-layer fog-layer--page" aria-hidden="true" />
      <div className="compass-watermark" aria-hidden="true" style={{opacity: 0.05}} />
      
      <GalleryContainer>
        <GalleryHeader>
          <GalleryTitle>NFT Gallery</GalleryTitle>
          <RopeDivider />
          <GallerySubtitle>
            Discover 1000 unique treasure clues, each containing pieces of Olivier Levasseur's legendary puzzle
          </GallerySubtitle>
        </GalleryHeader>

  {!hideFilters && (
  <FilterSection>
        <FilterGroup>
          <FilterLabel>Rarity</FilterLabel>
          <FilterSelect
            value={filters.rarity || ''}
            onChange={(e) => handleFilterChange('rarity', e.target.value || null)}
          >
            <option value="">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Status</FilterLabel>
          <FilterSelect
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || null)}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="auction">In Auction</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Chapter</FilterLabel>
          <FilterSelect
            value={filters.chapter || ''}
            onChange={(e) => handleFilterChange('chapter', e.target.value || null)}
          >
            <option value="">All Chapters</option>
            <option value="Chapter 1">Chapter I</option>
            <option value="Chapter 3">Chapter III</option>
            <option value="Chapter IV">Chapter IV</option>
            <option value="Chapter VI">Chapter VI</option>
            <option value="Chapter VII">Chapter VII - Siren's Map ✨</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Price Range (XRP)</FilterLabel>
          <PriceRangeInput>
            <PriceInput
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              onBlur={handlePriceRangeChange}
            />
            <span>to</span>
            <PriceInput
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              onBlur={handlePriceRangeChange}
            />
          </PriceRangeInput>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Search</FilterLabel>
          <SearchInput
            type="text"
            placeholder="Search by name or clue..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>&nbsp;</FilterLabel>
          <ClearFiltersButton onClick={handleClearFilters}>
            Clear Filters
          </ClearFiltersButton>
        </FilterGroup>
  </FilterSection>
  )}

      <ResultsInfo>
        <div>
          Showing {nfts.length} of {totalNFTs} NFTs
        </div>
        <SortSelect
          value={sortBy}
          onChange={(e) => {
            const v = e.target.value;
            setSortBy(v);
            setFilters({ sortBy: v });
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rarity">Rarity</option>
        </SortSelect>
      </ResultsInfo>

      {nfts.length === 0 && !isLoadingNFTs ? (
        <EmptyState>
          <h3>No NFTs found</h3>
          <p>Try adjusting your filters to see more results</p>
        </EmptyState>
      ) : (
        <>
          <NFTGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {nfts.map((nft, index) => {
                const rarityColor = RARITY_COLORS[nft.art_rarity || nft.rarity] || RARITY_COLORS.Common;
                // layers is already parsed by NFTContext
                const layers = Array.isArray(nft.layers) ? nft.layers : [];
                const hasPuzzle = false; // Puzzle badges removed - players must discover puzzle pieces
                
                return (
                <NFTCard
                  key={nft.tokenId || nft.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedNFT(nft);
                  }}
                >
                  <NFTImage>
                    <RarityCornerBadge $color={rarityColor}>
                      ⭐ {nft.art_rarity || nft.rarity || 'Common'}
                    </RarityCornerBadge>
                    {hasPuzzle && (
                      <PuzzleBadge>
                        🔍 PUZZLE
                      </PuzzleBadge>
                    )}
                    {nft.metadata?.image || nft.image_url || nft.image_uri ? (
                      <img
                        src={nft.metadata?.image || nft.image_url || nft.image_uri}
                        alt={nft.metadata?.name || nft.name}
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget;
                          // Prevent infinite loops if the fallback also fails
                          if (el.src.includes('/images/logo.png')) {
                            el.style.display = 'none'; // Truly hide if fallback fails
                            return;
                          }
                          
                          // First, try cache-busting
                          if (el.dataset.fallback !== 'done') {
                            el.dataset.fallback = 'done';
                            const base = (nft.metadata?.image || nft.image_uri || '').split('?')[0];
                            if (base) {
                              el.src = `${base}?v=${Date.now()}`;
                              return; // Attempt reload
                            }
                          }
                          
                          // If cache-busting fails or isn't possible, use placeholder
                          el.src = '/images/logo.png';
                        }}
                      />
                    ) : (
                      '🗺️'
                    )}
                  </NFTImage>
                  
                  <NFTInfo>
                    <NFTTitle>{nft.metadata?.name || nft.name || `NFT #${nft.token_id || nft.id}`}</NFTTitle>
                    
                    <NFTRarity rarity={nft.art_rarity || nft.rarity || 'Common'}>
                      ✨ {nft.art_rarity || nft.rarity || 'Common'}
                    </NFTRarity>
                    
                    <p style={{ 
                      color: '#cccccc', 
                      fontSize: '0.9rem', 
                      lineHeight: '1.4',
                      margin: '0.5rem 0'
                    }}>
                      {nft.metadata?.description || nft.description || 'A cryptographic clue leading to the treasure...'}
                    </p>
                    
                    {!hideStatus && (
                      <NFTPrice>
                        <PriceLabel>{nft.currentOffer ? 'Current Price' : 'Relic Status'}</PriceLabel>
                        <PriceValue>
                          {nft.currentOffer ? `${nft.currentOffer.amount} XRP` : 'Locked Relic'}
                        </PriceValue>
                      </NFTPrice>
                    )}
                  </NFTInfo>
                </NFTCard>
                );
              })}
            </AnimatePresence>
          </NFTGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </PageButton>
              
              {getPageNumbers().map((page, index) => (
                <PageButton
                  key={index}
                  active={page === pagination.page}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      )}
      
      {/* Layer Viewer Modal */}
      {selectedNFT && (
        <LayerViewer 
          nft={selectedNFT} 
          onClose={() => setSelectedNFT(null)} 
        />
      )}
      </GalleryContainer>
    </div>
  );
}

export default Gallery;