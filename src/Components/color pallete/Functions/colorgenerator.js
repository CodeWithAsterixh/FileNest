import { setCssVariable } from "./setRootCss";

function lightenColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
    g = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
    b = Math.min(255, Math.floor(b + (255 - b) * percent / 100));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function generateShades(hex) {
    const shades = [];
    for (let i = 0; i < 10; i++) {
        shades.push(lightenColor(hex, i * 10));
    }

    return shades;
}


export function parseColorsToCssVar(colorArray, name="color"){
    
    colorArray.forEach((color, index)=>{            
        setCssVariable(`${name}${1000-(index*100)}`, color)
    })
}