/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import Modal from '../Modal/Modal'
import './FileOpener.css'
import { X } from '@phosphor-icons/react';

function VideoOpener({file, close}) {
    useEffect(() => {
      console.log(file);
      
    }, [file])
    
  return (
    <Modal className='VideoPlayerModal' defaultCancel={false}>
        <span onClick={close}><X size={30} color='var(--baseWhite1000)' /></span>
        <div className="VideoPlayer">
            <video controls src={file.url}></video>
        </div>
    </Modal>
    )
}

export default VideoOpener