# MediaVisual - Media Visualization Tool

A Salesforce Lightning Web Component (LWC) that provides a visual representation of label and tag media types with customizable dimensions.

## Overview

MediaVisual is a tool designed to help visualize different types of media (Labels and Tags) with customizable dimensions, shapes, and formats. It's implemented as a Lightning Web Component for Salesforce and provides a real-time preview of how media will look with specified dimensions.

## Features

- **Media Type Selection**: Choose between Label and Tag types
- **Finished Format Options**: Specify Roll or Fanfold formats
- **Customizable Dimensions**: Set precise width and length measurements (in inches)
- **Label-specific Settings**: 
  - Shape selection (Square/Rectangle, Circular/Oval, Jewelry/Rat-tail, Other)
  - Gap Down, Left Margin, Right Margin, and Corner Radius specifications
- **Dynamic Visualization**: Real-time rendering of media with proper proportions and appearance
- **Responsive Design**: Properly scaled visualization that works across different screen sizes

## Usage

1. Select a Media Type (Label or Tag)
2. Choose a Finished Format
3. Enter the Width and Length measurements (in inches)
4. If Label is selected, choose a Shape type
5. Click "Render Design" to visualize the media

## Technical Details

The component uses:
- Lightning Web Components framework
- Dynamic HTML/CSS rendering
- JavaScript for calculations and dynamic UI adjustments

### Key Components

- **mediaVisualizer** - Main LWC component containing the visualization logic

## Implementation Notes

- The visualization is for reference only and includes a disclaimer that it's not to actual scale
- All dimensions are converted from inches to pixels using a scaling factor of 96 (1 inch = 96 pixels)
- The component uses specific styling to represent different media types:
  - Labels: White center with black border on liner background
  - Tags: Off-white/beige appearance with appropriate border styling

## Development

This project is developed using Salesforce DX. You can deploy it to a Salesforce org using:

```bash
sfdx force:source:deploy -p force-app
```

## Disclaimer

The visualization is not to actual scale and doesn't reflect all features of the final product upon purchasing.
