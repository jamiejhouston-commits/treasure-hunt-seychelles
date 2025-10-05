# Fonts Setup

Place the following (open-licensed) font TTF files in this directory to enable proper typography for Chapter VI card rendering:

Required families & weights:
- Cinzel-Bold.ttf (or Cinzel-ExtraBold if Bold unavailable)
- Inter-Regular.ttf
- Inter-SemiBold.ttf
- Inter-Medium.ttf
- Inter-Italic.ttf (italic style for riddles)

You can obtain these from Google Fonts:
- Cinzel: https://fonts.google.com/specimen/Cinzel
- Inter:  https://fonts.google.com/specimen/Inter

File naming expectations (match exactly or adjust registerFont calls):
```
fonts/
  Cinzel-Bold.ttf
  Inter-Regular.ttf
  Inter-SemiBold.ttf
  Inter-Medium.ttf
  Inter-Italic.ttf
```
If a file is missing, the generator falls back to system sans and logs a warning.
