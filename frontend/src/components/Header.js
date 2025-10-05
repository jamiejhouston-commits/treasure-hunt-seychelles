import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWallet } from '../contexts/WalletContext';

const ANIMATION_STORAGE_KEY = 'animations-enabled';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333333;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #f5d976;
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const TreasureIcon = styled.span`
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.98);
    flex-direction: column;
    padding: 2rem;
    border-bottom: 1px solid #333333;
    gap: 1.5rem;
  }
`;

const AnimationToggleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(217, 180, 91, 0.35);
  background: rgba(12, 15, 19, 0.65);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
  transition: border-color 0.2s ease-in-out, background 0.2s ease-in-out;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const AnimationLabel = styled.span`
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: rgba(234, 231, 220, 0.75);
`;

const AnimationSwitch = styled.button`
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid rgba(217, 180, 91, 0.6);
  background: ${props => props.$active
    ? 'linear-gradient(135deg, rgba(217, 180, 91, 1) 0%, rgba(182, 138, 58, 1) 100%)'
    : 'rgba(20, 24, 32, 0.85)'};
  padding: 0;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => (props.$active ? '14px' : '2px')};
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => (props.$active ? '#0c0f13' : '#d9b45b')};
    transition: left 0.25s ease, background 0.25s ease;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const AnimationState = styled.span`
  font-variant: all-small-caps;
  letter-spacing: 0.18em;
  color: rgba(234, 231, 220, 0.7);
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  position: relative;
  
  ${props => props.isActive && `
    color: ${props.theme.colors.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${props.theme.colors.primary};
    }
  `}
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const WalletButton = styled.button`
  background: ${props => props.connected 
    ? 'linear-gradient(135deg, #d4af37 0%, #f5d976 100%)'
    : 'transparent'
  };
  color: ${props => props.connected ? '#000000' : props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  
  &:hover {
    background: ${props => props.connected 
      ? 'linear-gradient(135deg, #f5d976 0%, #d4af37 100%)'
      : props.theme.colors.primary
    };
    color: #000000;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const WalletAddress = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  font-family: monospace;
`;

const WalletBalance = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NetworkIndicator = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isTestnet ? '#f59e0b' : '#10b981'};
  border: 2px solid #000000;
`;

function Header() {
  const location = useLocation();
  const { isConnected, isConnecting, address, balance, connect, disconnect, networkInfo } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const storedPreferenceRef = useRef(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    try {
      const stored = window.localStorage.getItem(ANIMATION_STORAGE_KEY);
      if (stored !== null) {
        storedPreferenceRef.current = true;
        return stored === 'true';
      }
    } catch (error) {
      // Ignore storage access issues (e.g., privacy mode)
    }

    if (window.matchMedia) {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return true;
  });

  const isTestnet = networkInfo?.info?.network_id !== 0;

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) return 'Loading...';
    return `${Number(bal).toFixed(2)} XRP`;
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/gallery-minted', label: 'Gallery Minted' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/puzzle', label: 'Puzzle' },
    { path: '/my-collection', label: 'My Collection' },
    { path: '/offers', label: 'Offers' },
    { path: '/about', label: 'About' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.setAttribute('data-anim', animationsEnabled ? 'on' : 'off');

    if (document.body) {
      document.body.classList.toggle('animations-disabled', !animationsEnabled);
      document.body.classList.remove('home-mode-cinematic', 'home-mode-calm');
    }
  }, [animationsEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event) => {
      if (storedPreferenceRef.current) return;
      setAnimationsEnabled(!event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedPreferenceRef]);

  const toggleAnimations = () => {
    storedPreferenceRef.current = true;
    setAnimationsEnabled((prev) => {
      const next = !prev;

      try {
        window.localStorage.setItem(ANIMATION_STORAGE_KEY, next.toString());
      } catch (error) {
        // Ignore storage write issues
      }

      return next;
    });
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/" onClick={closeMobileMenu}>
          <TreasureIcon>🏴‍☠️</TreasureIcon>
          Hidden Gems of Seychelles
        </Logo>

        <NavLinks isOpen={isMobileMenuOpen}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              isActive={location.pathname === item.path}
              onClick={closeMobileMenu}
            >
              {item.label}
            </NavLink>
          ))}

          <AnimationToggleGroup role="group" aria-label="Toggle ambient animations">
            <AnimationLabel>Animations</AnimationLabel>
            <AnimationSwitch
              type="button"
              onClick={toggleAnimations}
              aria-pressed={animationsEnabled}
              aria-label={animationsEnabled ? 'Disable ambient animations' : 'Enable ambient animations'}
              $active={animationsEnabled}
            />
            <AnimationState>{animationsEnabled ? 'On' : 'Off'}</AnimationState>
          </AnimationToggleGroup>
          
          <WalletSection>
            {isConnected ? (
              <>
                <WalletInfo>
                  <WalletAddress>{formatAddress(address)}</WalletAddress>
                  <WalletBalance>{formatBalance(balance)}</WalletBalance>
                </WalletInfo>
                <WalletButton
                  connected={true}
                  onClick={disconnect}
                >
                  Disconnect
                  <NetworkIndicator isTestnet={isTestnet} title={isTestnet ? 'Testnet' : 'Mainnet'} />
                </WalletButton>
              </>
            ) : (
              <WalletButton
                connected={false}
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </WalletButton>
            )}
          </WalletSection>
        </NavLinks>

        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
}

export default Header;