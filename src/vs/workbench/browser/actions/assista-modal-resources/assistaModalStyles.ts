

export class AssistaModalStyles {
  static assistaModalStyles = `
	.assista-modal-overlay,
.assista-modal-overlay * {
  font-family: 'Ubuntu Sans', sans-serif !important;
}
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&display=swap');
.assista-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(30, 30, 30, 0.82); /* semi-transparent dark overlay */
  z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  font-family: system-ui, Arial, sans-serif;
}
.assista-modal.assista-welcome-step {
  background: #181A1F !important;
  min-width: 100vw;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  padding: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: none;
  border-radius: 0;
  animation: fadeInUp 0.33s cubic-bezier(.23,1.01,.32,1) both;
  position: relative;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(35px);}
  to   { opacity: 1; transform: translateY(0);}
}
.assista-welcome-step .assista-title {
  font-weight: 600; font-size: 2rem;
  color: #fff !important;
  text-align: center;
  margin-bottom: 1.1rem;
}
/* --- Fix for final step title and status log positioning --- */
.assista-title-fixed-center {
  position: absolute;
  top: 35%;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 2;
  margin: 0;
  transform: translateY(-50%);
  pointer-events: none;
}
.assista-status-log-fixed {
  position: absolute;
  top: calc(35% + 3.5rem);
  left: 0;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.2rem;
  margin-bottom: 2.2rem;
  justify-content: flex-start;
}
.assista-welcome-step .assista-subtitle {
  color: #b7b7b7 !important;
  font-size: 1.03rem !important;
  margin-bottom: 2.2rem !important;
  font-weight: 400 !important;
  text-align: center !important;
}
.assista-welcome-step .assista-btn-group {
  display: flex !important;
  gap: 1.1rem !important;
  justify-content: center !important;
  margin-bottom: 2.2rem !important;
  flex-wrap: wrap !important;
  margin-top: 2.5rem !important;
}
.assista-welcome-step .assista-btn,
.assista-welcome-step button.assista-btn {
  background: #E5E6EB !important;
  color: #181A1F !important;
  border: none !important;
  border-radius: 8px !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  padding: 0.8rem 2.2rem !important;
  cursor: pointer !important;
  transition: background 0.13s, color 0.13s !important;
  outline: none !important;
  margin-bottom: 0.3rem !important;
  letter-spacing: 0.01em !important;
  box-shadow: 0 1.5px 8px 0 #0002 !important;
  z-index: 10 !important;
  position: relative !important;
}
.assista-welcome-step .assista-btn:hover,
.assista-welcome-step button.assista-btn:hover,
.assista-welcome-step .assista-btn:focus,
.assista-welcome-step button.assista-btn:focus {
  background: #F2F3F5 !important;
  color: #181A1F !important;
}
/* Get Started button hover color for step 0 */
.assista-welcome-step .assista-btn.get-started-btn:hover,
.assista-welcome-step .assista-btn.get-started-btn:focus {
  background: #bc8487 !important;
  color: #000 !important;
  position: relative;
  overflow: hidden;
}
.assista-welcome-step .assista-btn.get-started-btn::before,
.assista-welcome-step .assista-btn.get-started-btn::after {
  content: '';
  position: absolute;
  top: 0;
  width: 40%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  filter: blur(8px);
  background: radial-gradient(circle at 80% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 80%, rgba(255,255,255,0) 100%);
  transition: opacity 0.2s;
}
.assista-welcome-step .assista-btn.get-started-btn::before {
  left: 50%;
  transform: translateX(-100%);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background: radial-gradient(circle at 100% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 80%, rgba(255,255,255,0) 100%);
}
.assista-welcome-step .assista-btn.get-started-btn::after {
  right: 50%;
  transform: translateX(100%) scaleX(-1);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  background: radial-gradient(circle at 0% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 80%, rgba(255,255,255,0) 100%);
}
.assista-welcome-step .assista-btn.get-started-btn:hover::before,
.assista-welcome-step .assista-btn.get-started-btn:focus::before {
  animation: assista-btn-glow-sweep-left 0.7s linear forwards;
  opacity: 1;
}
.assista-welcome-step .assista-btn.get-started-btn:hover::after,
.assista-welcome-step .assista-btn.get-started-btn:focus::after {
  animation: assista-btn-glow-sweep-right 0.7s linear forwards;
  opacity: 1;
}
@keyframes assista-btn-glow-sweep-left {
  0% {
    left: 50%;
    opacity: 0.7;
  }
  40% {
    opacity: 1;
  }
  100% {
    left: 0%;
    opacity: 0;
  }
}
@keyframes assista-btn-glow-sweep-right {
  0% {
    right: 50%;
    opacity: 0.7;
  }
  40% {
    opacity: 1;
  }
  100% {
    right: 0%;
    opacity: 0;
  }
}
.assista-welcome-step .assista-theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2.5rem;
  justify-items: center;
  margin-bottom: 2.2rem;
  width: 100%;
  max-width: 420px;
}
.assista-welcome-step .assista-theme-card {
  background: #23242a !important;
  border: 2px solid #393a40 !important;
  border-radius: 22px !important;
  padding: 1.2rem 1.1rem 0.7rem 1.1rem;
  min-width: 160px;
  max-width: 200px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: border 0.15s, box-shadow 0.15s, background 0.15s;
  cursor: pointer;
  position: relative;
}
.assista-welcome-step .assista-theme-card:hover {
  border: 2px solid #d09c9e !important;
  box-shadow: 0 2px 16px 0 #875a7b33;
}
.assista-welcome-step .assista-theme-card.selected {
  border: 2px solid #d09c9e !important;
  box-shadow: 0 2px 16px 0 #875a7b33;
  background: #23242a !important;
}
.assista-welcome-step .assista-theme-card.selected::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #d09c9e !important;
  color: #fff !important;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}
.assista-welcome-step .assista-theme-img {
  width: 180px;
  height: 120px;
  border-radius: 8px !important;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.2rem;
}
.assista-welcome-step .assista-theme-name {
  color: #fff !important;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  text-align: start;
  width: 100%;
}
.assista-welcome-step input[type="text"],
.assista-welcome-step select {
  background: #23242a !important;
  color: #fff !important;
  border: 1px solid #393a40;
  box-shadow: none !important;
  outline: none !important;
  transition: border 0.13s;
  min-height: 23px;
  line-height: 1;
  font-size: 0.92rem !important;
  border-radius: 4px;
  padding: 0.5rem 0.7rem;
}
.assista-welcome-step input[type="text"]:focus,
.assista-welcome-step select:focus {
  border: 1.5px solid #2196f3;
}
.assista-welcome-step input[type="text"]::placeholder {
  font-size: 0.92rem !important;
  color: #b7adc6 !important;
  opacity: 1;
}
.assista-welcome-step select option {
  background: #23242a !important;
  color: #fff !important;
}
.assista-welcome-step select:invalid {
  color: #888 !important;
  font-style: italic !important;
  font-family: inherit !important;
  font-weight: 400 !important;
  opacity: 1;
}
.assista-welcome-step .assista-input-error {
  border: 1.5px solid #ff4d4f !important;
}
.assista-welcome-step input.assista-input-error {
  border: 1.5px solid #ff4d4f !important;
}
.assista-welcome-step .assista-back-btn-top-left {
  position: absolute;
  top: 24px;
  left: 24px;
  background: #23242a !important;
  color: #fff !important;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px 0 #0001;
  transition: background 0.13s, color 0.13s;
}
.assista-welcome-step .assista-back-btn-top-left:hover, .assista-welcome-step .assista-back-btn-top-left:focus {
  background: #393a40 !important;
  color: #fff !important;
}
.assista-welcome-step select.assista-input-error {
  border: 1.5px solid #ff4d4f !important;
}
.assista-progress-bar-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 40px;
  z-index: 2;
  margin-top: 0 !important;
}
.assista-progress-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #444; opacity: 0.7; transition: all 0.2s; }
.assista-progress-dot.active { width: 28px; height: 6px; border-radius: 6px; background: #fff; opacity: 1; }

.assista-substep-progress-bar-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  z-index: 1;
  margin-top: 0 !important;
}
.assista-substep-progress-dot { display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: #666; opacity: 0.6; transition: all 0.2s; }
.assista-substep-progress-dot.active { width: 20px; height: 4px; border-radius: 4px; background: #d09c9e; opacity: 1; }

/* --- Custom Get Started Button Style --- */
.assista-welcome-step .assista-btn.get-started-btn {
    background: #E3B2B3 !important;
    color: #181A1F !important;
    border: none !important;
    padding: 14px 26px !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    overflow: hidden !important;
    animation: pulse-glow 2s ease-in-out infinite !important;
}
.assista-welcome-step .assista-btn.get-started-btn::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: -100% !important;
    width: 100% !important;
    height: 100% !important;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
    transition: left 0.8s ease !important;
}
.assista-welcome-step .assista-btn.get-started-btn::after {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%) !important;
    border-radius: 12px !important;
    pointer-events: none !important;
}
.assista-welcome-step .assista-btn.get-started-btn:hover::before {
    left: 100% !important;
}
.assista-welcome-step .assista-btn.get-started-btn:hover {
    background: rgba(227, 178, 179, 0.9) !important;
    transform: scale(1.02) !important;
    box-shadow: 0 4px 10px rgba(227, 178, 179, 0.15) !important;
}
.assista-welcome-step .assista-btn.get-started-btn:active {
    transform: scale(0.98) !important;
    transition: all 0.1s ease !important;
}
@keyframes pulse-glow {
    0%, 100% {
        box-shadow: 0 0 20px rgba(227, 178, 179, 0.5);
    }
    50% {
        box-shadow: 0 0 30px rgba(227, 178, 179, 0.8);
    }
}
/* Bottom right back button for step 2 */
.assista-welcome-step .assista-back-btn-bottom-right {
  position: absolute;
  bottom: 32px;
  right: 32px;
  background: #23242a !important;
  color: #fff !important;
  border: none;
  border-radius: 6px;
  width: 64px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px 0 #0001;
  transition: background 0.13s, color 0.13s;
}
.assista-welcome-step .assista-back-btn-bottom-right:hover, .assista-welcome-step .assista-back-btn-bottom-right:focus {
  background: #393a40 !important;
  color: #fff !important;
}

.input {
  color: white;
  border: 1px solid #d09c9e;
  border-radius: 10px;
  padding: 14px 25px;
  background: transparent;
  width: 350px;
}

.browse-btn {
  height: 48px;
  width: 48px;
  border: none;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #23242a;
  color: #d09c9e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: -48px;
  transition: background 0.15s, color 0.15s;
  box-shadow: none;
  outline: none;
}
.browse-btn:hover, .browse-btn:focus {
  background: #393a40;
  color: #fff;
}
.assista-welcome-step .assista-back-btn-top-right {
  position: absolute;
  top: 24px;
  right: 24px;
  background: #23242a !important;
  color: #fff !important;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px 0 #0001;
  transition: background 0.13s, color 0.13s;
}
.assista-welcome-step .assista-back-btn-top-right:hover, .assista-welcome-step .assista-back-btn-top-right:focus {
  background: #393a40 !important;
  color: #fff !important;
}
.assista-welcome-step select.assista-input-error {
  border: 1.5px solid #ff4d4f !important;
}

/* Add this style block to the modal style injection (in show()), after .assista-title definition: */
/* .assista-title-fixed-center {
  position: absolute;
  top: 20%;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 2;
  margin: 0;
  transform: translateY(-50%);
  pointer-events: none;
} */
.assista-text-arrow-btn {
  background: transparent !important;
  color: #fff !important;
  border: none !important;
  font-family: 'Ubuntu Sans', sans-serif !important;
  font-size: 1.1rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: color 0.2s !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0 !important;
  box-shadow: none !important;
}

.assista-text-arrow-btn:hover {
  color: #d1d1d1 !important;
}

.assista-text-arrow-btn .codicon {
  font-size: 22px !important;
  transition: transform 0.2s ease;
}

.assista-text-arrow-btn:hover .codicon {
    transform: translateX(5px);
}

.assista-text-arrow-btn:focus, .assista-text-arrow-btn:active {
	outline: none !important;
	box-shadow: none !important;
}
.assista-modal-overlay .codicon {
  font-family: codicon !important;
}`;

  static assistaGradientStyles = `
.assista-animated-gradient {
  position: relative;
  display: inline-block;
  color: #CFA4A4;
  font-weight: bold;
  font-size: 1.25rem;
  letter-spacing: 0.32em;
  font-family: monospace, monospace;
  text-shadow: 0 1px 2px #0006;
  overflow: hidden;
}
.assista-animated-gradient::after {
  content: attr(data-text);
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  background: linear-gradient(var(--assista-gradient-angle, 120deg), #CFA4A4 0%, #fff 40%, #fff 60%, #CFA4A4 100%);
  background-size: 200% 100%;
  background-position: -100% 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: assista-gradient-move 2.2s linear infinite;
  animation-direction: var(--assista-gradient-direction, normal);
  pointer-events: none;
}
@keyframes assista-gradient-move {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}
`;
  static assistaSecondaryButtonStyles = `
.assista-secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E3B2B3;
  color: #E3B2B3;
  padding: 0 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  transition: color 300ms, transform 300ms;
  transform: scale(1);
  background: transparent;
  box-shadow: none;
  position: relative;
  overflow: hidden;
}
.assista-secondary-btn::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 0%;
  background: rgb(227 178 179 / 0.1);
  z-index: 0;
  transition: width 0.5s cubic-bezier(.4,1,.7,1);
  border-radius: 0.75rem;
}
.assista-secondary-btn:hover::before, .assista-secondary-btn:focus::before {
  width: 100%;
}
.assista-secondary-btn span, .assista-secondary-btn .btn-text {
  position: relative;
  z-index: 1;
}
.assista-secondary-btn:hover, .assista-secondary-btn:focus {
  color: #E3B2B3;
  transform: scale(1.03);
}
`;

  static assistaFloatingLabelStyles = `
.assista-welcome-step .floating-label input,
.assista-welcome-step .floating-label select {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 15px 0 8px 0 !important;
	text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #fff !important;
    width: 100%;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;
}
.assista-welcome-step .floating-label {
    position: relative;
    margin-bottom: 5px;
	border-bottom: 1.8px solid rgba(227, 178, 179, 0.3) !important;
}
.assista-welcome-step .floating-label label {
    position: absolute;
    top: 15px;
    left: 0;
    font-size: 15px;
    color: rgba(227, 178, 179, 0.5);
    pointer-events: none;
    transition: all 0.3s ease;
}
.assista-welcome-step .floating-label input:focus ~ label,
.assista-welcome-step .floating-label.has-value label,
.assista-welcome-step .floating-label select:focus ~ label {
    top: -5px;
    font-size: 12px;
    color: #e3b2b3;
}
.assista-welcome-step .floating-label::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg,rgb(163, 110, 111) 0%,rgb(122, 86, 88) 100%);
    transition: width 0.3s ease;
}
.assista-welcome-step .floating-label:focus-within::after {
    width: 100%;
}
`;

  static assistaUnderlineErrorStyles = `
.assista-welcome-step .floating-label.assista-input-underline-error::after {
    width: 100% !important;
    background: linear-gradient(90deg, #ff4d4f 0%, #ff4d4f 100%);
    height: 1px;
    left: 0;
    opacity: 0;
    transition: width 0.4s cubic-bezier(.4,1,.7,1), opacity 0.4s cubic-bezier(.4,1,.7,1);
    animation: assista-underline-fill-fade 0.4s cubic-bezier(.4,1,.7,1) forwards;
}
@keyframes assista-underline-fill-fade {
    0% { width: 0; opacity: 0; }
    60% { opacity: 1; }
    100% { width: 100%; opacity: 1; }
}
`;

  static assistaFontStyles = `
@font-face {
					font-family: 'RedHatDisplayBold';
					src: url('resources/assista-fonts/RedHatDisplay-Bold.ttf') format('truetype');
					font-weight: bold;
					font-style: normal;
				}
				.assista-redhat-bold {
					font-family: 'RedHatDisplayBold', monospace, monospace !important;
					font-weight: bold !important;
				}
	`;

  static assistaTitleGradientStyles = `
			.assista-title-gradient {
				background: linear-gradient(270deg, #bc8487, #e3b2b3, #efd4d4, #faf3f3, #bc8487);
				background-size: 400% 100%;
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				text-fill-color: transparent;
				line-height: 1.2;
				padding: 2px 0;
				display: inline-block;
				animation: assista-title-gradient-animate 4s ease-in-out infinite;
			}
			@keyframes assista-title-gradient-animate {
				0% { background-position: 0% 50%; }
				50% { background-position: 100% 50%; }
				100% { background-position: 0% 50%; }
			}
			`;

  static assistaLogoFloatStyles = `
			.assista-logo-float {
				animation: assista-float 1.2s ease-in-out 1;
				will-change: transform;
			}
			@keyframes assista-float {
				0% { transform: translateY(0); }
				50% { transform: translateY(-18px); }
				100% { transform: translateY(0); }
			}
			`;

  /**
   * Injects a style block into the document head for the given style category, using the provided styleId to avoid duplicates.
   * @param styleId A unique id for the style tag (e.g., 'assista-floating-label-style')
   * @param styleCategory The name of the static style property (e.g., 'assistaFloatingLabelStyles')
   */
  static injectStyle(styleId: string, styleCategory: keyof typeof AssistaModalStyles) {
    if (typeof document === 'undefined') return;
    if (document.getElementById(styleId)) return; // Already injected
    const styleContent = AssistaModalStyles[styleCategory];
    if (typeof styleContent !== 'string') return;
    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    styleTag.textContent = styleContent;
    document.head.appendChild(styleTag);
  }
}
