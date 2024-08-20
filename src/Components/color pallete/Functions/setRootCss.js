// Set a CSS variable
export function setCssVariable(name, value) {
  
    document.documentElement.style.setProperty(`--${name}`, value);
  }