/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import { Route, Routes } from 'react-router-dom';
import { ArrowArcRight, Eye, EyeClosed } from '@phosphor-icons/react';
import { setFiles, setPassword, uploadFiles, loadFiles } from './Redux/ReducersAction';
import Home from './Pages/Home/Home';
import ColorPalette, { setColor } from './Components/color pallete/ColoePalette';
import Out from './Components/Outlet/Outlet';
import Modal from './Components/Modal/Modal';
import './App.css'
import { uploadFilesSave } from './Functions/DB';

function App() {
  const files = useSelector((state) => state.files);
  const password = useSelector((state) => state.password.password);
  const dispatch = useDispatch();
  const [createPassword, setCreatePassword] = useState(false);
  const [inputPassword, setInputPassword] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [inputVal, setInputVal] = useState('');
  
  // Default color palette setup
  const defCol = [
    { name: 'primary', mainColor: "#ADD8E6", shades: [] }, // Light Blue
    { name: 'secondary', mainColor: "#4B0082", shades: [] }, // Indigo (Contrasts with Light Blue)
    { name: 'color-accent-Gold', mainColor: "#FFD700", shades: [] }, // Gold
    { name: 'baseWhite', mainColor: "#F5F5F5", shades: [] }, // Light Neutral
    { name: 'baseBlack', mainColor: "#333333", shades: [] }, // Dark Neutral
    { name: 'color-error', mainColor: "#FF6F61", shades: [] }, // Red for Errors
    { name: 'color-success', mainColor: "#28A745", shades: [] }, // Green for Success
  ];

  useEffect(() => {
    const savedPassword = localStorage.getItem('ps');
    if (savedPassword) {
      if (savedPassword === 'default') {
        dispatch(setPassword('default'));
        console.log('default');
      } else {
        setInputPassword(true);
      }
    } else {
      localStorage.setItem('ps', 'false');
      setCreatePassword(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (password) {
      dispatch(loadFiles(password));
    }
  }, [password, dispatch]);

  const handleToggleClick = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  const handleSubmit = (value = inputVal) => {
    const savedPassword = localStorage.getItem('ps');
    if (savedPassword === 'false' || savedPassword === false) {
      if (value.length > 0) {
        dispatch(setPassword(value));
        localStorage.setItem('ps', value);
        setInputPassword(false);
        setCreatePassword(false);
      }
      return;
    }
    
    if (savedPassword) {      
      if (value.length > 0) {
        if (value === savedPassword) {
          console.log('password is correct');
          dispatch(setPassword(value));
        } else {
          console.log('password is incorrect');
        }
      }
    }
    
    setInputPassword(false);
    setCreatePassword(false);
  };

  return (
    <>
      {createPassword ? (
        <Modal defaultCancel={false}>
          <span onClick={() => { handleSubmit('default'); }} className="skip">
            skip <ArrowArcRight weight='regular' size={20} />
          </span>
          <div className="createPassword">
            <div className="input">
              <input type={inputType} placeholder="Enter Password" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
              <button className={showPassword ? 'show' : ''} onClick={handleToggleClick}>
                {showPassword ? <Eye color='var(--secondary100)' weight='bold' size={20} /> : <EyeClosed color='var(--secondary1000)' weight='bold' size={20} />}
              </button>
            </div>
            <button onClick={() => handleSubmit()} className='enter'>Create</button>
          </div>
        </Modal>
      ) : inputPassword ? (
        <Modal defaultCancel={false}>
          <div className="inputPassword">
            <div className="input">
              <input type={inputType} placeholder="Enter Password" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
              <button className={showPassword ? 'show' : ''} onClick={handleToggleClick}>
                {showPassword ? <Eye color='var(--secondary100)' weight='bold' size={20} /> : <EyeClosed color='var(--secondary1000)' weight='bold' size={20} />}
              </button>
            </div>
            <button onClick={() => handleSubmit()} className='enter'>Enter</button>
          </div>
        </Modal>
      ) : (
        <Routes>
          <Route path='/' element={<Out />}>
            <Route index element={<Home />} />
            <Route path='color' element={<ColorPalette templates={setColor(defCol)} />} />
          </Route>
        </Routes>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
