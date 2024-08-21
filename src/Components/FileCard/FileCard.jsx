/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react';
import './FileCard.css';
import { FileImage, FilePdf, FileVideo, FileAudio, FileText, FilePpt, Download, FileArrowDown, Trash, FileDoc, FileXls, FileArchive, FileCode, WarningCircle } from '@phosphor-icons/react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../Functions/DB';
import { deleteFile, setFiles } from '../../Redux/ReducersAction';
import VideoOpener from './VideoOpener';
import ImageOpener from './ImageOpener';
import { toast } from 'react-toastify';




 // Action to download a file
 export const handleDownload = async (file, password) => {
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
                    handleBlur()
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
    function handleUpdateRename(newName) {
        const updatedFiles = files.map((lFile) => {
            if (lFile.id === file.id) {
                // Ensure the new name includes the correct file type
                const fileName = `${newName}${file.fileType}`;
                return {
                    ...lFile,
                    fileName,
                    modifiedDate: new Date().toISOString(),
                };
            }
            return lFile;
        });
    
        const updatedFile = updatedFiles.find((f) => f.id === file.id);
    
        db.updateFile(file.id, updatedFile, password)
            .then((result) => {
                if (result.success) {
                    if(result.type == 'warn'){
                        toast.warn('Device doesnt allow browser renaming, file not renamed!', {
                            position: "top",
                            icon: <WarningCircle size={20} />
                          })
                    }
                    dispatch(setFiles(updatedFiles)); // Update Redux or local state
                    setRenameAble(false); // Hide rename UI
                } else {
                    console.error(result.message);
                }
            });
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
            // Image files
            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.gif':
            case '.bmp':
            case '.tiff':
            case '.svg':
                return <FileImage color="var(--baseBlack1000)" weight='duotone' size={size} />;
        
            // Document files
            case '.pdf':
                return <FilePdf color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.doc':
            case '.docx':
            case '.odt':
                return <FileDoc color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.ppt':
            case '.pptx':
            case '.odp':
                return <FilePpt color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.xls':
            case '.xlsx':
            case '.ods':
                return <FileXls color="var(--baseBlack1000)" weight='duotone' size={size} />;
            case '.txt':
            case '.rtf':
                return <FileText color="var(--baseBlack1000)" weight='duotone' size={size} />;
        
            // Video files
            case '.mp4':
            case '.mov':
            case '.avi':
            case '.mkv':
            case '.flv':
            case '.wmv':
                return <FileVideo color="var(--baseBlack1000)" weight='duotone' size={size} />;
        
            // Audio files
            case '.mp3':
            case '.wav':
            case '.ogg':
            case '.flac':
            case '.aac':
                return <FileAudio color="var(--baseBlack1000)" weight='duotone' size={size} />;
        
            // Archive files
            case '.zip':
            case '.rar':
            case '.7z':
            case '.tar':
            case '.gz':
                return <FileArchive color="var(--baseBlack1000)" weight='duotone' size={size} />;
        
            // Code files
            case '.html':
            case '.css':
            case '.js':
            case '.json':
            case '.xml':
            case '.md':
            case '.sql':
                return <FileCode color="var(--baseBlack1000)" weight='duotone' size={size} />;
        
            // Default to text file icon if file type is unknown
            default:
                return <FileText color="var(--baseBlack1000)" weight='duotone' size={size} />;
        }
    };

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

   
    const handleOpen = async ()=>{
        let displayContent;
        if(file.type.includes("video")){
            displayContent = {
                shown: true,
                content: <VideoOpener password={password} file={file} close={handleClose} />,
                id: file.id
            }
        }else if(file.type.includes("image")){
            displayContent = {
                shown: true,
                content: <ImageOpener password={password} file={file} close={handleClose} />,
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
                <li className="option" id='download' onClick={()=>handleDownload(file, password)}>
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
