import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// NFT state structure
const initialState = {
  selectedNFT: null,
  filters: {
    rarity: null,
    status: null,
    priceRange: null,
    search: '',
    sortBy: 'oldest',
    chapter: null,
    minted: null
  },
  pagination: {
    page: 1,
    limit: 12  // Reduced from 20 to 12 for better pagination
  }
};

const queryKeys = {
  nfts: (filters) => ['nfts', filters],
  nft: (tokenId) => ['nft', tokenId],
  stats: ['nft-stats']
};

// Action types
const actionTypes = {
  SET_SELECTED_NFT: 'SET_SELECTED_NFT',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  RESET_FILTERS: 'RESET_FILTERS'
};

// Reducer function
function nftReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_SELECTED_NFT:
      return { ...state, selectedNFT: action.payload };
    
    case actionTypes.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 } // Reset to first page when filtering
      };
    
    case actionTypes.SET_PAGINATION:
      return { 
        ...state, 
        pagination: { ...state.pagination, ...action.payload }
      };
    
    case actionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        pagination: initialState.pagination
      };
    
    default:
      return state;
  }
}

// Helper mappers
const toTitleCase = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const normalizePremintImagePath = (uri) => {
  if (!uri) return uri;
  const trimmed = uri.split('?')[0];
  const match = trimmed.match(/(.*\/ch6_premint\/)(?:ch6_)?(\d+)\.png$/i);
  if (match) {
    const [, prefix, num] = match;
    const padded = num.padStart(3, '0');
    return `${prefix}ch6_${padded}.png`;
  }
  return trimmed;
};

const resolveImage = (item) => {
  // Chapter VII painterly assets 
  if (item.chapter === 'Chapter VII' && item.image_uri && item.image_uri.includes('/ch7_sirens_map/')) {
    return item.image_uri.startsWith('http')
      ? item.image_uri
      : `http://localhost:3001${item.image_uri}`;
  }

  // Chapter VI pre-mint assets have image_uri like /ch6_premint/{n}.png
  if (item.chapter === 'VI' && item.image_uri && item.image_uri.includes('/ch6_premint/')) {
    const normalized = normalizePremintImagePath(item.image_uri);
    return normalized.startsWith('http')
      ? normalized
      : `http://localhost:3001${normalized}`;
  }

  const imageUrlCandidate = item.image_url || item.imageUrl;
  if (typeof imageUrlCandidate === 'string') {
    const normalizedCandidate = normalizePremintImagePath(imageUrlCandidate);
    const badIpfsWrapped = normalizedCandidate.includes('ipfs://');
    const isHttp = normalizedCandidate.startsWith('http://') || normalizedCandidate.startsWith('https://');
    if (isHttp && !badIpfsWrapped) return normalizedCandidate;
  }

  const ipfs = item.image_uri || item.imageUrl || item.ipfs_image;
  if (typeof ipfs === 'string') {
    if (ipfs.includes('/ch6_premint/')) {
      const normalized = normalizePremintImagePath(ipfs);
      return normalized.startsWith('http')
        ? normalized
        : `http://localhost:3001${normalized}`;
    }
    if (ipfs.startsWith('ipfs://')) {
      if (item.token_id != null) return `http://localhost:3001/real/images/${item.token_id}.png`;
      if (item.id != null) return `http://localhost:3001/real/images/${item.id}.png`;
    }
    return ipfs.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }

  if (item.token_id != null) return `http://localhost:3001/real/images/${item.token_id}.png`;
  if (item.id != null) return `http://localhost:3001/real/images/${item.id}.png`;
  return undefined;
};

// Minted definition: ONLY when on-chain id present.
const mapListItem = (item) => {
  const minted = !!item.nftoken_id;
  let status;
  if (item.for_sale && minted) status = 'available';
  else if (item.current_owner && minted) status = 'sold';
  else if (minted) status = 'minted';
  else status = 'unminted';

  // Parse layers if it's a string
  let parsedLayers = item.layers;
  if (typeof item.layers === 'string') {
    try {
      parsedLayers = JSON.parse(item.layers);
    } catch (e) {
      console.warn('Failed to parse layers for NFT', item.token_id, e);
      parsedLayers = [];
    }
  }

  // Parse attributes if it's a string
  let parsedAttributes = item.attributes;
  if (typeof item.attributes === 'string') {
    try {
      parsedAttributes = JSON.parse(item.attributes);
    } catch (e) {
      parsedAttributes = null;
    }
  }

  return {
    tokenId: item.token_id,
    sequence: item.token_id,
    rarity: toTitleCase(item.rarity),
    currentOwner: item.current_owner,
    currentOffer: item.for_sale ? { amount: item.price_xrp, id: item.offer_id || undefined } : null,
    attributes: parsedAttributes,
    metadata: {
      name: item.name,
      description: item.description,
      image: resolveImage(item)
    },
    status,
    minted,
    nftokenId: item.nftoken_id || null,
    // Preserve raw NFT data for Gallery components (with parsed layers)
    ...item,
    layers: parsedLayers, // Override with parsed version
    attributes: parsedAttributes // Override with parsed version
  };
};

const mapDetailItem = (d) => {
  const minted = !!d.nftoken_id;
  let status;
  if (d.for_sale && minted) status = 'available';
  else if (d.current_owner && minted) status = 'sold';
  else if (minted) status = 'minted';
  else status = 'unminted';
  return {
    tokenId: d.token_id,
    sequence: d.token_id,
    rarity: toTitleCase(d.rarity),
    currentOwner: d.current_owner,
    currentOffer: d.for_sale
      ? { amount: d.price_xrp, id: d.offer_id || undefined }
      : (Array.isArray(d.offers) && d.offers.length > 0
          ? { amount: d.offers[0].price_xrp, id: d.offers[0].id }
          : null),
    attributes: d.attributes,
    metadata: {
      name: d.name,
      description: d.description,
      image: resolveImage(d)
    },
    clue: d?.clue_data?.cipher || d?.clue_data?.hint || null,
    history: d.history || [],
    offers: d.offers || [],
    status,
    minted,
    nftokenId: d.nftoken_id || null
  };
};

// API functions
const api = {
  // Fetch NFTs with filters
  fetchNFTs: async ({ page = 1, limit = 12, rarity, status, minPrice, maxPrice, search, sortBy = 'newest', chapter, minted }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    console.log('🔍 Fetching NFTs with params:', { page, limit, rarity, status, minPrice, maxPrice, search, sortBy, chapter, minted });
    
    // Align UI filters to backend params
    if (rarity) params.append('rarity', rarity.toLowerCase());
    if (status) {
      if (status === 'available') params.append('forSale', 'true');
      if (status === 'sold') params.append('forSale', 'false');
      // 'auction' not supported on backend yet
    }
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
  if (search) params.append('search', search);
  if (chapter) params.append('chapter', chapter);
  if (minted !== null && minted !== undefined) params.append('minted', minted ? 'true' : 'false');

    console.log('🌐 API URL:', `${API_BASE_URL}/nfts?${params}`);

    // Sorting map -> backend sortBy/sortOrder
    const sortMap = {
      newest: { field: 'token_id', order: 'desc' },
      oldest: { field: 'token_id', order: 'asc' },
      'price-low': { field: 'price_xrp', order: 'asc' },
      'price-high': { field: 'price_xrp', order: 'desc' },
      rarity: { field: 'rarity', order: 'asc' }
    };
    const s = sortMap[sortBy] || sortMap.newest;
    params.append('sortBy', s.field);
    params.append('sortOrder', s.order);

    const response = await fetch(`${API_BASE_URL}/nfts?${params}`);
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      throw new Error('Failed to fetch NFTs');
    }
    const data = await response.json();
    
    console.log('✅ API Response:', { 
      nfts: data.nfts?.length || 0, 
      total: data.total, 
      pagination: data.pagination 
    });
    
    return {
      ...data,
      nfts: (Array.isArray(data.nfts) ? data.nfts : []).map(mapListItem)
    };
  },

  // Fetch single NFT
  fetchNFT: async (tokenId) => {
    const response = await fetch(`${API_BASE_URL}/nfts/${tokenId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NFT');
    }
    const data = await response.json();
    return mapDetailItem(data);
  },

  // Fetch NFT stats
  fetchStats: async () => {
    const response = await fetch(`${API_BASE_URL}/nfts/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },

  // Create offer
  createOffer: async (offerData) => {
    const response = await fetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': localStorage.getItem('api_key') || ''
      },
      body: JSON.stringify(offerData)
    });
    if (!response.ok) {
      throw new Error('Failed to create offer');
    }
    return response.json();
  },

  // Accept offer
  acceptOffer: async (offerId) => {
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': localStorage.getItem('api_key') || ''
      },
      body: JSON.stringify({ buyerAccount: localStorage.getItem('buyer_account') })
    });
    if (!response.ok) {
      throw new Error('Failed to accept offer');
    }
    return response.json();
  },

  // Submit puzzle solution
  submitSolution: async (solutionData) => {
    const response = await fetch(`${API_BASE_URL}/treasure-hunt/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': localStorage.getItem('api_key') || ''
      },
      body: JSON.stringify(solutionData)
    });
    if (!response.ok) {
      throw new Error('Failed to submit solution');
    }
    return response.json();
  }
};

// Create context
const NFTContext = createContext();

// Provider component
export function NFTProvider({ children }) {
  const [state, dispatch] = useReducer(nftReducer, initialState);
  const queryClient = useQueryClient();

  // Fetch NFTs query
  const {
    data: nftsData,
    isLoading: isLoadingNFTs,
    error: nftsError,
    refetch: refetchNFTs
  } = useQuery({
    queryKey: queryKeys.nfts({ ...state.filters, ...state.pagination }),
    queryFn: () => api.fetchNFTs({
      ...state.filters,
      ...state.pagination,
      minPrice: state.filters.priceRange?.[0],
      maxPrice: state.filters.priceRange?.[1]
    }),
    keepPreviousData: true,
    staleTime: 30000 // 30 seconds
  });

  // Fetch stats query
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError
  } = useQuery({
    queryKey: queryKeys.stats,
    queryFn: api.fetchStats,
    staleTime: 60000 // 1 minute
  });

  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: api.createOffer,
    onSuccess: (data) => {
      toast.success('Offer created successfully!');
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
    onError: (error) => {
      toast.error(`Failed to create offer: ${error.message}`);
    }
  });

  // Accept offer mutation
  const acceptOfferMutation = useMutation({
    mutationFn: api.acceptOffer,
    onSuccess: (data) => {
      toast.success('Offer accepted successfully!');
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
    },
    onError: (error) => {
      toast.error(`Failed to accept offer: ${error.message}`);
    }
  });

  // Submit solution mutation
  const submitSolutionMutation = useMutation({
    mutationFn: api.submitSolution,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Congratulations! Solution verified!');
        if (data.treasureAwarded) {
          toast.success('🏆 You have been awarded the Treasure NFT!');
        }
      } else {
        toast.error('Solution incorrect. Keep trying!');
      }
    },
    onError: (error) => {
      toast.error(`Failed to submit solution: ${error.message}`);
    }
  });

  // Action handlers
  const setSelectedNFT = useCallback((nft) => {
    dispatch({ type: actionTypes.SET_SELECTED_NFT, payload: nft });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: filters });
  }, []);

  const setPagination = useCallback((pagination) => {
    dispatch({ type: actionTypes.SET_PAGINATION, payload: pagination });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: actionTypes.RESET_FILTERS });
  }, []);

  // Fetch single NFT function
  const fetchNFT = useCallback(async (tokenId) => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.nft(tokenId),
        queryFn: () => api.fetchNFT(tokenId),
        staleTime: 30000
      });
      return response;
    } catch (error) {
      toast.error(`Failed to fetch NFT: ${error.message}`);
      throw error;
    }
  }, [queryClient]);

  // Create offer function
  const createOffer = useCallback(async (offerData) => {
    return createOfferMutation.mutateAsync(offerData);
  }, [createOfferMutation]);

  // Accept offer function
  const acceptOffer = useCallback(async (offerId) => {
    return acceptOfferMutation.mutateAsync(offerId);
  }, [acceptOfferMutation]);

  // Submit solution function
  const submitSolution = useCallback(async (solutionData) => {
    return submitSolutionMutation.mutateAsync(solutionData);
  }, [submitSolutionMutation]);

  // Context value
  const value = {
    // State
    ...state,
    
    // Data
    nfts: nftsData?.nfts || [],
    totalNFTs: nftsData?.total || 0,
    totalPages: nftsData?.totalPages || 0,
  stats,
  availableFilters: nftsData?.filters?.available || null,
  appliedFilters: nftsData?.filters?.applied || null,
    
    // Loading states
    isLoadingNFTs,
    isLoadingStats,
    isCreatingOffer: createOfferMutation.isLoading,
    isAcceptingOffer: acceptOfferMutation.isLoading,
    isSubmittingSolution: submitSolutionMutation.isLoading,
    
    // Error states
    nftsError,
    statsError,
    
    // Actions
    setSelectedNFT,
    setFilters,
    setPagination,
    resetFilters,
    refetchNFTs,
    
    // API functions
    fetchNFT,
    createOffer,
    acceptOffer,
    submitSolution
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
}

// Hook to use NFT context
export function useNFT() {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
}