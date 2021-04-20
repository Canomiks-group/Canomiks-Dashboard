import React, { useState } from 'react';
import axios from 'axios';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import S3Upload from 'react-s3-uploader/s3upload'
import Dropzone from 'react-dropzone'
import UploadDisplay from './UploadDisplay'
import { useDispatch } from 'react-redux';
function Upload(){
    const dispatch = useDispatch();
const uploadOptions = {
    server: 'http://localhost:5000'
  }
  const s3Url = 'https://prime-canomiks.s3.amazonaws.com'
  
function handleFinishedUpload (files){
        console.log(files.fileUrl,'filesss')
        dispatch({
            type: 'ADD_URL',
            payload: { pdfUrl: files.fileUrl,
                orderId: 2
              
            },
          });

      }
  
  
  
  return (<>
      <h3>Click the box to upload a file</h3>
    <DropzoneS3Uploader
      onFinish={handleFinishedUpload}
      s3Url={s3Url}
      maxSize={1024 * 1024 * 5}
      upload={uploadOptions}
    />
    </>
  )
  }
  export default Upload