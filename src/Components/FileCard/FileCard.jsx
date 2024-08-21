/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react';
import './FileCard.css';
import { FileImage, FilePdf, FileVideo, FileAudio, FileText, FilePpt, Download, FileArrowDown, Trash, FileDoc } from '@phosphor-icons/react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../Functions/DB';
import { deleteFile, setFiles } from '../../Redux/ReducersAction';
import VideoOpener from './VideoOpener';
import ImageOpener from './ImageOpener';

const FileCard = ({ file, open }) => {
    const [imgError, setImgError] = useState(false);
    const [renameAble, setRenameAble] = useState(false);
    const [editedName, setEditedName] = useState(file.fileName);
    const nameBoxRef = useRef(null);
    const dispatch = useDispatch();
    const password = useSelector(state => state.password.password);
    const files = useSelector((state) => state.files);
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nameBoxRef.current && !nameBoxRef.current.contains(event.target)) {
                if (renameAble) {
                    setRenameAble(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [renameAble, editedName, file.fileName, file.id, dispatch]);

    const handleRenameClick = () => {
        setRenameAble(true);
        setEditedName(file.fileName.split(".")[0]);
    };

    const handleInputChange = (event) => {
        setEditedName(event.target.value);
    };

    const handleEnter = (key) =>{
        if(key.key.toLowerCase() == 'enter'){
            if (editedName !== file.fileName.split(".")[0]) {
                handleUpdateRename(editedName)             
            }
        }
        
    }

    function handleUpdateRename(name){
        const modifiedDate = new Date().toISOString()
        const update = files.map(lFile => {
            let fileName = lFile.fileName
            if(lFile.id == file.id){    
                fileName = name+file.fileType
            } 
            return {...lFile, fileName, modifiedDate}

        })
        const updatedFile = update.find(f => f.id == file.id)
        db.updateFile(file.id, updatedFile, password)
        dispatch(setFiles(update)) 
        setRenameAble(false)
    }

    const handleBlur = () => {
        if (renameAble) {
            setRenameAble(false);
            if (editedName !== file.fileName.split(".")[0]) {
                handleUpdateRename(editedName)
            }
        }
    };

    const getFileIcon = (fileType, size=32) => {
        switch (fileType) {
            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.gif':
                return <FileImage color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.pdf':
                return <FilePdf color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.mp4':
            case '.mov':
            case '.avi':
                return <FileVideo color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.mp3':
            case '.wav':
                return <FileAudio color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.ppt':
            case '.pptx':
                return <FilePpt color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.txt':
                return <FileText color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.doc':
            case '.docx':
                return <FileDoc color="var(--baseBlack1000)" weight='duotone' size={size} />;
            default:
                return <FileText color="var(--baseBlack1000)" weight='duotone' size={size} />;
        }
    };

    // Action to delete a file
    const handleDelete = async () => {
        try {
            await db.deleteFile(file.id); // Assuming deleteFile is implemented in your DB class
            // Dispatch an action to remove the file from the Redux store
            dispatch(deleteFile({ id: file.id }));
        } catch (error) {
            console.error('Failed to delete file:', error);
        }
    };

    // Action to download a file
    const handleDownload = async () => {
        try {
            const fileBlob = await db.handleRetrieveFile(file.id, password);
            if (fileBlob) {
                const link = document.createElement('a');
                link.href = fileBlob;
                link.download = file.fileName;
                link.click();
            }
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };
    const handleOpen = async ()=>{
        const retrieved = await db.handleRetrieveFile(file.id, password)
        let displayContent;
        if(file.type.includes("video")){
            displayContent = {
                shown: true,
                content: <VideoOpener file={{...file, url:retrieved}} close={handleClose} />,
                id: file.id
            }
        }else if(file.type.includes("image")){
            displayContent = {
                shown: true,
                content: <ImageOpener file={{...file, url:retrieved}} close={handleClose} />,
                id: file.id
            }
        }

        open.setFileOpener(displayContent)
    }
    const handleClose = async ()=>{
        open.setFileOpener({
            shown: false,
            content: null,
            id: null
        })        
    }

    return (
        <div className="file-card">
            <ul className="options">
                {/* {
                  file.type.includes('image')?
                    <>
                      
                    </>
                  :null
                } */}
                <li className="option" id='open' onClick={handleOpen}>
                    <FileText size={20} weight='bold' color="var(--secondary100)" />
                </li>
                <li className="option" id='download' onClick={handleDownload}>
                    <FileArrowDown size={20} weight='bold' color="var(--secondary100)" />
                </li>
                <li className="option" id='delete file' onClick={handleDelete}>
                    <Trash size={20} weight='bold' color="var(--secondary100)" />
                </li>
                
            </ul>
            <div className="file-card-preview">
                {imgError || !file.preview ? (
                    <div className="file-card-icon">
                        {getFileIcon(file.fileType, 50)}
                    </div>
                ) : (
                    <img
                        src={file.preview}
                        alt={file.fileName}
                        onError={() => setImgError(true)}
                    />
                )}
            </div>
            <div className="file-card-details">
                <span 
                    className="file-card-name" 
                    ref={nameBoxRef}
                    onClick={handleRenameClick}
                    onBlur={handleBlur}
                    contentEditable={renameAble}
                    suppressContentEditableWarning={true}
                >
                    {file.fileName ? (
                        renameAble ? (
                            <input 
                                type="text" 
                                value={editedName} 
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                autoFocus
                                onKeyUp={handleEnter}
                            />
                        ) : (
                            <>
                                <i className="name">{file.fileName.split(".")[0]}</i>
                                <i className="ext">.{file.fileName.split(".")[1]}</i>
                            </>
                        )
                    ) : null}
                </span>
                <div className="file-card-icon">
                    {getFileIcon(file.fileType, 20)}
                </div>
            </div>
        </div>
    );
};

export default FileCard;
