/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ArrowLeft, File, FileArchive, FileDoc, FileImage, FilePpt, FileText, FileVideo, Trash } from '@phosphor-icons/react'
import Modal from '../Modal/Modal'
import './SettingsContent.css'
import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { loadCategories } from '../../Redux/ReducersAction';
import { db } from '../../Functions/DB';
Chart.register(...registerables);

export async function categorizeFiles(files, totalStorage) {
    // Initialize categories
    
    const categories = {
      images: { name: 'images', size: { original: 0, percent: 0 }, count: 0 },
      videos: { name: 'videos', size: { original: 0, percent: 0 }, count: 0 },
      apps: { name: 'apps', size: { original: 0, percent: 0 }, count: 0 },
      documents: { name: 'documents', size: { original: 0, percent: 0 }, count: 0 },
      others: { name: 'others', size: { original: 0, percent: 0 }, count: 0 },
    };
  
    // Categorize files
    files.forEach(file => {
      let category = 'others';
      if (file.type.includes('image')) {
        category = 'images';
      } else if (file.type.includes('video')) {
        category = 'videos';
      } else if (file.type.includes('application')) {
        category = 'apps';
      } else if (file.type.includes('document')) {
        category = 'documents';
      }
  
      // Add file size to the appropriate category
      categories[category].size.original += Number(file.fileSize.toLowerCase().split(" mb")[0]);
      categories[category].count += 1;
    });
  
    // Calculate percentages
    for (const category in categories) {
      const size = Number(categories[category].size.original);
      categories[category].size.percent = ((size / totalStorage.value) * 100).toFixed(2);
    }
  
    // Convert categories object to array and filter out categories with zero size
    return Object.values(categories);
  }
  

function Storage({cancel}) {
    const {maxStorage, usedStorage, remainingStorage, categorized} = useSelector(state => state.storage)
    const files = useSelector(state => state.files)
    const canvas = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (canvas.current) {
            const datas = []
            if(categorized){
                categorized.forEach(cat => {
                    datas.push(Number(cat.size.percent))
                })
            }
            datas.push(Number(remainingStorage.percent))

          const ctx = canvas.current.getContext('2d');
          const myChart = new Chart(ctx, {
            type: 'doughnut', 
            data: {
              datasets: [{
                label: '', 
                data: datas, 
                backgroundColor: [ 
                  '#814ca7',
                  '#ffeb7f',
                  '#ffa8a0',
                  '#7eca8f',
                  '#cde7f0',
                  '#dddddd',
                ],
                borderColor: [ 
                  '#4b0082',
                  '#ffd700',
                  '#ff6f61',
                  '#28a745',
                  '#add8e6',
                  '#a8a8a8',
                ],
                borderWidth: 1 
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom', 
                },
                tooltip: {
                  enabled: true, 
                },
              },
              scales: {
                y: {
                  grid: {
                    display: false 
                  },
                  ticks: {
                    display: false 
                  },
                  border: {
                    display: false 
                  }
                },
                x: {
                  grid: {
                    display: false 
                  },
                  ticks: {
                    display: false 
                  },
                  border: {
                    display: false 
                  }
                }
              },
              layout: {
                padding: {
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0
                }
              }
            }
          });
    
          // Cleanup on component unmount
          return () => {
            myChart.destroy();
          };
        }
      }, [canvas]);

      useEffect(() => {
        async function categorize(){
            const categorized = await categorizeFiles(files, maxStorage)
            dispatch(loadCategories(categorized))
        }
        
        categorize()

      }, [files])
      
      function GetIcon({name}){
        let icon = <File />
        switch(name){
            case 'images':
                icon = <FileImage size={20} weight='bold' color='var(--baseBlack100)' />;
                break;
            case 'videos':
                icon = <FileVideo size={20} weight='bold' color='var(--secondary1000)' />;
                break;
            case 'apps':
                icon = <FileArchive size={20} weight='bold' color='var(--baseWhite100)' />;  // Alternatively, you might choose a different icon
                break;
            case 'documents':
                icon = <FileDoc size={20} weight='bold' color='var(--baseBlack100)' />;
                break;
            case 'others':
                icon = <FileText size={20} weight='bold' color='var(--secondary1000)' />;
                break;
            default:
                icon = <FileText size={20} weight='bold' color='var(--secondary1000)' />; 
        }
        return icon
      }

      
    

  return (
    <Modal className='storageModal' defaultCancel={false}>
        <div className="title">
            <i className="cancel" onClick={cancel}><ArrowLeft color='var(--baseBlack900)' weight='bold' size={20} /></i>
            <h3>Settings</h3>
        </div>
        <div className='Storage'>
            <div className="chart"  data-before={`${Math.round(usedStorage.value)}mb of ${Math.round(maxStorage.value)}mb`}>
                <canvas ref={canvas}></canvas>
            </div>
            <div className="totals">
                <b>Used</b>
                <b>Free</b>
            </div>
            <ul className="Lining">
                {
                    categorized&&categorized.map((category, index) => (
                        <li key={index} className={category.name} style={{'--size': `${category.size.percent}%`}}></li>
                    ))
                }
            </ul>
            <div className="totals">
                <b>{Math.round(Number(usedStorage.value))}mb ({Math.round(Number(usedStorage.percent))}%)</b>
                <b>{Math.round(Number(remainingStorage.value))}mb ({Math.round(Number(remainingStorage.percent))}%)</b>
            </div>

            <ul className="categoryListing">
                
                {
                    categorized&&categorized.map((category, index) => (
                        <li key={index} className={category.name}>
                            <span >
                                <GetIcon name={category.name} /><b>{category.name}</b>
                            </span>
                            {/* <span className="sizeTotal">{category.size.original}mb</span> */}
                        </li>
                    ))
                }
            </ul>

            <span className="clearStorage" onClick={()=>db.clearData()}><Trash size={20} weight="bold"/>Clear all data</span>
           </div>
    </Modal>
  )
}

export default Storage