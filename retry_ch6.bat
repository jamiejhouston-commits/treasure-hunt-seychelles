@echo off
echo 🔄 RETRY MINTING ALL FAILED CHAPTER VI NFTs
echo ============================================
echo.

cd /d "C:\Users\andre\The Levasseur Treasure of Seychelles\scripts"
node optimized_retry_mint.cjs

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ RETRY MINTING COMPLETED SUCCESSFULLY!
) else (
    echo.
    echo ❌ RETRY MINTING FAILED WITH ERROR CODE %ERRORLEVEL%
)

pause