import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid #333333;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem 1rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-family: 'Cinzel', serif;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const FooterText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  font-size: 0.9rem;
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  font-size: 0.9rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
`;

const ExternalLink = styled.a`
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 2px solid #333333;
  border-radius: 8px;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  font-size: 1.2rem;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #333333;
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const TechStack = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const TechBadge = styled.span`
  background: rgba(212, 175, 55, 0.1);
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(212, 175, 55, 0.3);
`;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>The Treasure of Seychelles</FooterTitle>
            <FooterText>
              Embark on a cryptographic treasure hunt through 1000 NFT clues leading to 
              Olivier Levasseur's legendary pirate treasure hidden in the Seychelles archipelago.
            </FooterText>
            <FooterText>
              Built on the XRPL with native NFT support, ensuring fast, secure, and 
              eco-friendly transactions.
            </FooterText>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/gallery">NFT Gallery</FooterLink>
            <FooterLink to="/puzzle">Solve Puzzle</FooterLink>
            <FooterLink to="/about">About</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Resources</FooterTitle>
            <ExternalLink 
              href="https://xrpl.org/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              XRPL Documentation 🔗
            </ExternalLink>
            <ExternalLink 
              href="https://xumm.app/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              XUMM Wallet 📱
            </ExternalLink>
            <ExternalLink 
              href="https://livenet.xrpl.org/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              XRPL Explorer 🔍
            </ExternalLink>
            <ExternalLink 
              href="https://nft.storage/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              NFT.Storage (IPFS) 📦
            </ExternalLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Connect</FooterTitle>
            <SocialLinks>
              <SocialIcon 
                href="https://twitter.com/treasureseychelles" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Twitter"
              >
                🐦
              </SocialIcon>
              <SocialIcon 
                href="https://discord.gg/treasureseychelles" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Discord"
              >
                💬
              </SocialIcon>
              <SocialIcon 
                href="https://github.com/treasure-seychelles" 
                target="_blank" 
                rel="noopener noreferrer"
                title="GitHub"
              >
                💻
              </SocialIcon>
              <SocialIcon 
                href="https://opensea.io/collection/treasure-seychelles" 
                target="_blank" 
                rel="noopener noreferrer"
                title="OpenSea"
              >
                🌊
              </SocialIcon>
            </SocialLinks>
            <FooterText style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
              Join our community for updates, clues, and treasure hunting strategies!
            </FooterText>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <div>
            © {currentYear} Treasure of Seychelles. Built with ❤️ for the XRPL community.
          </div>
          <TechStack>
            <TechBadge>XRPL</TechBadge>
            <TechBadge>React</TechBadge>
            <TechBadge>Node.js</TechBadge>
            <TechBadge>IPFS</TechBadge>
            <TechBadge>XUMM</TechBadge>
          </TechStack>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;