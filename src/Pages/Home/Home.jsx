/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FileCard from '../../Components/FileCard/FileCard';
import './Home.css';

function Home() {
  // Access files from the Redux store
  const files = useSelector((state) => state.files);

  useEffect(() => {
    console.log(files); // For debugging purposes
  }, [files]);

  return (
    <div className="Home">
      <div className="filesContainer">
        {/* Check if files are loaded and map them to FileCard components */}
        {files && files.length > 0 ? (
          files.map((file) => (
            <FileCard key={file.id} file={file} /> // Use file.id if available
          ))
        ) : (
          <p>No files available</p> // Display a message if no files are present
        )}
      </div>
    </div>
  );
}

export default Home;
