export class AssistaSvgUtils {
  /**
   * Converts SVG markup to data URI format
   * @param svg - SVG markup string
   * @returns Data URI string
   */
  static svgDataUri(svg: string): string {
    // Remove any existing XML declaration and ensure proper encoding
    const cleanSvg = svg.replace(/<\?xml[^>]*\?>/, '').trim();
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleanSvg)))}`;
  }

  /**
   * Theme selector SVG images
   * Replace the placeholder comments with your actual SVG content
   */
  static readonly themeImages = {
    // PASTE YOUR CIDE AI SVG HERE
    cideAI: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        clip-path: url(#clippath-6);
      }

      .cls-2 {
        clip-path: url(#clippath-7);
      }

      .cls-3 {
        fill: #dfadae;
      }

      .cls-4 {
        clip-path: url(#clippath-4);
      }

      .cls-5 {
        fill: url(#linear-gradient-2);
      }

      .cls-6 {
        fill: #e2b1b2;
      }

      .cls-7 {
        fill: #dba9aa;
      }

      .cls-8 {
        fill: #dcaaab;
      }

      .cls-9 {
        fill: none;
      }

      .cls-10 {
        fill: url(#linear-gradient-4);
      }

      .cls-11 {
        fill: #d7a5a6;
      }

      .cls-12 {
        fill: url(#linear-gradient-3);
      }

      .cls-13 {
        clip-path: url(#clippath-1);
      }

      .cls-14 {
        fill: url(#linear-gradient-5);
      }

      .cls-15 {
        clip-path: url(#clippath-5);
      }

      .cls-16 {
        clip-path: url(#clippath-8);
      }

      .cls-17 {
        fill: #d9a7a8;
      }

      .cls-18 {
        fill: #d19d9f;
      }

      .cls-19 {
        fill: url(#linear-gradient-8);
      }

      .cls-20 {
        fill: #d29ea0;
      }

      .cls-21 {
        clip-path: url(#clippath-3);
      }

      .cls-22 {
        fill: #d4a0a2;
      }

      .cls-23 {
        fill: #daa8a9;
      }

      .cls-24 {
        fill: #23242a;
        opacity: 1;
      }

      .cls-25 {
        fill: #deacad;
      }

      .cls-26 {
        fill: url(#linear-gradient-7);
      }

      .cls-27 {
        fill: url(#linear-gradient-9);
      }

      .cls-28 {
        fill: #ddabac;
      }

      .cls-29 {
        fill: #d39fa1;
      }

      .cls-30 {
        fill: #e0aeaf;
      }

      .cls-31 {
        fill: #e1b0b1;
      }

      .cls-32 {
        fill: #d7a3a5;
      }

      .cls-33 {
        fill: url(#linear-gradient-6);
      }

      .cls-34 {
        fill: #d8a6a7;
      }

      .cls-35 {
        fill: #d6a2a4;
      }

      .cls-36 {
        fill: #d09c9e;
      }

      .cls-37 {
        clip-path: url(#clippath-2);
      }

      .cls-38 {
        fill: #d5a1a3;
      }

      .cls-39 {
        fill: url(#linear-gradient);
      }

      .cls-40 {
        fill: #e3b2b3;
      }

      .cls-41 {
        clip-path: url(#clippath);
      }
    </style>
    <clipPath id="clippath">
      <path class="cls-9" d="M30.14,22.22c11.71-1.23,13.26,16.98,1.36,17.73-11.19.71-12.9-16.52-1.36-17.73ZM29.73,24.84c-7.55,1.19-6.35,13.83,2.53,12.44,7.5-1.17,6.37-13.84-2.53-12.44Z"/>
    </clipPath>
    <linearGradient id="linear-gradient" x1="22.01" y1="31.07" x2="39.96" y2="31.07" gradientUnits="userSpaceOnUse">
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <clipPath id="clippath-1">
      <path class="cls-9" d="M30.74,12.09c.91-.17,1.38.45,1.47,1.28.13,1.13.19,5.66,0,6.67-.22,1.17-2.24,1.28-2.43-.19-.16-1.18-.16-5.52.02-6.67.08-.53.39-.99.95-1.09Z"/>
    </clipPath>
    <clipPath id="clippath-2">
      <path class="cls-9" d="M12.95,29.89c.74-.17,6.25-.19,7.03-.04,1.18.23,1.18,2.19,0,2.42-.91.17-5.88.14-6.86,0-1.45-.23-1.48-2.07-.17-2.37Z"/>
    </clipPath>
    <clipPath id="clippath-3">
      <path class="cls-9" d="M41.85,29.89c.57-.17,6.25-.15,7.02-.03,1.5.23,1.49,2.17,0,2.4-.98.15-5.94.18-6.86,0-1.14-.22-1.15-2.09-.17-2.38Z"/>
    </clipPath>
    <clipPath id="clippath-4">
      <path class="cls-9" d="M30.74,41.2c.46-.08,1.18.17,1.37.57.18.38.2,6.44.09,7.16-.24,1.51-2.21,1.56-2.42-.19-.13-1.13-.19-5.66,0-6.67.08-.44.53-.81.95-.88Z"/>
    </clipPath>
    <clipPath id="clippath-5">
      <path class="cls-9" d="M22.45,37.98c1.15-.35,2.07.69,1.57,1.78l-4.84,4.87c-1.4.66-2.35-.14-1.83-1.62,1.07-.71,4.22-4.75,5.09-5.02Z"/>
    </clipPath>
    <clipPath id="clippath-6">
      <path class="cls-9" d="M18,17.36c.24-.07.51-.09.76-.04.85.15,4.14,4.25,5.17,4.94.68,1.35-.36,2.54-1.74,1.74l-4.94-5.18c-.14-.55.19-1.3.75-1.47Z"/>
    </clipPath>
    <linearGradient id="linear-gradient-2" x1="29.41" y1="16.5" x2="32.59" y2="16.5" xlink:href="#linear-gradient"/>
    <clipPath id="clippath-7">
      <path class="cls-9" d="M43.28,17.34c.99-.2,1.77,1.03,1.15,1.98-.33.51-4.24,4.42-4.75,4.75-1.19.77-2.47-.5-1.7-1.7.42-.65,3.84-4.04,4.53-4.56.24-.18.45-.41.76-.47Z"/>
    </clipPath>
    <clipPath id="clippath-8">
      <path class="cls-9" d="M38.62,37.98c.24-.07.51-.09.76-.04.85.15,4.14,4.25,5.17,4.94.73,1.26-.53,2.46-1.74,1.74l-4.94-5.17c-.14-.55.19-1.3.75-1.47Z"/>
    </clipPath>
    <linearGradient id="linear-gradient-3" x1="37.5" y1="20.82" x2="44.9" y2="20.82" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-4" x1="16.97" y1="20.77" x2="24.4" y2="20.77" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-5" x1="29.41" y1="45.63" x2="32.52" y2="45.63" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-6" x1="16.96" y1="41.38" x2="24.41" y2="41.38" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-7" x1="11.75" y1="31.07" x2="21.11" y2="31.07" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-8" x1="40.89" y1="31.07" x2="50.24" y2="31.07" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-9" x1="37.59" y1="41.37" x2="45.02" y2="41.37" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-bg" width="62" height="62" rx="10.17" ry="10.17" fill="#23242a"/>
      <g>
        <g>
          <g class="cls-41">
            <rect class="cls-36" x="25.19" y="26.44" width="3.36" height="9.22"/>
            <rect class="cls-36" x="28.54" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-18" x="28.91" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-20" x="29.28" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-29" x="29.65" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-22" x="30.03" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-38" x="30.4" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-35" x="30.77" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-32" x="31.14" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-11" x="31.51" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-34" x="31.88" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-17" x="32.25" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-23" x="32.62" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-7" x="32.99" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-8" x="33.36" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-28" x="33.73" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-25" x="34.1" y="26.44" width=".37" height="9.22"/>
            <rect class="cls-25" x="34.48" y="26.44" width=".79" height="9.22"/>
            <rect class="cls-3" x="35.26" y="26.44" width=".79" height="9.22"/>
            <rect class="cls-30" x="36.05" y="26.44" width=".79" height="9.22"/>
            <rect class="cls-31" x="36.83" y="26.44" width=".79" height="9.22"/>
            <rect class="cls-6" x="37.62" y="25.44" width=".79" height="11.22"/>
            <rect class="cls-40" x="38.4" y="25.44" width=".79" height="11.22"/>
            <rect class="cls-40" x="39.19" y="25.44" width=".58" height="11.22"/>
            <rect class="cls-36" x="20.6" y="23" width="7.94" height="15.66"/>
            <rect class="cls-36" x="28.54" y="23" width=".37" height="15.66"/>
            <rect class="cls-18" x="28.91" y="23" width=".37" height="15.66"/>
            <rect class="cls-20" x="29.28" y="23" width=".37" height="15.66"/>
            <rect class="cls-29" x="29.65" y="23" width=".37" height="15.66"/>
            <rect class="cls-22" x="30.03" y="23" width=".37" height="15.66"/>
            <rect class="cls-38" x="30.4" y="23" width=".37" height="15.66"/>
            <rect class="cls-35" x="30.77" y="23" width=".37" height="15.66"/>
            <rect class="cls-32" x="31.14" y="23" width=".37" height="15.66"/>
            <rect class="cls-11" x="31.51" y="23" width=".37" height="15.66"/>
            <rect class="cls-34" x="31.88" y="23" width=".37" height="15.66"/>
            <rect class="cls-17" x="32.25" y="23" width=".37" height="15.66"/>
            <rect class="cls-23" x="32.62" y="23" width=".37" height="15.66"/>
            <rect class="cls-7" x="32.99" y="23" width=".37" height="15.66"/>
            <rect class="cls-8" x="33.36" y="23" width=".37" height="15.66"/>
            <rect class="cls-28" x="33.73" y="23" width=".37" height="15.66"/>
            <rect class="cls-25" x="34.1" y="23" width=".37" height="15.66"/>
            <rect class="cls-25" x="34.48" y="23" width=".79" height="15.66"/>
            <rect class="cls-3" x="35.26" y="23" width=".79" height="15.66"/>
            <rect class="cls-30" x="36.05" y="23" width=".79" height="15.66"/>
            <rect class="cls-31" x="36.83" y="23" width=".79" height="15.66"/>
            <rect class="cls-6" x="37.62" y="23" width=".79" height="15.66"/>
            <rect class="cls-40" x="38.4" y="23" width=".79" height="15.66"/>
            <rect class="cls-40" x="39.19" y="23" width="3.22" height="15.66"/>
          </g>
          <path class="cls-39" d="M38.19,25.42c-1.82-2.57-4.68-3.8-8.08-3.44-6.05.63-8.43,5.53-8.07,9.81.35,4.15,3.24,8.44,8.77,8.44.23,0,.46-.01.7-.02,3.47-.22,6.14-1.93,7.51-4.8,1.51-3.14,1.17-7.15-.83-9.99ZM36.53,33.57c-.74,1.92-2.27,3.15-4.31,3.47-4.28.67-6.66-2.03-7.13-4.99-.06-.37-.09-.74-.09-1.11,0-2.68,1.52-5.34,4.77-5.85.43-.07.86-.1,1.27-.1,1.87,0,3.46.71,4.54,2.05,1.41,1.74,1.79,4.36.95,6.53Z"/>
        </g>
        <g class="cls-13">
          <rect class="cls-36" x="29.62" y="11.93" width="1.01" height="9.39"/>
          <rect class="cls-36" x="30.62" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-18" x="30.68" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-20" x="30.74" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-29" x="30.79" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-22" x="30.85" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-38" x="30.91" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-35" x="30.96" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-32" x="31.02" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-11" x="31.08" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-34" x="31.13" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-17" x="31.19" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-23" x="31.25" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-7" x="31.3" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-8" x="31.36" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-28" x="31.42" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-25" x="31.47" y="11.93" width=".06" height="9.39"/>
          <rect class="cls-25" x="31.53" y="11.93" width=".12" height="9.39"/>
          <rect class="cls-3" x="31.65" y="11.93" width=".12" height="9.39"/>
          <rect class="cls-30" x="31.77" y="11.93" width=".12" height="9.39"/>
          <rect class="cls-31" x="31.89" y="11.93" width=".12" height="9.39"/>
          <rect class="cls-6" x="32.01" y="11.93" width=".12" height="9.39"/>
          <rect class="cls-40" x="32.13" y="11.93" width=".12" height="9.39"/>
          <rect class="cls-40" x="32.25" y="11.93" width=".15" height="9.39"/>
        </g>
        <g class="cls-37">
          <rect class="cls-36" x="11.64" y="29.7" width="3.55" height="2.74"/>
          <rect class="cls-36" x="15.19" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-18" x="15.38" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-20" x="15.57" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-29" x="15.76" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-22" x="15.94" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-38" x="16.13" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-35" x="16.32" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-32" x="16.51" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-11" x="16.7" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-34" x="16.89" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-17" x="17.07" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-23" x="17.26" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-7" x="17.45" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-8" x="17.64" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-28" x="17.83" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-25" x="18.02" y="29.7" width=".19" height="2.74"/>
          <rect class="cls-25" x="18.2" y="29.7" width=".4" height="2.74"/>
          <rect class="cls-3" x="18.6" y="29.7" width=".4" height="2.74"/>
          <rect class="cls-30" x="19" y="29.7" width=".4" height="2.74"/>
          <rect class="cls-31" x="19.4" y="29.7" width=".4" height="2.74"/>
          <rect class="cls-6" x="19.8" y="29.7" width=".4" height="2.74"/>
          <rect class="cls-40" x="20.2" y="29.7" width=".4" height="2.74"/>
          <rect class="cls-40" x="20.6" y="29.7" width=".56" height="2.74"/>
        </g>
        <g class="cls-21">
          <rect class="cls-36" x="40.87" y="29.72" width="3.46" height="2.73"/>
          <rect class="cls-36" x="44.33" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-18" x="44.52" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-20" x="44.7" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-29" x="44.89" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-22" x="45.08" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-38" x="45.27" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-35" x="45.46" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-32" x="45.65" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-11" x="45.83" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-34" x="46.02" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-17" x="46.21" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-23" x="46.4" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-7" x="46.59" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-8" x="46.78" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-28" x="46.96" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-25" x="47.15" y="29.72" width=".19" height="2.73"/>
          <rect class="cls-25" x="47.34" y="29.72" width=".4" height="2.73"/>
          <rect class="cls-3" x="47.74" y="29.72" width=".4" height="2.73"/>
          <rect class="cls-30" x="48.14" y="29.72" width=".4" height="2.73"/>
          <rect class="cls-31" x="48.54" y="29.72" width=".4" height="2.73"/>
          <rect class="cls-6" x="48.94" y="29.72" width=".4" height="2.73"/>
          <rect class="cls-40" x="49.33" y="29.72" width=".4" height="2.73"/>
          <rect class="cls-40" x="49.73" y="29.72" width=".64" height="2.73"/>
        </g>
        <g class="cls-4">
          <rect class="cls-36" x="29.6" y="41.12" width="1.01" height="9.38"/>
          <rect class="cls-36" x="30.6" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-18" x="30.66" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-20" x="30.71" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-29" x="30.77" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-22" x="30.82" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-38" x="30.88" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-35" x="30.93" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-32" x="30.99" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-11" x="31.04" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-34" x="31.1" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-17" x="31.15" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-23" x="31.21" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-7" x="31.27" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-8" x="31.32" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-28" x="31.38" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-25" x="31.43" y="41.12" width=".06" height="9.38"/>
          <rect class="cls-25" x="31.49" y="41.12" width=".12" height="9.38"/>
          <rect class="cls-3" x="31.6" y="41.12" width=".12" height="9.38"/>
          <rect class="cls-30" x="31.72" y="41.12" width=".12" height="9.38"/>
          <rect class="cls-31" x="31.84" y="41.12" width=".12" height="9.38"/>
          <rect class="cls-6" x="31.96" y="41.12" width=".12" height="9.38"/>
          <rect class="cls-40" x="32.07" y="41.12" width=".12" height="9.38"/>
          <rect class="cls-40" x="32.19" y="41.12" width=".12" height="9.38"/>
        </g>
        <g class="cls-15">
          <rect class="cls-36" x="16.84" y="37.62" width="2.88" height="7.65"/>
          <rect class="cls-36" x="19.71" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-18" x="19.86" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-20" x="20.01" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-29" x="20.16" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-22" x="20.3" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-38" x="20.45" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-35" x="20.6" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-32" x="20.75" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-11" x="20.89" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-34" x="21.04" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-17" x="21.19" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-23" x="21.34" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-7" x="21.48" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-8" x="21.63" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-28" x="21.78" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-25" x="21.93" y="37.62" width=".15" height="7.65"/>
          <rect class="cls-25" x="22.08" y="37.62" width=".31" height="7.65"/>
          <rect class="cls-3" x="22.39" y="37.62" width=".31" height="7.65"/>
          <rect class="cls-30" x="22.7" y="37.62" width=".31" height="7.65"/>
          <rect class="cls-31" x="23.01" y="37.62" width=".31" height="7.65"/>
          <rect class="cls-6" x="23.33" y="37.62" width=".31" height="7.65"/>
          <rect class="cls-40" x="23.64" y="37.62" width=".31" height="7.65"/>
          <rect class="cls-40" x="23.95" y="37.62" width=".57" height="7.65"/>
        </g>
        <g class="cls-1">
          <rect class="cls-36" x="17.11" y="17.27" width="2.6" height="7.52"/>
          <rect class="cls-36" x="19.71" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-18" x="19.86" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-20" x="20.01" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-29" x="20.15" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-22" x="20.3" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-38" x="20.45" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-35" x="20.6" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-32" x="20.74" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-11" x="20.89" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-34" x="21.04" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-17" x="21.19" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-23" x="21.33" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-7" x="21.48" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-8" x="21.63" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-28" x="21.77" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-25" x="21.92" y="17.27" width=".15" height="7.52"/>
          <rect class="cls-25" x="22.07" y="17.27" width=".31" height="7.52"/>
          <rect class="cls-3" x="22.38" y="17.27" width=".31" height="7.52"/>
          <rect class="cls-30" x="22.69" y="17.27" width=".31" height="7.52"/>
          <rect class="cls-31" x="23" y="17.27" width=".31" height="7.52"/>
          <rect class="cls-6" x="23.32" y="17.27" width=".31" height="7.52"/>
          <rect class="cls-40" x="23.63" y="17.27" width=".31" height="7.52"/>
          <rect class="cls-40" x="23.94" y="17.27" width=".67" height="7.52"/>
        </g>
        <path class="cls-5" d="M32.45,20.09c-.14.73-.83,1.1-1.45,1.1h-.05c-.76-.03-1.33-.54-1.43-1.3-.15-1.17-.16-5.54.03-6.74.11-.71.54-1.19,1.15-1.3.12-.02.23-.03.34-.03.3,0,.56.08.78.25.35.26.57.7.64,1.27.13,1.09.2,5.66-.01,6.75Z"/>
      </g>
      <g class="cls-2">
        <rect class="cls-36" x="37.21" y="17.15" width="3.02" height="7.7"/>
        <rect class="cls-36" x="40.23" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-18" x="40.38" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-20" x="40.53" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-29" x="40.67" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-22" x="40.82" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-38" x="40.97" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-35" x="41.11" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-32" x="41.26" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-11" x="41.41" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-34" x="41.55" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-17" x="41.7" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-23" x="41.85" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-7" x="41.99" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-8" x="42.14" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-28" x="42.29" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-25" x="42.43" y="17.15" width=".15" height="7.7"/>
        <rect class="cls-25" x="42.58" y="17.15" width=".31" height="7.7"/>
        <rect class="cls-3" x="42.89" y="17.15" width=".31" height="7.7"/>
        <rect class="cls-30" x="43.2" y="17.15" width=".31" height="7.7"/>
        <rect class="cls-31" x="43.51" y="17.15" width=".31" height="7.7"/>
        <rect class="cls-6" x="43.82" y="17.15" width=".31" height="7.7"/>
        <rect class="cls-40" x="44.13" y="17.15" width=".31" height="7.7"/>
        <rect class="cls-40" x="44.44" y="17.15" width=".6" height="7.7"/>
      </g>
      <g>
        <g class="cls-16">
          <rect class="cls-36" x="37.73" y="37.89" width="2.6" height="7.44"/>
          <rect class="cls-36" x="40.33" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-18" x="40.48" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-20" x="40.63" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-29" x="40.78" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-22" x="40.92" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-38" x="41.07" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-35" x="41.22" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-32" x="41.37" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-11" x="41.51" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-34" x="41.66" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-17" x="41.81" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-23" x="41.95" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-7" x="42.1" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-8" x="42.25" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-28" x="42.4" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-25" x="42.54" y="37.89" width=".15" height="7.44"/>
          <rect class="cls-25" x="42.69" y="37.89" width=".31" height="7.44"/>
          <rect class="cls-3" x="43" y="37.89" width=".31" height="7.44"/>
          <rect class="cls-30" x="43.31" y="37.89" width=".31" height="7.44"/>
          <rect class="cls-31" x="43.63" y="37.89" width=".31" height="7.44"/>
          <rect class="cls-6" x="43.94" y="37.89" width=".31" height="7.44"/>
          <rect class="cls-40" x="44.25" y="37.89" width=".31" height="7.44"/>
          <rect class="cls-40" x="44.56" y="37.89" width=".72" height="7.44"/>
        </g>
        <path class="cls-12" d="M37.91,24.14c-.41-.41-.62-1.16-.14-1.89.46-.71,3.94-4.14,4.59-4.63.05-.04.1-.08.15-.12.19-.16.41-.34.71-.4.08-.02.16-.02.25-.02.44,0,.87.22,1.15.63.36.52.37,1.21.02,1.75-.36.55-4.28,4.48-4.83,4.83-.3.19-.6.27-.88.27-.41,0-.77-.17-1.02-.42Z"/>
        <path class="cls-10" d="M17,18.88c-.16-.65.2-1.54.93-1.76.18-.05.36-.08.55-.08.11,0,.21.01.32.03.53.09,1.53,1.14,3.13,2.85.85.91,1.72,1.85,2.14,2.13l.05.04.03.06c.38.75.31,1.54-.18,2-.25.24-.57.35-.92.35-.31,0-.65-.09-.99-.28l-.05-.05-4.99-5.22-.02-.07Z"/>
        <path class="cls-14" d="M32.33,41.67c.25.51.2,6.78.11,7.31-.14.93-.84,1.34-1.44,1.34h-.02c-.64-.01-1.33-.49-1.45-1.53-.13-1.09-.2-5.67.01-6.75.11-.57.67-1,1.16-1.08.07-.01.15-.02.23-.02.53,0,1.19.28,1.4.73Z"/>
        <path class="cls-33" d="M24.04,38.17c.4.45.47,1.1.2,1.69l-.05.07-4.9,4.92c-.37.17-.72.26-1.04.26-.34,0-.65-.11-.88-.32-.44-.4-.53-1.08-.25-1.88l.03-.08.06-.04c.46-.31,1.38-1.32,2.26-2.29,1.47-1.62,2.4-2.61,2.9-2.76.17-.05.35-.08.52-.08.45,0,.86.18,1.15.51Z"/>
        <path class="cls-26" d="M20.02,32.52c-.44.08-1.78.12-3.18.12-1.58,0-3.24-.05-3.76-.13-.89-.14-1.31-.81-1.33-1.41-.02-.59.32-1.26,1.14-1.45.41-.09,2.28-.15,4.02-.15,1.41,0,2.73.04,3.11.11.75.14,1.09.83,1.09,1.45s-.34,1.31-1.09,1.46Z"/>
        <path class="cls-19" d="M50.24,31.06c0,.62-.41,1.31-1.33,1.45-.52.08-2.18.13-3.76.13-1.4,0-2.74-.04-3.18-.12-.62-.12-1.05-.66-1.08-1.38-.03-.6.23-1.29.89-1.49.32-.1,1.83-.14,3.39-.14,1.65,0,3.36.05,3.74.11.92.14,1.33.83,1.33,1.44Z"/>
        <path class="cls-27" d="M44.76,42.75c.39.67.32,1.42-.17,1.91-.28.28-.65.43-1.03.43-.29,0-.59-.09-.88-.26l-.05-.04-4.99-5.22-.02-.07c-.16-.65.2-1.54.93-1.76.18-.05.36-.08.55-.08.11,0,.21.01.32.03.53.09,1.53,1.14,3.13,2.85.85.91,1.72,1.85,2.14,2.13l.07.08Z"/>
      </g>
    </g>
  </g>
</svg>`,

    // PASTE YOUR DARK+ SVG HERE
    darkPlus: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 { fill: #dfadae; }
      .cls-2 { fill: #e2b1b2; }
      .cls-3 { fill: #dba9aa; }
      .cls-4 { fill: #dcaaab; }
      .cls-5 { fill: none; }
      .cls-6 { fill: #d7a5a6; }
      .cls-7 { fill: #d9a7a8; }
      .cls-8 { fill: #d19d9f; }
      .cls-9 { fill: #d29ea0; }
      .cls-10 { fill: #d4a0a2; }
      .cls-11 { fill: #daa8a9; }
      .cls-12 { fill: #23242a; opacity: 1; }
      .cls-13 { fill: #deacad; }
      .cls-14 { fill: #ddabac; }
      .cls-15 { fill: #d39fa1; }
      .cls-16 { fill: #e0aeaf; }
      .cls-17 { fill: #e1b0b1; }
      .cls-18 { fill: #d7a3a5; }
      .cls-19 { fill: #d8a6a7; }
      .cls-20 { fill: #d6a2a4; }
      .cls-21 { fill: #d09c9e; }
      .cls-22 { fill: #d5a1a3; }
      .cls-23 { fill: url(#linear-gradient); }
      .cls-24 { fill: #e3b2b3; }
      .cls-25 { clip-path: url(#clippath); }
    </style>
    <clipPath id="clippath">
      <path class="cls-5" d="M33.89,12.68c-.34.39-1.08.88-1.5,1.27-5.33,5.09-6.81,13.15-3.14,19.67,3.25,5.78,10.28,9.04,16.8,7.3.95-.25,1.82-.71,2.75-1.02,2.01.45.34,2.39-.34,3.35-8.42,11.71-26.59,10.4-33.56-2.09-6.91-12.38.38-27.65,14.28-30.03,1-.17,3.35-.47,4.27-.23.77.2.95,1.21.45,1.78ZM30.06,13.19c-5.45.73-10.24,3.75-13.06,8.48-7.83,13.12,2.61,29.37,17.82,27.37,3.62-.48,7.91-2.36,10.36-5.12.07-.08.58-.67.52-.72-4.29.73-8.8-.08-12.48-2.41-8.36-5.28-10.48-16.54-5.25-24.83.62-.98,1.36-1.87,2.09-2.77Z"/>
    </clipPath>
    <linearGradient id="linear-gradient" x1="11.98" y1="31.07" x2="50.01" y2="31.07" gradientUnits="userSpaceOnUse">
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-12" width="62" height="62" rx="10.17" ry="10.17"/>
      <g>
        <g class="cls-25">
          <rect class="cls-21" x="9.17" y="13.19" width="16.58" height="37.85"/>
          <rect class="cls-21" x="25.75" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-8" x="26.55" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-9" x="27.34" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-15" x="28.14" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-10" x="28.94" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-22" x="29.73" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-20" x="30.53" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-18" x="31.33" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-6" x="32.13" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-19" x="32.92" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-7" x="33.72" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-11" x="34.52" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-3" x="35.31" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-4" x="36.11" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-14" x="36.91" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-13" x="37.71" y="13.19" width=".8" height="37.85"/>
          <rect class="cls-13" x="38.5" y="13.19" width="1.69" height="37.85"/>
          <rect class="cls-1" x="40.19" y="13.19" width="1.69" height="37.85"/>
          <rect class="cls-16" x="41.88" y="13.19" width="1.69" height="37.85"/>
          <rect class="cls-17" x="43.57" y="13.19" width="1.69" height="37.85"/>
          <rect class="cls-2" x="45.26" y="13.19" width=".51" height="37.85"/>
          <rect class="cls-21" x="7.98" y="10.66" width="17.77" height="44.3"/>
          <rect class="cls-21" x="25.75" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-8" x="26.55" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-9" x="27.34" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-15" x="28.14" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-10" x="28.94" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-22" x="29.73" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-20" x="30.53" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-18" x="31.33" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-6" x="32.13" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-19" x="32.92" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-7" x="33.72" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-11" x="34.52" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-3" x="35.31" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-4" x="36.11" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-14" x="36.91" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-13" x="37.71" y="10.66" width=".8" height="44.3"/>
          <rect class="cls-13" x="38.5" y="10.66" width="1.69" height="44.3"/>
          <rect class="cls-1" x="40.19" y="10.66" width="1.69" height="44.3"/>
          <rect class="cls-16" x="41.88" y="10.66" width="1.69" height="44.3"/>
          <rect class="cls-17" x="43.57" y="10.66" width="1.69" height="44.3"/>
          <rect class="cls-2" x="45.26" y="10.66" width=".51" height="44.3"/>
          <rect class="cls-24" x="46.94" y="10.66" width="1.69" height="44.3"/>
          <rect class="cls-24" x="48.63" y="10.66" width="2.18" height="44.3"/>
        </g>
        <path class="cls-23" d="M49.94,40.44c-.15-.39-.51-.65-1.09-.78l-.07-.02-.07.03c-.39.13-.77.28-1.15.44-.51.21-1.04.43-1.58.57-6.28,1.68-13.23-1.34-16.52-7.18-3.53-6.29-2.26-14.25,3.1-19.37.17-.16.39-.34.63-.52.33-.26.67-.52.88-.77.32-.36.42-.88.28-1.35-.13-.42-.44-.72-.85-.83-1.21-.32-4.35.22-4.38.22-6.7,1.15-12.21,5.3-15.11,11.38-2.92,6.11-2.68,13.04.66,19.02,3.36,6.02,9.57,9.86,16.61,10.26.41.03.81.04,1.2.04,6.47,0,12.45-3.01,16.17-8.18l.2-.27c.59-.79,1.39-1.87,1.09-2.69ZM45,43.75c-2.22,2.51-6.33,4.53-10.21,5.04-6.99.92-13.43-2-17.25-7.8-3.81-5.8-3.93-13.15-.33-19.19,2.63-4.41,7.07-7.39,12.25-8.27-.59.73-1.19,1.48-1.7,2.29-5.42,8.6-3.03,19.9,5.33,25.18,3.49,2.2,7.87,3.12,12.1,2.53-.07.08-.14.16-.19.22Z"/>
      </g>
    </g>
  </g>
</svg>`,

    // PASTE YOUR VENV SETUP SVG HERE
    venvSetup: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        fill: #dfadae;
      }

      .cls-2 {
        clip-path: url(#clippath-4);
      }

      .cls-3 {
        fill: url(#linear-gradient-2);
      }

      .cls-4 {
        fill: #e2b1b2;
      }

      .cls-5 {
        fill: #dba9aa;
      }

      .cls-6 {
        fill: #dcaaab;
      }

      .cls-7 {
        fill: none;
      }

      .cls-8 {
        fill: url(#linear-gradient-4);
      }

      .cls-9 {
        fill: #d7a5a6;
      }

      .cls-10 {
        fill: url(#linear-gradient-3);
      }

      .cls-11 {
        clip-path: url(#clippath-1);
      }

      .cls-12 {
        fill: url(#linear-gradient-5);
      }

      .cls-13 {
        fill: #d9a7a8;
      }

      .cls-14 {
        fill: #d19d9f;
      }

      .cls-15 {
        fill: #d29ea0;
      }

      .cls-16 {
        clip-path: url(#clippath-3);
      }

      .cls-17 {
        fill: #d4a0a2;
      }

      .cls-18 {
        fill: #daa8a9;
      }

      .cls-19 {
        fill: #fff;
        opacity: .1;
      }

      .cls-20 {
        fill: #deacad;
      }

      .cls-21 {
        fill: #ddabac;
      }

      .cls-22 {
        fill: #d39fa1;
      }

      .cls-23 {
        fill: #e0aeaf;
      }

      .cls-24 {
        fill: #e1b0b1;
      }

      .cls-25 {
        fill: #d7a3a5;
      }

      .cls-26 {
        fill: #d8a6a7;
      }

      .cls-27 {
        fill: #d6a2a4;
      }

      .cls-28 {
        fill: #d09c9e;
      }

      .cls-29 {
        clip-path: url(#clippath-2);
      }

      .cls-30 {
        fill: #d5a1a3;
      }

      .cls-31 {
        fill: url(#linear-gradient);
      }

      .cls-32 {
        fill: #e3b2b3;
      }

      .cls-33 {
        clip-path: url(#clippath);
      }
    </style>
    <clipPath id="clippath">
      <path class="cls-7" d="M24.75,12.2v9.76c0,.24-.49.71-.77.71h-9.99c-.21.03-.36.26-.46.44l-.04,24.05c.2,1.34.86,2.19,2.24,2.39,3.9.14,7.81.02,11.72.06.95.29.71,1.56-.26,1.58h-11.41c-2.15-.18-3.67-1.76-3.93-3.87v-24.36c0-.35.14-.68.37-.95l10.97-10.97c.27-.25.63-.39,1-.42h16.05c2.89.24,5.16,2.62,5.34,5.5.14,2.28-.11,4.7,0,7-.05.94-1.31,1.11-1.58.2-.09-2.17.1-4.41,0-6.57-.08-1.59-.54-2.86-1.9-3.78-.4-.27-1.46-.77-1.91-.77h-15.44ZM23.23,21.14v-7.84l-7.84,7.84h7.84Z"/>
    </clipPath>
    <linearGradient id="linear-gradient" x1="11.37" y1="30.9" x2="46.12" y2="30.9" gradientUnits="userSpaceOnUse">
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <clipPath id="clippath-1">
      <path class="cls-7" d="M35.85,37.45h2.4c2.29,0,4.15-1.86,4.15-4.15v-4.8c0-1.79-1.46-3.25-3.25-3.25h-4.2c-1.79,0-3.25,1.46-3.25,3.25v2.4c0,.3.25.55.55.55h4.26v1.31h-9.06c-1.79,0-3.25,1.46-3.25,3.25v4.2c0,1.79,1.46,3.25,3.25,3.25h2.4c.3,0,.55-.25.55-.55,0-3.01,2.45-5.46,5.46-5.46ZM29.31,42.36h-1.88c-1.19,0-2.15-.97-2.15-2.15v-4.2c0-1.19.97-2.15,2.15-2.15h9.61c.3,0,.55-.25.55-.55v-2.4c0-.3-.25-.55-.55-.55h-4.26v-1.85c0-1.19.97-2.15,2.15-2.15h4.2c1.19,0,2.15.97,2.15,2.15v4.8c0,1.68-1.37,3.05-3.05,3.05h-2.4c-3.43,0-6.25,2.65-6.53,6.01Z"/>
    </clipPath>
    <linearGradient id="linear-gradient-2" x1="24.06" y1="34.35" x2="42.53" y2="34.35" xlink:href="#linear-gradient"/>
    <clipPath id="clippath-2">
      <path class="cls-7" d="M46.66,32.75h-2.4c-.3,0-.55.25-.55.55,0,3.01-2.45,5.46-5.46,5.46h-2.4c-2.29,0-4.15,1.86-4.15,4.15v4.8c0,1.79,1.46,3.25,3.25,3.25h4.2c1.79,0,3.25-1.46,3.25-3.25v-2.4c0-.3-.25-.55-.55-.55h-4.26v-1.31h9.06c1.79,0,3.25-1.46,3.25-3.25v-4.2c0-1.79-1.46-3.25-3.25-3.25ZM48.81,40.2h0c0,1.19-.97,2.15-2.15,2.15h-9.61c-.3,0-.55.25-.55.55v2.4c0,.3.25.55.55.55h4.26v1.85c0,1.19-.97,2.15-2.15,2.15h-4.2c-1.19,0-2.15-.97-2.15-2.15v-4.8c0-1.68,1.37-3.05,3.05-3.05h2.4c3.43,0,6.25-2.65,6.53-6.01h1.88c1.19,0,2.15.97,2.15,2.15v4.2h0Z"/>
    </clipPath>
    <linearGradient id="linear-gradient-3" x1="31.57" y1="41.85" x2="50.03" y2="41.85" xlink:href="#linear-gradient"/>
    <clipPath id="clippath-3">
      <circle class="cls-7" cx="34.93" cy="28.58" r=".55"/>
    </clipPath>
    <linearGradient id="linear-gradient-4" x1="34.26" y1="28.58" x2="35.6" y2="28.58" xlink:href="#linear-gradient"/>
    <clipPath id="clippath-4">
      <circle class="cls-7" cx="39.18" cy="47.72" r=".55"/>
    </clipPath>
    <linearGradient id="linear-gradient-5" x1="38.5" y1="47.72" x2="39.86" y2="47.72" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-19" width="62" height="62" rx="10.17" ry="10.17"/>
      <g>
        <g class="cls-33">
          <rect class="cls-28" x="15.39" y="13.3" width="7.84" height="7.84"/>
          <rect class="cls-28" x="11.86" y="10.62" width="12.15" height="40.56"/>
          <rect class="cls-28" x="24.02" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-14" x="24.73" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-15" x="25.45" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-22" x="26.17" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-17" x="26.89" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-30" x="27.6" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-27" x="28.32" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-25" x="29.04" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-9" x="29.76" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-26" x="30.47" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-13" x="31.19" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-18" x="31.91" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-5" x="32.63" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-6" x="33.34" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-21" x="34.06" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-20" x="34.78" y="10.62" width=".72" height="40.56"/>
          <rect class="cls-20" x="35.5" y="10.62" width="1.52" height="40.56"/>
          <rect class="cls-1" x="37.02" y="10.62" width="1.52" height="40.56"/>
          <rect class="cls-23" x="38.53" y="10.62" width="1.52" height="40.56"/>
          <rect class="cls-24" x="40.05" y="10.62" width="1.52" height="40.56"/>
          <rect class="cls-4" x="41.57" y="10.62" width="1.52" height="40.56"/>
          <rect class="cls-32" x="43.09" y="10.62" width="1.52" height="40.56"/>
          <rect class="cls-32" x="44.61" y="10.62" width="1.11" height="40.56"/>
        </g>
        <path class="cls-31" d="M46.08,16.09c-.19-3.14-2.68-5.71-5.83-5.97h-16.1c-.5.05-.95.25-1.3.57l-11,11c-.3.36-.47.8-.48,1.27v24.41c.29,2.38,2.05,4.11,4.42,4.3h11.42c.7-.01,1.25-.48,1.34-1.14.09-.64-.29-1.2-.94-1.41l-.15-.02c-1.52-.01-3.05-.01-4.58,0-2.33.01-4.76.02-7.07-.05-1.07-.16-1.63-.77-1.81-1.9l.04-23.91s.04-.06.05-.07h9.88c.36.03.7-.26.87-.42.19-.18.41-.47.41-.79v-9.26h14.94c.29,0,1.24.42,1.64.69,1.1.74,1.6,1.75,1.68,3.39.05,1.09.02,2.24,0,3.35-.02,1.05-.04,2.15,0,3.21l.02.13c.19.64.76,1.01,1.39.94.65-.07,1.12-.59,1.16-1.31-.05-1.09-.02-2.23.01-3.34.03-1.21.07-2.47-.01-3.67ZM22.73,20.65h-6.13l6.13-6.13v6.13Z"/>
      </g>
      <g class="cls-11">
        <rect class="cls-28" x="25.28" y="26.34" width="5.46" height="16.02"/>
        <rect class="cls-28" x="30.74" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-14" x="31.13" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-15" x="31.52" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-22" x="31.9" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-17" x="32.29" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-30" x="32.68" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-27" x="33.07" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-25" x="33.45" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-9" x="33.84" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-26" x="34.23" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-13" x="34.61" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-18" x="35" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-5" x="35.39" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-6" x="35.77" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-21" x="36.16" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-20" x="36.55" y="26.34" width=".39" height="16.02"/>
        <rect class="cls-20" x="36.94" y="26.34" width=".82" height="16.02"/>
        <rect class="cls-1" x="37.76" y="26.34" width=".82" height="16.02"/>
        <rect class="cls-23" x="38.57" y="26.34" width=".82" height="16.02"/>
        <rect class="cls-24" x="39.39" y="26.34" width=".82" height="16.02"/>
        <rect class="cls-4" x="40.21" y="26.34" width=".82" height="16.02"/>
        <rect class="cls-32" x="41.03" y="26.34" width=".27" height="16.02"/>
        <rect class="cls-28" x="24.19" y="25.24" width="6.56" height="18.21"/>
        <rect class="cls-28" x="30.74" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-14" x="31.13" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-15" x="31.52" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-22" x="31.9" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-17" x="32.29" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-30" x="32.68" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-27" x="33.07" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-25" x="33.45" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-9" x="33.84" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-26" x="34.23" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-13" x="34.61" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-18" x="35" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-5" x="35.39" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-6" x="35.77" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-21" x="36.16" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-20" x="36.55" y="25.24" width=".39" height="18.21"/>
        <rect class="cls-20" x="36.94" y="25.24" width=".82" height="18.21"/>
        <rect class="cls-1" x="37.76" y="25.24" width=".82" height="18.21"/>
        <rect class="cls-23" x="38.57" y="25.24" width=".82" height="18.21"/>
        <rect class="cls-24" x="39.39" y="25.24" width=".82" height="18.21"/>
        <rect class="cls-4" x="40.21" y="25.24" width=".82" height="18.21"/>
        <rect class="cls-32" x="41.03" y="25.24" width=".82" height="18.21"/>
        <rect class="cls-32" x="41.85" y="25.24" width=".55" height="18.21"/>
      </g>
      <path class="cls-3" d="M39.15,25.12h-4.2c-1.87,0-3.38,1.51-3.38,3.37v2.4c0,.38.3.68.67.68h4.14v1.05h-8.94c-1.87,0-3.38,1.52-3.38,3.38v4.21c0,1.86,1.51,3.37,3.38,3.37h2.4c.37,0,.67-.3.67-.67,0-2.94,2.39-5.33,5.33-5.33h2.4c2.36,0,4.28-1.92,4.28-4.28v-4.81c0-1.86-1.52-3.37-3.38-3.37ZM41.18,33.3c0,1.62-1.31,2.93-2.93,2.93h-2.4c-3.41,0-6.3,2.63-6.64,6.01h-1.76c-1.12,0-2.04-.91-2.04-2.03v-4.21c0-1.11.91-2.03,2.04-2.03h9.6c.38,0,.68-.3.68-.68v-2.4c0-.37-.3-.67-.68-.67h-4.13v-1.74c0-1.11.91-2.03,2.04-2.03h4.2c1.11,0,2.03.91,2.03,2.03v4.81Z"/>
      <g class="cls-29">
        <rect class="cls-28" x="32.79" y="33.85" width="5.46" height="16.02"/>
        <rect class="cls-28" x="38.25" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-14" x="38.64" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-15" x="39.02" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-22" x="39.41" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-17" x="39.8" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-30" x="40.19" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-27" x="40.57" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-25" x="40.96" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-9" x="41.35" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-26" x="41.73" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-13" x="42.12" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-18" x="42.51" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-5" x="42.89" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-6" x="43.28" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-21" x="43.67" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-20" x="44.06" y="33.85" width=".39" height="16.02"/>
        <rect class="cls-20" x="44.44" y="33.85" width=".82" height="16.02"/>
        <rect class="cls-1" x="45.26" y="33.85" width=".82" height="16.02"/>
        <rect class="cls-23" x="46.08" y="33.85" width=".82" height="16.02"/>
        <rect class="cls-24" x="46.9" y="33.85" width=".82" height="16.02"/>
        <rect class="cls-4" x="47.72" y="33.85" width=".82" height="16.02"/>
        <rect class="cls-32" x="48.54" y="33.85" width=".27" height="16.02"/>
        <rect class="cls-28" x="31.69" y="32.75" width="6.56" height="18.21"/>
        <rect class="cls-28" x="38.25" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-14" x="38.64" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-15" x="39.02" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-22" x="39.41" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-17" x="39.8" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-30" x="40.19" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-27" x="40.57" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-25" x="40.96" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-9" x="41.35" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-26" x="41.73" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-13" x="42.12" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-18" x="42.51" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-5" x="42.89" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-6" x="43.28" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-21" x="43.67" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-20" x="44.06" y="32.75" width=".39" height="18.21"/>
        <rect class="cls-20" x="44.44" y="32.75" width=".82" height="18.21"/>
        <rect class="cls-1" x="45.26" y="32.75" width=".82" height="18.21"/>
        <rect class="cls-23" x="46.08" y="32.75" width=".82" height="18.21"/>
        <rect class="cls-24" x="46.9" y="32.75" width=".82" height="18.21"/>
        <rect class="cls-4" x="47.72" y="32.75" width=".82" height="18.21"/>
        <rect class="cls-32" x="48.54" y="32.75" width=".82" height="18.21"/>
        <rect class="cls-32" x="49.36" y="32.75" width=".55" height="18.21"/>
      </g>
      <path class="cls-10" d="M46.66,32.62h-2.4c-.38,0-.68.31-.68.68,0,2.94-2.39,5.33-5.33,5.33h-2.4c-2.35,0-4.27,1.92-4.27,4.28v4.8c0,1.87,1.51,3.38,3.38,3.38h4.2c1.86,0,3.38-1.51,3.38-3.38v-2.4c0-.37-.31-.67-.68-.67h-4.13v-1.06h8.94c1.86,0,3.37-1.51,3.37-3.37v-4.21c0-1.86-1.51-3.38-3.37-3.38ZM48.69,40.21c0,1.11-.91,2.03-2.03,2.03h-9.61c-.37,0-.67.3-.67.68v2.39c0,.38.3.68.67.68h4.13v1.73c0,1.12-.91,2.04-2.03,2.04h-4.2c-1.12,0-2.04-.91-2.04-2.04v-4.8c0-1.62,1.32-2.93,2.93-2.93h2.4c3.41,0,6.31-2.63,6.64-6.01h1.77c1.11,0,2.03.91,2.03,2.03v4.21Z"/>
      <g class="cls-16">
        <rect class="cls-28" x="34.39" y="28.04" width=".39" height="1.1"/>
        <rect class="cls-28" x="34.78" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-14" x="34.8" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-15" x="34.83" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-22" x="34.85" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-17" x="34.87" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-30" x="34.9" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-27" x="34.92" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-25" x="34.94" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-9" x="34.97" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-26" x="34.99" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-13" x="35.01" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-18" x="35.04" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-5" x="35.06" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-6" x="35.08" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-21" x="35.11" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-20" x="35.13" y="28.04" width=".02" height="1.1"/>
        <rect class="cls-20" x="35.15" y="28.04" width=".05" height="1.1"/>
        <rect class="cls-1" x="35.2" y="28.04" width=".05" height="1.1"/>
        <rect class="cls-23" x="35.25" y="28.04" width=".05" height="1.1"/>
        <rect class="cls-24" x="35.3" y="28.04" width=".05" height="1.1"/>
        <rect class="cls-4" x="35.35" y="28.04" width=".05" height="1.1"/>
        <rect class="cls-32" x="35.4" y="28.04" width=".05" height="1.1"/>
        <rect class="cls-32" x="35.45" y="28.04" width=".03" height="1.1"/>
      </g>
      <path class="cls-8" d="M35.6,28.59c0,.37-.3.67-.67.67s-.68-.3-.68-.67.3-.68.68-.68.67.3.67.68Z"/>
      <g class="cls-2">
        <rect class="cls-28" x="38.63" y="47.17" width=".39" height="1.1"/>
        <rect class="cls-28" x="39.03" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-14" x="39.05" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-15" x="39.07" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-22" x="39.1" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-17" x="39.12" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-30" x="39.14" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-27" x="39.17" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-25" x="39.19" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-9" x="39.21" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-26" x="39.24" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-13" x="39.26" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-18" x="39.28" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-5" x="39.31" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-6" x="39.33" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-21" x="39.35" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-20" x="39.38" y="47.17" width=".02" height="1.1"/>
        <rect class="cls-20" x="39.4" y="47.17" width=".05" height="1.1"/>
        <rect class="cls-1" x="39.45" y="47.17" width=".05" height="1.1"/>
        <rect class="cls-23" x="39.5" y="47.17" width=".05" height="1.1"/>
        <rect class="cls-24" x="39.55" y="47.17" width=".05" height="1.1"/>
        <rect class="cls-4" x="39.6" y="47.17" width=".05" height="1.1"/>
        <rect class="cls-32" x="39.65" y="47.17" width=".05" height="1.1"/>
        <rect class="cls-32" x="39.69" y="47.17" width=".03" height="1.1"/>
      </g>
      <path class="cls-12" d="M39.86,47.72c0,.38-.31.68-.68.68s-.68-.3-.68-.68.31-.67.68-.67.68.3.68.67Z"/>
    </g>
  </g>
</svg>`,

    // PASTE YOUR FINAL STEP SVG HERE
    finalStep: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <!-- PASTE YOUR FINAL STEP SVG CONTENT HERE -->
  <defs>
    <style>
      .cls-1 { fill: url(#linear-gradient-2); }
      .cls-2 { fill: #23242a; opacity: 1; }
      .cls-3 { fill: url(#linear-gradient); }
    </style>
  </defs>
  <rect class="cls-2" width="62" height="62" rx="10.17" ry="10.17"/>
  <!-- Add your final step icon elements here -->
</svg>`,

    odooConf: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        fill: url(#linear-gradient-2);
      }

      .cls-2 {
        fill: url(#linear-gradient-3);
      }

      .cls-3 {
        fill: #fff;
        opacity: .1;
      }

      .cls-4 {
        fill: url(#linear-gradient);
      }
    </style>
    <linearGradient id="linear-gradient" x1="19.78" y1="31.07" x2="42.22" y2="31.07" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#bc8487"/>
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="26.69" y1="31.07" x2="35.31" y2="31.07" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-3" x1="12.45" y1="31.07" x2="49.55" y2="31.07" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-3" x="0" width="62" height="62" rx="10.17" ry="10.17"/>
      <path class="cls-4" d="M31.57,42.72h-1.13c-.83,0-1.48,0-2.09-.45-.6-.44-.79-1.03-1.06-1.85l-.34-1.04c-.04-.1-.15-.24-.28-.32l-.29-.17c-.1-.05-.27-.07-.43-.03l-1.18.34c-.89.26-1.53.44-2.27.14-.74-.31-1.07-.89-1.52-1.7l-.5-.89c-.43-.76-.74-1.3-.66-2.05.08-.75.49-1.22,1.07-1.87l1.05-1.19s.12-.3.12-.57-.11-.55-.17-.63l-1-1.13c-.57-.65-.99-1.12-1.07-1.87-.08-.75.23-1.29.66-2.05l.5-.89c.46-.81.79-1.39,1.52-1.7.74-.31,1.39-.12,2.27.13l1.24.36c.1.02.28,0,.42-.08l.29-.17c.08-.05.19-.19.25-.34l.32-.98c.27-.83.47-1.42,1.07-1.86.61-.45,1.26-.45,2.09-.45h1.13c.83,0,1.48,0,2.09.44.6.44.8,1.04,1.07,1.86l.34,1.03c.04.1.15.24.28.32l.29.17c.09.05.26.07.43.03l1.18-.34c.85-.25,1.53-.44,2.27-.14.74.31,1.07.89,1.53,1.7l.5.89c.43.76.74,1.3.66,2.05-.08.75-.49,1.22-1.07,1.87l-1.05,1.19s-.12.3-.12.57.11.55.17.63l1,1.13c.57.65.99,1.12,1.07,1.86.08.75-.23,1.29-.66,2.05l-.5.89c-.46.81-.79,1.39-1.52,1.7-.74.31-1.42.11-2.28-.13l-1.24-.36c-.1-.02-.28,0-.42.08l-.29.17c-.08.05-.19.19-.24.34l-.32.98c-.27.82-.46,1.42-1.06,1.86-.61.45-1.26.45-2.09.45ZM29.91,40.12c.14,0,.34,0,.52,0h1.13c.19,0,.4,0,.54,0,.02-.1.09-.32.15-.52l.34-1.04c.27-.72.73-1.3,1.32-1.68l.4-.23c.75-.4,1.56-.5,2.33-.32l1.3.37c.19.05.39.11.54.15.08-.14.19-.33.29-.5l.5-.89c.1-.17.21-.36.28-.5-.1-.12-.24-.28-.37-.43l-1.05-1.2c-.49-.62-.76-1.47-.76-2.28s.27-1.65.71-2.22l1.1-1.25c.13-.15.28-.31.37-.43-.07-.14-.18-.33-.27-.5h0s-.5-.89-.5-.89c-.1-.17-.21-.36-.29-.5-.15.04-.35.1-.54.15l-1.24.36c-.83.2-1.64.1-2.34-.27l-.4-.23c-.64-.42-1.11-1-1.36-1.66l-.36-1.09c-.06-.18-.12-.38-.18-.52-.14,0-.34,0-.52,0h-1.13c-.19,0-.4,0-.55,0-.02.1-.09.32-.15.51l-.34,1.04c-.27.73-.73,1.29-1.32,1.68l-.39.23c-.76.4-1.57.5-2.33.32l-1.3-.37c-.19-.05-.39-.11-.54-.15-.08.14-.19.32-.29.5l-.5.89c-.1.17-.21.36-.28.5.1.12.24.28.37.43l1.05,1.2c.49.63.76,1.47.76,2.28s-.27,1.65-.71,2.22l-1.1,1.26c-.13.15-.28.31-.37.43.07.14.18.33.27.5l.5.89c.1.18.21.36.29.5.15-.04.35-.1.54-.15l1.24-.36c.83-.2,1.64-.09,2.34.27l.4.23c.65.42,1.1.99,1.36,1.66l.36,1.09c.06.19.12.38.18.52Z"/>
      <path class="cls-1" d="M31,35.38c-2.38,0-4.31-1.94-4.31-4.31s1.94-4.31,4.31-4.31,4.31,1.94,4.31,4.31-1.94,4.31-4.31,4.31ZM31,29.34c-.95,0-1.73.77-1.73,1.73s.77,1.73,1.73,1.73,1.73-.77,1.73-1.73-.77-1.73-1.73-1.73Z"/>
      <path class="cls-2" d="M31,49.62c-3.92,0-7.66-1.21-10.79-3.45v2.16c0,.71-.58,1.29-1.29,1.29s-1.29-.58-1.29-1.29v-4.93c0-.52.31-.99.79-1.19.48-.2,1.03-.1,1.41.27,3,2.94,6.97,4.56,11.17,4.56,8.8,0,15.96-7.16,15.96-15.96,0-2.22-.45-4.37-1.33-6.38-.29-.65.01-1.42.67-1.7.65-.29,1.42.01,1.7.67,1.02,2.34,1.54,4.84,1.54,7.42,0,10.23-8.32,18.55-18.55,18.55ZM15.18,39.26c-.5,0-.97-.29-1.19-.78-1.02-2.35-1.54-4.84-1.54-7.42,0-10.23,8.32-18.55,18.55-18.55,3.92,0,7.66,1.21,10.79,3.45v-2.16c0-.71.58-1.29,1.29-1.29s1.29.58,1.29,1.29v4.93c0,.52-.31.99-.79,1.19s-1.04.1-1.41-.27c-3-2.94-6.97-4.56-11.17-4.56-8.8,0-15.96,7.16-15.96,15.96,0,2.22.45,4.37,1.33,6.38.29.66-.01,1.42-.67,1.7-.17.07-.34.11-.52.11Z"/>
    </g>
  </g>
</svg>`,
    setupDebugger: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        fill: url(#linear-gradient-2);
      }

      .cls-2 {
        fill: #fff;
        opacity: .1;
      }

      .cls-3 {
        fill: url(#linear-gradient);
      }
    </style>
    <linearGradient id="linear-gradient" x1="-5016.44" y1="-297.87" x2="-4974.74" y2="-297.87" gradientTransform="translate(3774.04 -3290.72) rotate(-45)" gradientUnits="userSpaceOnUse">
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="-5006.75" y1="-298.07" x2="-4984.59" y2="-298.07" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-2" x="0" width="62" height="62" rx="10.17" ry="10.17"/>
      <g>
        <path class="cls-3" d="M16.02,45.58c-.29-.76-.06-1.34.58-1.84-6.35-7.07-6.34-18.28,0-25.34-1.81-1.41.32-3.54,1.73-1.73,7.07-6.35,18.28-6.34,25.34,0,1.41-1.81,3.54.32,1.73,1.73,6.34,7.07,6.35,18.28,0,25.34.64.5.86,1.08.58,1.84l-.46.46c-.76.29-1.34.06-1.84-.58-7.07,6.34-18.28,6.34-25.34,0-.5.64-1.08.86-1.84.58l-.46-.46ZM18.33,20.12c-5.39,6.17-5.4,15.72,0,21.89.51-.62,1.29-1.29,2.1-.75,1.04.69.46,1.9-.37,2.48,6.16,5.39,15.72,5.39,21.89,0-.62-.51-1.29-1.29-.75-2.1.69-1.04,1.9-.46,2.48.37,5.39-6.16,5.39-15.72,0-21.89-.51.62-1.29,1.29-2.1.75-1.04-.69-.46-1.9.37-2.48-6.16-5.39-15.72-5.4-21.89,0,.62.51,1.29,1.29.75,2.1-.69,1.04-1.9.47-2.48-.37Z"/>
        <path class="cls-1" d="M26.74,37.17l-1.56-1.54c-1.27.84-3.55.45-4.44-.79-.63-.89.28-2.15,1.3-1.88.53.14.86.79,1.47.65-.57-1.01-.65-2.27-.31-3.37-.74-.78-1.42-1.58-1.67-2.65-.9-.06-2.15-.02-2.19-1.27s1.24-1.34,2.14-1.29c.29-.49.42-1.08.77-1.54.69-.89,1.6-1.58,2.68-1.9.21-.22-.23-1.36.58-1.95.39-.29,1.05-.29,1.44,0,.8.59.37,1.75.57,1.95,1.05.26,1.88.91,2.62,1.68,1.02-.28,2.29-.31,3.23.25.16-.11.08-.1.05-.2-.15-.56-.75-.73-.66-1.5.11-.89,1.15-1.43,1.9-.89.94.67,1.41,2.27,1.2,3.37-.04.21-.32.87-.26.98l1.51,1.53c.74-.91,1.79-1.44,2.97-1.29.86.11,2.28.82,2.18,1.84-.06.64-.67,1.21-1.32,1.15-.86-.08-1.19-1.25-2.1.03l.89.89c.13.13.46.67.58.86.2.33.35.69.51,1.03.83-.23,1.78-.14,2.54.29.45.25,1.04.67,1.23,1.15.35.85-.31,1.78-1.23,1.67-.74-.09-1.19-1.1-2-.69.18,3.88-2.77,7.27-6.64,7.66-.19.02-1.07-.03-1.13.02-.04.03-.12.32-.13.39-.07.77.93,1.14.8,2.02-.1.71-.8,1.2-1.5,1-1.36-.38-2.02-2.68-1.63-3.95l-1.77-1.09-.89-.89c-.3.32-.93.73-.67,1.24.08.16.25.26.33.4.74,1.38-.95,2.64-2.1,1.32-.75-.85-1.02-2.96-.17-3.8l.89-.89ZM28.06,24.67c-2.41-2.38-5.84,1.03-3.46,3.46l3.46-3.46ZM27.14,29.05l-1.47,1.47c-.38.38-.27,1.92.19,2.3,1.72,1.53,3.3,3.6,5.06,5.05,1.51,1.24,3.83,1.48,5.5.45l-9.27-9.27ZM38.2,36.65c1.08-1.83.91-4.17-.49-5.79-1.47-1.71-3.43-3.25-4.96-4.94-.47-.34-1.04-.5-1.61-.4-.1.02-.67.19-.69.21l-1.58,1.58,9.33,9.33Z"/>
      </g>
    </g>
  </g>
</svg>`,
    themeSelector: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        fill: #ca9597;
      }

      .cls-2 {
        fill: #cd999b;
      }

      .cls-3 {
        fill: #dfadae;
      }

      .cls-4 {
        fill: url(#linear-gradient-2);
      }

      .cls-5 {
        fill: #e2b1b2;
      }

      .cls-6 {
        fill: #c58e91;
      }

      .cls-7 {
        fill: #dba9aa;
      }

      .cls-8 {
        fill: #dcaaab;
      }

      .cls-9 {
        fill: #c38c8f;
      }

      .cls-10 {
        fill: #c28b8e;
      }

      .cls-11 {
        fill: #bc8487;
      }

      .cls-12 {
        fill: none;
      }

      .cls-13 {
        fill: #d7a5a6;
      }

      .cls-14 {
        fill: #cb9698;
      }

      .cls-15 {
        clip-path: url(#clippath-1);
      }

      .cls-16 {
        fill: #d9a7a8;
      }

      .cls-17 {
        fill: #cf9b9d;
      }

      .cls-18 {
        fill: #d19d9f;
      }

      .cls-19 {
        fill: #c89395;
      }

      .cls-20 {
        fill: #c79294;
      }

      .cls-21 {
        fill: #d29ea0;
      }

      .cls-22 {
        fill: #d4a0a2;
      }

      .cls-23 {
        fill: #bd8588;
      }

      .cls-24 {
        fill: #daa8a9;
      }

      .cls-25 {
        fill: #ce9a9c;
      }

      .cls-26 {
        fill: #fff;
        opacity: .1;
      }

      .cls-27 {
        fill: #deacad;
      }

      .cls-28 {
        fill: #ddabac;
      }

      .cls-29 {
        fill: #d39fa1;
      }

      .cls-30 {
        fill: #e0aeaf;
      }

      .cls-31 {
        fill: #e1b0b1;
      }

      .cls-32 {
        fill: #d7a3a5;
      }

      .cls-33 {
        fill: #d8a6a7;
      }

      .cls-34 {
        fill: #d6a2a4;
      }

      .cls-35 {
        fill: #c18a8d;
      }

      .cls-36 {
        fill: #be8689;
      }

      .cls-37 {
        fill: #d09c9e;
      }

      .cls-38 {
        fill: #c48d90;
      }

      .cls-39 {
        fill: #bf878a;
      }

      .cls-40 {
        fill: #d5a1a3;
      }

      .cls-41 {
        fill: #c0898c;
      }

      .cls-42 {
        fill: #c68f92;
      }

      .cls-43 {
        fill: #cd989a;
      }

      .cls-44 {
        fill: url(#linear-gradient);
      }

      .cls-45 {
        fill: #bf888b;
      }

      .cls-46 {
        fill: #c99496;
      }

      .cls-47 {
        fill: #e3b2b3;
      }

      .cls-48 {
        clip-path: url(#clippath);
      }

      .cls-49 {
        fill: #cc9799;
      }

      .cls-50 {
        fill: #c69193;
      }
    </style>
    <clipPath id="clippath">
      <path class="cls-12" d="M48.64,12.35c-1.02-1.02-2.42-1.56-3.86-1.5-1.43.07-2.78.74-3.7,1.84l-7.9,9.48-2.35-2.35c-1.85-1.85-4.85-1.85-6.7,0l-.55.55-.02.02s-.02.02-.02.02l-5.15,5.15-2.87,2.87-3.45,3.45c-.26.26-.26.69,0,.95l12.07,12.07c.89.89,1.39,2.08,1.39,3.35,0,1.71,1.39,3.11,3.11,3.11s3.11-1.39,3.11-3.11c0-1.26.49-2.45,1.39-3.35l7.47-7.47.57-.57c.92-.92,1.38-2.14,1.38-3.35s-.46-2.43-1.38-3.35l-2.35-2.35,9.48-7.9c1.1-.92,1.77-2.27,1.84-3.7,0-.08,0-.15,0-.23,0-1.35-.54-2.66-1.5-3.62ZM34.48,41.66s0,0,0,0l-2.3,2.3s-.02.02-.02.02c-1.13,1.14-1.76,2.66-1.76,4.27,0,.97-.79,1.77-1.77,1.77s-1.77-.79-1.77-1.77c0-1.62-.63-3.15-1.78-4.3l-11.6-11.6,2.97-2.97s0,0,0,0l2.87-2.87c.33-.33.78-.52,1.25-.52s.92.18,1.25.52.52.78.52,1.25-.18.92-.52,1.25l-1.32,1.32c-1.12,1.12-1.12,2.94,0,4.06l.05.05c1.12,1.12,2.94,1.12,4.06,0l.45-.45c.53-.53,1.39-.53,1.93,0,.26.26.4.6.4.96s-.14.71-.4.96l-.45.45c-.54.54-.84,1.26-.84,2.03s.3,1.49.84,2.03l.05.05c1.12,1.12,2.94,1.12,4.06,0l1.32-1.32c.69-.69,1.81-.69,2.5,0,.33.33.52.78.52,1.25s-.18.91-.51,1.25ZM36.28,39.86c-.11-.62-.41-1.19-.86-1.64-1.21-1.21-3.18-1.21-4.4,0l-1.32,1.32c-.6.6-1.57.6-2.17,0l-.05-.05c-.29-.29-.45-.67-.45-1.08s.16-.79.45-1.08l.45-.45c.51-.51.79-1.19.79-1.91s-.28-1.4-.79-1.91c-1.05-1.05-2.77-1.05-3.82,0l-.45.45c-.6.6-1.57.6-2.17,0l-.05-.05c-.6-.6-.6-1.57,0-2.17l1.32-1.32c.59-.59.91-1.37.91-2.2s-.32-1.61-.91-2.2c-.45-.45-1.02-.75-1.64-.86l2.89-2.89,15.15,15.15-2.89,2.89ZM40.22,31.12c1.32,1.32,1.32,3.48,0,4.8l-.1.1-15.15-15.15.1-.1c1.32-1.32,3.48-1.32,4.8,0l2.87,2.87s0,0,0,0l4.6,4.6,2.87,2.87ZM48.8,16.15c-.05,1.07-.53,2.05-1.36,2.73l-9.58,7.98-3.73-3.73h0s7.98-9.58,7.98-9.58c.69-.83,1.66-1.31,2.73-1.36.06,0,.12,0,.18,0,1.01,0,1.95.39,2.67,1.11.76.76,1.15,1.77,1.1,2.85Z"/>
    </clipPath>
    <linearGradient id="linear-gradient" x1="11.61" y1="31.11" x2="50.39" y2="31.11" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#bc8487"/>
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <clipPath id="clippath-1">
      <path class="cls-12" d="M45.7,16.86c-.48.48-1.25.48-1.72,0-.48-.48-.48-1.25,0-1.72s1.25-.48,1.72,0c.48.48.48,1.25,0,1.72h0Z"/>
    </clipPath>
    <linearGradient id="linear-gradient-2" x1="43.37" y1="16" x2="46.31" y2="16" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-26" width="62" height="62" rx="10.17" ry="10.17"/>
      <g>
        <g id="path2004">
          <g>
            <g class="cls-48">
              <rect class="cls-16" x="34.13" y="12.19" width=".46" height="14.67"/>
              <rect class="cls-24" x="34.59" y="12.19" width=".81" height="14.67"/>
              <rect class="cls-7" x="35.4" y="12.19" width=".81" height="14.67"/>
              <rect class="cls-8" x="36.22" y="12.19" width=".81" height="14.67"/>
              <rect class="cls-28" x="37.03" y="12.19" width=".81" height="14.67"/>
              <rect class="cls-27" x="37.84" y="12.19" width=".81" height="14.67"/>
              <rect class="cls-27" x="38.66" y="12.19" width="1.72" height="14.67"/>
              <rect class="cls-3" x="40.38" y="12.19" width="1.72" height="14.67"/>
              <rect class="cls-30" x="42.1" y="12.19" width="1.72" height="14.67"/>
              <rect class="cls-31" x="43.82" y="12.19" width="1.72" height="14.67"/>
              <rect class="cls-5" x="45.55" y="12.19" width="1.72" height="14.67"/>
              <rect class="cls-47" x="47.27" y="12.19" width="1.58" height="14.67"/>
              <rect class="cls-17" x="24.97" y="19.45" width=".09" height="16.57"/>
              <rect class="cls-37" x="25.07" y="19.45" width=".57" height="16.57"/>
              <rect class="cls-37" x="25.64" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-18" x="26.45" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-21" x="27.27" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-29" x="28.08" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-22" x="28.89" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-40" x="29.71" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-34" x="30.52" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-32" x="31.33" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-13" x="32.15" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-33" x="32.96" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-16" x="33.78" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-24" x="34.59" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-7" x="35.4" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-8" x="36.22" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-28" x="37.03" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-27" x="37.84" y="19.45" width=".81" height="16.57"/>
              <rect class="cls-27" x="38.66" y="19.45" width="1.72" height="16.57"/>
              <rect class="cls-3" x="40.38" y="19.45" width="1.16" height="16.57"/>
              <rect class="cls-46" x="20.86" y="21.82" width=".19" height="18.31"/>
              <rect class="cls-1" x="21.05" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-14" x="21.62" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-49" x="22.19" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-43" x="22.77" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-2" x="23.34" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-25" x="23.92" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-17" x="24.49" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-37" x="25.07" y="21.82" width=".57" height="18.31"/>
              <rect class="cls-37" x="25.64" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-18" x="26.45" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-21" x="27.27" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-29" x="28.08" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-22" x="28.89" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-40" x="29.71" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-34" x="30.52" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-32" x="31.33" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-13" x="32.15" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-33" x="32.96" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-16" x="33.78" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-24" x="34.59" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-7" x="35.4" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-8" x="36.22" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-28" x="37.03" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-27" x="37.84" y="21.82" width=".81" height="18.31"/>
              <rect class="cls-27" x="38.66" y="21.82" width=".51" height="18.31"/>
              <rect class="cls-36" x="13.48" y="26" width=".1" height="24.03"/>
              <rect class="cls-39" x="13.58" y="26" width=".57" height="24.03"/>
              <rect class="cls-45" x="14.16" y="26" width=".57" height="24.03"/>
              <rect class="cls-41" x="14.73" y="26" width=".57" height="24.03"/>
              <rect class="cls-35" x="15.3" y="26" width=".57" height="24.03"/>
              <rect class="cls-10" x="15.88" y="26" width=".57" height="24.03"/>
              <rect class="cls-9" x="16.45" y="26" width=".57" height="24.03"/>
              <rect class="cls-38" x="17.03" y="26" width=".57" height="24.03"/>
              <rect class="cls-6" x="17.6" y="26" width=".57" height="24.03"/>
              <rect class="cls-42" x="18.18" y="26" width=".57" height="24.03"/>
              <rect class="cls-50" x="18.75" y="26" width=".57" height="24.03"/>
              <rect class="cls-20" x="19.32" y="26" width=".57" height="24.03"/>
              <rect class="cls-19" x="19.9" y="26" width=".57" height="24.03"/>
              <rect class="cls-46" x="20.47" y="26" width=".57" height="24.03"/>
              <rect class="cls-1" x="21.05" y="26" width=".57" height="24.03"/>
              <rect class="cls-14" x="21.62" y="26" width=".57" height="24.03"/>
              <rect class="cls-49" x="22.19" y="26" width=".57" height="24.03"/>
              <rect class="cls-43" x="22.77" y="26" width=".57" height="24.03"/>
              <rect class="cls-2" x="23.34" y="26" width=".57" height="24.03"/>
              <rect class="cls-25" x="23.92" y="26" width=".57" height="24.03"/>
              <rect class="cls-17" x="24.49" y="26" width=".57" height="24.03"/>
              <rect class="cls-37" x="25.07" y="26" width=".57" height="24.03"/>
              <rect class="cls-37" x="25.64" y="26" width=".81" height="24.03"/>
              <rect class="cls-18" x="26.45" y="26" width=".81" height="24.03"/>
              <rect class="cls-21" x="27.27" y="26" width=".81" height="24.03"/>
              <rect class="cls-29" x="28.08" y="26" width=".81" height="24.03"/>
              <rect class="cls-22" x="28.89" y="26" width=".81" height="24.03"/>
              <rect class="cls-40" x="29.71" y="26" width=".81" height="24.03"/>
              <rect class="cls-34" x="30.52" y="26" width=".81" height="24.03"/>
              <rect class="cls-32" x="31.33" y="26" width=".81" height="24.03"/>
              <rect class="cls-13" x="32.15" y="26" width=".81" height="24.03"/>
              <rect class="cls-33" x="32.96" y="26" width=".81" height="24.03"/>
              <rect class="cls-16" x="33.78" y="26" width=".81" height="24.03"/>
              <rect class="cls-24" x="34.59" y="26" width=".4" height="24.03"/>
              <rect class="cls-11" x="11.79" y="10.79" width=".07" height="40.58"/>
              <rect class="cls-11" x="11.86" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-23" x="12.43" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-36" x="13.01" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-39" x="13.58" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-45" x="14.16" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-41" x="14.73" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-35" x="15.3" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-10" x="15.88" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-9" x="16.45" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-38" x="17.03" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-6" x="17.6" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-42" x="18.18" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-50" x="18.75" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-20" x="19.32" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-19" x="19.9" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-46" x="20.47" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-1" x="21.05" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-14" x="21.62" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-49" x="22.19" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-43" x="22.77" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-2" x="23.34" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-25" x="23.92" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-17" x="24.49" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-37" x="25.07" y="10.79" width=".57" height="40.58"/>
              <rect class="cls-37" x="25.64" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-18" x="26.45" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-21" x="27.27" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-29" x="28.08" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-22" x="28.89" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-40" x="29.71" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-34" x="30.52" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-32" x="31.33" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-13" x="32.15" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-33" x="32.96" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-16" x="33.78" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-24" x="34.59" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-7" x="35.4" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-8" x="36.22" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-28" x="37.03" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-27" x="37.84" y="10.79" width=".81" height="40.58"/>
              <rect class="cls-27" x="38.66" y="10.79" width="1.72" height="40.58"/>
              <rect class="cls-3" x="40.38" y="10.79" width="1.72" height="40.58"/>
              <rect class="cls-30" x="42.1" y="10.79" width="1.72" height="40.58"/>
              <rect class="cls-31" x="43.82" y="10.79" width="1.72" height="40.58"/>
              <rect class="cls-5" x="45.55" y="10.79" width="1.72" height="40.58"/>
              <rect class="cls-47" x="47.27" y="10.79" width="1.72" height="40.58"/>
              <rect class="cls-47" x="48.99" y="10.79" width="1.15" height="40.58"/>
            </g>
            <path class="cls-44" d="M48.82,12.18c-1.07-1.07-2.55-1.65-4.05-1.57-1.5.07-2.92.77-3.88,1.93l-7.73,9.27-2.16-2.16c-.94-.94-2.19-1.46-3.52-1.46s-2.59.52-3.53,1.46l-.55.55.18.18-.23-.13-11.47,11.47c-.36.36-.36.94,0,1.3l12.07,12.07c.85.85,1.32,1.98,1.32,3.17,0,1.86,1.5,3.36,3.36,3.36s3.36-1.5,3.36-3.36c0-1.2.46-2.32,1.31-3.17l8.05-8.05c.94-.94,1.46-2.19,1.46-3.52s-.52-2.58-1.46-3.53l-2.16-2.16,9.27-7.72c1.16-.97,1.86-2.39,1.93-3.89v-.24c0-1.42-.57-2.8-1.57-3.8ZM34.3,41.49l-2.33,2.32c-1.18,1.2-1.83,2.78-1.83,4.45,0,.84-.68,1.52-1.51,1.52s-1.52-.68-1.52-1.52c0-1.69-.66-3.27-1.86-4.47l-11.42-11.42,5.68-5.67c.57-.58,1.57-.58,2.14,0,.29.28.45.66.45,1.07s-.16.79-.45,1.07l-1.31,1.32c-.59.59-.92,1.37-.92,2.21s.33,1.62.92,2.21l.04.05c.59.58,1.38.91,2.21.91s1.62-.33,2.21-.92l.45-.45c.44-.43,1.14-.43,1.58,0,.21.21.32.49.32.79s-.11.57-.32.78l-.46.46c-.59.59-.91,1.37-.91,2.21s.32,1.61.91,2.2l.05.05c.59.59,1.37.91,2.21.91s1.61-.32,2.2-.91l1.32-1.32c.59-.59,1.56-.59,2.15,0,.28.29.44.67.44,1.08s-.15.78-.44,1.07ZM36.42,39.37c-.16-.5-.44-.95-.82-1.33-.63-.63-1.48-.98-2.38-.98s-1.74.35-2.37.98l-1.32,1.32c-.48.48-1.33.48-1.81,0l-.05-.05c-.24-.24-.37-.56-.37-.9s.13-.67.37-.91l.46-.46c.56-.55.86-1.29.86-2.08s-.3-1.53-.86-2.09-1.33-.87-2.09-.87-1.51.29-2.09.87l-.45.45c-.5.5-1.32.5-1.81.01l-.05-.05c-.5-.5-.5-1.32,0-1.82l1.31-1.31c.64-.64.99-1.48.99-2.38s-.35-1.74-.99-2.37c-.37-.38-.83-.66-1.32-.82l2.4-2.4,14.79,14.79-2.4,2.4ZM40.05,31.3c.59.59.91,1.38.91,2.22s-.29,1.56-.84,2.14l-14.79-14.78c.58-.55,1.34-.85,2.15-.85s1.63.33,2.22.92l10.35,10.35ZM48.55,16.14c-.05,1-.5,1.91-1.27,2.55l-9.4,7.84-3.41-3.41,7.84-9.41c.64-.77,1.55-1.22,2.55-1.26,1-.05,1.95.32,2.66,1.03.67.67,1.03,1.54,1.03,2.48v.18Z"/>
          </g>
        </g>
        <g id="path2020">
          <g>
            <g class="cls-15">
              <rect class="cls-47" x="43.5" y="14.66" width="2.68" height="2.68"/>
            </g>
            <path class="cls-4" d="M46.31,16c0,.39-.15.76-.43,1.04-.28.27-.65.43-1.04.43s-.76-.16-1.04-.43c-.28-.28-.43-.65-.43-1.04s.15-.76.43-1.04c.56-.56,1.52-.56,2.08,0,.28.28.43.65.43,1.04Z"/>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`,
    projectIcon: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        fill: url(#linear-gradient-2);
      }

      .cls-2 {
        fill: #fff;
        opacity: .1;
      }

      .cls-3 {
        fill: url(#linear-gradient);
      }
    </style>
    <linearGradient id="linear-gradient" x1="11.92" y1="25.84" x2="50.08" y2="25.84" gradientUnits="userSpaceOnUse">
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="19.35" y1="39.68" x2="42.64" y2="39.68" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <rect class="cls-2" width="62" height="62" rx="10.17" ry="10.17"/>
    <g>
      <path class="cls-3" d="M47.03,16.64v-1.72c0-1.81-1.48-3.29-3.3-3.29h-15.5c-.86-.51-1.84-.78-2.84-.78h-9.9c-1.97,0-3.57,1.6-3.57,3.57v22.85c0,1.97,1.6,3.57,3.57,3.57h2.95c.53,0,.96-.44.96-.96s-.44-.97-.96-.97h-2.95c-.9,0-1.64-.73-1.64-1.64V14.41c0-.9.74-1.63,1.64-1.63h9.9c1.01,0,1.98.41,2.67,1.13l2.83,2.91c1.06,1.09,2.54,1.72,4.06,1.72h11.55c.91,0,1.64.73,1.64,1.63v17.1c0,.9-.73,1.63-1.64,1.63h-2.89c-.53,0-.97.44-.97.97s.44.96.97.96h2.89c1.97,0,3.57-1.6,3.57-3.57v-17.1c0-1.79-1.33-3.28-3.05-3.52ZM32.28,15.47l-1.86-1.91h13.31c.75,0,1.36.61,1.36,1.36v1.68h-10.14c-1.01,0-1.98-.41-2.67-1.13Z"/>
      <path class="cls-1" d="M33.48,51.33c-.32,0-.63-.06-.92-.18-.6-.25-1.06-.71-1.31-1.31-.02-.05-.07-.17-.25-.17s-.23.12-.25.17c-.51,1.23-1.93,1.82-3.16,1.31l-2.28-.94c-.6-.25-1.06-.71-1.31-1.31-.25-.6-.25-1.25,0-1.85.02-.05.07-.17-.06-.3s-.25-.08-.3-.06c-1.23.51-2.65-.08-3.16-1.31l-.94-2.28c-.51-1.23.08-2.65,1.31-3.16.06-.02.17-.07.17-.25s-.12-.23-.17-.25c-.59-.24-1.06-.71-1.31-1.31-.25-.6-.25-1.25,0-1.85l.94-2.28c.51-1.23,1.93-1.82,3.16-1.31.05.02.17.07.3-.06.13-.13.08-.25.06-.3-.25-.6-.25-1.25,0-1.85.25-.59.71-1.06,1.31-1.31l2.28-.94c.6-.25,1.25-.25,1.85,0,.6.25,1.06.71,1.31,1.31.02.05.07.17.25.17s.23-.11.25-.17c.25-.6.71-1.06,1.31-1.31.6-.25,1.25-.25,1.85,0l2.28.94c.6.25,1.06.71,1.31,1.31.25.6.25,1.25,0,1.85-.02.05-.07.17.06.3s.25.08.3.06c.59-.25,1.25-.25,1.85,0,.6.25,1.06.71,1.31,1.31l.94,2.28c.25.6.25,1.25,0,1.85-.25.6-.71,1.06-1.31,1.31-.05.02-.17.07-.17.25s.12.23.17.25c.6.25,1.06.71,1.31,1.31s.25,1.25,0,1.85l-.94,2.28c-.25.6-.71,1.06-1.31,1.31-.6.25-1.25.25-1.85,0-.05-.02-.17-.07-.3.06-.13.13-.08.25-.06.3.25.59.25,1.25,0,1.85s-.71,1.06-1.31,1.31l-2.28.94c-.3.12-.61.18-.92.18ZM31,47.73c.71,0,1.62.36,2.04,1.36.05.12.14.21.26.26.12.05.25.05.37,0l2.28-.94c.25-.1.37-.39.26-.63-.42-1.01-.03-1.9.48-2.4.51-.5,1.4-.89,2.4-.48.12.05.25.05.37,0,.12-.05.21-.14.26-.26l.94-2.28c.05-.12.05-.25,0-.37-.05-.12-.14-.21-.26-.27-1-.42-1.36-1.33-1.36-2.04s.36-1.62,1.36-2.04c.12-.05.21-.14.26-.26.05-.12.05-.25,0-.37l-.94-2.28c-.05-.12-.14-.21-.26-.26-.12-.05-.25-.05-.37,0-1.01.42-1.9.03-2.4-.48-.5-.5-.89-1.4-.48-2.4.05-.12.05-.25,0-.37-.05-.12-.14-.21-.26-.26l-2.28-.94c-.12-.05-.25-.05-.37,0-.12.05-.21.14-.26.26-.41,1-1.32,1.36-2.04,1.36s-1.62-.36-2.04-1.36c-.1-.25-.39-.37-.63-.26l-2.28.94c-.12.05-.21.14-.26.26-.05.12-.05.25,0,.37.41,1.01.02,1.9-.48,2.4s-1.4.9-2.4.48c-.24-.1-.53.02-.63.26l-.94,2.28c-.05.12-.05.25,0,.37.05.12.14.21.26.26,1,.42,1.36,1.32,1.36,2.04s-.35,1.6-1.32,2.02c-.01,0-.03.01-.04.02-.25.1-.36.39-.26.63l.94,2.28c.1.25.39.36.63.26,1-.42,1.9-.03,2.4.48.5.5.89,1.4.48,2.41-.1.25.02.53.26.63l2.28.94c.25.1.53-.02.63-.26.42-1,1.33-1.36,2.04-1.36ZM31,44.65c-2.74,0-4.97-2.23-4.97-4.97s2.23-4.97,4.97-4.97,4.97,2.23,4.97,4.97-2.23,4.97-4.97,4.97ZM31,36.64c-1.68,0-3.04,1.36-3.04,3.04s1.36,3.04,3.04,3.04,3.04-1.36,3.04-3.04-1.36-3.04-3.04-3.04Z"/>
    </g>
  </g>
</svg>`,
    assistaLogo: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 489.79 531.27">
  <defs>
    <style>
      .cls-1 {
        fill: url(#linear-gradient-2);
      }

      .cls-2 {
        fill: url(#linear-gradient-4);
      }

      .cls-3 {
        fill: url(#linear-gradient-3);
      }

      .cls-4 {
        fill: url(#linear-gradient);
      }
    </style>
    <linearGradient id="linear-gradient" x1="-10307.38" y1="411.21" x2="-9889.02" y2="411.21" gradientTransform="translate(-9817.59) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#bc8487"/>
      <stop offset=".79" stop-color="#e3b2b3"/>
      <stop offset=".85" stop-color="#efd4d4"/>
      <stop offset=".92" stop-color="#faf3f3"/>
      <stop offset=".96" stop-color="#fff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="-9012.51" y1="355.09" x2="-9169.79" y2="106.51" gradientTransform="translate(-8808.22) rotate(-180) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#bc8487"/>
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <linearGradient id="linear-gradient-3" x1="-778.53" y1="212.14" x2="-360.18" y2="212.14" gradientTransform="translate(778.53)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#bc8487"/>
      <stop offset=".79" stop-color="#e3b2b3"/>
      <stop offset=".97" stop-color="#fff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-4" x1="516.34" y1="156.02" x2="359.06" y2="-92.56" gradientTransform="translate(-230.84)" xlink:href="#linear-gradient-2"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <path class="cls-4" d="M247.71,339.88l-5.93-2.42-103.14-43.12s-2.04-.82-2.17-3.2v92.09c0,1.19.72,2.26,1.82,2.73l351.5,145.32v-92.56l-242.08-98.84Z"/>
      <path class="cls-1" d="M136.47,291.06v.06c.03,1.29.75,2.57,2.17,3.2l103.14,43.12,111.58-45.7v-92.68s-214.71,88.76-214.71,88.76c-.03,0-.06.03-.09.03-.06.03-.09.06-.13.06-.13.06-.41.22-.72.47l-.38.38c-.13.13-.25.31-.38.5-.06.09-.13.22-.16.35-.09.19-.19.41-.22.63-.06.25-.1.5-.1.82Z"/>
      <path class="cls-3" d="M0,239.65v92.56s351.5-145.32,351.5-145.32c1.1-.47,1.82-1.54,1.82-2.73v-92.09c-.13,2.39-2.17,3.2-2.17,3.2l-103.14,43.12-5.93,2.42L0,239.65Z"/>
      <path class="cls-2" d="M353.32,91.99v.06c-.03,1.29-.75,2.57-2.17,3.2l-103.14,43.12-111.58-45.7V0l214.71,88.76s.06.03.09.03c.06.03.09.06.13.06.13.06.41.22.72.47l.38.38c.13.13.25.31.38.5.06.09.13.22.16.35.09.19.19.41.22.63.06.25.1.5.1.82Z"/>
    </g>
  </g>
</svg>`,
    DownloadOdooIcon: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 62 62">
  <defs>
    <style>
      .cls-1 {
        fill: url(#linear-gradient-2);
      }

      .cls-2 {
        fill: url(#linear-gradient-3);
      }

      .cls-3 {
        fill: #fff;
        opacity: .1;
      }

      .cls-4 {
        fill: url(#linear-gradient);
      }
    </style>
    <linearGradient id="linear-gradient" x1="11.8" y1="31" x2="50.2" y2="31" gradientUnits="userSpaceOnUse">
      <stop offset=".36" stop-color="#d09c9e"/>
      <stop offset=".7" stop-color="#deacad"/>
      <stop offset=".97" stop-color="#e3b2b3"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="18.98" y1="29.26" x2="39.48" y2="29.26" xlink:href="#linear-gradient"/>
    <linearGradient id="linear-gradient-3" x1="38.62" y1="43.5" x2="48.35" y2="43.5" xlink:href="#linear-gradient"/>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <rect class="cls-3" x="0" width="62" height="62" rx="10.17" ry="10.17"/>
      <g>
        <path class="cls-4" d="M23.73,11.91c5.49.34,11.89-.69,17.25.34,10.78,2.06,9.09,12.25,9.18,20.74-.17,1.53-2.44,1.55-2.67-.09-.43-6.62,2.09-16.04-6.61-17.96-5.09-1.12-11.58.07-16.84-.38-13.3,0-8.59,15.01-9.49,23.53.22,2.75.79,5.75,3.1,7.51,4.04,3.07,11.96,1.47,16.84,1.88,1.65.14,1.98,2.02.48,2.66-3.66-.1-7.46.2-11.1.02-15.62-.8-11.36-15.28-12-26.2.36-7.67,4.18-11.6,11.85-12.05Z"/>
        <path class="cls-1" d="M28.26,25.09h2.93l.54-4.76c.57-1.33,2.44-1.06,2.61.4l-.48,4.37h4.55c.06,0,.42.19.5.25,1.02.74.56,2.29-.67,2.42-1.48.16-3.22-.12-4.72,0l-.25,2.93h4.05c.15,0,.67.25.8.37.85.78.36,2.2-.79,2.31-1.4.12-2.97-.1-4.39,0l-.54,4.68c-.55,1.54-2.64,1.17-2.64-.46l.49-4.04-.11-.19h-2.76c-.08.05-.11.11-.13.21-.19,1.1-.19,2.37-.34,3.5-.13.91-.25,1.97-1.45,1.97-1.06,0-1.34-.91-1.29-1.8.06-1.29.41-2.59.42-3.89h-4.64c-.37,0-.85-.65-.92-1-.22-1,.5-1.59,1.43-1.68,1.42-.13,3.03.09,4.47,0l.34-2.92h-4.3c-.1,0-.58-.31-.67-.41-.79-.87-.23-2.13.92-2.26,1.27-.14,2.84.16,4.1,0,.09-.01.19,0,.25-.08l.47-4.46c.23-.9,1.11-1.33,1.98-.93.63.29.7.96.68,1.58-.05,1.26-.42,2.61-.42,3.89ZM30.85,27.76h-2.93l-.33,2.93h2.93l.33-2.93Z"/>
        <path class="cls-2" d="M44.81,45.57c.15.04.17-.06.25-.12.79-.61,1.22-1.81,2.45-1.36,1.06.39,1.04,1.5.4,2.28-.7.84-2.58,2.76-3.43,3.43-.59.47-1.22.56-1.84.08-.69-.53-3.21-3.03-3.72-3.72-.48-.65-.36-1.5.32-1.94,1.32-.85,2,.69,2.9,1.35v-7.56c0-.7.97-1.32,1.66-1.16.32.08,1.02.57,1.02.9v7.81Z"/>
      </g>
    </g>
  </g>
</svg>`,
    assistaLight: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 305.26 265.59">
  <defs>
    <style>
      .cls-1 {
        fill: #35679f;
      }

      .cls-2 {
        font-family: CascadiaCodeRoman-SemiLight, 'Cascadia Code';
        font-variation-settings: 'wght' 350;
        font-weight: 300;
      }

      .cls-3 {
        fill: #fff;
      }

      .cls-4 {
        fill: #a5a5a5;
      }

      .cls-4, .cls-5, .cls-6 {
        font-size: 10.6px;
      }

      .cls-7 {
        fill: #ff0c3e;
      }

      .cls-8 {
        fill: #3a5e43;
      }

      .cls-9 {
        fill: #05c65c;
      }

      .cls-10 {
        fill: #672818;
      }

      .cls-11 {
        fill: #c25b60;
      }

      .cls-12 {
        fill: #f0f1f3;
      }

      .cls-13 {
        fill: #b8b92f;
      }

      .cls-14 {
        fill: #9e8155;
      }

      .cls-5 {
        fill: #694065;
      }

      .cls-15 {
        fill: #c5c4c9;
      }

      .cls-6 {
        fill: #4d7d59;
        letter-spacing: 0em;
      }

      .cls-16 {
        letter-spacing: 0em;
      }

      .cls-16, .cls-17, .cls-18 {
        fill: #212121;
        font-size: 10.59px;
      }

      .cls-19 {
        fill: #ffab15;
      }

      .cls-17 {
        letter-spacing: 0em;
      }

      .cls-20 {
        fill: #9a9089;
      }

      .cls-21 {
        fill: #f1d5a4;
      }
    </style>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <g>
        <rect class="cls-3" x="0" y="0" width="305.26" height="265.59" rx="16.01" ry="16.01"/>
        <text class="cls-2" transform="translate(72.64 202.98)"><tspan class="cls-18" x="0" y="0">&lt;</tspan><tspan class="cls-6" x="6.21" y="0">meta charset</tspan><tspan class="cls-16" x="80.75" y="0">=</tspan><tspan class="cls-5" x="86.96" y="0">&quot;UTF-8&quot;</tspan><tspan class="cls-17" x="130.45" y="0">&gt;</tspan><tspan class="cls-4"><tspan x="0" y="12.72">//code comment</tspan></tspan></text>
        <path class="cls-12" d="M19.29,225.73H0V43.75h19.29c14.98,0,27.12,12.14,27.12,27.12v127.75c0,14.98-12.14,27.12-27.12,27.12Z"/>
        <rect class="cls-14" x="70.06" y="99.69" width="133.01" height="5.5" rx="2.01" ry="2.01"/>
        <path class="cls-10" d="M216.3,156.43H72.3c-1.24,0-2.25-.9-2.25-2.01v-1.48c0-1.11,1.01-2.01,2.25-2.01h143.99c1.24,0,2.25.9,2.25,2.01v1.48c0,1.11-1.01,2.01-2.25,2.01Z"/>
        <g>
          <rect class="cls-1" x="70.06" y="74.06" width="93.9" height="5.5" rx="2.01" ry="2.01"/>
          <rect class="cls-1" x="169.88" y="74.06" width="62.58" height="5.5" rx="2.01" ry="2.01"/>
        </g>
        <g>
          <rect class="cls-8" x="70.06" y="125.31" width="111.39" height="5.5" rx="2.01" ry="2.01"/>
          <rect class="cls-8" x="188.48" y="125.31" width="74.24" height="5.5" rx="2.01" ry="2.01"/>
        </g>
        <path class="cls-7" d="M17.13,14.37c0,1.88-1.9,3.49-3.53,3.49-1.89,0-3.52-1.61-3.52-3.49s1.63-3.49,3.52-3.49,3.53,1.61,3.53,3.49Z"/>
        <path class="cls-19" d="M27.16,14.37c0,1.88-1.62,3.49-3.52,3.49s-3.52-1.61-3.52-3.49,1.62-3.49,3.52-3.49,3.52,1.61,3.52,3.49Z"/>
        <path class="cls-9" d="M37.46,14.37c0,1.88-1.9,3.49-3.52,3.49-1.9,0-3.53-1.61-3.53-3.49s1.63-3.49,3.53-3.49,3.52,1.61,3.52,3.49Z"/>
        <rect class="cls-15" x="0" y="24.42" width="305.26" height=".58"/>
      </g>
      <rect class="cls-21" x="8.01" y="74.06" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-11" x="8.01" y="99.59" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-13" x="8.01" y="125.31" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-20" x="8.01" y="150.93" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
    </g>
  </g>
</svg>`,
    assistaDark: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 305.26 265.59">
  <defs>
    <style>
      .cls-1 {
        fill: #947755;
      }

      .cls-2 {
        fill: #35679f;
      }

      .cls-3 {
        fill: #694065;
      }

      .cls-4 {
        fill: #898132;
      }

      .cls-5 {
        fill: #3c5f45;
      }

      .cls-6 {
        font-family: CascadiaCodeRoman-SemiLight, 'Cascadia Code';
        font-size: 10.6px;
        font-variation-settings: 'wght' 350;
        font-weight: 300;
      }

      .cls-7 {
        fill: #4d7d59;
      }

      .cls-8 {
        fill: #28292b;
      }

      .cls-9 {
        fill: #fff;
      }

      .cls-10 {
        fill: #2b2c30;
      }

      .cls-11 {
        fill: #ff0c3e;
      }

      .cls-12 {
        fill: #3a5e43;
      }

      .cls-13 {
        fill: #05c65c;
      }

      .cls-14 {
        fill: #672818;
      }

      .cls-15 {
        fill: #9e8155;
      }

      .cls-16 {
        fill: #a5a5a5;
      }

      .cls-17 {
        fill: #335a6f;
      }

      .cls-18 {
        fill: #3e4042;
      }

      .cls-19 {
        fill: #ffab15;
      }
    </style>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <g>
        <rect class="cls-10" x="0" y="0" width="305.26" height="265.59" rx="16.01" ry="16.01"/>
        <text class="cls-6" transform="translate(72.64 202.98)"><tspan class="cls-16" x="0" y="0">&lt;</tspan><tspan class="cls-7" x="6.21" y="0">meta charset</tspan><tspan class="cls-9" x="80.76" y="0">=</tspan><tspan class="cls-3" x="86.97" y="0">&quot;UTF-8&quot;</tspan><tspan class="cls-16" x="130.46" y="0">&gt;</tspan><tspan class="cls-16"><tspan x="0" y="12.72">//code comment</tspan></tspan></text>
        <path class="cls-8" d="M19.29,225.73H0V43.75h19.29c14.98,0,27.12,12.14,27.12,27.12v127.75c0,14.98-12.14,27.12-27.12,27.12Z"/>
        <rect class="cls-12" x="70.06" y="99.69" width="133.01" height="5.5" rx="2.01" ry="2.01"/>
        <path class="cls-14" d="M216.3,156.43H72.3c-1.24,0-2.25-.9-2.25-2.01v-1.48c0-1.11,1.01-2.01,2.25-2.01h143.99c1.24,0,2.25.9,2.25,2.01v1.48c0,1.11-1.01,2.01-2.25,2.01Z"/>
        <g>
          <rect class="cls-2" x="70.06" y="74.06" width="93.9" height="5.5" rx="2.01" ry="2.01"/>
          <rect class="cls-2" x="169.88" y="74.06" width="62.58" height="5.5" rx="2.01" ry="2.01"/>
        </g>
        <g>
          <rect class="cls-15" x="70.06" y="125.31" width="111.39" height="5.5" rx="2.01" ry="2.01"/>
          <rect class="cls-15" x="188.48" y="125.31" width="74.24" height="5.5" rx="2.01" ry="2.01"/>
        </g>
        <path class="cls-11" d="M17.13,14.37c0,1.88-1.9,3.49-3.53,3.49-1.89,0-3.52-1.61-3.52-3.49s1.63-3.49,3.52-3.49,3.53,1.61,3.53,3.49Z"/>
        <path class="cls-19" d="M27.16,14.37c0,1.88-1.62,3.49-3.52,3.49s-3.52-1.61-3.52-3.49,1.62-3.49,3.52-3.49,3.52,1.61,3.52,3.49Z"/>
        <path class="cls-13" d="M37.46,14.37c0,1.88-1.9,3.49-3.52,3.49-1.9,0-3.53-1.61-3.53-3.49s1.63-3.49,3.53-3.49,3.52,1.61,3.52,3.49Z"/>
        <rect class="cls-18" x="0" y="24.42" width="305.26" height=".58"/>
      </g>
      <rect class="cls-4" x="8.01" y="74.06" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-17" x="8.01" y="99.59" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-5" x="8.01" y="125.31" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-1" x="8.01" y="150.93" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
    </g>
  </g>
</svg>`,
    assistaMidnight: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 305.26 265.59">
  <defs>
    <style>
      .cls-1 {
        fill: #947755;
      }

      .cls-2 {
        fill: #35679f;
      }

      .cls-3 {
        fill: #898132;
      }

      .cls-4 {
        fill: #3c5f45;
      }

      .cls-5 {
        font-family: CascadiaCodeRoman-SemiLight, 'Cascadia Code';
        font-size: 10.6px;
        font-variation-settings: 'wght' 350;
        font-weight: 300;
      }

      .cls-6 {
        fill: #fff;
      }

      .cls-7 {
        fill: #694065;
      }

      .cls-7, .cls-8 {
        letter-spacing: 0em;
      }

      .cls-9 {
        fill: #ff0c3e;
      }

      .cls-10 {
        fill: #3a5e43;
      }

      .cls-11 {
        fill: #05c65c;
      }

      .cls-12 {
        fill: #672818;
      }

      .cls-13 {
        fill: #9e8155;
      }

      .cls-14 {
        fill: #26292d;
      }

      .cls-15 {
        fill: #a5a5a5;
      }

      .cls-16 {
        fill: #335a6f;
      }

      .cls-17 {
        fill: none;
        stroke: #3d3d3d;
        stroke-miterlimit: 10;
        stroke-width: .25px;
      }

      .cls-18 {
        fill: #181a1f;
      }

      .cls-19 {
        fill: #ffab15;
      }

      .cls-8 {
        fill: #4d7d59;
      }
    </style>
  </defs>
  <g id="Layer_1-2" data-name="Layer 1">
    <g>
      <g>
        <rect class="cls-18" x="0" y="0" width="305.26" height="265.59" rx="16.01" ry="16.01"/>
        <text class="cls-5" transform="translate(72.64 202.98)"><tspan class="cls-15" x="0" y="0">&lt;</tspan><tspan class="cls-8" x="6.21" y="0">meta charset</tspan><tspan class="cls-6" x="80.76" y="0">=</tspan><tspan class="cls-7" x="86.97" y="0">&quot;UTF-8&quot;</tspan><tspan class="cls-15" x="130.46" y="0">&gt;</tspan><tspan class="cls-15"><tspan x="0" y="12.72">//code comment</tspan></tspan></text>
        <path class="cls-14" d="M19.29,225.73H0V43.75h19.29c14.98,0,27.12,12.14,27.12,27.12v127.75c0,14.98-12.14,27.12-27.12,27.12Z"/>
        <rect class="cls-13" x="70.06" y="99.69" width="133.01" height="5.5" rx="2.01" ry="2.01"/>
        <path class="cls-2" d="M216.3,156.43H72.3c-1.24,0-2.25-.9-2.25-2.01v-1.48c0-1.11,1.01-2.01,2.25-2.01h143.99c1.24,0,2.25.9,2.25,2.01v1.48c0,1.11-1.01,2.01-2.25,2.01Z"/>
        <g>
          <rect class="cls-12" x="70.06" y="74.06" width="93.9" height="5.5" rx="2.01" ry="2.01"/>
          <rect class="cls-12" x="169.88" y="74.06" width="62.58" height="5.5" rx="2.01" ry="2.01"/>
        </g>
        <g>
          <rect class="cls-10" x="70.06" y="125.31" width="111.39" height="5.5" rx="2.01" ry="2.01"/>
          <rect class="cls-10" x="188.48" y="125.31" width="74.24" height="5.5" rx="2.01" ry="2.01"/>
        </g>
        <path class="cls-9" d="M17.13,14.37c0,1.88-1.9,3.49-3.53,3.49-1.89,0-3.52-1.61-3.52-3.49s1.63-3.49,3.52-3.49,3.53,1.61,3.53,3.49Z"/>
        <path class="cls-19" d="M27.16,14.37c0,1.88-1.62,3.49-3.52,3.49s-3.52-1.61-3.52-3.49,1.62-3.49,3.52-3.49,3.52,1.61,3.52,3.49Z"/>
        <path class="cls-11" d="M37.46,14.37c0,1.88-1.9,3.49-3.52,3.49-1.9,0-3.53-1.61-3.53-3.49s1.63-3.49,3.53-3.49,3.52,1.61,3.52,3.49Z"/>
        <line class="cls-17" x1="0" y1="24.71" x2="305.26" y2="24.71"/>
      </g>
      <rect class="cls-1" x="8.01" y="74.06" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-4" x="8.01" y="99.59" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-3" x="8.01" y="125.31" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
      <rect class="cls-16" x="8.01" y="150.93" width="27.52" height="5.5" rx="2.01" ry="2.01"/>
    </g>
  </g>
</svg>`,
  };

  /**
   * Get converted data URI for a specific theme image
   * @param imageKey - Key from themeImages object
   * @returns Data URI string
   */
  static getThemeImageDataUri(imageKey: keyof typeof AssistaSvgUtils.themeImages): string {
    const svg = this.themeImages[imageKey];
    return this.svgDataUri(svg);
  }

  /**
   * Get all theme images as data URIs
   * @returns Object with all theme images as data URIs
   */
  static getAllThemeImages() {
    return {
      cideAI: this.getThemeImageDataUri('cideAI'),
      darkPlus: this.getThemeImageDataUri('darkPlus'),
      venvSetup: this.getThemeImageDataUri('venvSetup'),
      finalStep: this.getThemeImageDataUri('finalStep'),
      odooConf: this.getThemeImageDataUri('odooConf'),
      setupDebugger: this.getThemeImageDataUri('setupDebugger'),
      themeSelector: this.getThemeImageDataUri('themeSelector'),
      projectIcon: this.getThemeImageDataUri('projectIcon'),
      assistaLogo: this.getThemeImageDataUri('assistaLogo'),
      downloadOdooIcon: this.getThemeImageDataUri('DownloadOdooIcon'),
      assistaLight: this.getThemeImageDataUri('assistaLight'),
      assistaDark: this.getThemeImageDataUri('assistaDark'),
      assistaMidnight: this.getThemeImageDataUri('assistaMidnight'),
    };
  }

  /**
   * Returns the Assista logo as an SVG DOM element.
   */
  static getAssistaLogoSvgElement(): SVGSVGElement {
    const svgNS = "http://www.w3.org/2000/svg";
    const xlinkNS = "http://www.w3.org/1999/xlink";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 489.79 531.27");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.style.display = "block";

    // --- <defs> ---
    const defs = document.createElementNS(svgNS, "defs");

    const linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.setAttribute("id", "linear-gradient");
    linearGradient.setAttribute("x1", "-10307.38");
    linearGradient.setAttribute("y1", "411.21");
    linearGradient.setAttribute("x2", "-9889.02");
    linearGradient.setAttribute("y2", "411.21");
    linearGradient.setAttribute("gradientTransform", "translate(-9817.59) rotate(-180) scale(1 -1)");
    linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");
    let stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", "0");
    stop.setAttribute("stop-color", "#bc8487");
    linearGradient.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".79");
    stop.setAttribute("stop-color", "#e3b2b3");
    linearGradient.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".85");
    stop.setAttribute("stop-color", "#efd4d4");
    linearGradient.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".92");
    stop.setAttribute("stop-color", "#faf3f3");
    linearGradient.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".96");
    stop.setAttribute("stop-color", "#fff");
    linearGradient.appendChild(stop);
    defs.appendChild(linearGradient);

    const linearGradient2 = document.createElementNS(svgNS, "linearGradient");
    linearGradient2.setAttribute("id", "linear-gradient-2");
    linearGradient2.setAttribute("x1", "-9012.51");
    linearGradient2.setAttribute("y1", "355.09");
    linearGradient2.setAttribute("x2", "-9169.79");
    linearGradient2.setAttribute("y2", "106.51");
    linearGradient2.setAttribute("gradientTransform", "translate(-8808.22) rotate(-180) scale(1 -1)");
    linearGradient2.setAttribute("gradientUnits", "userSpaceOnUse");
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", "0");
    stop.setAttribute("stop-color", "#bc8487");
    linearGradient2.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".36");
    stop.setAttribute("stop-color", "#d09c9e");
    linearGradient2.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".7");
    stop.setAttribute("stop-color", "#deacad");
    linearGradient2.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".97");
    stop.setAttribute("stop-color", "#e3b2b3");
    linearGradient2.appendChild(stop);
    defs.appendChild(linearGradient2);

    const linearGradient3 = document.createElementNS(svgNS, "linearGradient");
    linearGradient3.setAttribute("id", "linear-gradient-3");
    linearGradient3.setAttribute("x1", "-778.53");
    linearGradient3.setAttribute("y1", "212.14");
    linearGradient3.setAttribute("x2", "-360.18");
    linearGradient3.setAttribute("y2", "212.14");
    linearGradient3.setAttribute("gradientTransform", "translate(778.53)");
    linearGradient3.setAttribute("gradientUnits", "userSpaceOnUse");
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", "0");
    stop.setAttribute("stop-color", "#bc8487");
    linearGradient3.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".79");
    stop.setAttribute("stop-color", "#e3b2b3");
    linearGradient3.appendChild(stop);
    stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", ".97");
    stop.setAttribute("stop-color", "#fff");
    linearGradient3.appendChild(stop);
    defs.appendChild(linearGradient3);

    const linearGradient4 = document.createElementNS(svgNS, "linearGradient");
    linearGradient4.setAttribute("id", "linear-gradient-4");
    linearGradient4.setAttribute("x1", "516.34");
    linearGradient4.setAttribute("y1", "156.02");
    linearGradient4.setAttribute("x2", "359.06");
    linearGradient4.setAttribute("y2", "-92.56");
    linearGradient4.setAttribute("gradientTransform", "translate(-230.84)");
    linearGradient4.setAttributeNS(xlinkNS, "xlink:href", "#linear-gradient-2");
    defs.appendChild(linearGradient4);

    svg.appendChild(defs);

    // --- <g> with paths ---
    const g1 = document.createElementNS(svgNS, "g");
    g1.setAttribute("id", "Layer_1-2");
    g1.setAttribute("data-name", "Layer 1");

    const g2 = document.createElementNS(svgNS, "g");

    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("class", "cls-4");
    path1.setAttribute("d", "M247.71,339.88l-5.93-2.42-103.14-43.12s-2.04-.82-2.17-3.2v92.09c0,1.19.72,2.26,1.82,2.73l351.5,145.32v-92.56l-242.08-98.84Z");
    path1.setAttribute("style", "fill: url(#linear-gradient);");
    g2.appendChild(path1);

    const path2 = document.createElementNS(svgNS, "path");
    path2.setAttribute("class", "cls-1");
    path2.setAttribute("d", "M136.47,291.06v.06c.03,1.29.75,2.57,2.17,3.2l103.14,43.12,111.58-45.7v-92.68s-214.71,88.76-214.71,88.76c-.03,0-.06.03-.09.03-.06.03-.09.06-.13.06-.13.06-.41.22-.72.47l-.38.38c-.13.13-.25.31-.38.5-.06.09-.13.22-.16.35-.09.19-.19.41-.22.63-.06.25-.1.5-.1.82Z");
    path2.setAttribute("style", "fill: url(#linear-gradient-2);");
    g2.appendChild(path2);

    const path3 = document.createElementNS(svgNS, "path");
    path3.setAttribute("class", "cls-3");
    path3.setAttribute("d", "M0,239.65v92.56s351.5-145.32,351.5-145.32c1.1-.47,1.82-1.54,1.82-2.73v-92.09c-.13,2.39-2.17,3.2-2.17,3.2l-103.14,43.12-5.93,2.42L0,239.65Z");
    path3.setAttribute("style", "fill: url(#linear-gradient-3);");
    g2.appendChild(path3);

    const path4 = document.createElementNS(svgNS, "path");
    path4.setAttribute("class", "cls-2");
    path4.setAttribute("d", "M353.32,91.99v.06c-.03,1.29-.75,2.57-2.17,3.2l-103.14,43.12-111.58-45.7V0l214.71,88.76s.06.03.09.03c.06.03.09.06.13.06.13.06.41.22.72.47l.38.38c.13.13.25.31.38.5.06.09.13.22.16.35.09.19.19.41.22.63.06.25.1.5.1.82Z");
    path4.setAttribute("style", "fill: url(#linear-gradient-4);");
    g2.appendChild(path4);

    g1.appendChild(g2);
    svg.appendChild(g1);

    return svg;
  }
}
