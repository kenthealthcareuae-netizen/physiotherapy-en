import React, { useState, useEffect } from 'react';

function AdminApp() {
  const [mediaItems, setMediaItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [selectedTag, setSelectedTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // API base URL - local development
  const API_BASE = '/backend/api';

  useEffect(() => {
    loadMedia();
    loadTags();
    
    // Add test function to window for debugging
    window.testTagsAPI = async () => {
      try {
        const response = await fetch('http://localhost:8080/backend/api/media-local.php?action=tags');
        const data = await response.json();
        console.log('Direct API test:', data);
        return data;
      } catch (error) {
        console.error('Direct API test error:', error);
        return null;
      }
    };
  }, []);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080${API_BASE}/media-local.php?action=all`);
      const data = await response.json();
      
      if (data.success) {
        setMediaItems(data.data || []);
      } else {
        alert('Failed to load media: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading media:', error);
      alert('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      console.log('Loading tags from:', `${API_BASE}/media-local.php?action=tags`);
      const response = await fetch(`http://localhost:8080${API_BASE}/media-local.php?action=tags`);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Tags response:', data);
      
      if (data.success) {
        setTags(data.data || []);
        console.log('Tags loaded successfully:', data.data);
      } else {
        console.error('Failed to load tags:', data.message);
        // Fallback: create default tags if API fails
        setTags([
          { id: 1, name: 'physiotherapy', description: 'Physiotherapy related media' },
          { id: 2, name: 'home-physiotherapy', description: 'Home physiotherapy services' },
          { id: 3, name: 'behavioural-english', description: 'Behavioral English therapy' },
          { id: 4, name: 'neuro-arabic', description: 'Neuro Arabic therapy' },
          { id: 5, name: 'general', description: 'General healthcare media' }
        ]);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      // Fallback: create default tags if network fails
      setTags([
        { id: 1, name: 'physiotherapy', description: 'Physiotherapy related media' },
        { id: 2, name: 'home-physiotherapy', description: 'Home physiotherapy services' },
        { id: 3, name: 'behavioural-english', description: 'Behavioral English therapy' },
        { id: 4, name: 'neuro-arabic', description: 'Neuro Arabic therapy' },
        { id: 5, name: 'general', description: 'General healthcare media' }
      ]);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        alert(`File is too large. Maximum size is 50MB. Your file is ${formatFileSize(file.size)}.`);
        event.target.value = ''; // Clear the file input
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        alert(`Invalid file type. Allowed types: JPG, PNG, WebP, GIF, MP4, WebM, OGG. Your file type: ${file.type}`);
        event.target.value = ''; // Clear the file input
        return;
      }
      
      setSelectedFile(file);
      setUploadData(prev => ({
        ...prev,
        title: file.name.split('.')[0]
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    if (uploadData.tags.length === 0) {
      alert('Please add at least one tag');
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting upload...');
      console.log('File:', selectedFile);
      console.log('Upload data:', uploadData);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('tags', JSON.stringify(uploadData.tags));

      console.log('FormData created, sending to:', `${API_BASE}/media-local.php?action=upload`);
      console.log('Full URL:', `http://localhost:8080${API_BASE}/media-local.php?action=upload`);
      
      const response = await fetch(`http://localhost:8080${API_BASE}/media-local.php?action=upload`, {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      let data;
      try {
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response: ' + responseText);
        }
        
        data = JSON.parse(responseText);
        console.log('Upload response:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (data.success) {
        alert('Media uploaded successfully!');
        setSelectedFile(null);
        setUploadData({ title: '', description: '', tags: [] });
        loadMedia();
      } else {
        let errorMessage = data.message || 'Unknown error';
        if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.join(', ');
        }
        alert('Upload failed: ' + errorMessage);
        console.error('Upload failed:', data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const response = await fetch(`http://localhost:8080${API_BASE}/media-local.php?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Media deleted successfully!');
        loadMedia();
      } else {
        alert('Delete failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed');
    }
  };

  const addTag = (tag) => {
    if (tag && !uploadData.tags.includes(tag)) {
      setUploadData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setUploadData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          🎯 Kent Healthcare - Admin Panel
        </h1>
        
        {/* Upload Section */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
            📤 Upload New Media
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Select File
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Allowed: JPG, PNG, WebP, GIF, MP4, WebM, OGG (max 50MB)
              </p>
            </div>

            {selectedFile && (
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '6px', 
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedFile.type.startsWith('video/') ? '🎥' : '🖼️'}
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', margin: 0 }}>{selectedFile.name}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Title
              </label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter media title"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Description
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter media description"
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Tags (Required) - {tags.length} available
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value=""
                  onChange={(e) => addTag(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select a tag ({tags.length} available)</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.name}>{tag.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    // Add default tags if none are loaded
                    if (tags.length === 0) {
                      setTags([
                        { id: 1, name: 'physiotherapy', description: 'Physiotherapy related media' },
                        { id: 2, name: 'home-physiotherapy', description: 'Home physiotherapy services' },
                        { id: 3, name: 'behavioural-english', description: 'Behavioral English therapy' },
                        { id: 4, name: 'neuro-arabic', description: 'Neuro Arabic therapy' },
                        { id: 5, name: 'general', description: 'General healthcare media' }
                      ]);
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {tags.length === 0 ? 'Load Default Tags' : 'Reload Tags'}
                </button>
              </div>
              
              {uploadData.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {uploadData.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0369a1',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadData.tags.length === 0 || isUploading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: (!selectedFile || uploadData.tags.length === 0 || isUploading) ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: (!selectedFile || uploadData.tags.length === 0 || isUploading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? '⏳ Uploading...' : '📤 Upload Media'}
            </button>
          </div>
        </div>

        {/* Media Library */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', margin: 0 }}>
              🖼️ Media Library ({mediaItems.length} items)
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', color: '#374151' }}>Filter by Tag:</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">All Tags ({tags.length} available)</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.name}>{tag.name}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              ⏳ Loading media...
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '16px' 
            }}>
              {mediaItems
                .filter(item => !selectedTag || JSON.parse(item.tags || '[]').includes(selectedTag))
                .map(item => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: 'white'
                    }}
                  >
                    <div style={{ 
                      aspectRatio: '16/9', 
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.file_type === 'video' ? (
                        <div style={{ textAlign: 'center', color: '#6b7280' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎥</div>
                          <p style={{ fontSize: '14px', margin: 0 }}>Video File</p>
                        </div>
                      ) : (
                        <img
                          src={`http://localhost:8080/backend/${(item.thumbnail_path || item.file_path).replace('../', '')}`}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            console.error('Image load error:', e.target.src);
                            console.error('Original paths:', { file_path: item.file_path, thumbnail_path: item.thumbnail_path });
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', `http://localhost:8080/backend/${(item.thumbnail_path || item.file_path).replace('../', '')}`);
                          }}
                        />
                      )}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          margin: 0, 
                          color: '#374151',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {item.title || item.original_name}
                        </h3>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginLeft: '8px'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {JSON.parse(item.tags || '[]').map(tag => (
                          <span
                            key={tag}
                            style={{
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              fontSize: '10px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <p style={{ 
                        fontSize: '12px', 
                        color: '#6b7280', 
                        margin: 0 
                      }}>
                        {formatFileSize(item.file_size)} • {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminApp;