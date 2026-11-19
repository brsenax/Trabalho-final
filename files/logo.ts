// Logo do ManuTech em SVG inline (não depende de arquivo externo).

const ICONE = `<rect width="200" height="200" rx="44" fill="#2563eb"/>
  <path d="M164.8,87.2 L181.4,89.7 L181.4,110.3 L164.8,112.8 L159.9,127.7 L171.9,139.5 L159.8,156.1 L144.9,148.4 L132.2,157.6 L134.9,174.2 L115.4,180.5 L107.9,165.5 L92.1,165.5 L84.6,180.5 L65.1,174.2 L67.8,157.6 L55.1,148.4 L40.2,156.1 L28.1,139.5 L40.1,127.7 L35.2,112.8 L18.6,110.3 L18.6,89.7 L35.2,87.2 L40.1,72.3 L28.1,60.5 L40.2,43.9 L55.1,51.6 L67.8,42.4 L65.1,25.8 L84.6,19.5 L92.1,34.5 L107.9,34.5 L115.4,19.5 L134.9,25.8 L132.2,42.4 L144.9,51.6 L159.8,43.9 L171.9,60.5 L159.9,72.3 Z" fill="#ffffff"/>
  <circle cx="100" cy="100" r="50" fill="#2563eb"/>
  <!-- monitor -->
  <rect x="68" y="76" width="64" height="42" rx="6" fill="#ffffff"/>
  <rect x="73" y="81" width="54" height="32" rx="3" fill="#172554"/>
  <path d="M83 97 L94 107 L117 88" fill="none" stroke="#60a5fa" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="95" y="118" width="10" height="7" fill="#ffffff"/>
  <rect x="84" y="124" width="32" height="6" rx="3" fill="#ffffff"/>`;

// Só o ícone (quadrado azul com engrenagem + computador).
export function logoIcone(tamanho = 48): string {
  return `<svg class="logo-svg" width="${tamanho}" height="${tamanho}" viewBox="0 0 200 200" role="img" aria-label="ManuTech">${ICONE}</svg>`;
}

// Ícone + nome "ManuTech". Use claro=true quando o fundo for escuro (sidebar).
export function logoMarca(tamanho = 40, claro = false): string {
  return `
    <span class="logo-marca ${claro ? "logo-marca--clara" : ""}">
      ${logoIcone(tamanho)}
      <span class="logo-nome">Manu<span>Tech</span></span>
    </span>`;
}
