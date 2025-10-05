import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutPage = styled.div`
  min-height: 100vh;
  background: 
    linear-gradient(135deg, var(--bg-deep) 0%, #0A0E14 100%);
`;

const AboutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const AboutHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const AboutTitle = styled.h1`
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

const AboutSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--ink-dim);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const InterstitialImage = styled.div`
  width: 100vw;
  height: 46vh;
  margin: 4rem 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  
  background: 
    linear-gradient(rgba(12,15,19,0.6), rgba(12,15,19,0.8)),
    image-set(
      url('/themes/seychelles/about_interstitial.avif') 1x,
      url('/themes/seychelles/about_interstitial.webp') 1x
    );
  background-size: cover;
  background-position: center;
  
  /* Add vignette effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.7) 100%);
    pointer-events: none;
  }
  
  /* Fallback for browsers that don't support image-set */
  @supports not (background-image: image-set(url('test.webp') 1x)) {
    background: 
      linear-gradient(rgba(12,15,19,0.6), rgba(12,15,19,0.8)),
      url('/themes/seychelles/about_interstitial.webp');
  }
  
  @media (max-width: 768px) {
    height: 35vh;
    margin: 3rem 0;
  }
`;

const ContentSection = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Pirata One', cursive;
  color: var(--gold);
  font-size: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 0 20px rgba(242, 193, 90, 0.25);
`;

const SectionContent = styled.div`
  background: radial-gradient(circle at center, var(--bg-panel) 0%, #0E1218 100%);
  border: 1px solid rgba(217, 180, 91, 0.18);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
`;

const TimelineContainer = styled(SectionContent)`
  padding-left: 2.5rem;
  border-left: 2px solid var(--gold-2);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 20px;
    width: 10px;
    height: 10px;
    background: var(--gold);
    border-radius: 50%;
    box-shadow: 0 0 0 3px var(--bg-panel);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background-image: url('/themes/seychelles/watermark.svg');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.06;
    pointer-events: none;
  }
`;

const Paragraph = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const HighlightBox = styled.div`
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const TechCard = styled(motion.div)`
  background: radial-gradient(circle at center, var(--bg-panel) 0%, #0E1218 100%);
  border: 1px solid rgba(217, 180, 91, 0.18);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(217, 180, 91, 0.4);
    box-shadow: 0 4px 16px rgba(217, 180, 91, 0.1);
    transform: translateY(-2px);
  }
`;

const TechIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const TechTitle = styled.h4`
  color: var(--gold);
  margin-bottom: 1rem;
  font-family: 'Pirata One', cursive;
`;

const TechDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  font-size: 0.9rem;
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    left: -2rem;
    top: 0.5rem;
    width: 12px;
    height: 12px;
    background: ${props => props.theme.colors.primary};
    border-radius: 50%;
    border: 3px solid ${props => props.theme.colors.background};
  }
`;

const TimelineDate = styled.div`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const TimelineTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const TimelineText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;
`;

const TeamAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37 0%, #f5d976 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1rem;
  border: 3px solid #333333;
`;

const TeamName = styled.h4`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  font-family: 'Cinzel', serif;
`;

const TeamRole = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const FAQSection = styled.div``;

const FAQItem = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FAQQuestion = styled.h4`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FAQAnswer = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  
  ${props => !props.isOpen && 'display: none;'}
`;

function About() {
  const [openFAQ, setOpenFAQ] = React.useState(null);

  const technologies = [
    {
      icon: '⚡',
      title: 'XRPL Blockchain',
      description: 'Built on the XRP Ledger for fast, eco-friendly, and cost-effective NFT transactions with native NFT support.'
    },
    {
      icon: '🏦',
      title: 'XUMM Wallet',
      description: 'Seamless integration with XUMM for secure wallet connections and transaction signing on mobile devices.'
    },
    {
      icon: '📦',
      title: 'IPFS Storage',
      description: 'Decentralized storage via NFT.Storage ensures permanent availability of NFT metadata and images.'
    },
    {
      icon: '⚛️',
      title: 'React Frontend',
      description: 'Modern, responsive web application built with React 18, providing an intuitive user experience.'
    },
    {
      icon: '🔧',
      title: 'Node.js Backend',
      description: 'Robust Express.js API server with SQLite database for managing NFT data and user interactions.'
    },
    {
      icon: '🔐',
      title: 'Web3 Security',
      description: 'Industry-standard security practices with wallet-based authentication and secure transaction handling.'
    }
  ];

  const timeline = [
    {
      date: '1721',
      title: 'The Golden Age',
      content: 'Olivier Levasseur captures the Nossa Senhora do Cabo, one of the richest prizes in pirate history, valued at over £500,000.'
    },
    {
      date: '1724',
      title: 'The Seychelles Haven',
      content: 'La Buse establishes operations in the Seychelles archipelago, using the remote islands as a base for Indian Ocean raids.'
    },
    {
      date: '1730',
      title: 'The Final Cryptogram',
      content: 'Captured and executed, Levasseur throws his famous cryptogram to the crowd: "Find my treasure, he who can!"'
    },
    {
      date: '1949-1977',
      title: 'Modern Treasure Hunters',
      content: 'Reginald Cruise-Wilkins spends decades searching Mahé island, discovering artifacts but not the main treasure.'
    },
    {
      date: '2024',
      title: 'The NFT Treasure Hunt',
      content: 'The legendary puzzle enters the digital age with 1000 NFT clues on the XRPL, democratizing the centuries-old treasure hunt.'
    }
  ];

  const team = [
    {
      name: 'Captain Crypto',
      role: 'Blockchain Developer',
      avatar: '🏴‍☠️'
    },
    {
      name: 'Navigator Nash',
      role: 'Frontend Developer',
      avatar: '🧭'
    },
    {
      name: 'Treasure Keeper',
      role: 'Smart Contract Auditor',
      avatar: '💎'
    },
    {
      name: 'Lore Master',
      role: 'Historical Researcher',
      avatar: '📚'
    }
  ];

  const faqs = [
    {
      question: '🏴‍☠️ Is this treasure hunt based on real history?',
      answer: 'Yes! Olivier Levasseur was a real French pirate who operated in the Indian Ocean from 1721-1730. His cryptogram and the legend of his treasure are documented historical facts, though the treasure has never been found.'
    },
    {
      question: '💰 How much is the treasure worth?',
      answer: 'Historical estimates suggest Levasseur\'s treasure could be worth over $1 billion in today\'s value. Our NFT collection represents this through the ultimate Treasure NFT prize and the collective value of all 1000 clue NFTs.'
    },
    {
      question: '🔍 What happens when someone solves the puzzle?',
      answer: 'The first person to submit the correct solution will receive the legendary Treasure NFT, which represents a significant portion of the collection\'s value. The puzzle solution will be verified against historical and cryptographic evidence.'
    },
    {
      question: '⚡ Why use the XRPL?',
      answer: 'The XRP Ledger offers native NFT support with 3-5 second settlement times, minimal fees (typically $0.01), and is carbon-neutral. This makes it perfect for frequent interactions in our treasure hunt.'
    },
    {
      question: '🎨 Are the NFTs randomly generated?',
      answer: 'No, each NFT is carefully crafted with historical references, geographical clues, and cryptographic elements that tie into the overall puzzle. Every piece is a genuine clue toward solving Levasseur\'s mystery.'
    },
    {
      question: '📱 Do I need special software?',
      answer: 'You only need the XUMM wallet app on your mobile device to participate. XUMM is available for iOS and Android and provides secure interaction with the XRPL blockchain.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <AboutPage className="about-page">
      {/* Background animation layers */}
      <div className="bg-layer fog-layer fog-layer--page" aria-hidden="true" style={{opacity: 0.08}} />
      
      <AboutContainer>
        <AboutHeader>
          <AboutTitle>About the Project</AboutTitle>
          <AboutSubtitle>
            Discover the fascinating intersection of history, cryptography, and blockchain technology 
            in the world's first NFT-based treasure hunt.
          </AboutSubtitle>
        </AboutHeader>

        <ContentSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle>🏴‍☠️ The Legend of La Buse</SectionTitle>
          <SectionContent>
          <Paragraph>
            Olivier Levasseur, known as "La Buse" (The Buzzard), was one of the most successful 
            pirates of the Golden Age of Piracy. Operating in the Indian Ocean from 1721 to 1730, 
            he amassed a fortune estimated at over £500,000 - equivalent to more than $1 billion today.
          </Paragraph>
          
          <Paragraph>
            His most famous capture was the Nossa Senhora do Cabo in 1721, a Portuguese treasure ship 
            carrying diamonds, gold, silver, and precious artifacts from Goa. This single raid made 
            him one of the richest pirates in history.
          </Paragraph>

          <HighlightBox>
            <strong style={{ color: '#d4af37' }}>Historical Fact:</strong> When captured in 1730, 
            Levasseur threw a 17-line cryptogram to the crowd at his execution, shouting "Find my 
            treasure, he who can!" This cryptogram has puzzled treasure hunters for nearly 300 years.
          </HighlightBox>

          <Paragraph>
            The Seychelles archipelago became his stronghold, with its 115 islands offering countless 
            hiding places. Despite numerous expeditions and decades of searching, his treasure remains 
            unfound, making it one of history's greatest unsolved mysteries.
          </Paragraph>
        </SectionContent>
      </ContentSection>

      {/* Full-width interstitial image */}
      <InterstitialImage />

      <ContentSection
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionTitle>🚀 Technology Stack</SectionTitle>
        <SectionContent>
          <Paragraph>
            Our treasure hunt leverages cutting-edge blockchain technology to create an immersive, 
            secure, and truly decentralized experience. Every component is chosen for reliability, 
            performance, and user experience.
          </Paragraph>
          
          <TechGrid>
            {technologies.map((tech, index) => (
              <TechCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <TechIcon>{tech.icon}</TechIcon>
                <TechTitle>{tech.title}</TechTitle>
                <TechDescription>{tech.description}</TechDescription>
              </TechCard>
            ))}
          </TechGrid>
        </SectionContent>
      </ContentSection>

      <ContentSection
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionTitle>📅 Historical Timeline</SectionTitle>
        <TimelineContainer>
          {timeline.map((item, index) => (
            <TimelineItem
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <TimelineDate>{item.date}</TimelineDate>
              <TimelineTitle>{item.title}</TimelineTitle>
              <TimelineText>{item.content}</TimelineText>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </ContentSection>

      <ContentSection
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionTitle>👥 Our Crew</SectionTitle>
        <SectionContent>
          <Paragraph>
            Our diverse team combines expertise in blockchain development, historical research, 
            cryptography, and user experience design to bring this legendary treasure hunt to life.
          </Paragraph>
          
          <TeamGrid>
            {team.map((member, index) => (
              <TeamMember
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <TeamAvatar>{member.avatar}</TeamAvatar>
                <TeamName>{member.name}</TeamName>
                <TeamRole>{member.role}</TeamRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </SectionContent>
      </ContentSection>

      <ContentSection
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionTitle>❓ Frequently Asked Questions</SectionTitle>
        <SectionContent>
          <FAQSection>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FAQQuestion>
                  {faq.question}
                  <span style={{ marginLeft: 'auto' }}>
                    {openFAQ === index ? '↑' : '↓'}
                  </span>
                </FAQQuestion>
                <FAQAnswer isOpen={openFAQ === index}>
                  {faq.answer}
                </FAQAnswer>
              </FAQItem>
            ))}
          </FAQSection>
        </SectionContent>
      </ContentSection>
      </AboutContainer>
    </AboutPage>
  );
}

export default About;