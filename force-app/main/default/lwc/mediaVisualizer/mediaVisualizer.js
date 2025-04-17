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
    sensingDetails = ''; // No default sensing details
    measurementUnit = 'Inches'; // Default to Inches
    measurementUnitOptions = [
        { label: 'Inches', value: 'Inches' },
        { label: 'Millimeters', value: 'Millimeters' }
    ];

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

    sensingDetailsOptions = [
        { label: 'Black Sensing Mark', value: 'Black Sensing Mark' },
        { label: 'Left and Right Notches', value: 'Left and Right Notches' },
        { label: 'Left only Notch', value: 'Left only Notch' },
        { label: 'Right only Notch', value: 'Right only Notch' },
        { label: 'Central Sensing Slot', value: 'Central Sensing Slot' }
    ];

    // Computed property to determine if additional fields should be shown
    get isLabel() {
        return this.mediaType === 'Label';
    }

    // Computed property to determine if tag specific fields should be shown
    get isTag() {
        return this.mediaType === 'Tag';
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

        // Handle measurement unit changes
        if (fieldName === 'measurementUnit') {
            const newUnit = event.detail ? event.detail.value : event.target.value;
            if (newUnit !== this.measurementUnit) {
                this.convertAllFields(newUnit);
                this.measurementUnit = newUnit;
            }
        } else if (event.target.type === 'checkbox') {
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
            
            // Clear the render container when Media Type changes
            const container = this.template.querySelector('.render-container');
            if (container) {
                container.innerHTML = ''; // Clear any existing content
                container.style.display = 'none'; // Hide the container
                console.log('Render container cleared due to Media Type change');
            }
        }
        if (fieldName === 'shape') {
            console.log(`Shape updated to: ${this.shape}`);
        }
    }

    // Converts all relevant fields between inches and millimeters
    convertAllFields(newUnit) {
        const fields = ['width', 'length', 'gapDown', 'leftMargin', 'rightMargin', 'cornerRadius'];
        const factor = 25.4;
        if (newUnit === 'Millimeter' && this.measurementUnit === 'Inches') {
            fields.forEach(f => {
                if (this[f] != null && this[f] !== '') {
                    this[f] = parseFloat((parseFloat(this[f]) * factor).toFixed(4));
                }
            });
        } else if (newUnit === 'Inches' && this.measurementUnit === 'Millimeter') {
            fields.forEach(f => {
                if (this[f] != null && this[f] !== '') {
                    this[f] = parseFloat((parseFloat(this[f]) / factor).toFixed(4));
                }
            });
        }
    }

    // Handles the Render Design button click
    handleRenderDesign() {
        console.log(`Width: ${this.width}, Length: ${this.length}`);
        console.log(`Media Type: ${this.mediaType}`);
        
        if (this.mediaType === 'Label') {
            console.log(`Shape: ${this.shape}`);
            console.log(`Standard Perforation: ${this.standardPerforation}`);
        } else if (this.mediaType === 'Tag') {
            console.log(`Sensing Details: ${this.sensingDetails}`);
        }

        // Validate required fields
        if (this.width == null || this.length == null) {
            console.error('Width and Length must be specified!');
            return;
        }

        const scaleFactor = this.measurementUnit === 'Inches' ? 96 : 96 / 25.4;

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
        
        // Determine number of labels/tags to display based on length and unit
        let numLabelsToShow = 3; // Default
        
        // Adjust thresholds based on measurement unit
        const lengthThreshold1 = this.measurementUnit === 'Inches' ? 5 : 5 * 25.4; // 5 inches or ~127 mm
        const lengthThreshold2 = this.measurementUnit === 'Inches' ? 3 : 3 * 25.4; // 3 inches or ~76.2 mm
        
        if (this.length > lengthThreshold1) {
            numLabelsToShow = 1; // Show only 1 label/tag if length > threshold1
        } else if (this.length > lengthThreshold2) {
            numLabelsToShow = 2; // Show 2 labels/tags if length > threshold2 but <= threshold1
        }
        // Otherwise show 3 labels/tags (default)
        
        // Set fixed padding values instead of calculated ones
        const horizontalPadding = 40; // Fixed horizontal padding on both sides
        const topPadding = 40; // Fixed padding at top
        
        // Adjust bottom padding based on width - narrower widths need more padding for wrapped text
        let bottomPadding = 50; // Default bottom padding
        
        // If the width is narrow enough that the note text might wrap to two lines, increase padding
        if (validatedLinerWidth < 300) {
            bottomPadding = 70; // Increased padding for narrow widths
        }

        // Calculate the height needed for labels/tags
        const totalLabelsHeight = validatedLinerHeight * numLabelsToShow;
        
        // Fixed container dimensions with consistent padding
        const containerWidth = validatedLinerWidth + (horizontalPadding * 2);
        const containerHeight = totalLabelsHeight + topPadding + bottomPadding;

        // Make container visible and set its properties
        container.style.width = `${containerWidth}px`;
        container.style.height = `${containerHeight}px`;
        container.style.position = 'relative';
        container.style.margin = '0 auto';
        container.style.display = 'block';
        container.style.backgroundColor = '#828282';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '5px';
        container.style.overflow = 'hidden';
        container.style.boxSizing = 'border-box';

        // Clear the container
        container.innerHTML = '';

        // Create a wrapper for the visualization with fixed positioning
        const visualWrapper = document.createElement('div');
        visualWrapper.style.position = 'absolute';
        visualWrapper.style.top = `${topPadding}px`; // Fixed top padding
        visualWrapper.style.left = `${horizontalPadding}px`; // Fixed left padding
        visualWrapper.style.width = `${validatedLinerWidth}px`;
        visualWrapper.style.height = `${totalLabelsHeight}px`;
        container.appendChild(visualWrapper);

        // Create a separate container for the note text - adjust bottom position based on width
        const noteContainer = document.createElement('div');
        noteContainer.style.position = 'absolute';
        noteContainer.style.bottom = validatedLinerWidth < 300 ? '25px' : '15px'; // More space from bottom when narrow
        noteContainer.style.left = '0';
        noteContainer.style.width = '100%';
        noteContainer.style.textAlign = 'center';
        noteContainer.style.padding = '0';
        noteContainer.style.boxSizing = 'border-box';

        const noteText = document.createElement('div');
        noteText.innerText = 'Note: Not to actual scale. This render does not reflect the final drawing after purchasing';
        noteText.style.fontSize = '11px';
        noteText.style.color = '#666';
        noteText.style.fontStyle = 'italic';
        noteText.style.fontWeight = 'bold';
        noteText.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        noteText.style.padding = '3px';
        noteText.style.borderRadius = '3px';
        noteText.style.display = 'inline-block';
        
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
            // Render Tags - no liners, no margins, no gap down for tags
            if (numLabelsToShow === 1) {
                // Just render a single tag
                const tag = document.createElement('div');
                tag.style.width = `${validatedLinerWidth}px`;
                tag.style.height = `${validatedLinerHeight}px`;
                tag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
                tag.style.position = 'absolute';
                tag.style.top = '0';
                tag.style.left = '0';
                tag.style.boxSizing = 'border-box';
                tag.style.border = '2px solid #000'; // Solid border all around
                
                // Set dashed borders on top and bottom
                tag.style.borderTop = '2px dashed #000';
                tag.style.borderBottom = '2px dashed #000';
                
                visualWrapper.appendChild(tag);

                // Add sensing details
                this.renderTagWithSensingDetails(tag, validatedLinerWidth, validatedLinerHeight);
            } else if (numLabelsToShow === 2) {
                // Render 2 tags
                const topTag = document.createElement('div');
                topTag.style.width = `${validatedLinerWidth}px`;
                topTag.style.height = `${validatedLinerHeight}px`;
                topTag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
                topTag.style.position = 'absolute';
                topTag.style.top = '0';
                topTag.style.left = '0';
                topTag.style.boxSizing = 'border-box';
                topTag.style.borderTop = '2px dashed #000';
                topTag.style.borderLeft = '2px solid #000';
                topTag.style.borderRight = '2px solid #000';
                
                const bottomTag = document.createElement('div');
                bottomTag.style.width = `${validatedLinerWidth}px`;
                bottomTag.style.height = `${validatedLinerHeight}px`;
                bottomTag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
                bottomTag.style.position = 'absolute';
                bottomTag.style.top = `${validatedLinerHeight}px`;
                bottomTag.style.left = '0';
                bottomTag.style.boxSizing = 'border-box';
                bottomTag.style.borderBottom = '2px dashed #000';
                bottomTag.style.borderLeft = '2px solid #000';
                bottomTag.style.borderRight = '2px solid #000';
                
                // Add perforation line between tags
                const perforationLine = document.createElement('div');
                perforationLine.style.position = 'absolute';
                perforationLine.style.left = '0';
                perforationLine.style.top = `${validatedLinerHeight}px`;
                perforationLine.style.width = `${validatedLinerWidth}px`;
                perforationLine.style.height = '0';
                perforationLine.style.borderTop = '2px dashed #000';
                perforationLine.style.zIndex = '2'; // Ensure it's on top
                
                visualWrapper.appendChild(topTag);
                visualWrapper.appendChild(bottomTag);
                visualWrapper.appendChild(perforationLine);

                // Add sensing details
                this.renderTagWithSensingDetails(topTag, validatedLinerWidth, validatedLinerHeight);
                this.renderTagWithSensingDetails(bottomTag, validatedLinerWidth, validatedLinerHeight);
            } else {
                // Render 3 tags (default)
                const topTag = document.createElement('div');
                topTag.style.width = `${validatedLinerWidth}px`;
                topTag.style.height = `${validatedLinerHeight}px`;
                topTag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
                topTag.style.position = 'absolute';
                topTag.style.top = '0';
                topTag.style.left = '0';
                topTag.style.boxSizing = 'border-box';
                topTag.style.borderTop = '2px dashed #000';
                topTag.style.borderLeft = '2px solid #000';
                topTag.style.borderRight = '2px solid #000';
                
                const middleTag = document.createElement('div');
                middleTag.style.width = `${validatedLinerWidth}px`;
                middleTag.style.height = `${validatedLinerHeight}px`;
                middleTag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
                middleTag.style.position = 'absolute';
                middleTag.style.top = `${validatedLinerHeight}px`;
                middleTag.style.left = '0';
                middleTag.style.boxSizing = 'border-box';
                middleTag.style.borderLeft = '2px solid #000';
                middleTag.style.borderRight = '2px solid #000';
                
                const bottomTag = document.createElement('div');
                bottomTag.style.width = `${validatedLinerWidth}px`;
                bottomTag.style.height = `${validatedLinerHeight}px`;
                bottomTag.style.backgroundColor = '#FDF5E6'; // Off-white/beige color
                bottomTag.style.position = 'absolute';
                bottomTag.style.top = `${validatedLinerHeight * 2}px`;
                bottomTag.style.left = '0';
                bottomTag.style.boxSizing = 'border-box';
                bottomTag.style.borderBottom = '2px dashed #000';
                bottomTag.style.borderLeft = '2px solid #000';
                bottomTag.style.borderRight = '2px solid #000';
                
                visualWrapper.appendChild(topTag);
                visualWrapper.appendChild(middleTag);
                visualWrapper.appendChild(bottomTag);
                
                // Add standalone perforation lines between tags
                for (let i = 1; i < 3; i++) {
                    const perforationLine = document.createElement('div');
                    perforationLine.style.position = 'absolute';
                    perforationLine.style.left = '0';
                    perforationLine.style.top = `${validatedLinerHeight * i}px`;
                    perforationLine.style.width = `${validatedLinerWidth}px`;
                    perforationLine.style.height = '0';
                    perforationLine.style.borderTop = '2px dashed #000';
                    perforationLine.style.zIndex = '2'; // Ensure it's on top
                    visualWrapper.appendChild(perforationLine);
                }

                // Add sensing details
                this.renderTagWithSensingDetails(topTag, validatedLinerWidth, validatedLinerHeight);
                this.renderTagWithSensingDetails(middleTag, validatedLinerWidth, validatedLinerHeight);
                this.renderTagWithSensingDetails(bottomTag, validatedLinerWidth, validatedLinerHeight);
            }
        }

        console.log('Design rendered.');
    }

    // Helper method to create a liner with a label
    createLiner(linerWidth, linerHeight, labelWidth, labelHeight, scaleFactor, hasPerforations) {
        const liner = document.createElement('div');
        liner.style.width = `${linerWidth}px`;
        liner.style.height = `${linerHeight}px`;
        liner.style.backgroundColor = '#f6f6f6'; // Updated from #eeeeeb to #f6f6f6
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

    // Handle the rendering of sensing details for tags
    renderTagWithSensingDetails(tag, validatedLinerWidth, validatedLinerHeight) {
        if (this.sensingDetails === 'Left and Right Notches') {
            // Create rectangular cutouts aligned with perforation lines
            
            // Get perforation positions
            const perforationPositions = [];
            
            // Add the top perforation position (dashed line)
            perforationPositions.push(0); // Top edge of tag
            
            // If we have multiple tags stacked, add middle perforation positions
            const parent = tag.parentNode;
            if (parent && parent.children.length > 1) {
                // Check if this is not the last tag
                const tagIndex = Array.from(parent.children).indexOf(tag);
                if (tagIndex < parent.children.length - 1) {
                    perforationPositions.push(validatedLinerHeight); // Bottom edge of this tag
                }
            } else {
                // Single tag case - add bottom position
                perforationPositions.push(validatedLinerHeight); // Bottom edge of tag
            }
            
            // Size of the notches - back to the previous preferred size
            const notchWidth = 14;  // Height of the notch (vertical dimension)
            const notchDepth = 40;  // Depth of the notch (how far it extends)
            
            // Create notches at each perforation point
            perforationPositions.forEach(position => {
                // Create a div to cover up the dashed line in the notch area
                // Left notch cover
                const leftNotchCover = document.createElement('div');
                leftNotchCover.style.position = 'absolute';
                leftNotchCover.style.left = '0px'; 
                leftNotchCover.style.width = `${notchDepth}px`;
                leftNotchCover.style.height = `${notchWidth}px`;
                leftNotchCover.style.backgroundColor = '#828282'; // Same as background
                leftNotchCover.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                leftNotchCover.style.zIndex = '5'; // Higher z-index to cover the dashed line
                
                // Right notch cover
                const rightNotchCover = document.createElement('div');
                rightNotchCover.style.position = 'absolute';
                rightNotchCover.style.right = '0px'; 
                rightNotchCover.style.width = `${notchDepth}px`;
                rightNotchCover.style.height = `${notchWidth}px`;
                rightNotchCover.style.backgroundColor = '#828282'; // Same as background
                rightNotchCover.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                rightNotchCover.style.zIndex = '5'; // Higher z-index to cover the dashed line
                
                // Left notch cutout - create as background colored rectangle
                const leftNotchCutout = document.createElement('div');
                leftNotchCutout.style.position = 'absolute';
                leftNotchCutout.style.left = `-${1}px`; // Slightly overlap with tag edge
                leftNotchCutout.style.width = `${notchDepth}px`;
                leftNotchCutout.style.height = `${notchWidth}px`;
                leftNotchCutout.style.backgroundColor = '#828282'; // Same as background
                leftNotchCutout.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                leftNotchCutout.style.zIndex = '6'; // Even higher z-index
                
                // Right notch cutout
                const rightNotchCutout = document.createElement('div');
                rightNotchCutout.style.position = 'absolute';
                rightNotchCutout.style.right = `-${1}px`; // Slightly overlap with tag edge
                rightNotchCutout.style.width = `${notchDepth}px`;
                rightNotchCutout.style.height = `${notchWidth}px`;
                rightNotchCutout.style.backgroundColor = '#828282'; // Same as background
                rightNotchCutout.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                rightNotchCutout.style.zIndex = '6'; // Even higher z-index
                
                tag.appendChild(leftNotchCover);
                tag.appendChild(rightNotchCover);
                tag.appendChild(leftNotchCutout);
                tag.appendChild(rightNotchCutout);
            });
        } else if (this.sensingDetails === 'Left only Notch') {
            // Similar to both sides, but only create left notches
            // Get perforation positions
            const perforationPositions = [];
            
            // Add the top perforation position
            perforationPositions.push(0); // Top edge of tag
            
            // If we have multiple tags stacked, add middle perforation positions
            const parent = tag.parentNode;
            if (parent && parent.children.length > 1) {
                // Check if this is not the last tag
                const tagIndex = Array.from(parent.children).indexOf(tag);
                if (tagIndex < parent.children.length - 1) {
                    perforationPositions.push(validatedLinerHeight); // Bottom edge of this tag
                }
            } else {
                // Single tag case - add bottom position
                perforationPositions.push(validatedLinerHeight); // Bottom edge of tag
            }
            
            // Size of the notches - back to the previous preferred size
            const notchWidth = 14;  // Height of the notch (vertical dimension)
            const notchDepth = 40;  // Depth of the notch (how far it extends)
            
            // Create notches at each perforation point - left side only
            perforationPositions.forEach(position => {
                // Create a div to cover up the dashed line in the notch area
                const leftNotchCover = document.createElement('div');
                leftNotchCover.style.position = 'absolute';
                leftNotchCover.style.left = '0px'; 
                leftNotchCover.style.width = `${notchDepth}px`;
                leftNotchCover.style.height = `${notchWidth}px`;
                leftNotchCover.style.backgroundColor = '#828282'; // Same as background
                leftNotchCover.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                leftNotchCover.style.zIndex = '5'; // Higher z-index to cover the dashed line
                
                // Left notch - create as a cutout using background color
                const leftNotchCutout = document.createElement('div');
                leftNotchCutout.style.position = 'absolute';
                leftNotchCutout.style.left = `-${1}px`; // Slightly overlap with tag edge
                leftNotchCutout.style.width = `${notchDepth}px`;
                leftNotchCutout.style.height = `${notchWidth}px`;
                leftNotchCutout.style.backgroundColor = '#828282'; // Same as background
                leftNotchCutout.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                leftNotchCutout.style.zIndex = '6'; // Even higher z-index
                
                tag.appendChild(leftNotchCover);
                tag.appendChild(leftNotchCutout);
            });
        } else if (this.sensingDetails === 'Right only Notch') {
            // Similar to both sides, but only create right notches
            // Get perforation positions
            const perforationPositions = [];
            
            // Add the top perforation position
            perforationPositions.push(0); // Top edge of tag
            
            // If we have multiple tags stacked, add middle perforation positions
            const parent = tag.parentNode;
            if (parent && parent.children.length > 1) {
                // Check if this is not the last tag
                const tagIndex = Array.from(parent.children).indexOf(tag);
                if (tagIndex < parent.children.length - 1) {
                    perforationPositions.push(validatedLinerHeight); // Bottom edge of this tag
                }
            } else {
                // Single tag case - add bottom position
                perforationPositions.push(validatedLinerHeight); // Bottom edge of tag
            }
            
            // Size of the notches - back to the previous preferred size
            const notchWidth = 14;  // Height of the notch (vertical dimension)
            const notchDepth = 40;  // Depth of the notch (how far it extends)
            
            // Create notches at each perforation point - right side only
            perforationPositions.forEach(position => {
                // Create a div to cover up the dashed line in the notch area
                const rightNotchCover = document.createElement('div');
                rightNotchCover.style.position = 'absolute';
                rightNotchCover.style.right = '0px'; 
                rightNotchCover.style.width = `${notchDepth}px`;
                rightNotchCover.style.height = `${notchWidth}px`;
                rightNotchCover.style.backgroundColor = '#828282'; // Same as background
                rightNotchCover.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                rightNotchCover.style.zIndex = '5'; // Higher z-index to cover the dashed line
                
                // Right notch - create as a cutout
                const rightNotchCutout = document.createElement('div');
                rightNotchCutout.style.position = 'absolute';
                rightNotchCutout.style.right = `-${1}px`; // Slightly overlap with tag edge
                rightNotchCutout.style.width = `${notchDepth}px`;
                rightNotchCutout.style.height = `${notchWidth}px`;
                rightNotchCutout.style.backgroundColor = '#828282'; // Same as background
                rightNotchCutout.style.top = position === 0 ? 
                    `-${notchWidth/2}px` : // Center on the top perforation
                    `${position - notchWidth/2}px`; // Center on other perforations
                rightNotchCutout.style.zIndex = '6'; // Even higher z-index
                
                tag.appendChild(rightNotchCover);
                tag.appendChild(rightNotchCutout);
            });
        } else if (this.sensingDetails === 'Black Sensing Mark') {
            // Black sensing mark - only show one horizontal black bar at the bottom position
            
            // Size of the black bar
            const barHeight = 10; // Height of the black bar
            const barOffset = 20; // Offset from the perforation line (20px above)
            
            // Get the bottom perforation position
            let bottomPosition;
            
            // Determine if this is a multi-tag setup
            const parent = tag.parentNode;
            if (parent && parent.children.length > 1) {
                // Check if this is not the last tag
                const tagIndex = Array.from(parent.children).indexOf(tag);
                if (tagIndex < parent.children.length - 1) {
                    bottomPosition = validatedLinerHeight; // Bottom edge of this tag
                } else {
                    bottomPosition = validatedLinerHeight; // Bottom edge of tag
                }
            } else {
                // Single tag case
                bottomPosition = validatedLinerHeight; // Bottom edge of tag
            }
            
            // Create only one black bar at the bottom position
            const blackBar = document.createElement('div');
            blackBar.style.position = 'absolute';
            blackBar.style.left = '0';
            blackBar.style.width = '100%'; // Full width of the tag
            blackBar.style.height = `${barHeight}px`;
            blackBar.style.backgroundColor = '#000'; // Black color
            blackBar.style.zIndex = '3';
            
            // Position the black bar 20px above the bottom perforation line
            blackBar.style.top = `${bottomPosition - barOffset - barHeight}px`;
            
            tag.appendChild(blackBar);
        } else if (this.sensingDetails === 'Central Sensing Slot') {
            // Central sensing slots - at both top and bottom center
            
            // Size of the slot - using the same dimensions as notches for consistency
            const slotWidth = 14;  // Height of the slot (vertical dimension)
            const slotDepth = 20;  // Depth of the slot (half the notch depth since it's centered)
            
            // Create slot at the top center
            // First create a div to cover the dashed line in the slot area
            const topSlotCover = document.createElement('div');
            topSlotCover.style.position = 'absolute';
            topSlotCover.style.left = `${validatedLinerWidth / 2 - slotDepth}px`; // Center horizontally
            topSlotCover.style.width = `${slotDepth * 2}px`; // Width spans both sides of center
            topSlotCover.style.height = `${slotWidth}px`;
            topSlotCover.style.backgroundColor = '#828282'; // Same as background
            topSlotCover.style.top = `-${slotWidth/2}px`; // Center on the top perforation
            topSlotCover.style.zIndex = '5'; // Higher z-index to cover the dashed line
            
            // Then create the actual top slot cutout
            const topCentralSlot = document.createElement('div');
            topCentralSlot.style.position = 'absolute';
            topCentralSlot.style.left = `${validatedLinerWidth / 2 - slotDepth}px`; // Center horizontally
            topCentralSlot.style.top = `-${slotWidth/2}px`; // Center on the top perforation
            topCentralSlot.style.width = `${slotDepth * 2}px`; // Width spans both sides of center
            topCentralSlot.style.height = `${slotWidth}px`;
            topCentralSlot.style.backgroundColor = '#828282'; // Same as background color
            topCentralSlot.style.zIndex = '6'; // Even higher z-index
            
            // Create slot at the bottom center
            // First create a div to cover the dashed line in the slot area
            const bottomSlotCover = document.createElement('div');
            bottomSlotCover.style.position = 'absolute';
            bottomSlotCover.style.left = `${validatedLinerWidth / 2 - slotDepth}px`; // Center horizontally
            bottomSlotCover.style.width = `${slotDepth * 2}px`; // Width spans both sides of center
            bottomSlotCover.style.height = `${slotWidth}px`;
            bottomSlotCover.style.backgroundColor = '#828282'; // Same as background
            bottomSlotCover.style.bottom = `-${slotWidth/2}px`; // Center on the bottom perforation
            bottomSlotCover.style.zIndex = '5'; // Higher z-index to cover the dashed line
            
            // Then create the actual bottom slot cutout
            const bottomCentralSlot = document.createElement('div');
            bottomCentralSlot.style.position = 'absolute';
            bottomCentralSlot.style.left = `${validatedLinerWidth / 2 - slotDepth}px`; // Center horizontally
            bottomCentralSlot.style.bottom = `-${slotWidth/2}px`; // Center on the bottom perforation
            bottomCentralSlot.style.width = `${slotDepth * 2}px`; // Width spans both sides of center
            bottomCentralSlot.style.height = `${slotWidth}px`;
            bottomCentralSlot.style.backgroundColor = '#828282'; // Same as background color
            bottomCentralSlot.style.zIndex = '6'; // Even higher z-index
            
            tag.appendChild(topSlotCover);
            tag.appendChild(topCentralSlot);
            tag.appendChild(bottomSlotCover);
            tag.appendChild(bottomCentralSlot);
        }
    }
}
