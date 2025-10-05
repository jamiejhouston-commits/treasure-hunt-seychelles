import React from 'react';
import Gallery from './Gallery';

/*
  Gallery II Wrapper
  ---------------------------------
  For now this reuses the existing Gallery component logic (filters, pagination, NFTContext data).
  We distinguish it by customizing title/subtitle via simple prop overrides.
  Later we can:
    - Scope to painterly/story collection once those NFTs are tagged (e.g., filter by chapter or metadata flag)
    - Provide separate context slice if needed
*/

// Lightweight approach: extend the Gallery component to accept optional title/subtitle props
// Instead of copying 680 lines, we will temporarily reuse it by composition.
// To enable this, we patch Gallery.js to accept props; until then this page will be updated after patch.

export default function GalleryII(props) {
  // Placeholder until Gallery.js gains prop support; we can do a dynamic override by cloning element
  // For now, we just render a visually distinct heading above the reused Gallery component container.
  return (
    <div className="gallery-ii-wrapper" style={{position:'relative'}}>
      <div className="bg-layer fog-layer fog-layer--page" aria-hidden="true" />
      <div style={{textAlign:'center', paddingTop:'2rem'}}>
        <h1 style={{
          fontFamily: 'Pirata One, cursive',
          fontSize: 'clamp(2rem,5vw,3.5rem)',
          color: '#BFE8C1',
          textShadow: '0 2px 16px rgba(0,0,0,0.6)'
  }}>Gallery Minted</h1>
        <p style={{maxWidth:600, margin:'0.5rem auto 2rem', color:'#C9C6BB', lineHeight:1.5}}>
          Official minted collection. Only finalized, on-chain chapters appear here.
        </p>
      </div>
      <Gallery />
    </div>
  );
}
