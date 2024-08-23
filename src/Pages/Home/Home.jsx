/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FileCard from '../../Components/FileCard/FileCard';
import './Home.css';
import { CloudArrowUp, FileDotted, FilePlus, FileSearch, Funnel, MagnifyingGlass, X } from '@phosphor-icons/react';
import { useFileUpload } from '../../Functions/useFileUpload';

function Home() {
  // Access files from the Redux store
  const files = useSelector((state) => state.files);
  const types = useSelector((state) => state.categories.allTypes);
  const category = useSelector((state) => state.categories.currentCategory);
  const password = useSelector((state) => state.password.password);// Fetch this from state or props
  const { uploadProcess, handleFileChange } = useFileUpload(password);
  const [categorized, setCategorized] = useState([])
  const fileInputRef = useRef(null);
  const [search, setSearch] = useState(false)
  const [inputSearch, setInputSearch] = useState('')

  const [fileOpener, setFileOpener] = useState({
    shown: false,
    content: null,
    id: null
})
  // useEffect(() => {
  //   console.table(files)
  // }, [files])
  // useEffect(() => {
  //   console.table(types)
  // }, [types])
  useEffect(() => {
    if(files){
      // console.log(category);
      
      let categorizedFiles;
      switch (category) {
        case 'videos':
          categorizedFiles = files.filter(file => file.type.includes('video'))
          break;
        case 'photos':
          categorizedFiles = files.filter(file => file.type.includes('image'))
          break;
        case 'others':
          categorizedFiles = files.filter(file => !file.type.includes('image') && !file.type.includes('video'))
          break;
      
        default:
          categorizedFiles = files
          break;
      }
      setCategorized(categorizedFiles)
    }
    
    if(search&&search.trim() !== ''){
      let searchFilter = files.filter(item => item.fileName.includes(search))

      switch (category) {
        case 'videos':
          searchFilter = files.filter(file => file.type.includes('video')).filter(item => item.fileName.includes(search))
          break;
        case 'photos':
          searchFilter = files.filter(file => file.type.includes('image')).filter(item => item.fileName.includes(search))
          break;
        case 'others':
          searchFilter = files.filter(file => !file.type.includes('image') && !file.type.includes('video')).filter(item => item.fileName.includes(search))
          break;
      
        default:
          searchFilter = files.filter(item => item.fileName.includes(search))
          break;
      }
      setCategorized(searchFilter)
    }

    
  }, [category, files, search])

  
  

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="Home">
      <div className="controls">
        <label htmlFor="search" className="search">
          <div className="searchInput">
              <input value={inputSearch} onChange={(e)=>setInputSearch(e.target.value)} type="text"/>
              <button onClick={()=>setInputSearch('')}><X /></button>
          </div>
          <button onClick={()=> setSearch(inputSearch)}><MagnifyingGlass /></button>
        </label>
        <button onClick={()=> {return}}>Filters <Funnel color="var(--secondary100)" size={20} /></button>
      </div>
      <input
            type="file"
            onChange={handleFileChange}
            multiple
            ref={fileInputRef}
            style={{display: 'none'}}
          />
      {uploadProcess.process > 0&&uploadProcess.process < 3? 
        <>
            <div className='uploading'>
              <i onClick={handleButtonClick} >
                <CloudArrowUp size={100} />
              </i>
              <p>Uploading: {uploadProcess.size} files</p>
            </div>
          </>
        :<div className="filesContainer">
            {/* Check if files are loaded and map them to FileCard components */}
            {files && categorized.length > 0 ? (
              categorized.map((file) => (
                <FileCard open={{fileOpener, setFileOpener}} key={file.id} file={file} />
              ))
            ) : (
              <div className="nofile">
              <p>No files available</p>
              <i onClick={handleButtonClick} >
                <FilePlus color='var(--secondary100)' size={100} />
              </i>
              </div>// Display a message if no files are present
            )}
            {
              fileOpener.shown&&fileOpener.content
            }
      </div>
      }
    </div>
  );
}

export default Home;
