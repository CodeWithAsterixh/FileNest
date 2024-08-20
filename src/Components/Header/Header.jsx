/* eslint-disable no-unused-vars */
import './Header.css';
import logo from '../../assets/images/Adobe_Express_20240818_2338580.2773579255395181.png';
import { CloudArrowUp, FileText, Image, PlusCircle, VideoCamera } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFile } from '../../Redux/ReducersAction';
import { v4 as uniqueId } from 'uuid';
import { uploadFilesSave } from '../../Functions/DB';

function Header() {
  const filesState = useSelector((state) => state.files);
  const password = useSelector((state) => state.password.password);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [uploadProcess, setUploadProcess] = useState({ process: 0, size: 0 });

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setUploadProcess({ process: 1, size: files.length });

    const fileArray = await Promise.all(Array.from(files).map(async (file, index) => {
      const { name, size, type } = file;
      const fileSize = (size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert size to MB
      const fileExtension = name.split('.').pop().toLowerCase(); // Get the file extension
      const uploadDate = new Date().toISOString();
      const filePath = URL.createObjectURL(file); // Use a temporary URL for the file
      const preview = await generatePreview(fileExtension, file); // Generate a preview URL or icon

      setUploadProcess({ process: 2, size: index + 1 });

      return {
        fileName: name,
        fileType: `.${fileExtension}`,
        type,
        fileSize,
        uploadDate,
        filePath,
        preview,
        tags: [],
        description: '',
        id: uniqueId(),
      };
    }));

    setUploadProcess({ process: 3, size: fileArray.length });
    fileArray.forEach(async file => {
      dispatch(addFile({ file, password }));
      // Encrypt and save the file in the database
      await uploadFilesSave(file, password);
    });
  };

  const generatePreview = (fileExtension, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
          resolve(reader.result);
        } else if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension)) {
          resolve('/path/to/video-icon.png');
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension)) {
          resolve('/path/to/document-icon.png');
        } else {
          resolve('/path/to/file-icon.png');
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    console.log(uploadProcess);
  }, [uploadProcess]);

  return (
    <div className='Header'>
      <div className="logo">
        <img src={logo} alt="Logo" />
        <i className="file">File</i>
        <i className="nest">Nest</i>
      </div>

      <nav>
        <a className='active'>All</a>
        <a>
          <VideoCamera size={20} color="var(--secondary1000)" weight='duotone' />
          <span>Videos</span>
        </a>
        <a>
          <FileText size={20} color="var(--secondary1000)" weight='duotone' />
          <span>Documents</span>
        </a>
        <a>
          <Image size={20} color="var(--secondary1000)" weight='duotone' />
          <span>Photos</span>
        </a>
        {uploadProcess.process > 0 && uploadProcess.process < 3 ? (
          <a data-before={uploadProcess.size} className="uploading" onClick={handleButtonClick}>
            <CloudArrowUp size={24} color="var(--secondary100)" weight='duotone' />
          </a>
        ) : (
          <a className="add" onClick={handleButtonClick}>
            <span>Add</span> <PlusCircle size={24} color="var(--secondary1000)" weight='duotone' />
          </a>
        )}
      </nav>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}

export default Header;
