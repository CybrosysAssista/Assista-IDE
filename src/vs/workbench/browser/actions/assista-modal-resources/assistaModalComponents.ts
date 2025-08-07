// AssistaSvgContainer.ts
// Reusable components for Assista modal and steps

// import '../assista-components.css';

export class AssistaComponents {
  /**
   * Creates a styled SVG container with an image for use in modals.
   * @param imgSrc The image source URL
   * @param alt Optional alt text for the image
   */
  static createSvgContainer(imgSrc: string, alt: string = ''): HTMLDivElement {
    const svgContainer = document.createElement('div');
    svgContainer.style.display = 'flex';
    svgContainer.style.justifyContent = 'center';
    svgContainer.style.alignItems = 'center';
    svgContainer.style.marginBottom = '1.7rem';
    svgContainer.style.marginTop = '1rem';

    const svgImg = document.createElement('img');
    svgImg.src = imgSrc;
    svgImg.alt = alt;
    svgImg.style.width = '80px';
    svgImg.style.height = '80px';
    svgImg.style.display = 'block';
    svgContainer.appendChild(svgImg);

    return svgContainer;
  }

  /**
   * Creates a floating label input or select component.
   * @param type 'input' or 'select'
   * @param id The id for the input/select and label
   * @param label The label text
   * @param options Object where key is display label and value is the stored value (for select only)
   * @param inputType The type attribute for input (e.g., 'text', 'password')
   * @param required Whether the field is required
   * @param value Optional value for the input/select
   */
  static createFloatingLabelField({
    type,
    id,
    label,
    options = {},
    inputType = 'text',
    required = false,
    value
  }: {
    type: 'input' | 'select',
    id: string,
    label: string,
    options?: Record<string, string>,
    inputType?: string,
    required?: boolean,
    value?: string
  }): HTMLDivElement {
    const floatingLabelDiv = document.createElement('div');
    floatingLabelDiv.className = 'floating-label';
    floatingLabelDiv.style.width = '350px';

    let field: HTMLInputElement | HTMLSelectElement;
    if (type === 'input') {
      field = document.createElement('input');
      field.type = inputType;
      field.id = id;
      if (required) field.required = true;
      field.style.width = '100%';
      if (value) {
        field.value = value;
        floatingLabelDiv.classList.add('has-value');
      } else {
        floatingLabelDiv.classList.remove('has-value');
      }
    } else {
      field = document.createElement('select');
      field.id = id;
      if (required) field.required = true;
      // Add placeholder option
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = ' ';
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      field.appendChild(placeholderOption);
      // Add options from dictionary
      Object.entries(options).forEach(([label, val]) => {
        const option = document.createElement('option');
        option.value = val;
        option.textContent = label;
        field.appendChild(option);
      });
      if (value) {
        field.value = value;
        floatingLabelDiv.classList.add('has-value');
      } else {
        floatingLabelDiv.classList.remove('has-value');
      }
    }

    // Label
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', id);
    labelEl.textContent = label;

    floatingLabelDiv.appendChild(field);
    floatingLabelDiv.appendChild(labelEl);

    // Floating label effect
    field.addEventListener('blur', () => {
      if (field instanceof HTMLInputElement) {
        if (field.value) {
          floatingLabelDiv.classList.add('has-value');
        } else {
          floatingLabelDiv.classList.remove('has-value');
        }
      } else if (field instanceof HTMLSelectElement) {
        if (field.value) {
          floatingLabelDiv.classList.add('has-value');
        } else {
          floatingLabelDiv.classList.remove('has-value');
        }
      }
    });

    return floatingLabelDiv;
  }

  /**
   * Creates a styled browse button with a Codicon folder icon.
   * @param onClick The click handler for the button
   */
  static createBrowseButton(onClick: (ev: MouseEvent) => void): HTMLButtonElement {
    const selectBtn = document.createElement('button');
    selectBtn.className = 'browse-btn';
    selectBtn.textContent = '';
    const codicon = document.createElement('span');
    codicon.className = 'codicon codicon-folder';
    codicon.style.fontSize = '16px';
    codicon.style.display = 'block';
    codicon.style.margin = 'auto';
    selectBtn.appendChild(codicon);
    selectBtn.style.height = '38px';
    selectBtn.style.width = '40px';
    selectBtn.style.lineHeight = '30px';
    selectBtn.style.position = 'absolute';
    selectBtn.style.top = '5px';
    selectBtn.style.right = '5px';
    selectBtn.style.zIndex = '';
    selectBtn.style.lineHeight = '28px';
    selectBtn.style.padding = '0';
    selectBtn.style.fontSize = '1rem';
    selectBtn.style.display = 'flex';
    selectBtn.style.alignItems = 'center';
    selectBtn.style.justifyContent = 'center';
    selectBtn.style.boxSizing = 'border-box';
    selectBtn.style.verticalAlign = 'middle';
    selectBtn.style.borderRadius = '5px';
    selectBtn.style.background = 'transparent';
    selectBtn.style.color = 'white';
    selectBtn.style.border = 'none';
    selectBtn.style.marginLeft = '';
    selectBtn.style.transition = 'background 0.15s, color 0.15s';
    selectBtn.style.boxShadow = 'none';
    selectBtn.style.outline = 'none';
    selectBtn.onclick = onClick;
    return selectBtn;
  }

  /**
   * Creates a styled Skip button for use in modals.
   * @param onClick The click handler for the button
   * @param text Optional button text (default: 'Skip')
   */
  static createSecondaryButton(onClick: (ev: MouseEvent) => void, text?: string): HTMLButtonElement {
    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.textContent = text || 'Skip';
    skipBtn.className = 'assista-secondary-btn assista-btn-same-size';
    skipBtn.style.width = '200px';
    skipBtn.style.setProperty('padding', '10px 0', 'important');
    skipBtn.style.setProperty('height', 'auto', 'important');
    skipBtn.style.setProperty('font-family', "'Ubuntu Sans', sans-serif", 'important');
    skipBtn.onclick = onClick;
    return skipBtn;
  }

  /**
   * Creates a styled Confirm button for use in modals.
   * @param onClick The click handler for the button
   * @param text Optional button text (default: 'Confirm')
   */
  static createPrimaryButton(onClick: (ev: MouseEvent) => void, text?: string): HTMLButtonElement {
    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'submit';
    confirmBtn.className = 'assista-btn get-started-btn';
    confirmBtn.textContent = text || 'Confirm';
    confirmBtn.style.width = '200px';
    confirmBtn.style.setProperty('padding', '10px 0', 'important');
    confirmBtn.style.setProperty('border', '1px solid #E3B2B3', 'important');
    confirmBtn.style.setProperty('height', 'auto', 'important');
    confirmBtn.style.setProperty('font-family', "'Ubuntu Sans', sans-serif", 'important');
    confirmBtn.style.overflow = 'hidden';
    confirmBtn.style.textOverflow = 'ellipsis';
    confirmBtn.style.whiteSpace = 'nowrap';
    confirmBtn.onclick = onClick;
    return confirmBtn;
  }

  /**
   * Creates a styled back button for use in modals.
   * @param onClick The click handler for the button
   * @param position The position of the back button ('top-left' | 'bottom-right')
   * @param text Optional button text (for bottom-right position, default: 'Skip')
   */
  static createBackButton(onClick: (ev: MouseEvent) => void, position: 'top-left' | 'bottom-right' = 'top-left', text?: string): HTMLButtonElement {
    const backBtn = document.createElement('button');
    backBtn.className = `assista-back-btn-${position}`;
    backBtn.title = position === 'top-left' ? 'Back' : text || 'Skip';

    if (position === 'top-left') {
      // Icon-only button for top-left position
      const backIcon = document.createElement('span');
      backIcon.className = 'codicon codicon-chevron-left';
      backIcon.style.fontSize = '20px';
      backBtn.appendChild(backIcon);
    } else {
      // Text button for bottom-right position
      backBtn.textContent = text || 'Skip';
    }

    backBtn.onclick = onClick;
    return backBtn;
  }

  /**
   * Creates a styled skip button for the bottom-right position.
   * @param onClick The click handler for the button
   * @param text Optional button text (default: 'Skip All')
   */
  static createSkipButton(onClick: (ev: MouseEvent) => void, text?: string): HTMLButtonElement {
    const skipBtn = document.createElement('button');
    skipBtn.className = 'assista-back-btn-bottom-right';
    skipBtn.textContent = text || 'Skip All';
    skipBtn.onclick = onClick;
    return skipBtn;
  }

  /**
   * Creates a styled ASSISTA span with animated gradient effect.
   * @param text Optional text (default: 'ASSISTA')
   * @param fontSize Optional font size (default: '1.3rem')
   */
  static createAssistaSpan(text: string = 'ASSISTA', fontSize: string = '1.3rem'): HTMLSpanElement {

    const assistaSpan = document.createElement('span');
    assistaSpan.textContent = text;
    assistaSpan.className = 'assista-animated-gradient assista-redhat-bold';
    assistaSpan.setAttribute('data-text', text);
    assistaSpan.style.color = '#CFA4A4';
    assistaSpan.style.fontWeight = 'bold';
    assistaSpan.style.fontSize = fontSize;
    assistaSpan.style.letterSpacing = '0.32em';
    assistaSpan.style.fontFamily = 'monospace, monospace';
    assistaSpan.style.textShadow = '0 1px 2px #0006';
    assistaSpan.style.position = 'relative';
    assistaSpan.style.overflow = 'hidden';
    assistaSpan.style.background = '';
    assistaSpan.style.webkitBackgroundClip = '';
    assistaSpan.style.webkitTextFillColor = '';

    // Add random gradient animation properties
    const randomAngle = 90 + Math.floor(Math.random() * 180); // 90-270deg
    const randomDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
    assistaSpan.style.setProperty('--assista-gradient-angle', `${randomAngle}deg`);
    assistaSpan.style.setProperty('--assista-gradient-direction', randomDirection);

    return assistaSpan;
  }

  /**
   * Creates a styled button row container for form buttons.
   * @param buttons Array of button elements to add to the row
   */
  static createButtonRow(buttons: HTMLElement[]): HTMLDivElement {
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'space-between';
    btnRow.style.marginTop = '1.2rem';
    btnRow.style.width = '350px'; // Match input width
    btnRow.style.gap = '0.7rem'; // Optional, for spacing between buttons
    btnRow.style.alignItems = 'flex-start';

    // Add all buttons to the row
    buttons.forEach(button => {
      btnRow.appendChild(button);
    });

    return btnRow;
  }

  /**
   * Creates a subtitle with typing animation effect.
   * @param text The text to animate
   * @param className Optional CSS class name (default: 'assista-subtitle')
   * @param cursorColor Optional cursor color (default: '#b7b7b7')
   * @param cursorSize Optional cursor font size (default: '0.98rem')
   */
  static createTypingSubtitle(
    text: string,
    className: string = 'assista-subtitle',
    cursorColor: string = '#b7b7b7',
    cursorSize: string = '0.98rem'
  ): HTMLSpanElement {
    // Ensure cursor blink CSS is injected
    this.ensureCursorBlinkStyle();

    const subtitle = document.createElement('span');
    subtitle.className = className;
    subtitle.style.display = 'inline-block';

    // Dedicated text node for subtitle
    const subtitleTextNode = document.createTextNode('');
    subtitle.appendChild(subtitleTextNode);

    // Create a span for the blinking cursor
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.display = 'inline-block';
    cursor.style.marginLeft = '2px';
    cursor.style.color = cursorColor;
    cursor.style.fontWeight = '400';
    cursor.style.fontSize = cursorSize;
    subtitle.appendChild(cursor);

    // Start typing animation
    let subtitleIndex = 0;
    const animateTyping = () => {
      if (subtitleIndex <= text.length) {
        subtitleTextNode.textContent = text.slice(0, subtitleIndex);
        subtitleIndex++;
        // Dynamic speed: random for each char, longer after spaces
        let delay = 40 + Math.random() * 60; // 40-100ms
        if (text[subtitleIndex - 2] === ' ') delay += 120 + Math.random() * 100; // longer after space
        setTimeout(animateTyping, delay);
      } else {
        subtitleTextNode.textContent = text;
        cursor.style.animation = 'assista-blink-cursor 0.7s steps(1) infinite';
      }
    };

    // Start the animation
    animateTyping();

    return subtitle;
  }

  /**
   * Ensures the cursor blink CSS is injected.
   */
  private static ensureCursorBlinkStyle(): void {
    if (!document.getElementById('assista-cursor-blink-style')) {
      const style = document.createElement('style');
      style.id = 'assista-cursor-blink-style';
      style.textContent = `@keyframes assista-blink-cursor { 0% { opacity: 1; } 49% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }`;
      document.head.appendChild(style);
    }
  }

  /**
   * Creates a styled input adornment row container for input fields with buttons.
   * @param elements Array of elements to add to the row (typically input field and button)
   */
  static createInputAdornmentRow(elements: HTMLElement[]): HTMLDivElement {
    const inputAdornmentRow = document.createElement('div');
    inputAdornmentRow.style.position = 'relative';
    inputAdornmentRow.style.width = '350px';
    inputAdornmentRow.style.display = 'block';
    inputAdornmentRow.style.alignItems = '';
    inputAdornmentRow.style.margin = '0 auto';
    inputAdornmentRow.style.border = 'none';
    inputAdornmentRow.style.background = 'transparent';
    inputAdornmentRow.style.boxShadow = 'none';

    // Add all elements to the row
    elements.forEach(element => {
      inputAdornmentRow.appendChild(element);
    });

    return inputAdornmentRow;
  }

  /**
   * Creates a styled subtitle element.
   * @param text The text content for the subtitle
   * @param className Optional CSS class name (default: 'assista-subtitle')
   * @param marginTop Optional top margin (default: '10px')
   */
  static createSubtitle(
    text: string,
    className: string = 'assista-subtitle',
    marginTop: string = '10px'
  ): HTMLSpanElement {
    const subtitle = document.createElement('span');
    subtitle.className = className;
    subtitle.style.marginTop = marginTop;
    subtitle.textContent = text;
    subtitle.style.display = 'inline-block';

    return subtitle;
  }

  /**
   * Creates a styled warning div with customizable content.
   * @param warningText The main warning text
   * @param codeText Optional code text to highlight (e.g., filename)
   * @param additionalText Optional additional text after the code
   */
  static createWarningDiv(
    warningText: string,
    codeText?: string,
    additionalText?: string
  ): HTMLDivElement {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
      background: #181A1F;
      border: 1px solid #666;
      border-radius: 6px;
      padding: 10px;
      color: #999;
      font-size: 13px;
      text-align: center;
      max-width: 400px;
      opacity: 0.8;
    `;

    const warningIcon = document.createElement('span');
    warningIcon.textContent = 'Warning:';
    warningIcon.style.fontWeight = '600';

    const warningTextSpan = document.createElement('span');
    warningTextSpan.textContent = ` ${warningText}`;

    warningDiv.appendChild(warningIcon);
    warningDiv.appendChild(warningTextSpan);

    if (codeText) {
      const codeElement = document.createElement('code');
      codeElement.textContent = codeText;
      warningDiv.appendChild(codeElement);
    }

    if (additionalText) {
      const additionalTextSpan = document.createElement('span');
      additionalTextSpan.textContent = additionalText;
      warningDiv.appendChild(additionalTextSpan);
    }

    return warningDiv;
  }
}
