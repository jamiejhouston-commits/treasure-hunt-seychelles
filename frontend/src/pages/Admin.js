import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const AdminTitle = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${props => props.theme.colors.primary};
`;

const AdminStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${props => props.theme.colors.surface};
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 1px solid ${props => props.authorized ? props.theme.colors.success : props.theme.colors.error};
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.authorized ? props.theme.colors.success : props.theme.colors.error};
`;

const UnauthorizedMessage = styled.div`
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 3rem 2rem;
  margin-top: 2rem;
`;

const LoginForm = styled.form`
  max-width: 400px;
  margin: 2rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoginInput = styled.input`
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #333333;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LoginButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: #000000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5d976;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const AdminCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  font-family: 'Cinzel', serif;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #d4af37 0%, #f5d976 100%)' : 
    'transparent'
  };
  color: ${props => props.primary ? '#000000' : props.theme.colors.primary};
  border: ${props => props.primary ? 'none' : `2px solid ${props.theme.colors.primary}`};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: ${props => props.primary ? 
      'linear-gradient(135deg, #f5d976 0%, #d4af37 100%)' : 
      props.theme.colors.primary
    };
    color: #000000;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LogsSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
`;

const LogsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #333333;
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
`;

const LogItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #333333;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  
  &:last-child {
    border-bottom: none;
  }
  
  .timestamp {
    color: ${props => props.theme.colors.primary};
  }
  
  .level {
    color: ${props => {
      switch (props.level) {
        case 'error': return props.theme.colors.error;
        case 'warn': return props.theme.colors.warning;
        case 'info': return props.theme.colors.success;
        default: return props.theme.colors.textSecondary;
      }
    }};
    font-weight: 600;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.error};
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [mintLogs, setMintLogs] = useState([]);
  const appendLog = (level, msg) => setMintLogs(prev => [...prev, { t: new Date().toISOString(), level, msg }]);

  // Check if user is authorized on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('admin_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsAuthorized(true);
      loadStats();
      loadLogs();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter API key');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        localStorage.setItem('admin_api_key', apiKey);
        setIsAuthorized(true);
        toast.success('Admin access granted');
        loadStats();
        loadLogs();
      } else {
        toast.error('Invalid API key');
      }
    } catch (error) {
      toast.error('Failed to verify credentials');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_api_key')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/logs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_api_key')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const callStep = async (endpoint, label) => {
    try {
      setLoading(true);
      appendLog('info', `▶ ${label} started`);
      const res = await fetch(`${API_BASE_URL}/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_api_key')}` }
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Step failed');
      appendLog('info', data.output?.slice(-2000) || `${label} done`);
      toast.success(`${label} complete`);
    } catch (e) {
      appendLog('error', `${label} error: ${e.message}`);
      toast.error(`${label} failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const syncNFTData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/sync-nfts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_api_key')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Synced ${data.synced} NFTs`);
        loadStats();
      } else {
        toast.error('Failed to sync NFT data');
      }
    } catch (error) {
      toast.error('Failed to sync NFT data');
    } finally {
      setLoading(false);
    }
  };

  const verifyPuzzleSolution = async () => {
    setShowModal('puzzle');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_api_key');
    setIsAuthorized(false);
    setApiKey('');
    setStats(null);
    setLogs([]);
  };

  if (!isAuthorized) {
    return (
      <AdminContainer>
        <AdminHeader>
          <AdminTitle>🔐 Admin Panel</AdminTitle>
          <AdminStatus authorized={false}>
            <StatusIndicator authorized={false} />
            <span>Unauthorized</span>
          </AdminStatus>
        </AdminHeader>
        <UnauthorizedMessage>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>
            Access Restricted
          </h3>
          <p>Please enter your admin API key to continue.</p>
          <LoginForm onSubmit={handleLogin}>
            <LoginInput
              type="password"
              placeholder="Admin API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <LoginButton type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </LoginButton>
          </LoginForm>
        </UnauthorizedMessage>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>⚡ Admin Dashboard</AdminTitle>
        <AdminStatus authorized={true}>
          <StatusIndicator authorized={true} />
          <span>Authorized</span>
          <ActionButton onClick={handleLogout}>
            Logout
          </ActionButton>
        </AdminStatus>
      </AdminHeader>

      <AdminGrid>
        <AdminCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardTitle>📊 Collection Stats</CardTitle>
          {stats && (
            <StatGrid>
              <StatItem>
                <StatNumber>{stats.totalNFTs || 0}</StatNumber>
                <StatLabel>Total NFTs</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.mintedNFTs || 0}</StatNumber>
                <StatLabel>Minted</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.uniqueOwners || 0}</StatNumber>
                <StatLabel>Owners</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.totalOffers || 0}</StatNumber>
                <StatLabel>Offers</StatLabel>
              </StatItem>
            </StatGrid>
          )}
          <ActionButton primary onClick={loadStats}>
            🔄 Refresh Stats
          </ActionButton>
        </AdminCard>

        <AdminCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <CardTitle>🪙 Minting Pipeline</CardTitle>
          <div style={{ marginBottom: '1rem' }}>
            <ActionButton onClick={() => callStep('mint/generate', 'Generate Art')} disabled={loading}>Generate Art</ActionButton>
            <ActionButton onClick={() => callStep('mint/metadata', 'Build Metadata')} disabled={loading}>Build Metadata</ActionButton>
            <ActionButton onClick={() => callStep('mint/ipfs', 'Upload to IPFS')} disabled={loading}>Upload to IPFS</ActionButton>
            <ActionButton primary onClick={() => callStep('mint/testnet', 'Mint on Testnet')} disabled={loading}>Mint on Testnet</ActionButton>
            <ActionButton onClick={syncNFTData} disabled={loading}>Sync NFT Data</ActionButton>
          </div>
          <div>
            <h4 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Pipeline Logs</h4>
            <LogsList>
              {mintLogs.length > 0 ? (
                mintLogs.map((l, i) => (
                  <LogItem key={i} level={l.level}>
                    <span className="timestamp">[{l.t}]</span> <span className="level">{l.level}</span> - {l.msg}
                  </LogItem>
                ))
              ) : (
                <LogItem>No pipeline activity yet</LogItem>
              )}
            </LogsList>
          </div>
        </AdminCard>

        <AdminCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardTitle>🔗 XRPL Integration</CardTitle>
          {stats && (
            <StatGrid>
              <StatItem>
                <StatNumber>{stats.pendingTxs || 0}</StatNumber>
                <StatLabel>Pending Txs</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.syncStatus === 'current' ? '✅' : '⚠️'}</StatNumber>
                <StatLabel>Sync Status</StatLabel>
              </StatItem>
            </StatGrid>
          )}
          <ActionButton primary onClick={syncNFTData} disabled={loading}>
            {loading ? '⏳ Syncing...' : '🔄 Sync NFT Data'}
          </ActionButton>
          <ActionButton onClick={() => setShowModal('xrpl')}>
            🔍 View XRPL Status
          </ActionButton>
        </AdminCard>

        <AdminCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardTitle>🧩 Puzzle Management</CardTitle>
          {stats && (
            <StatGrid>
              <StatItem>
                <StatNumber>{stats.totalSubmissions || 0}</StatNumber>
                <StatLabel>Submissions</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>{stats.treasureClaimed ? '🏆' : '❓'}</StatNumber>
                <StatLabel>Treasure</StatLabel>
              </StatItem>
            </StatGrid>
          )}
          <ActionButton primary onClick={verifyPuzzleSolution}>
            🔍 Verify Solution
          </ActionButton>
          <ActionButton onClick={() => setShowModal('submissions')}>
            📋 View Submissions
          </ActionButton>
        </AdminCard>
      </AdminGrid>

      <LogsSection>
        <LogsHeader>
          <h3 style={{ color: '#d4af37', fontFamily: 'Cinzel, serif' }}>
            📜 System Logs
          </h3>
          <ActionButton onClick={loadLogs}>
            🔄 Refresh Logs
          </ActionButton>
        </LogsHeader>
        
        <LogsList>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <LogItem key={index} level={log.level}>
                <span className="timestamp">{new Date(log.timestamp).toLocaleString()}</span>
                {' '}
                <span className="level">[{log.level.toUpperCase()}]</span>
                {' '}
                {log.message}
              </LogItem>
            ))
          ) : (
            <LogItem>No logs available</LogItem>
          )}
        </LogsList>
      </LogsSection>

      {/* Modals */}
      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(null)}
        >
          <ModalContent>
            <ModalHeader>
              <h3 style={{ color: '#d4af37' }}>
                {showModal === 'puzzle' && '🧩 Puzzle Verification'}
                {showModal === 'xrpl' && '🔗 XRPL Status'}
                {showModal === 'submissions' && '📋 Recent Submissions'}
              </h3>
              <CloseButton onClick={() => setShowModal(null)}>
                ×
              </CloseButton>
            </ModalHeader>
            
            {showModal === 'puzzle' && (
              <div>
                <p>Manual puzzle verification interface would be implemented here.</p>
              </div>
            )}
            
            {showModal === 'xrpl' && (
              <div>
                <p>XRPL network status and connection details would be displayed here.</p>
              </div>
            )}
            
            {showModal === 'submissions' && (
              <div>
                <p>Recent puzzle submissions list would be shown here.</p>
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </AdminContainer>
  );
}

export default Admin;