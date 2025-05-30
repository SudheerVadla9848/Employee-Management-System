import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { File, X, Upload } from 'lucide-react';

interface FileUploadProps {
  id: string;
  label?: string;
  error?: string;
  accept?: string;
  maxSize?: number;
  onChange: (file: File | null) => void;
  currentFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  error,
  accept = 'application/pdf',
  maxSize = 1024 * 1024, // 1MB
  onChange,
  currentFile,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(currentFile || null);
  const [fileError, setFileError] = useState<string>('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!file.type.match(accept)) {
      return { valid: false, error: 'File type not accepted' };
    }
    
    if (file.size < 10 * 1024) { // 10KB
      return { valid: false, error: 'File must be at least 10KB' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File is too large (max ${maxSize / 1024 / 1024}MB)` };
    }

    return { valid: true };
  };

  const handleChange = (file: File | null) => {
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setFile(file);
        onChange(file);
        setFileError('');
      } else {
        setFileError(validation.error || 'Invalid file');
        onChange(null);
      }
    } else {
      setFile(null);
      onChange(null);
      setFileError('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChange(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      
      <div
        className={clsx(
          'mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md',
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          error || fileError ? 'border-red-300' : ''
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={id}
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id={id}
                  name={id}
                  type="file"
                  ref={inputRef}
                  className="sr-only"
                  accept={accept}
                  onChange={handleInputChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF only, 10KB - 1MB
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <File className="h-8 w-8 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {(error || fileError) && (
        <p className="input-error">{error || fileError}</p>
      )}
    </div>
  );
};

export default FileUpload;