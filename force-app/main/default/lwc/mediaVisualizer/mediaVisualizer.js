import { LightningElement } from 'lwc';

export default class MediaVisualizer extends LightningElement {
    // Component state
    mediaType = ''; // No default media type
    finishedFormat = ''; // No default finished format
    width = null; // Empty width
    length = null; // Empty length
    gapDown = 0.1250; // Static gap down value (in inches)
    leftMargin = 0.1250; // Static left margin value (in inches)
    rightMargin = 0.1250; // Static right margin value (in inches)
    cornerRadius = 0.1250; // Static corner radius value (in inches)
    shape = 'Square/Rectangle'; // Default shape for label
    standardPerforation = 'Yes'; // Default value for standard perforation

    // Options for comboboxes
    mediaTypeOptions = [
        { label: 'Label', value: 'Label' },
        { label: 'Tag', value: 'Tag' }
    ];

    finishedFormatOptions = [
        { label: 'Roll', value: 'Roll' },
        { label: 'Fanfold', value: 'Fanfold' }
    ];

    shapeOptions = [
        { label: 'Square/Rectangle', value: 'Square/Rectangle' },
        { label: 'Circular/Oval', value: 'Circular/Oval' },
        { label: 'Jewelry/Rat-tail', value: 'Jewelry/Rat-tail' },
        { label: 'Other', value: 'Other' }
    ];
    
    perforationOptions = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];

    // Computed property to determine if additional fields should be shown
    get isLabel() {
        return this.mediaType === 'Label';
    }

    // Lifecycle hook to ensure the canvas is hidden on page load
    connectedCallback() {
        const container = this.template.querySelector('.render-container');
        if (container) {
            container.style.display = 'none'; // Ensure the canvas is hidden on page load
        }
    }

    // Handles input changes for all fields
    handleInputChange(event) {
        const fieldName = event.target.dataset.field; // Use data-field for field identification

        // Check if the fieldName exists; if not, log an error for debugging
        if (!fieldName) {
            console.error('Field name not found in data-field attribute.');
            return;
        }

        // Handle checkbox input differently since it uses 'checked' instead of 'value'
        if (event.target.type === 'checkbox') {
            this[fieldName] = event.target.checked;
        } else {
            // Update the field value directly for other input types
            this[fieldName] = event.target.value;
        }

        // Log the updated value for debugging
        console.log(`${fieldName} updated to: ${this[fieldName]}`);

        // Specifically log if mediaType or shape is updated
        if (fieldName === 'mediaType') {
            console.log(`Media Type updated to: ${this.mediaType}`);
        }
        if (fieldName === 'shape') {
            console.log(`Shape updated to: ${this.shape}`);
        }
    }

    // Handles the Render Design button click
    handleRenderDesign() {
        console.log(`Width: ${this.width}, Length: ${this.length}`);
        console.log(`Media Type: ${this.mediaType}`);
        console.log(`Shape: ${this.shape}`);
        console.log(`Standard Perforation: ${this.standardPerforation}`);

        // Validate required fields
        if (this.width == null || this.length == null) {
            console.error('Width and Length must be specified!');
            return;
        }

        const scaleFactor = 96; // Scale factor for rendering (1 inch = 96 pixels)

        // Correctly calculate liner dimensions: width is horizontal, length is vertical
        const linerWidth = this.width * scaleFactor; // Width becomes the horizontal dimension
        const linerHeight = this.length * scaleFactor; // Length becomes the vertical dimension

        console.log(`Liner Dimensions (px): Width = ${linerWidth}, Height = ${linerHeight}`);

        // Validate liner dimensions
        const validatedLinerWidth = Math.max(linerWidth, 1);
        const validatedLinerHeight = Math.max(linerHeight, 1);

        console.log(`Validated Liner Dimensions (px): Width = ${validatedLinerWidth}, Height = ${validatedLinerHeight}`);

        // Calculate label dimensions
        let labelWidth = validatedLinerWidth - (this.leftMargin + this.rightMargin) * scaleFactor;
        let labelHeight = validatedLinerHeight - 2 * this.gapDown * scaleFactor;

        console.log(`Label Dimensions (px): Width = ${labelWidth}, Height = ${labelHeight}`);

        // Locate the rendering container
        const container = this.template.querySelector('.render-container');
        if (!container) {
            console.error('Render container not found!');
            return;
        }
        
        // Determine number of labels to display based on length (for both perforated and non-perforated)
        let numLabelsToShow = 3; // Default
        if (this.mediaType === 'Label') {
            if (this.length > 5) {
                numLabelsToShow = 1; // Show only 1 label if length > 5 inches
            } else if (this.length > 3) {
                numLabelsToShow = 2; // Show 2 labels if length > 3 inches but <= 5 inches
            }
            // Otherwise show 3 labels (default)
        }
        
        // Create a more uniform padding that's proportional to the dimensions
        // Use the same percentage for width and height to ensure uniform padding
        const paddingPercentage = 0.15; // 15% padding on all sides
        const minPadding = 40; // Minimum padding in pixels
        
        // Calculate padding based on the dimensions
        const widthPadding = Math.max(validatedLinerWidth * paddingPercentage, minPadding);
        
        // For multi-label display, adjust height padding
        let heightPadding;
        if (this.mediaType === 'Label' && numLabelsToShow > 1) {
            // Add space for (numLabelsToShow - 1) additional labels
            heightPadding = Math.max(validatedLinerHeight * paddingPercentage, minPadding) + 
                            validatedLinerHeight * 0.5;
        } else {
            heightPadding = Math.max(validatedLinerHeight * paddingPercentage, minPadding);
        }
        
        // Add extra height for the note text (at least 40px)
        const noteHeight = 40;
        
        // Dynamically size the container based on the dimensions plus padding
        const containerWidth = validatedLinerWidth + (widthPadding * 2);
        const containerHeight = validatedLinerHeight * (this.mediaType === 'Label' ? numLabelsToShow : 1) + 
                               (heightPadding * 2) + noteHeight;

        // Make container visible and set its properties
        container.style.width = `${containerWidth}px`;
        container.style.height = `${containerHeight}px`;
        container.style.position = 'relative';
        container.style.margin = '0 auto';
        container.style.display = 'block';
        container.style.backgroundColor = '#f4f4f4';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '5px';
        container.style.overflow = 'hidden'; // Ensure content doesn't flow outside
        container.style.boxSizing = 'border-box';

        // Clear the container
        container.innerHTML = '';

        // Create a wrapper for the visualization that centers content
        const visualWrapper = document.createElement('div');
        visualWrapper.style.position = 'absolute';
        visualWrapper.style.top = `${heightPadding - (this.mediaType === 'Label' && numLabelsToShow > 1 ? validatedLinerHeight / 2 : 0)}px`;
        visualWrapper.style.left = `${widthPadding}px`;
        visualWrapper.style.width = `${validatedLinerWidth}px`;
        visualWrapper.style.height = `${this.mediaType === 'Label' ? validatedLinerHeight * numLabelsToShow : validatedLinerHeight}px`;
        container.appendChild(visualWrapper);

        // Create a separate container for the note text
        const noteContainer = document.createElement('div');
        noteContainer.style.position = 'absolute';
        noteContainer.style.bottom = '10px';
        noteContainer.style.left = '0';
        noteContainer.style.width = '100%';
        noteContainer.style.textAlign = 'center';
        noteContainer.style.padding = '10px';
        noteContainer.style.boxSizing = 'border-box';

        const noteText = document.createElement('div');
        noteText.innerText = 'Note: Not to actual scale. This render does not reflect the final drawing after purchasing';
        noteText.style.fontSize = '12px';
        noteText.style.color = '#666';
        noteText.style.fontStyle = 'italic';
        noteText.style.fontWeight = 'bold';
        noteText.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent background
        noteText.style.padding = '5px';
        noteText.style.borderRadius = '3px';
        noteText.style.display = 'inline-block'; // To make background only as wide as text
        
        noteContainer.appendChild(noteText);
        container.appendChild(noteContainer);

        // Render based on Media Type
        if (this.mediaType === 'Label') {
            // Determine if we should use perforations or not
            const hasPerforations = this.standardPerforation === 'Yes';
            
            if (numLabelsToShow === 1) {
                // Just render a single liner
                this.renderSingleLiner(visualWrapper, validatedLinerWidth, validatedLinerHeight, labelWidth, labelHeight, scaleFactor, hasPerforations);
                
                // For a single liner, add dashed border on top and bottom if perforated
                if (hasPerforations) {
                    const singleLiner = visualWrapper.firstChild;
                    singleLiner.style.borderTop = '2px dashed #000';
                    singleLiner.style.borderBottom = '2px dashed #000';
                }
            } else if (numLabelsToShow === 2) {
                // Render 2 liners
                const topLiner = this.createLiner(validatedLinerWidth, validatedLinerHeight, labelWidth, labelHeight, scaleFactor, false);
                topLiner.style.top = '0';
                
                const bottomLiner = this.createLiner(validatedLinerWidth, validatedLinerHeight, labelWidth, labelHeight, scaleFactor, false);
                bottomLiner.style.top = `${validatedLinerHeight}px`;
                
                visualWrapper.appendChild(topLiner);
                visualWrapper.appendChild(bottomLiner);
                
                // Add perforation lines if needed
                if (hasPerforations) {
                    // Add dashed line between two liners
                    const perforationLine = document.createElement('div');
                    perforationLine.style.position = 'absolute';
                    perforationLine.style.left = '0';
                    perforationLine.style.top = `${validatedLinerHeight}px`;
                    perforationLine.style.width = '100%';
                    perforationLine.style.borderTop = '2px dashed #000';
                    visualWrapper.appendChild(perforationLine);
                    
                    // Add top and bottom dashed lines
                    topLiner.style.borderTop = '2px dashed #000';
                    bottomLiner.style.borderBottom = '2px dashed #000';
                }
            } else {
                // Render 3 liners (default)
                const topLiner = this.createLiner(validatedLinerWidth, validatedLinerHeight, labelWidth, labelHeight, scaleFactor, false);
                topLiner.style.top = '0';
                
                const middleLiner = this.createLiner(validatedLinerWidth, validatedLinerHeight, labelWidth, labelHeight, scaleFactor, false);
                middleLiner.style.top = `${validatedLinerHeight}px`;
                
                const bottomLiner = this.createLiner(validatedLinerWidth, validatedLinerHeight, labelWidth, labelHeight, scaleFactor, false);
                bottomLiner.style.top = `${validatedLinerHeight * 2}px`;
                
                visualWrapper.appendChild(topLiner);
                visualWrapper.appendChild(middleLiner);
                visualWrapper.appendChild(bottomLiner);
                
                // Add perforation lines if needed
                if (hasPerforations) {
                    // Add dashed lines between liners
                    for (let i = 1; i < 3; i++) {
                        const perforationLine = document.createElement('div');
                        perforationLine.style.position = 'absolute';
                        perforationLine.style.left = '0';
                        perforationLine.style.top = `${validatedLinerHeight * i}px`;
                        perforationLine.style.width = '100%';
                        perforationLine.style.borderTop = '2px dashed #000';
                        visualWrapper.appendChild(perforationLine);
                    }
                    
                    // Add top and bottom dashed lines
                    topLiner.style.borderTop = '2px dashed #000';
                    bottomLiner.style.borderBottom = '2px dashed #000';
                }
            }
        } else if (this.mediaType === 'Tag') {
            // Render Tag
            const tag = document.createElement('div');
            tag.style.width = `${validatedLinerWidth}px`;
            tag.style.height = `${validatedLinerHeight}px`;
            tag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
            tag.style.position = 'absolute';
            tag.style.top = '0';
            tag.style.left = '0';
            tag.style.boxSizing = 'border-box';

            // Set dashed borders on top and bottom (like a liner)
            tag.style.borderTop = '2px dashed #000';
            tag.style.borderBottom = '2px dashed #000';
            tag.style.borderLeft = '2px solid #000';
            tag.style.borderRight = '2px solid #000';
            
            visualWrapper.appendChild(tag);
        }

        console.log('Design rendered.');
    }

    // Helper method to create a liner with a label
    createLiner(linerWidth, linerHeight, labelWidth, labelHeight, scaleFactor, hasPerforations) {
        const liner = document.createElement('div');
        liner.style.width = `${linerWidth}px`;
        liner.style.height = `${linerHeight}px`;
        liner.style.backgroundColor = '#FFF9DB'; // Liner color
        liner.style.position = 'absolute';
        liner.style.left = '0';
        liner.style.display = 'flex';
        liner.style.alignItems = 'center';
        liner.style.justifyContent = 'center';
        liner.style.boxSizing = 'border-box';

        // Set border styles based on whether perforations are needed
        if (hasPerforations) {
            // Only apply top border if it's the first liner
            liner.dataset.perfType = 'perforated';
        } else {
            liner.style.borderTop = '1px solid transparent';
            liner.style.borderBottom = '1px solid transparent';
        }
        
        // Always have solid borders on left and right
        liner.style.borderLeft = '2px solid #000';
        liner.style.borderRight = '2px solid #000';

        // Add label based on shape
        if (this.shape === 'Jewelry/Rat-tail') {
            // Outer wrapper for the border
            const outerWrapper = document.createElement('div');
            outerWrapper.style.width = `${labelWidth}px`;
            outerWrapper.style.height = `${labelHeight}px`;
            outerWrapper.style.backgroundColor = '#000';
            outerWrapper.style.position = 'relative';
            outerWrapper.style.display = 'flex';
            outerWrapper.style.alignItems = 'center';
            outerWrapper.style.justifyContent = 'center';
            outerWrapper.style.clipPath = 'polygon(0% 0%, 20% 0%, 50% 25%, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 50% 75%, 20% 100%, 0% 100%)';

            // Inner clipped shape
            const innerShape = document.createElement('div');
            innerShape.style.width = `${labelWidth - 6}px`;
            innerShape.style.height = `${labelHeight - 6}px`;
            innerShape.style.backgroundColor = '#FFFFFF';
            innerShape.style.clipPath = 'polygon(0% 0%, 20% 0%, 50% 25%, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 50% 75%, 20% 100%, 0% 100%)';
            innerShape.style.margin = '3px';

            outerWrapper.appendChild(innerShape);
            liner.appendChild(outerWrapper);
        } else {
            const label = document.createElement('div');
            label.style.width = `${labelWidth}px`;
            label.style.height = `${labelHeight}px`;
            label.style.backgroundColor = '#FFFFFF';
            label.style.position = 'relative';
            label.style.border = '2px solid #000';
            label.style.borderRadius = this.shape === 'Circular/Oval' ? '50%' : `${this.cornerRadius * scaleFactor}px`;
            label.style.boxSizing = 'border-box';
            liner.appendChild(label);
        }

        return liner;
    }

    // Helper method to render a single liner (used for standard perforation = Yes)
    renderSingleLiner(parent, linerWidth, linerHeight, labelWidth, labelHeight, scaleFactor, hasPerforations) {
        const liner = this.createLiner(linerWidth, linerHeight, labelWidth, labelHeight, scaleFactor, hasPerforations);
        liner.style.top = '0';
        parent.appendChild(liner);
    }
}
