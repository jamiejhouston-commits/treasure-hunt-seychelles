import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Client } from 'xrpl';
import toast from 'react-hot-toast';

// Mock XUMM for development (replace with real XUMM SDK when credentials are available)
const mockXumm = {
  ping: async () => ({ pong: true }),
  payload: {
    create: async (payload) => ({ 
      uuid: 'mock-uuid', 
      next: { always: 'https://xumm.app/sign/mock' },
      refs: { qr_png: 'data:image/png;base64,mock' }
    }),
    get: async (uuid) => ({
      meta: { signed: true },
      response: {
        resolved: true,
        account: 'rMockAccount123456789ABCDEFGH',
        user_token: 'mock-user-token',
        txid: 'MOCK_TX_ID'
      }
    })
  },
  user: {
    get: async (token) => ({ account: 'rMockAccount123456789ABCDEFGH' })
  }
};

// Initialize XUMM SDK or use mock
let xumm = mockXumm;

// Try to initialize real XUMM if credentials exist
try {
  if (process.env.REACT_APP_XUMM_API_KEY && process.env.REACT_APP_XUMM_API_SECRET) {
    const { Xumm } = require('xumm-sdk');
    xumm = new Xumm(
      process.env.REACT_APP_XUMM_API_KEY,
      process.env.REACT_APP_XUMM_API_SECRET
    );
  }
} catch (error) {
  console.warn('XUMM SDK initialization failed, using mock:', error.message);
}

// Initialize XRPL Client
const client = new Client(process.env.REACT_APP_XRPL_SERVER || 'wss://s.altnet.rippletest.net:51233');

// Wallet state structure
const initialState = {
  isConnected: false,
  isConnecting: false,
  address: null,
  balance: null,
  userToken: null,
  error: null,
  networkInfo: null
};

// Action types
const actionTypes = {
  CONNECTING: 'CONNECTING',
  CONNECT_SUCCESS: 'CONNECT_SUCCESS',
  CONNECT_ERROR: 'CONNECT_ERROR',
  DISCONNECT: 'DISCONNECT',
  UPDATE_BALANCE: 'UPDATE_BALANCE',
  SET_NETWORK_INFO: 'SET_NETWORK_INFO'
};

// Reducer function
function walletReducer(state, action) {
  switch (action.type) {
    case actionTypes.CONNECTING:
      return { ...state, isConnecting: true, error: null };
    
    case actionTypes.CONNECT_SUCCESS:
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        address: action.payload.address,
        userToken: action.payload.userToken,
        error: null
      };
    
    case actionTypes.CONNECT_ERROR:
      return {
        ...state,
        isConnected: false,
        isConnecting: false,
        error: action.payload.error
      };
    
    case actionTypes.DISCONNECT:
      return {
        ...initialState
      };
    
    case actionTypes.UPDATE_BALANCE:
      return {
        ...state,
        balance: action.payload.balance
      };
    
    case actionTypes.SET_NETWORK_INFO:
      return {
        ...state,
        networkInfo: action.payload.networkInfo
      };
    
    default:
      return state;
  }
}

// Create context
const WalletContext = createContext();

// Provider component
export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // Connect to XRPL client on mount
  useEffect(() => {
    const initializeClient = async () => {
      try {
        if (!client.isConnected()) {
          await client.connect();
          
          // Get network info
          const networkInfo = await client.request({
            command: 'server_info'
          });
          
          dispatch({
            type: actionTypes.SET_NETWORK_INFO,
            payload: { networkInfo: networkInfo.result }
          });
        }
      } catch (error) {
        console.error('Failed to connect to XRPL:', error);
        toast.error('Failed to connect to XRPL network');
      }
    };

    initializeClient();

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  // Update balance function
  const updateBalance = useCallback(async (address = state.address) => {
    if (!address || !client.isConnected()) return;

    try {
      const accountInfo = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      });

      const balance = parseFloat(accountInfo.result.account_data.Balance) / 1000000; // Convert drops to XRP
      
      dispatch({
        type: actionTypes.UPDATE_BALANCE,
        payload: { balance }
      });
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, [state.address]);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const userToken = localStorage.getItem('xumm_user_token');
        if (userToken) {
          const user = await xumm.user.get(userToken);
          if (user && user.account) {
            dispatch({
              type: actionTypes.CONNECT_SUCCESS,
              payload: {
                address: user.account,
                userToken: userToken
              }
            });
            try { localStorage.setItem('buyer_account', user.account); } catch (_) {}
            
            // Fetch balance
            await updateBalance(user.account);
          } else {
            localStorage.removeItem('xumm_user_token');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('xumm_user_token');
      }
    };

    checkExistingSession();
  }, [updateBalance]);

  // Connect wallet function
  const connect = async () => {
    dispatch({ type: actionTypes.CONNECTING });
    
    try {
      // Create sign-in request
      const request = await xumm.payload.create({
        txjson: {
          TransactionType: 'SignIn'
        }
      });

      if (request && request.next && request.next.always) {
        // Open XUMM app
        window.open(request.next.always, '_blank');
        
        toast.success('Please sign in using XUMM mobile app');

        // Poll for result
        const result = await xumm.payload.get(request.uuid);
        
        if (result.response.resolved && result.response.account) {
          const userToken = result.response.user_token;
          
          // Store user token
          localStorage.setItem('xumm_user_token', userToken);
          
          dispatch({
            type: actionTypes.CONNECT_SUCCESS,
            payload: {
              address: result.response.account,
              userToken: userToken
            }
          });
          try { localStorage.setItem('buyer_account', result.response.account); } catch (_) {}

          // Fetch balance
          await updateBalance(result.response.account);
          
          toast.success('Wallet connected successfully!');
        } else {
          throw new Error('Sign-in was cancelled or failed');
        }
      } else {
        throw new Error('Failed to create sign-in request');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      dispatch({
        type: actionTypes.CONNECT_ERROR,
        payload: { error: error.message }
      });
      toast.error(`Connection failed: ${error.message}`);
    }
  };

  // Disconnect wallet function
  const disconnect = () => {
    localStorage.removeItem('xumm_user_token');
    dispatch({ type: actionTypes.DISCONNECT });
    toast.success('Wallet disconnected');
  };

  // Submit transaction function
  const submitTransaction = async (txJson) => {
    if (!state.isConnected || !state.userToken) {
      throw new Error('Wallet not connected');
    }

    try {
      // Create payload
      const request = await xumm.payload.create({
        txjson: txJson,
        options: {
          submit: true
        }
      });

      if (request && request.next && request.next.always) {
        // Open XUMM app
        window.open(request.next.always, '_blank');
        
        toast.success('Please confirm transaction in XUMM app');

        // Wait for result
        const result = await xumm.payload.get(request.uuid);
        
        if (result.response.resolved && result.response.txid) {
          toast.success('Transaction submitted successfully!');
          
          // Update balance after transaction
          setTimeout(() => updateBalance(), 2000);
          
          return {
            success: true,
            txid: result.response.txid,
            account: result.response.account
          };
        } else {
          throw new Error('Transaction was cancelled or failed');
        }
      } else {
        throw new Error('Failed to create transaction request');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error(`Transaction failed: ${error.message}`);
      throw error;
    }
  };

  // Get NFT offers function
  const getNFTOffers = async (tokenId) => {
    if (!client.isConnected()) return [];

    try {
      const offers = await client.request({
        command: 'nft_sell_offers',
        nft_id: tokenId
      });

      return offers.result.offers || [];
    } catch (error) {
      console.error('Failed to fetch NFT offers:', error);
      return [];
    }
  };

  // Get account NFTs function
  const getAccountNFTs = async (address = state.address) => {
    if (!address || !client.isConnected()) return [];

    try {
      const nfts = await client.request({
        command: 'account_nfts',
        account: address,
        ledger_index: 'validated'
      });

      return nfts.result.account_nfts || [];
    } catch (error) {
      console.error('Failed to fetch account NFTs:', error);
      return [];
    }
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Functions
    connect,
    disconnect,
    updateBalance,
    submitTransaction,
    getNFTOffers,
    getAccountNFTs,
    
    // XRPL client access
    client,
    xumm
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}