# MediaVisual - Media Visualization Tool

A Salesforce Lightning Web Component (LWC) that provides a visual representation of label and tag media types with customizable dimensions.

## Overview

MediaVisual is a tool designed to help visualize different types of media (Labels and Tags) with customizable dimensions, shapes, and formats. It's implemented as a Lightning Web Component for Salesforce and provides a real-time preview of how media will look with specified dimensions.

## Features

- **Media Type Selection**: Choose between Label and Tag types
- **Finished Format Options**: Specify Roll or Fanfold formats
- **Measurement Units**: Toggle between Inches and Millimeters for all dimensions
- **Customizable Dimensions**: Set precise width and length measurements
- **Label-specific Settings**: 
  - Shape selection (Square/Rectangle, Circular/Oval, Jewelry/Rat-tail, Other)
  - Gap Down, Left Margin, Right Margin, and Corner Radius specifications
- **Tag-specific Settings**:
  - Sensing details selection (Black Sensing Mark, Left and Right Notches, Left only Notch, Right only Notch, Central Sensing Slot)
- **Standard Perforation Option**: Choose whether to display standard perforations
- **Multiple Label/Tag Display**: Shows 1-3 labels/tags based on length:
  - 3 labels/tags when length ≤ 3 inches (or 76.2 mm)
  - 2 labels/tags when length > 3 inches (or 76.2 mm) but ≤ 5 inches (or 127 mm)
  - 1 label/tag when length > 5 inches (or 127 mm)
- **Dynamic Visualization**: Real-time rendering of media with proper proportions and appearance
- **Responsive Design**: Properly scaled visualization that works across different screen sizes
- **Automatic Unit Conversion**: Values automatically convert when switching between inches and millimeters

## Visual Representation

- **Labels**: Displayed with white center on light gray liner background with proper margins
- **Tags**: Displayed at full width with beige background and dashed perforation lines
- **Tag Sensing Details**:
  - Black Sensing Mark: Horizontal black bar positioned 20px above bottom perforation
  - Left and Right Notches: Rectangular cutouts (14px x 40px) on both sides at perforation lines
  - Left only Notch: Rectangular cutout only on the left side at perforation lines
  - Right only Notch: Rectangular cutout only on the right side at perforation lines
  - Central Sensing Slot: Rectangular slots at both top and bottom center (40px wide)
- **Responsive Layout**: Container sizing adapts based on dimensions with consistent padding
- **Clear Canvas**: Visualization clears when switching between media types for a fresh render

## Usage

1. Select a Media Type (Label or Tag)
2. Choose a Finished Format
3. Select your preferred Measurement Unit (Inches or Millimeters)
4. Enter the Width and Length measurements
5. If Label is selected, choose a Shape type and set Standard Perforation (Yes/No)
6. If Tag is selected, choose a Sensing Details option
7. Click "Render Design" to visualize the media

## Technical Details

The component uses:
- Lightning Web Components framework
- Dynamic HTML/CSS rendering
- JavaScript for calculations and dynamic UI adjustments

### Key Components

- **mediaVisualizer** - Main LWC component containing the visualization logic
- **Visual Properties**:
  - Canvas background color: #828282 (medium gray)
  - Liner color: #f6f6f6 (very light gray)
  - Tag color: #FDF5E6 (off-white/beige)
  - Label color: White with black border

## Implementation Notes

- The visualization is for reference only and includes a disclaimer that it's not to actual scale
- Dimensions are converted from user units to pixels using the appropriate scaling factor:
  - For inches: 1 inch = 96 pixels
  - For millimeters: 1 mm = 96/25.4 ≈ 3.78 pixels
- Fixed padding ensures consistent layout across different dimension settings
- Dynamic bottom padding adjusts for narrow visualizations where text may wrap
- Sensing details for tags are rendered as cutouts or bars with specific positioning relative to perforation lines
- Unit conversion applies a factor of 25.4 (1 inch = 25.4 mm) when switching between units

## Development

This project is developed using Salesforce CLI. You can deploy it to a Salesforce org using:

```bash
sf deploy metadata --source-dir force-app --verbose
```

## Disclaimer

The visualization is not to actual scale and doesn't reflect all features of the final product upon purchasing.
