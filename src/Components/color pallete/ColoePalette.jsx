/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import './ColorPalette.css'
import { generateShades, parseColorsToCssVar } from './Functions/colorgenerator'
import { copyToClipBoard } from './Functions/copyToClipBoard'
import { toast } from 'react-toastify'

const defCol = [
    {name: 'primary', mainColor: "#2E0245", shades: []},
    {name: 'secondary', mainColor: "#32263E", shades: []},
    {name: 'baseWhite', mainColor: "#F2F2F2", shades: []},
    {name: 'baseBlack', mainColor: "#2E2E2E", shades: []}
]


/**
 * Sets and processes a list of color objects. Automatically adds `baseWhite` and `baseBlack` colors
 * if they are not included in the provided color list and if `autoNeutral` is set to `true`.
 * Generates shades for each color and parses them into CSS variables.
 *
 * @param {Array<{name: string, mainColor: string, shades: Array<string>}>} [colors=defCol] - An array of color objects. Each object should have:
 *  - `name` (string): The name of the color.
 *  - `mainColor` (string): The main color code in hexadecimal format (e.g., "#RRGGBB").
 *  - `shades` (Array<string>): An array to store the shades of the color.
 * 
 *  Note: The colors named `baseWhite` and `baseBlack` must be included as such if `autoNeutral` is `true`.
 *  any color that relates to the neutral light or dark/ white or black should be named `baseWhite` and `baseBlack` to prevent restyling of buttons
 * @param {boolean} [autoNeutral=true] - Determines whether `baseWhite` and `baseBlack` should be automatically added if missing.
 * 
 * @returns {Array<{name: string, mainColor: string, shades: Array<string>}>} - The updated array of color objects with generated shades and parsed CSS variables.
 * 
 * @example
 * // Example usage
 * const customColors = [
 *   { name: 'primary', mainColor: "#2E0245", shades: [] },
 *   { name: 'secondary', mainColor: "#32263E", shades: [] }
 * ];
 * const updatedColors = setColor(customColors, true);
 * console.log(updatedColors);
 */

export function setColor(colors=defCol, autoNeutral=true){
    if(autoNeutral){
        if(!colors.includes(color => color.name == 'baseWhite')){
            colors.push({name: 'baseWhite', mainColor: "#F2F2F2", shades: []})
        }
        if(!colors.includes(color => color.name == 'baseBlack')){
            colors.push({name: 'baseBlack', mainColor: "#2E2E2E", shades: []})
        }
    }
    colors.forEach(color => {
        color.shades = generateShades(color.mainColor)
        parseColorsToCssVar(color.shades, color.name)
    })

    return colors
  }
function ColorPalette({templates=setColor()}) {
    

    // create a number range
    let shades = []
    for (let i = 0; i < 10; i++) {
        shades.push(i);
    }
    async function copy(toCopy){
        
        const copied = await copyToClipBoard(toCopy)        
        if(copied){
            // toast("copied to clipboard")
            toast.success( `copied ${toCopy} to clipboard!`,
                {
                    position: "bottom-center",

                }
            )
            
        }
    }
    function Shaded({name, template=templates[0]}){       
        return (
            <>
                {
                    shades.map(shade=>(
                        <li key={`${name}${1000-(shade*100)}`} style={{backgroundColor:`var(--${name}${1000-(shade*100)})`}}>
                            <span className="textColorCode" data-before={`${name}${1000-(shade*100)}`}>
                                <b>{`${template.shades[((1000-(shade*100))/100)-1]}`}</b>
                                <button style={{backgroundColor: `var(--${name}1000)`}} onClick={()=>copy(template.shades[((1000-(shade*100))/100)-1])}>Copy to clip</button>
                            </span>
                        </li>
                    ))
                }
            </>
        )
    }
    

  return (
    <>
        <div className='colorPalette'>
        <h1>Color palette</h1>
        {
            templates.map((template, index) => (
                <ul key={index} className={template.name}>
                    <h1>{template.name}</h1>
                    <Shaded template={template} name={template.name} />
                </ul>
            ))
        }

    </div>
    </>

  )
}

export default ColorPalette