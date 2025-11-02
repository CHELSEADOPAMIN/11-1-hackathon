# 🎨 Icon & Branding Update

## Changes Made

### 1. Browser Tab Title
- **Before**: "Create Next App"
- **After**: "Recovery Companion - AI-Powered Rehabilitation Platform"

### 2. Favicon (Browser Tab Icon)
- **Design**: Purple circle (#8573bd) with white letter "H"
- **Files Created**:
  - `src/app/icon.tsx` - 32x32px favicon
  - `src/app/apple-icon.tsx` - 180x180px Apple touch icon
  - `public/icon.svg` - SVG version for reference

### 3. How It Works

Next.js automatically detects and uses:
- `src/app/icon.tsx` for the browser favicon
- `src/app/apple-icon.tsx` for iOS/Apple devices

These files use the `ImageResponse` API to dynamically generate the icons.

### 4. Icon Specifications

**Color Scheme**:
- Background: `#8573bd` (brand purple)
- Letter: `white`
- Font: Bold, sans-serif

**Sizes**:
- Standard favicon: 32x32px
- Apple touch icon: 180x180px

### 5. Preview

The browser tab will now display:
- 🟣 Purple circle with white "H"
- Title: "Recovery Companion - AI-Powered Rehabilitation Platform"

### 6. Deployment

When you deploy to Vercel:
1. The icons will be automatically generated
2. No additional configuration needed
3. Works across all modern browsers and devices

## Customization

To change the icon:
1. Edit `src/app/icon.tsx`
2. Modify the `background` color or letter
3. Changes take effect on next page reload

