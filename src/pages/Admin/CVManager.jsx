import { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchCsrfToken } from '../../api';

const CVManager = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Only PDF files are allowed');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const token = await fetchCsrfToken();
            const formData = new FormData();
            formData.append('cv', file);

            // Fetch doesn't support progress events natively easily, so we simulate progress for UI
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            const res = await fetch('/api/admin/upload-cv', {
                method: 'POST',
                headers: {
                    'x-csrf-token': token
                },
                body: formData
            });

            clearInterval(progressInterval);
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setUploadProgress(100);
            toast.success('CV Uploaded successfully!');
            setTimeout(() => {
                setFile(null);
                setUploadProgress(0);
            }, 1000);
            
        } catch (err) {
            toast.error(err.message || 'Upload failed');
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h1 className="admin-page-title">CV Manager</h1>
            
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <i className="fa-solid fa-file-pdf" style={{ fontSize: '4rem', color: 'var(--secondary-color)', marginBottom: '1.5rem' }}></i>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Upload New Resume/CV</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Upload a new PDF file to replace your current CV. The public site's "Download CV" button will instantly point to this new file.
                </p>

                <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: '2rem' }}>
                        <input 
                            type="file" 
                            accept="application/pdf"
                            id="cv-upload"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            disabled={isUploading}
                        />
                        <label 
                            htmlFor="cv-upload" 
                            className="btn btn-outline" 
                            style={{ cursor: 'pointer', display: 'inline-block', width: '100%' }}
                        >
                            <i className="fa-solid fa-cloud-arrow-up"></i> {file ? file.name : 'Choose PDF File'}
                        </label>
                    </div>

                    {uploadProgress > 0 && (
                        <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '10px', marginBottom: '2rem', overflow: 'hidden' }}>
                            <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--secondary-color)', transition: 'width 0.2s' }}></div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-primary w-100" 
                        disabled={!file || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CVManager;
