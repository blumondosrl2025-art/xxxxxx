import { useEffect } from 'react';
import { ShopTheme } from '../types';

interface ThemeEngineProps {
  theme: ShopTheme;
  containerId: string;
}

export default function ThemeEngine({ theme, containerId }: ThemeEngineProps) {
  useEffect(() => {
    // Import Web Fonts dynamically
    const fontUrls: Record<string, string> = {
      grotesk: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
      serif: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap',
      mono: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
      playfair: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
      sans: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    };

    const targetFontUrl = fontUrls[theme.fontFamily] || fontUrls.sans;

    // Check if link already exists
    let linkId = `font-${theme.fontFamily}`;
    let existingLink = document.getElementById(linkId);
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = targetFontUrl;
      document.head.appendChild(link);
    }

    // Apply CSS variables to container
    const container = document.getElementById(containerId);
    if (container) {
      container.style.setProperty('--theme-primary', theme.primaryColor);
      container.style.setProperty('--theme-accent', theme.accentColor);
      container.style.setProperty('--theme-bg', theme.backgroundColor);
      container.style.setProperty('--theme-card-bg', theme.cardBgColor);
      container.style.setProperty('--theme-text', theme.textColor);
      
      const fontFamilies: Record<string, string> = {
        grotesk: '"Space Grotesk", sans-serif',
        serif: '"Noto Serif SC", serif',
        mono: '"JetBrains Mono", monospace',
        playfair: '"Playfair Display", serif',
        sans: '"Inter", sans-serif'
      };
      
      container.style.setProperty('--theme-font', fontFamilies[theme.fontFamily] || fontFamilies.sans);
      
      const borderRadii: Record<string, string> = {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px'
      };
      container.style.setProperty('--theme-radius', borderRadii[theme.borderRadius] || '8px');
    }
  }, [theme, containerId]);

  return null;
}
