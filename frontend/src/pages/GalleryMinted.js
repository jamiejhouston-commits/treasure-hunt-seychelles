import React, { useEffect, useMemo } from 'react';
import Gallery from './Gallery';
import RarityTracker from '../components/RarityTracker';
import { useNFT } from '../contexts/NFTContext';

/* Gallery Minted
   ----------------------------------
   Displays only finalized, minted chapters (currently reuses full dataset until filtering is added).
*/
export default function GalleryMinted(){
  const { filters, setFilters, setPagination, availableFilters, nfts } = useNFT();
  useEffect(()=>{
    // Force minted only with a generous limit so all chapters are visible in one view.
    setFilters({ chapter: null, minted: true, sortBy: 'oldest' });
    // Backend enforces max limit=200. Do NOT exceed or API returns 400 (Invalid query parameters).
    setPagination({ page: 1, limit: 200 });
  },[setFilters,setPagination]);

  const mintedChapters = useMemo(() => {
    const fromApi = Array.isArray(availableFilters?.chapters)
      ? availableFilters.chapters.filter(Boolean)
      : [];
    if (fromApi.length > 0) return Array.from(new Set(fromApi));
    // Fallback for early render before metadata arrives
    return ['Chapter 1', 'Chapter 3', 'Chapter IV', 'Chapter VI', 'Chapter VII'];
  }, [availableFilters]);

  const activeChapter = filters?.chapter || 'all';

  const resolveChapterLabel = (chapter) => {
    const labels = {
      all: 'All Chapters',
      'Chapter 1': 'Chapter I',
      'Chapter 2': 'Chapter II',
      'Chapter 3': 'Chapter III',
      'Chapter IV': 'Chapter IV',
      'Chapter V': 'Chapter V',
      'Chapter VI': 'Chapter VI',
      'Chapter VII': "Chapter VII – Siren's Map"
    };
    return labels[chapter] || chapter;
  };

  const handleChapterSelect = (chapter) => {
    setFilters({ chapter: chapter === 'all' ? null : chapter });
  };

  return (
    <div className="gallery-minted-wrapper" style={{position:'relative'}} data-gallery="minted">
      <div className="bg-layer fog-layer fog-layer--page" aria-hidden="true" />
      <div style={{textAlign:'center', paddingTop:'2rem'}}>
        <h1 style={{
          fontFamily: 'Pirata One, cursive',
          fontSize: 'clamp(2rem,5vw,3.5rem)',
          color: '#F4E1A0',
          textShadow: '0 2px 16px rgba(0,0,0,0.6)'
        }}>Gallery Minted</h1>
        <p style={{maxWidth:640, margin:'0.5rem auto 2rem', color:'#C9C6BB', lineHeight:1.5}}>
          Official minted collection. Only finalized, on-chain chapters appear here.
        </p>
        <div
          aria-label="Filter minted collection by chapter"
          role="tablist"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginTop: '1.5rem'
          }}
        >
          {[ 'all', ...mintedChapters ].map((chapter) => {
            const isActive = activeChapter === chapter;
            return (
              <button
                key={chapter}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleChapterSelect(chapter)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '999px',
                  border: isActive ? '1px solid rgba(244, 225, 160, 0.9)' : '1px solid rgba(244, 225, 160, 0.35)',
                  background: isActive ? 'rgba(244, 225, 160, 0.16)' : 'rgba(12, 16, 22, 0.75)',
                  color: isActive ? '#F4E1A0' : '#C9C6BB',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  boxShadow: isActive ? '0 0 18px rgba(244, 225, 160, 0.2)' : '0 0 12px rgba(0, 0, 0, 0.35)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {resolveChapterLabel(chapter)}
              </button>
            );
          })}
        </div>

        {/* Show RarityTracker only for Chapter 1: The Trail Begins */}
        {(activeChapter === 'Chapter 1: The Trail Begins' || activeChapter === 'all') && nfts && nfts.length > 0 && (
          <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
            <RarityTracker nfts={nfts.filter(nft => nft.chapter?.includes('Chapter 1'))} />
          </div>
        )}
      </div>
      <Gallery hideFilters />
    </div>
  );
}
