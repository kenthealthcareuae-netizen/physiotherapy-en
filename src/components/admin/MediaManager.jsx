import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  Image, 
  Video, 
  Tag, 
  Trash2, 
  Edit, 
  Eye, 
  X,
  Plus,
  Save,
  Loader2,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';

const MediaManager = () => {
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  // API base URL - local development
  const API_BASE = '/backend/api';

  useEffect(() => {
    loadMedia();
    loadTags();
  }, []);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/media-local.php?action=all`);
      const data = await response.json();
      
      if (data.success) {
        setMediaItems(data.data || []);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to load media",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Error",
        description: "Failed to load media",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/media-local.php?action=tags`);
      const data = await response.json();
      
      if (data.success) {
        setTags(data.data || []);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadData(prev => ({
        ...prev,
        title: file.name.split('.')[0]
      }));
    }
  };

  const handleUpload = async (uploadData) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive"
      });
      return;
    }

    if (uploadData.tags.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one tag",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('tags', JSON.stringify(uploadData.tags));

      const response = await fetch(`${API_BASE}/media-local.php?action=upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Media uploaded successfully"
        });
        setSelectedFile(null);
        setUploadData({ title: '', description: '', tags: [] });
        loadMedia();
      } else {
        toast({
          title: "Error",
          description: data.message || "Upload failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const response = await fetch(`${API_BASE}/media-local.php?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Media deleted successfully"
        });
        loadMedia();
      } else {
        toast({
          title: "Error",
          description: data.message || "Delete failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem({
      ...item,
      tags: JSON.parse(item.tags || '[]')
    });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`${API_BASE}/media-local.php?id=${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editingItem.title,
          description: editingItem.description,
          tags: editingItem.tags
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Media updated successfully"
        });
        setEditingItem(null);
        loadMedia();
      } else {
        toast({
          title: "Error",
          description: data.message || "Update failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Update failed",
        variant: "destructive"
      });
    }
  };

  const moveMedia = (index, direction, tag) => {
    const filteredItems = mediaItems.filter(item => 
      JSON.parse(item.tags || '[]').includes(tag)
    ).sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredItems.length) return;

    const newItems = [...filteredItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    const mediaIds = newItems.map(item => item.id);
    handleOrderUpdate(tag, mediaIds);
  };

  const handleOrderUpdate = async (tag, mediaIds) => {
    try {
      setIsOrdering(true);
      const response = await fetch(`${API_BASE}/media-local.php?action=update-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tag, mediaIds })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Media order updated successfully"
        });
        loadMedia();
      } else {
        toast({
          title: "Error",
          description: data.message || "Order update failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Order update error:', error);
      toast({
        title: "Error",
        description: "Order update failed",
        variant: "destructive"
      });
    } finally {
      setIsOrdering(false);
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
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>

            {selectedFile && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    {selectedFile.type.startsWith('video/') ? (
                      <Video className="h-6 w-6 text-gray-400" />
                    ) : (
                      <Image className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={uploadData.title}
                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter media title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter media description"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Tags (Required)</Label>
              <div className="flex gap-2 mt-1">
                <select
                  value=""
                  onChange={(e) => addTag(e.target.value)}
                  className="px-3 py-2 border rounded-md flex-1"
                >
                  <option value="">Select a tag</option>
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.name}>{tag.name}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={() => addTag(document.querySelector('select').value)}
                  disabled={!document.querySelector('select').value}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {uploadData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {uploadData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => handleUpload(uploadData)}
              disabled={!selectedFile || uploadData.tags.length === 0 || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Media Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Media Library ({mediaItems.length} items)
          </CardTitle>
          <div className="flex gap-2 mt-4">
            <Label htmlFor="tag-filter">Filter by Tag:</Label>
            <select
              id="tag-filter"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-1 border rounded-md"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading media...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTag && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Ordering for: {selectedTag}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Use the arrow buttons to reorder media for this tag. The order will be saved automatically.
                  </p>
                </div>
              )}
              
              {selectedTag ? (
                <div className="space-y-2">
                  {mediaItems
                    .filter(item => JSON.parse(item.tags || '[]').includes(selectedTag))
                    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                    .map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveMedia(index, 'up', selectedTag)}
                            disabled={index === 0 || isOrdering}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveMedia(index, 'down', selectedTag)}
                            disabled={index === mediaItems.filter(i => JSON.parse(i.tags || '[]').includes(selectedTag)).length - 1 || isOrdering}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex-1 flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            {item.file_type === 'video' ? (
                              <Video className="h-6 w-6 text-gray-400" />
                            ) : (
                              <img
                                src={item.thumbnail_path || item.file_path}
                                alt={item.title}
                                className="w-full h-full object-cover rounded"
                              />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.title || item.original_name}</h4>
                            <p className="text-xs text-gray-500">Position: {index + 1}</p>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {item.file_type === 'video' ? (
                          <div className="text-center">
                            <Video className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="text-sm text-gray-500 mt-2">Video File</p>
                          </div>
                        ) : (
                          <img
                            src={item.thumbnail_path || item.file_path}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm truncate">{item.title || item.original_name}</h3>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {JSON.parse(item.tags || '[]').map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          {formatFileSize(item.file_size)} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Edit Media
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingItem(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-1">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value && !editingItem.tags.includes(e.target.value)) {
                          setEditingItem(prev => ({
                            ...prev,
                            tags: [...prev.tags, e.target.value]
                          }));
                        }
                      }}
                      className="px-3 py-2 border rounded-md flex-1"
                    >
                      <option value="">Select a tag</option>
                      {tags.map(tag => (
                        <option key={tag.id} value={tag.name}>{tag.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {editingItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingItem.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            onClick={() => setEditingItem(prev => ({
                              ...prev,
                              tags: prev.tags.filter(t => t !== tag)
                            }))}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MediaManager;