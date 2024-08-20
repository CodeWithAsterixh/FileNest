import { Archive, GearFine, Lock, User, X } from '@phosphor-icons/react'
import './Settings.css'
import { useState } from 'react'
function Settings() {
    const [shownSettings, setShownSettings] = useState(false)


    function toggleShowSettings(){
        setShownSettings(!shownSettings)
    }
  return (
    <div className={shownSettings?"Settings shown":"Settings"}>
        <i className="toggle" onClick={toggleShowSettings}>
            {
                shownSettings?<X size={50}/>:<GearFine size={50}/>
            }
        </i>

        <ul className="actions">
            <li><Archive size={25} color="var(--secondary100)"/></li>
            <li><Lock size={25} color="var(--secondary100)"/></li>
            <li><User size={25} color="var(--secondary100)"/></li>
            <li><GearFine size={25} color="var(--secondary100)"/></li>
        </ul>
    </div>
  )
}

export default Settings