#!/bin/bash

echo "=== Testing Puzzle Layer URLs ==="
echo ""

echo "NFT #5 - Cipher Text Layer:"
curl -sI "http://localhost:3001/treasure_hunt/chapter1/layers/nft_5_layer_1.png" | grep -E "(HTTP|Content-Length|Last-Modified|ETag)"
echo ""

echo "NFT #12 - Map Fragment Layer:"
curl -sI "http://localhost:3001/treasure_hunt/chapter1/layers/nft_12_layer_2.png" | grep -E "(HTTP|Content-Length|Last-Modified|ETag)"
echo ""

echo "NFT #17 - Decoding Key Layer:"
curl -sI "http://localhost:3001/treasure_hunt/chapter1/layers/nft_17_layer_3.png" | grep -E "(HTTP|Content-Length|Last-Modified|ETag)"
echo ""

echo "NFT #20 - Coordinates Layer:"
curl -sI "http://localhost:3001/treasure_hunt/chapter1/layers/nft_20_layer_1.png" | grep -E "(HTTP|Content-Length|Last-Modified|ETag)"
echo ""

echo "=== Expected File Sizes ==="
echo "NFT #5:  ~24KB (24274 bytes)"
echo "NFT #12: ~29KB (29344 bytes)"
echo "NFT #17: ~28KB (29112 bytes)"
echo "NFT #20: ~29KB (29992 bytes)"
