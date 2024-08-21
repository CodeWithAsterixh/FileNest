/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Eye, EyeClosed } from '@phosphor-icons/react'; 

function PasswordInput({ placeholder, value, onChange }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggleClick = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="input">
            <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
            />
            <button 
                className={showPassword ? 'show' : ''} 
                onClick={handleToggleClick}
            >
                {showPassword ? (
                    <Eye color='var(--secondary100)' weight='bold' size={20} />
                ) : (
                    <EyeClosed color='var(--secondary1000)' weight='bold' size={20} />
                )}
            </button>
        </div>
    );
}

export default PasswordInput;
