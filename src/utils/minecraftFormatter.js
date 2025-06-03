// Minecraft color and formatting codes
const colorMap = {
  '§0': 'text-black',
  '§1': 'text-[#0000AA]',
  '§2': 'text-[#00AA00]',
  '§3': 'text-[#00AAAA]',
  '§4': 'text-[#AA0000]',
  '§5': 'text-[#AA00AA]',
  '§6': 'text-[#FFAA00]',
  '§7': 'text-[#AAAAAA]',
  '§8': 'text-[#555555]',
  '§9': 'text-[#5555FF]',
  '§a': 'text-[#55FF55]',
  '§b': 'text-[#55FFFF]',
  '§c': 'text-[#FF5555]',
  '§d': 'text-[#FF55FF]',
  '§e': 'text-[#FFFF55]',
  '§f': 'text-white',
   '§r': 'text-white'
};

const formatMap = {
  '§l': 'font-bold',
  '§m': 'line-through',
  '§n': 'underline',
  '§o': 'italic'
};

/**
 * Parses Minecraft formatting codes into HTML with appropriate styling
 */
export const parseMCFormatting = (input) => {
  if (!input) return '';
  
  let result = '';
  let currentSpan = '';
  let currentClasses = [];

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '§' && i + 1 < input.length) {
      if (currentSpan) {
        result += `<span class="${currentClasses.join(' ')}">${currentSpan}</span>`;
        currentSpan = '';
      }

      const code = input.substr(i, 2);
      if (colorMap[code]) {
        // Color codes reset formatting
        currentClasses = [colorMap[code]];
      } else if (formatMap[code]) {
        if (!currentClasses.includes(formatMap[code])) {
          currentClasses.push(formatMap[code]);
        }
      } else if (code === '§r') {
        // Reset all formatting
        currentClasses = [];
      }
      i++; // Skip the next character as it's part of the formatting code
    } else {
      currentSpan += input[i];
    }
  }

  if (currentSpan) {
    result += `<span class="${currentClasses.join(' ')}">${currentSpan}</span>`;
  }

  return result || 'No description available';
};