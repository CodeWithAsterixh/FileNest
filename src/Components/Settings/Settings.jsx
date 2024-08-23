/* eslint-disable no-unused-vars */
import { Archive, ArrowArcRight, Eye, GearFine, Lock, User, X } from '@phosphor-icons/react'
import './Settings.css'
import { useState } from 'react'
import Modal from '../Modal/Modal'
import PasswordFixSettings from './PasswordFixSettings'
import Storage from './Storage'

function Settings() {
    const [shownSettings, setShownSettings] = useState(false)
    const [settingsContent, setSettingsContent] = useState({
        shown: false,
        content: null,
        settingsFor: null
    })


    async function toggleShowSettings(){
        setShownSettings(!shownSettings)
    }
    async function toggleShowSettingsOpen(content=<Modal><div>Settings content</div></Modal>, settingsFor){
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
                <li onClick={()=>toggleShowSettingsOpen(<Storage cancel={()=>toggleShowSettingsOpen(null, 'storage')} />, 'storage')}>

                    <i className="title">Storage</i>
                    <Archive size={25} color="var(--secondary100)"/>
                </li>
                <li onClick={()=>toggleShowSettingsOpen(<PasswordFixSettings cancel={()=>toggleShowSettingsOpen(null, 'passwordFix')} />, 'passwordFix')}>
                    <i className="title">Password manager</i>
                    <Lock size={25} color="var(--secondary100)"/>
                </li>
                <li>
                    <i className="title">User</i>
                    <User size={25} color="var(--secondary100)"/>
                </li>
                <li>
                    <i className="title">Other Settings</i>
                    <GearFine size={25} color="var(--secondary100)"/>
                </li>
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