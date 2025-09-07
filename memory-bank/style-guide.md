# Style Guide - Updated from Figma Design

## Colors (Figma-Aligned Light Theme)
- **Primary Background**: #FFFFFF (Clean white for main backgrounds)
- **Secondary Background**: #FAFAFB (Very light gray for subtle differentiation)
- **Input Background**: #DEE1E6 (Light gray for form inputs and disabled states)
- **Primary Accent**: #67AAF9 (Blue for buttons, links, and interactive elements)
- **Border Color**: #DEE1E6 (Light gray for borders and dividers)
- **Text Primary**: #171A1F (Dark charcoal for primary text)
- **Text Secondary**: #565D6D (Medium gray for secondary text and labels)

## Typography (Figma-Specified Fonts)
- **Section Headers**: Archivo, weight 600, 20px, line-height 28px
- **Form Labels**: Inter, weight 500, 16px, line-height 24px  
- **Large Text**: Inter, weight 500, 18px, line-height 28px
- **Body Text**: Inter, weight 400, 14px, line-height 20px
- **Button Text**: Inter, weight 500, 14px, line-height 22px
- **App Name**: 24px, weight 600, letter-spacing 1px

## Components (Figma-Based Specifications)

### Buttons
- **Primary Button**: 
  - Background: #67AAF9
  - Text: #FFFFFF
  - Padding: 13px vertical, 24px horizontal
  - Border radius: 6px
  - Border: none
- **Secondary Button**:
  - Background: transparent
  - Text: #67AAF9
  - Border: 1px solid #DEE1E6
  - Same padding and radius as primary
- **Disabled Button**:
  - Background: #F3F4F6
  - Text: #565D6D
  - 50% opacity

### Form Elements
- **Text Inputs**:
  - Background: #DEE1E6
  - Border: 1px solid #DEE1E6
  - Border radius: 6px
  - Padding: 11px 12px
  - Placeholder: #565D6D
- **Selection Containers**:
  - Background: #FFFFFF
  - Border: 1px solid #DEE1E6 (default), #67AAF9 (selected)
  - Border radius: 10px
  - Padding: 16px
  - Shadow: 0px 0px 1px rgba(23, 26, 31, 0.07), 0px 0px 2px rgba(23, 26, 31, 0.12)

### Cards & Containers
- **Main Cards**:
  - Background: #FFFFFF
  - Border radius: 10px
  - Shadow: 0px 0px 1px rgba(23, 26, 31, 0.07), 0px 0px 2px rgba(23, 26, 31, 0.12)
  - Border: 1px solid #FFFFFF (for consistency)

### Layout
- **Screen Padding**: 24px horizontal (standard mobile padding)
- **Section Spacing**: 20px between major sections
- **Element Spacing**: 8px between related elements, 16px between groups
- **Avatar Size**: 80px x 80px with 40px border radius

## Design Patterns (Updated for Light Theme)
- Clean, modern light theme optimized for clarity and accessibility
- Card-based layout with subtle shadows for visual hierarchy  
- Consistent use of flexbox for responsive layouts
- SafeAreaView for proper device compatibility
- TouchableOpacity with 0.8 activeOpacity for interactions
- Minimalist iconography with clear visual feedback
- High contrast ratios for accessibility compliance
- Progressive disclosure through card-based information architecture
