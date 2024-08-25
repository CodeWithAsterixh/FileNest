/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Copy, Download, DownloadSimple, Share, X } from '@phosphor-icons/react'
import Modal from '../Modal/Modal'
import './FileOpener.css'
import { useDispatch } from 'react-redux';
import { db, deleteFile } from '../../Functions/DB';
import { handleDownload } from './FileCard';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ImageOpener({password, file, close}) {
    const dispatch = useDispatch();
    const [url, setUrl] = useState(null)
    useEffect(() => {
      const getUrl = async ()=>{
        const retrieved = await db.handleRetrieveFile(file.id, password)
        // console.log(retrieved);
        
        setUrl(retrieved)
      }

      getUrl()
    }, [file])
    // Action to delete a file
    const handleDelete = async () => {
       try {
           await db.deleteFile(file.id); // Assuming deleteFile is implemented in your DB class
           // Dispatch an action to remove the file from the Redux store
           dispatch(deleteFile({ id: file.id }));
       } catch (error) {
        toast.error('Failed to delete file:');
      }
   };

   const handleCopy = async () => {
      if(url){
        const share = await db.createShareableLink(file.id, password)
      }
    };


  return (
    <Modal className='ImageViewerModal' defaultCancel={false}>
        <div className="top">
            <span className="share" onClick={handleCopy}><Copy size={20} color='var(--baseWhite1000)'/></span>
            <span className="download" onClick={()=>handleDownload(file, password)}><DownloadSimple size={20} color='var(--baseWhite1000)'/></span>
            <span onClick={close}><X size={30} color='var(--baseWhite1000)' /></span>
        </div>
        <div className="ImageViewer">
            {url?<img src={url} alt={file.fileName} />:<i className='load'></i>}
        </div>
    </Modal>
  )
}

export default ImageOpener