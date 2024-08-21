/* eslint-disable no-unused-vars */
import { Archive, ArrowArcRight, Eye, GearFine, Lock, User, X } from '@phosphor-icons/react'
import './Settings.css'
import { useState } from 'react'
import Modal from '../Modal/Modal'
import PasswordFixSettings from './PasswordFixSettings'

function Settings() {
    const [shownSettings, setShownSettings] = useState(false)
    const [settingsContent, setSettingsContent] = useState({
        shown: false,
        content: null,
        settingsFor: null
    })


    function toggleShowSettings(){
        setShownSettings(!shownSettings)
    }
    function toggleShowSettingsOpen(content=<Modal><div>Settings content</div></Modal>, settingsFor){
        if(content){
            if(settingsContent.settingsFor||settingsFor){
                if( settingsContent.settingsFor == settingsFor){
                    if(settingsContent.shown){
                        setSettingsContent(
                            {
                                shown: false,
                                content
                            }
                        )
                    }else{    
                        setSettingsContent(
                            {
                                shown: true,
                                content
                            }
                        )
                    }
                }else{    
                    setSettingsContent(
                        {
                            shown: true,
                            content
                        }
                    )
                }
                
            }
        }else{
            setSettingsContent(
                {
                    shown: false,
                    content
                }
            ) 
        }
    }
  return (
    <>
        <div className={shownSettings?"Settings shown":"Settings"}>
            <i className="toggle" onClick={toggleShowSettings}>
                {
                    shownSettings?<X size={50}/>:<GearFine size={50}/>
                }
            </i>
            <ul className="actions">
                <li><Archive size={25} color="var(--secondary100)"/></li>
                <li onClick={()=>toggleShowSettingsOpen(<PasswordFixSettings cancel={()=>toggleShowSettingsOpen(null, 'passwordFix')} />, 'passwordFix')}><Lock size={25} color="var(--secondary100)"/></li>
                <li><User size={25} color="var(--secondary100)"/></li>
                <li><GearFine size={25} color="var(--secondary100)"/></li>
            </ul>
        </div>

        {
            settingsContent.shown?
            settingsContent.content
            :null
        }
    </>
  )
}

export default Settings