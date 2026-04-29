import fs from 'fs';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Fundo -->
  <rect width="1200" height="630" fill="#0a0a0f"/>
  
  <!-- Borda sutil -->
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="none" stroke="#1e1e2e" stroke-width="1"/>
  
  <!-- Escudo (logo) -->
  <g transform="translate(480, 140)">
    <path d="M120 20 L220 65 L220 170 Q220 240 120 280 Q20 240 20 170 L20 65 Z"
          fill="#1a1a0e" stroke="#c9a84c" stroke-width="4" stroke-linejoin="round"/>
    <path d="M120 40 L200 80 L200 168 Q200 225 120 258 Q40 225 40 168 L40 80 Z"
          fill="none" stroke="#c9a84c" stroke-width="1.5" stroke-linejoin="round" opacity="0.3"/>
    <!-- Check mark -->
    <polyline points="75,155 105,185 165,125" fill="none" stroke="#c9a84c" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  
  <!-- TestPath -->
  <text x="600" y="340" font-family="Georgia, serif" font-size="72" font-weight="bold" fill="#e8d5a3" text-anchor="middle">TestPath</text>
  
  <!-- Badge CTFL -->
  <rect x="520" y="365" width="160" height="32" rx="16" fill="#1a1a0e" stroke="#c9a84c" stroke-width="1" opacity="0.8"/>
  <text x="600" y="387" font-family="sans-serif" font-size="14" fill="#c9a84c" text-anchor="middle" font-weight="bold">CTFL · CTAL · Playwright</text>
  
  <!-- Subtítulo -->
  <text x="600" y="450" font-family="sans-serif" font-size="28" fill="#7a7a8a" text-anchor="middle">Plataforma de certificações para QA</text>
  
  <!-- URL -->
  <text x="600" y="510" font-family="sans-serif" font-size="20" fill="#3a3a4a" text-anchor="middle">testpath.online</text>
  
  <!-- Detalhe dourado inferior -->
  <line x1="480" y1="540" x2="720" y2="540" stroke="#c9a84c" stroke-width="1" opacity="0.3"/>
</svg>`;

fs.writeFileSync('public/og-image.svg', svg);
console.log('✅ og-image.svg criado em public/');