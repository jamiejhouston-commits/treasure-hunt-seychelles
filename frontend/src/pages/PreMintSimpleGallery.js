import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNFT } from '../contexts/NFTContext';

const inferPremint = (nft) => {
  if (!nft) return false;

  const phase = nft.metadata?.collectionPhase?.toString().toLowerCase?.();
  if (phase === 'premint') return true;

  const tags = nft.metadata?.tags;
  if (Array.isArray(tags) && tags.some(tag => tag?.toString().toLowerCase?.() === 'premint')) {
    return true;
  }

  const image = nft.metadata?.image;
  if (typeof image === 'string' && image.includes('/ch6_premint/')) {
    return true;
  }

  if (typeof nft.minted === 'boolean') {
    return !nft.minted;
  }

  const hasToken = Boolean(nft.nftoken_id);
  const hasOwner = Boolean(nft.current_owner || nft.currentOwner);
  const isForSale = Boolean(nft.for_sale || nft.forSale);
  return !(hasToken || hasOwner || isForSale);
};

const normalizePremintImage = (src) => {
  if (!src) return null;
  const trimmed = src.split('?')[0];
  const match = trimmed.match(/(.*\/ch6_premint\/)(?:ch6_)?(\d+)\.png$/i);
  if (match) {
    const [, prefix, num] = match;
    const padded = num.padStart(3, '0');
    return `${prefix}ch6_${padded}.png`;
  }
  return trimmed;
};

const toAbsoluteUrl = (src) => {
  if (!src) return null;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('//')) return `https:${src}`;
  return src.startsWith('/') ? `http://localhost:3001${src}` : `http://localhost:3001/${src}`;
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '1.25rem',
  padding: '0 1rem'
};

const cardStyle = {
  border: '1px solid rgba(137, 214, 255, 0.25)',
  borderRadius: '10px',
  background: '#101622',
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  textDecoration: 'none',
  color: '#E9F3FF'
};

const imageBoxStyle = {
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: '6px',
  overflow: 'hidden',
  background: '#0b111c',
  display: 'grid',
  placeItems: 'center'
};

const titleStyle = {
  margin: 0,
  fontSize: '1rem',
  color: '#E9F3FF'
};

const statusStyle = {
  fontSize: '0.85rem',
  color: '#89D6FF'
};

export default function PreMintSimpleGallery() {
  const { nfts = [], isLoadingNFTs, nftsError } = useNFT();

  const { premint, display } = useMemo(() => {
    const filtered = nfts.filter(inferPremint);
    if (filtered.length > 0) {
      return { premint: filtered, display: filtered, usedFallback: false };
    }
    return { premint: filtered, display: nfts, usedFallback: true };
  }, [nfts]);

  if (isLoadingNFTs) {
    return <p style={{ textAlign: 'center', opacity: 0.7 }}>Loading pre-mint assets…</p>;
  }

  if (nftsError) {
    return <p style={{ textAlign: 'center', opacity: 0.7 }}>Failed to load pre-mint assets.</p>;
  }

  if (!display.length) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.7 }}>
        No pre-mint assets available right now.
      </div>
    );
  }

  const usingFallback = premint.length === 0 && nfts.length > 0;

  return (
    <>
      {usingFallback && (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#89D6FF', marginBottom: '1rem' }}>
          Showing all available cards because none were flagged as pre-mint. Minted ones are labeled below.
        </p>
      )}
      <div style={gridStyle}>
        {display.map((nft, index) => {
          const tokenKey = nft.tokenId || nft.token_id || nft.id || `premint-${index}`;
          const name = nft.metadata?.name || nft.name || `NFT #${nft.tokenId || nft.token_id || '?'}`;
          const rawImage = nft.metadata?.image || nft.image_uri || nft.imageUrl;
          const imgSrc = toAbsoluteUrl(normalizePremintImage(rawImage));

          const mintedStatus = typeof nft.minted === 'boolean'
            ? nft.minted
            : Boolean(nft.current_owner || nft.currentOwner || nft.nftoken_id || nft.for_sale || nft.forSale);

          return (
            <Link key={tokenKey} to={`/nft/${nft.tokenId || nft.token_id || ''}`} style={cardStyle}>
              <div style={imageBoxStyle}>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (!el.dataset.fallback) {
                        el.dataset.fallback = 'done';
                        const fallback = toAbsoluteUrl(normalizePremintImage(rawImage));
                        if (fallback && fallback !== el.src) {
                          el.src = fallback;
                          return;
                        }
                      }
                      el.replaceWith(document.createTextNode('🗺️'));
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '2rem', color: '#89D6FF' }}>🗺️</span>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <h2 style={titleStyle}>{name}</h2>
                <span style={statusStyle}>{mintedStatus ? 'Minted' : 'Awaiting Mint'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
