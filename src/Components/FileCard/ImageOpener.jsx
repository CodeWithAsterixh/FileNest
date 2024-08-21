/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X } from '@phosphor-icons/react'
import Modal from '../Modal/Modal'
import './FileOpener.css'

function ImageOpener({file, close}) {
  return (
    <Modal className='ImageViewerModal' defaultCancel={false}>
        <span onClick={close}><X size={30} color='var(--baseWhite1000)' /></span>
        <div className="ImageViewer">
            <img src={file.url} alt={file.fileName} />
        </div>
    </Modal>
  )
}

export default ImageOpener