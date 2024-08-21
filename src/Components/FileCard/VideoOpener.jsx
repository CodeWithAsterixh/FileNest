/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import Modal from '../Modal/Modal'
import './FileOpener.css'
import { DownloadSimple, Share, X } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { db, deleteFile } from '../../Functions/DB';
import { handleDownload } from './FileCard';

function VideoOpener({password, file, close}) {
    const [url, setUrl] = useState(null)
    useEffect(() => {
      const getUrl = async ()=>{
        const retrieved = await db.handleRetrieveFile(file.id, password)
        setUrl(retrieved)
      }
      getUrl()

    }, [file])
    
    const dispatch = useDispatch();

     // Action to delete a file
     const handleDelete = async (file) => {
        try {
            await db.deleteFile(file.id); // Assuming deleteFile is implemented in your DB class
            // Dispatch an action to remove the file from the Redux store
            dispatch(deleteFile({ id: file.id }));
        } catch (error) {
            console.error('Failed to delete file:', error);
        }
    };
    
  return (
    <Modal className='VideoPlayerModal' defaultCancel={false}>
        <div className="top">
            <span className="share"><Share size={20} color='var(--baseWhite1000)'/></span>
            <span className="download" onClick={()=>handleDownload(file, password)}><DownloadSimple size={20} color='var(--baseWhite1000)'/></span>
            <span onClick={close}><X size={30} color='var(--baseWhite1000)' /></span>
        </div>
        <div className="VideoPlayer">
            {
                url?<video controls src={url}></video>:<i className='load'></i>
            }
        </div>
    </Modal>
    )
}

export default VideoOpener