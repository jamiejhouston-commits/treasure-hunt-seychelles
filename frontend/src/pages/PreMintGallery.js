import React, { useEffect } from 'react';
import PreMintSimpleGallery from './PreMintSimpleGallery';
import { useNFT } from '../contexts/NFTContext';

export default function PreMintGallery(){
  const { setFilters, setPagination, resetFilters } = useNFT();

  useEffect(() => {
    resetFilters();
    setFilters({ minted: false }); // Show only unminted (should be 0)
    setPagination({ page: 1, limit: 120 });
  }, [resetFilters, setFilters, setPagination]);

  return (
    <div className="premint-gallery-wrapper" style={{ padding: '1rem 0 2rem' }}>
      <h1 style={{
        fontFamily: 'Pirata One, cursive',
        fontSize: 'clamp(1.8rem,4.5vw,3rem)',
        color: '#89D6FF',
        textAlign: 'center',
        margin: '0 0 1rem'
      }}>Pre-Mint Gallery</h1>
      <PreMintSimpleGallery />
    </div>
  );
}
