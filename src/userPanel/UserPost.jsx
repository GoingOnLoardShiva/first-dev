import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { InputTextarea } from 'primereact/inputtextarea';

const UserPost = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [useName, setUseName] = useState('');

  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;
  const [writecontnet, setWritecontnet] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const email = parsed?.user?.[0]?.email_id;
        const name = parsed?.user?.[0]?.user_fName;

        if (email) {
          setUserEmail(email);
          setUseName(name); // <-- set this in state
        } else {
          console.warn("Email not found in user object:", parsed);
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email field missing in user data' });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid user data format' });
      }
    } else {
      toast.current.show({ severity: 'warn', summary: 'Not logged in', detail: 'Please log in to upload your image.' });
    }
  }, []);


  const uploadHandler = async ({ files }) => {
    const formData = new FormData();


    if (!userEmail) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'User email not found' });
      return;
    }

    formData.append('email_id', userEmail);
    formData.append('file', files[0]);
    formData.append('writecontnet', writecontnet);
    formData.append('useName', useName);

    try {
      const res = await fetch(url + "/uploadPostuser", {
        method: 'POST',
        headers: {
          "access-key": key,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
        setWritecontnet('');
        setTotalSize(0);
        fileUploadRef.current.clear();
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
      }
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Upload failed', detail: err.message });
    }
  };

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;
    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });
    setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap gap-3">
        <img alt={file.name} src={file.objectURL} width={100} />
        <div className="flex flex-column text-left">
          <strong>{file.name}</strong>
          <small>{new Date().toLocaleDateString()}</small>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => (
    <div className="flex flex-column align-items-center py-6">
      <i className="pi pi-image p-5" style={{
        fontSize: '5em',
        borderRadius: '50%',
        backgroundColor: 'var(--surface-b)',
        color: 'var(--surface-d)'
      }}></i>
      <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}>
        Drag and Drop Image Here
      </span>
    </div>
  );

  const footerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef?.current?.formatSize(totalSize) || '0 B';

    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
        </div>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    label: 'Choose Picture',
    iconOnly: false,
    className: 'custom-choose-btn p-button-rounded p-button-outlined'
  };

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    label: 'Upload',
    iconOnly: false,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
  };

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    label: 'Cancel',
    iconOnly: false,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
  };

  return (
    <div className="p-4 max-w-2xl mx-auto shadow-md rounded-md bg-white">
      <Toast ref={toast} />
      <Tooltip target=".custom-choose-btn" content="Choose Image" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload Post" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear Image" position="bottom" />

      {/* <h3 className="mb-3">Create Post</h3> */}
      <InputTextarea
        autoResize
        rows={4}
        cols={60}
        placeholder="Write your post here..."
        value={writecontnet}
        onChange={(e) => setWritecontnet(e.target.value)}
        className="mb-4 w-full"
        style={{width: '100%', height: '100px', resize: 'none'}}
      />

      <FileUpload
        ref={fileUploadRef}
        name="file"
        customUpload
        uploadHandler={uploadHandler}
        accept="image/*"
        maxFileSize={1000000}
        multiple={false}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        footerTemplate={footerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </div>
  );
};

export default UserPost;
