/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react';
import './FileCard.css';
import { FileImage, FilePdf, FileVideo, FileAudio, FileText, FilePpt, Download, FileArrowDown, Trash } from '@phosphor-icons/react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../Functions/DB';
import { deleteFile } from '../../Redux/ReducersAction';

const FileCard = ({ file }) => {
    const [imgError, setImgError] = useState(false);
    const [renameAble, setRenameAble] = useState(false);
    const [editedName, setEditedName] = useState(file.fileName);
    const nameBoxRef = useRef(null);
    const dispatch = useDispatch();
    const password = useSelector(state => state.password.password);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nameBoxRef.current && !nameBoxRef.current.contains(event.target)) {
                if (renameAble) {
                    setRenameAble(false);
                    if (editedName !== file.fileName) {
                        // Implement the action to update file name
                        // dispatch(updateFileName({ id: file.id, newName: editedName }));
                    }
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

    const handleBlur = () => {
        if (renameAble) {
            setRenameAble(false);
            if (editedName !== file.fileName) {
                // Implement the action to update file name
                // dispatch(updateFileName({ id: file.id, newName: editedName }));
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
            case '.doc':
            case '.docx':
                return <FileText color="var(--baseBlack1000)" weight='duotone' size={size} />;
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
            const fileBlob = await db.getFileBlob(file.id, password);
            if (fileBlob) {
                // const fileURL = URL.createObjectURL(fileBlob);
                const url = db.handleRetrieveFile(file.id, password)
                const link = document.createElement('a');
                link.href = file.preview;
                link.download = file.fileName;
                link.click();
            }
        } catch (error) {
            console.error('Failed to download file:', error);
        }
    };

    return (
        <div className="file-card">
            <ul className="options">
                {
                  file.type.includes('image')?
                    <>
                      <li className="option" id='open' onClick={() => db.handleRetrieveFile(file.id, password)}>
                          <FileText size={20} weight='bold' color="var(--secondary100)" />
                      </li>
                      <li className="option" id='download' onClick={handleDownload}>
                          <FileArrowDown size={20} weight='bold' color="var(--secondary100)" />
                      </li>
                    </>
                  :null
                }
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
