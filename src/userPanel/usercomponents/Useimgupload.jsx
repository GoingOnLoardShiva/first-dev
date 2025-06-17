import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

const Useimgupload = () => {
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [userEmail, setUserEmail] = useState(null);

  const url = process.env.REACT_APP_HOST_URL;
  const key = process.env.REACT_APP_APIKEY;

  // Load user email on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const email = user?.user?.[0]?.email_id;

        if (email) {
          setUserEmail(email);
        } else {
          console.warn("Email not found in user object:", user);
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
    const parsed = JSON.parse(localStorage.getItem("user"));
    const email = parsed?.user?.[0]?.email_id; // ✅ Correct access

    if (!userEmail) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'User email not found' });
      return;
    }

    const formData = new FormData();
    formData.append('email_id', email);
    formData.append('file', files[0]);

    try {
      const res = await fetch(`${url}/uploadProfileImage`, {
        method: 'POST',
        headers: {
          "access-key": key
        },
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
      }
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Upload failed', detail: err.message });
    }
  };


  // Rest of your templates and config (unchanged)
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

  const onTemplateClear = () => setTotalSize(0);

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef?.current?.formatSize(totalSize) || '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
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

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
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
    <div className="flex align-items-center flex-column">
      <i
        className="pi pi-image mt-3 p-5"
        style={{
          fontSize: '5em',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-b)',
          color: 'var(--surface-d)'
        }}
      />
      <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
        Drag and Drop Image Here
      </span>
    </div>
  );

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined'
  };
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
  };

  return (
    <div>
      <Toast ref={toast} />
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        customUpload
        uploadHandler={uploadHandler}
        accept="image/*"
        maxFileSize={1000000}
        multiple={false}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </div>
  );
};

export default Useimgupload;
