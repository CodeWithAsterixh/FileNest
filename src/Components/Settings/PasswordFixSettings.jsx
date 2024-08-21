/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Eye, EyeClosed, ArrowArcRight, X } from '@phosphor-icons/react'; 
import Modal from '../Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import './SettingsContent.css'
import PasswordInput from './InputPassword';
import { setPassword } from '../../Redux/ReducersAction';

function PasswordFixSettings({cancel}) {
    const password = useSelector((state) => state.password.password);
    const [inputVal, setInputVal] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({type: 'success', message: 'successful', return: false})
    const dispatch = useDispatch();


    // Function to handle form submission
    const handleSubmit = (action = '') => {
        if (password === 'default') {
            if (!inputVal) {
                setMessage({type: 'error', message: 'Please input a password', return: true})
                return;
            }else{
                setMessage({type: 'success', message: 'New password created', return: true})
                dispatch(setPassword(inputVal))
                localStorage.setItem('ps', inputVal);
                cancel()
            }
            return;
        }else{
            if (!inputVal) {
                setMessage({type: 'error', message: 'Current password is required', return: true})
                return;
            }
    
            if (password !== 'default' && inputVal !== password) {
                setMessage({type: 'error', message: 'Current password is incorrect', return: true})
                return;
            }
    
            if (!newPassword || !confirmPassword) {
                setMessage({type: 'warn', message: 'New password and confirmation are required', return: true})
                return;
            }
    
            if (newPassword !== confirmPassword) {
                setMessage({type: 'error', message: 'New password and confirmation do not match', return: true})
                return;
            }
    
            if (password === 'default') {
                setMessage({type: 'success', message: 'New password created', return: true})
                dispatch(setPassword(confirmPassword))
                localStorage.setItem('ps', confirmPassword);
            } else {
                setMessage({type: 'success', message: 'Password changed', return: true})
                dispatch(setPassword(confirmPassword))
                localStorage.setItem('ps', confirmPassword);
            }
        }

        

        // Clear the inputs after submission
        setInputVal('');
        setNewPassword('');
        setConfirmPassword('');
    };

    useEffect(() => {
        // Set the timeout
        const timeOut = setTimeout(() => {
            setMessage({ type: 'success', message: 'successful', return: false });
        }, 3000);

        // Cleanup function to clear the timeout
        return () => clearTimeout(timeOut);
    }, [message]);
    

    return (
        <Modal className='PasswordFixSettings' defaultCancel={false}>
            <span onClick={cancel} className="skip">
                Cancel <X weight='regular' size={20} />
            </span>
            <div className="createPassword">
                <h3>
                    {password === 'default' ? 'Create New Password' : 'Change Password'}
                </h3>
                {
                    message.return&&<b className={message.type}>{message.message}</b>
                }
                    <PasswordInput
                        placeholder={password === 'default' ? 'Enter New Password' : 'Enter Current Password'} 
                        value={inputVal} 
                        onChange={(e) => setInputVal(e.target.value)}
                    />
                {
                    password!=='default'&&<>
                        <PasswordInput
                            placeholder="Enter New Password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        <PasswordInput
                            placeholder="Confirm New Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </>
                }
                <button onClick={() => handleSubmit()} className='enter'>
                    {password === 'default' ? 'Create' : 'Change'}
                </button>
            </div>
        </Modal>
    );
}

export default PasswordFixSettings;
