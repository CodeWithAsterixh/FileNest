/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState } from 'react';

// Create a context for process state
const ProcessContext = createContext();

export const useProcess = () => useContext(ProcessContext);

// Create a provider component
export const ProcessProvider = ({ children }) => {
  const [process, setProcess] = useState({ type: 'normal', message: "", returned: false });

  // Store the setProcess function globally in the Process class
  Process.setProcess = setProcess;

  return (
    <ProcessContext.Provider value={{ process, setProcess }}>
      {children}
    </ProcessContext.Provider>
  );
};

export class Process {
  static setProcess = null;

  constructor() {
    this.process = { type: 'normal', message: "", returned: false, position: '' };
  }

  updateProcess() {
    if (Process.setProcess) {
      Process.setProcess(this.process);
    } else {
      console.error('setProcess function is not initialized.');
    }
  }

  

  error(message, position='', options={autoClose: 2000}) {
    this.process = { type: 'error', message, returned: true, position };
    this.updateProcess();
    setTimeout(() => {
      this.clear()
    }, options.autoClose);
  }

  success(message, position='', options={autoClose: 2000}) {
    this.process = { type: 'success', message, returned: true, position };
    this.updateProcess();
    setTimeout(() => {
      this.clear()
    }, options.autoClose);
  }

  warn(message, position='', options={autoClose: 2000}) {
    this.process = { type: 'warn', message, returned: true, position };
    this.updateProcess();
    setTimeout(() => {
      this.clear()
    }, options.autoClose);
  }

  normal(message, position='', options={autoClose: 2000}) {
    this.process = { type: 'normal', message, returned: true, position };
    this.updateProcess();
    setTimeout(() => {
      this.clear()
    }, options.autoClose);
  }
  loading(message, position='', options={autoClose: 2000}) {
    this.process = { type: 'loading', message, returned: true, position };
    this.updateProcess();
    setTimeout(() => {
      this.clear()
    }, options.autoClose);
  }

  clear() {
    this.process = { type: 'normal', message: "", returned: false, position:'' };
    this.updateProcess();
  }
}


// Some external function or script
export const processing = new Process();