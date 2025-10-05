import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const ViewerContainer = styled(motion.div)`
  width: 100%;
  max-width: 1400px;
  height: 90vh;
  background: #1a1a1a;
  border-radius: 16px;
  border: 2px solid #333;
  display: flex;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
`;

const ImagePanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$isDragging ? 'grabbing' : props.$zoom > 1 ? 'grab' : 'default'};
`;

const LayeredImage = styled.div`
  position: relative;
  transform: scale(${props => props.$zoom}) translate(${props => props.$pan.x}px, ${props => props.$pan.y}px);
  transition: transform 0.1s ease-out;
  max-width: 100%;
  max-height: 100%;
`;

const BaseImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  user-select: none;
`;

const LayerOverlay = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
`;

const ControlsBar = styled.div`
  padding: 1rem;
  background: #1a1a1a;
  border-top: 1px solid #333;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const ControlButton = styled.button`
  background: #2a2a2a;
  border: 1px solid #444;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background: #3a3a3a;
    border-color: #666;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ZoomDisplay = styled.div`
  color: #999;
  font-size: 0.9rem;
  min-width: 60px;
  text-align: center;
`;

const Sidebar = styled.div`
  width: 320px;
  background: #1a1a1a;
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  @media (max-width: 1024px) {
    width: 280px;
  }
`;

const SidebarSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #333;
`;

const SidebarTitle = styled.h3`
  color: #F4E1A0;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: 'Pirata One', cursive;
`;

const NFTName = styled.h2`
  color: #F4E1A0;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: 'Pirata One', cursive;
`;

const NFTInfo = styled.div`
  color: #999;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const RarityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${props => props.$color || '#666'}22;
  border: 2px solid ${props => props.$color || '#666'};
  color: ${props => props.$color || '#666'};
  font-weight: bold;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const LayerControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.$active ? '#2a2a2a' : 'transparent'};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.$active ? '#444' : 'transparent'};
  transition: all 0.2s;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  
  &:hover {
    background: ${props => props.$disabled ? 'transparent' : '#2a2a2a'};
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #F4E1A0;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const LayerLabel = styled.label`
  color: ${props => props.$disabled ? '#666' : '#fff'};
  font-size: 0.95rem;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  flex: 1;
  user-select: none;
`;

const LayerDescription = styled.p`
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-style: italic;
`;

const DimmingIndicator = styled(motion.div)`
  background: rgba(244, 225, 160, 0.1);
  border: 1px solid rgba(244, 225, 160, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #F4E1A0;
  font-size: 0.85rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #444;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #666;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const NoPuzzleMessage = styled.div`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  color: #999;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const RARITY_COLORS = {
  'Epic': '#9d4edd',
  'Rare': '#3a86ff',
  'Uncommon': '#06d6a0',
  'Common': '#8d99ae'
};

export default function LayerViewer({ nft, onClose }) {
  const [visibleLayers, setVisibleLayers] = useState(new Set()); // Start with NO puzzle layers visible
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace('/api', '');
  
  // Parse layers from NFT data - layers might be a JSON string or array
  const parseLayers = () => {
    if (!nft.layers) return [];
    if (Array.isArray(nft.layers)) return nft.layers;
    if (typeof nft.layers === 'string') {
      try {
        return JSON.parse(nft.layers);
      } catch (e) {
        console.error('Failed to parse layers:', e);
        return [];
      }
    }
    return [];
  };
  
  // Debug: Log NFT data on mount
  useEffect(() => {
    console.log('🎯 LayerViewer: NFT data received:', nft);
    console.log('   Keys:', Object.keys(nft));
  }, []);

  const layers = parseLayers();
  const hasPuzzle = nft.puzzle_enabled || layers.length > 1;
  const rarity = nft.art_rarity || nft.rarity || 'Common';
  const rarityColor = RARITY_COLORS[rarity] || '#8d99ae';
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleResetView();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [zoom]);
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };
  
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  
  const handleFitScreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const toggleLayer = (layerNum) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerNum)) {
        if (layerNum !== 0) { // Can't hide Layer 0
          newSet.delete(layerNum);
        }
      } else {
        newSet.add(layerNum);
      }
      return newSet;
    });
  };
  
  const getLayerImageUrl = (layer) => {
    // Add cache-busting timestamp to force reload
    const cacheBuster = `?t=${Date.now()}`;

    // If layer has a URL field, use it
    if (layer.url) {
      console.log('🎨 LayerViewer: Using layer.url:', layer.url);
      const fullUrl = layer.url.startsWith('http') ? layer.url : `${baseUrl}${layer.url}`;
      return fullUrl + cacheBuster;
    }

    // Use token_id (check both snake_case and camelCase)
    const tokenId = nft.token_id || nft.tokenId || nft.id;
    console.log('🔍 LayerViewer: TokenID =', tokenId, 'Layer =', layer.layer);

    if (layer.layer === 0) {
      // Base artwork - try all possible image fields
      const imageUrl = nft.image_url || nft.image_uri || nft.metadata?.image || `${baseUrl}/treasure_hunt/chapter1/images/nft_${tokenId}.png`;
      console.log('🖼️ LayerViewer: Base image URL =', imageUrl);
      console.log('   Available fields:', {
        image_url: nft.image_url,
        image_uri: nft.image_uri,
        metadata_image: nft.metadata?.image
      });
      return imageUrl + cacheBuster;
    } else {
      // Puzzle overlay layer
      const layerUrl = `${baseUrl}/treasure_hunt/chapter1/layers/nft_${tokenId}_layer_${layer.layer}.png`;
      console.log('🧩 LayerViewer: Puzzle layer URL =', layerUrl);
      return layerUrl + cacheBuster;
    }
  };
  
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <ViewerContainer
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
          
          <ImagePanel>
            <ImageContainer
              $isDragging={isDragging}
              $zoom={zoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <LayeredImage $zoom={zoom} $pan={pan}>
                {/* Base artwork - always visible, dimmed only when puzzle layers (1+) are active */}
                <BaseImage
                  src={getLayerImageUrl(layers[0] || { layer: 0 })}
                  alt={nft.name}
                  draggable={false}
                />
                
                {/* Overlay layers */}
                {layers.slice(1).map((layer) => {
                  const isVisible = visibleLayers.has(layer.layer);
                  const layerUrl = getLayerImageUrl(layer);
                  console.log(`🎨 Rendering overlay Layer ${layer.layer}:`, { isVisible, layerUrl });

                  return (
                    <AnimatePresence key={layer.layer}>
                      {isVisible && (
                        <LayerOverlay
                          src={layerUrl}
                          alt={`Layer ${layer.layer}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          draggable={false}
                          onLoad={() => console.log(`✅ Layer ${layer.layer} image loaded`)}
                          onError={(e) => console.error(`❌ Layer ${layer.layer} failed to load:`, e.target.src)}
                        />
                      )}
                    </AnimatePresence>
                  );
                })}
              </LayeredImage>
            </ImageContainer>
            
            <ControlsBar>
              <ControlButton onClick={handleZoomOut} disabled={zoom <= 0.5}>
                <ZoomOut /> Zoom Out
              </ControlButton>
              <ZoomDisplay>{Math.round(zoom * 100)}%</ZoomDisplay>
              <ControlButton onClick={handleZoomIn} disabled={zoom >= 4}>
                <ZoomIn /> Zoom In
              </ControlButton>
              <ControlButton onClick={handleFitScreen}>
                <Maximize2 /> Fit
              </ControlButton>
              <ControlButton onClick={handleResetView}>
                <RotateCcw /> Reset
              </ControlButton>
            </ControlsBar>
          </ImagePanel>
          
          <Sidebar>
            <SidebarSection>
              <NFTName>{nft.name || nft.metadata?.name}</NFTName>
              <NFTInfo>
                #{nft.token_id || nft.tokenId || nft.id} • Chapter 1
              </NFTInfo>
              <RarityBadge $color={rarityColor}>
                ⭐ {rarity}
              </RarityBadge>
            </SidebarSection>
            
            <SidebarSection>
              <SidebarTitle>Layers</SidebarTitle>
              
              {/* Base Layer */}
              <LayerControl $active={true} $disabled={true}>
                <Checkbox
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  readOnly
                />
                <div>
                  <LayerLabel $disabled={false}>
                    ✓ Layer 0: Base Artwork
                  </LayerLabel>
                  <LayerDescription>
                    Original Seychelles artwork
                  </LayerDescription>
                </div>
              </LayerControl>
              
              {/* Puzzle Layers */}
              {layers.slice(1).length > 0 ? (
                layers.slice(1).map((layer) => (
                  <LayerControl
                    key={layer.layer}
                    $active={visibleLayers.has(layer.layer)}
                    onClick={() => toggleLayer(layer.layer)}
                  >
                    <Checkbox
                      type="checkbox"
                      checked={visibleLayers.has(layer.layer)}
                      onChange={() => toggleLayer(layer.layer)}
                    />
                    <div>
                      <LayerLabel>
                        {visibleLayers.has(layer.layer) ? '☐' : '☑'} Layer {layer.layer}: {layer.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </LayerLabel>
                      <LayerDescription>
                        {layer.description}
                      </LayerDescription>
                    </div>
                  </LayerControl>
                ))
              ) : (
                <NoPuzzleMessage>
                  This NFT contains pure artwork with no puzzle layers.
                  <br /><br />
                  Puzzle clues can be found in NFTs #5, #12, #17, and #20.
                </NoPuzzleMessage>
              )}

              {/* Dimming indicator - show only when puzzle layers (not layer 0) are visible */}
              {visibleLayers.size > 0 && (
                <DimmingIndicator
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                  Background dimmed for clarity
                </DimmingIndicator>
              )}
            </SidebarSection>
            
            {hasPuzzle && (
              <SidebarSection>
                <SidebarTitle>🔍 Puzzle Clue</SidebarTitle>
                <NFTInfo style={{ color: '#F4E1A0' }}>
                  This NFT contains a clue for the Chapter 1 treasure hunt!
                  <br /><br />
                  Toggle the puzzle layer to reveal the hidden information.
                  <br /><br />
                  Collect all four puzzle NFTs to solve the mystery.
                </NFTInfo>
              </SidebarSection>
            )}
            
            <SidebarSection>
              <SidebarTitle>Controls</SidebarTitle>
              <NFTInfo>
                <strong>Mouse:</strong> Drag to pan (when zoomed)<br />
                <strong>Keyboard:</strong><br />
                • +/- : Zoom in/out<br />
                • 0 : Reset view<br />
                • ESC : Close viewer
              </NFTInfo>
            </SidebarSection>
          </Sidebar>
        </ViewerContainer>
      </Overlay>
    </AnimatePresence>
  );
}
