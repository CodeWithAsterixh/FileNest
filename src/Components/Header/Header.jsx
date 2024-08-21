// src/components/Header/Header.js

import './Header.css';
import logo from '../../assets/images/Adobe_Express_20240818_2338580.2773579255395181.png';
import { CloudArrowUp, FileText, Image, PlusCircle, VideoCamera } from '@phosphor-icons/react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFileUpload } from '../../Functions/useFileUpload';
import Settings from '../Settings/Settings';
import { setCategory } from '../../Redux/ReducersAction';

function Header() {
  const password = useSelector((state) => state.password.password);
  const category = useSelector((state) => state.categories.currentCategory);
  const fileInputRef = useRef(null);
  const { uploadProcess, handleFileChange } = useFileUpload(password);
  const dispatch = useDispatch()

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  function handleChangeTypeList(type){
    console.log(type.toLowerCase());
    
    dispatch(setCategory(type.toLowerCase()))
  }

  return (
    <div className='Header'>
      <div className="logo">
        <img src={logo} alt="Logo" />
        <i className="file">File</i>
        <i className="nest">Nest</i>
      </div>

      <nav>
        <a onClick={()=>handleChangeTypeList('All')} className={category=="all"?'active':null}>All</a>
        <a onClick={()=>handleChangeTypeList('Videos')} className={category=="videos"?'active':null}>
          <VideoCamera size={20} color="var(--secondary1000)" weight='duotone' />
          <span>Videos</span>
        </a>
        <a onClick={()=>handleChangeTypeList('others')} className={category=="others"?'active':null}>
          <FileText size={20} color="var(--secondary1000)" weight='duotone' />
          <span>Documents</span>
        </a>
        <a onClick={()=>handleChangeTypeList('Photos')} className={category=="photos"?'active':null}>
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
        <Settings />
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
