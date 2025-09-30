# Educational Block Puzzle Game Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern mobile puzzle games like Tetris Mobile, Monument Valley, and educational apps like Duolingo. The game requires visual appeal to engage players while maintaining clear functionality for educational content.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Background: 220 15% 8% (dark navy for game area)
- Game board: 220 10% 12% (slightly lighter for contrast)
- UI elements: 160 60% 45% (sustainable green for buttons/accents)

**Block Colors:**
- Use vibrant, distinct colors for different block types: 
- 0 80% 60% (red), 30 90% 55% (orange), 60 70% 50% (yellow), 120 60% 45% (green), 200 70% 55% (blue), 280 65% 60% (purple)

**Light Mode Support:**
- Background: 220 20% 95%
- Game board: 220 15% 88%
- Text: 220 15% 15%

### B. Typography
**Primary Font:** Inter (Google Fonts)
- Game UI: 400-600 weights
- Keywords on blocks: 600 weight, 12-14px
- Score display: 700 weight, 18-24px
- Sentence completion: 400 weight, 16px

**Secondary Font:** JetBrains Mono for game elements requiring monospace clarity

### C. Layout System
**Tailwind Spacing:** Primarily use units 2, 4, 6, and 8
- Button padding: p-4
- Game board margins: m-6
- Component spacing: gap-4
- Mobile touch targets: min-h-12 (48px minimum)

### D. Component Library

**Game Board:**
- Rounded corners (rounded-lg)
- Subtle drop shadow for depth
- Grid lines with low opacity borders

**Control Buttons:**
- Large touch-friendly circular buttons (min 60px diameter)
- Positioned at bottom for thumb accessibility
- Icons from Heroicons (chevron-left, chevron-right, arrow-path, chevron-down)
- Haptic feedback visual states

**Modal Overlays:**
- Sentence completion popup: full-screen overlay with centered card
- Blur background (backdrop-blur-sm)
- Rounded modal with generous padding (p-8)
- Clear typography hierarchy

**Keyword Blocks:**
- High contrast text on block colors
- Rounded corners matching game aesthetic
- Subtle text shadows for readability

**Score Display:**
- Fixed position top-right
- Animated number changes
- Progress indicators for point thresholds

**Email Capture:**
- Simple, friendly form design
- Clear value proposition ("Get your achievement card!")
- Minimal fields (email only)

### E. Mobile-First Responsive Design

**Phone Portrait (Primary):**
- Game board: 80% width, centered
- Controls: Bottom sticky bar with 4 buttons
- Score: Top-right corner, compact
- Modals: Full-screen with safe area padding

**Tablet/Desktop:**
- Maintain game proportions
- Add side information panels
- Larger text sizes for readability

### F. Visual Feedback & Animations
**Minimal Animation Strategy:**
- Block placement: Subtle scale animation (scale-105)
- Row completion: Brief highlight before clearing
- Score increases: Number count-up animation
- Button presses: Quick scale feedback (scale-95)

**No Distracting Elements:**
- Avoid particle effects or continuous animations
- Focus on clear state changes and feedback

### G. Accessibility Considerations
- High contrast ratios for all text
- Large touch targets (minimum 44px)
- Clear visual hierarchy
- Support for reduced motion preferences
- Screen reader friendly labels

## Key Design Principles
1. **Mobile-First:** Every interaction optimized for touch
2. **Educational Focus:** Clear presentation of learning content
3. **Game Clarity:** Unambiguous visual states and feedback
4. **Progressive Engagement:** Visual rewards encourage continued play
5. **Sustainable Theme:** Color choices reflect environmental consciousness

This design creates an engaging, educational mobile game that balances entertainment with meaningful learning about global citizenship and sustainability.