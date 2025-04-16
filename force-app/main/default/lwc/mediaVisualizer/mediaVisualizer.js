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

        // Update the field value directly
        this[fieldName] = event.target.value;

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

        // Create a more uniform padding that's proportional to the dimensions
        // Use the same percentage for width and height to ensure uniform padding
        const paddingPercentage = 0.15; // 15% padding on all sides
        const minPadding = 40; // Minimum padding in pixels
        
        // Calculate padding based on the dimensions
        const widthPadding = Math.max(validatedLinerWidth * paddingPercentage, minPadding);
        const heightPadding = Math.max(validatedLinerHeight * paddingPercentage, minPadding);
        
        // Add extra height for the note text (at least 40px)
        const noteHeight = 40;
        
        // Dynamically size the container based on the dimensions plus padding
        const containerWidth = validatedLinerWidth + (widthPadding * 2);
        const containerHeight = validatedLinerHeight + (heightPadding * 2) + noteHeight;

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
        visualWrapper.style.top = `${heightPadding}px`;
        visualWrapper.style.left = `${widthPadding}px`;
        visualWrapper.style.width = `${validatedLinerWidth}px`;
        visualWrapper.style.height = `${validatedLinerHeight}px`;
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
            // Render Liner and Label
            const liner = document.createElement('div');
            liner.style.width = `${validatedLinerWidth}px`;
            liner.style.height = `${validatedLinerHeight}px`;
            liner.style.backgroundColor = '#FFF9DB'; // Liner color
            liner.style.position = 'absolute'; // Absolute position within the visual wrapper
            liner.style.top = '0';
            liner.style.left = '0';
            liner.style.display = 'flex';
            liner.style.alignItems = 'center';
            liner.style.justifyContent = 'center';
            liner.style.boxSizing = 'border-box';

            // Set individual border styles for dashed top/bottom and solid left/right
            liner.style.borderTop = '2px dashed #000';
            liner.style.borderBottom = '2px dashed #000';
            liner.style.borderLeft = '2px solid #000';
            liner.style.borderRight = '2px solid #000';

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

            visualWrapper.appendChild(liner);
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
}
