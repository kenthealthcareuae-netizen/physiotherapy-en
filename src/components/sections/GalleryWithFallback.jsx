import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { galleryConfig } from '../../config/gallery';

const GalleryWithFallback = ({ tag = 'physiotherapy' }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);

  // API base URL - local development
  const API_BASE = 'http://localhost:8080/backend/api';

  useEffect(() => {
    loadGalleryItems();
  }, [tag]);

  const loadGalleryItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUseFallback(false);
      
      // Try to fetch from backend API first (local development)
      console.log('Fetching gallery items for tag:', tag);
      console.log('API URL:', `${API_BASE}/media-local.php?action=by-tag-ordered&tag=${encodeURIComponent(tag)}`);
      const response = await fetch(`${API_BASE}/media-local.php?action=by-tag-ordered&tag=${encodeURIComponent(tag)}`);
      const data = await response.json();
      console.log('Gallery API response:', data);
      
      if (data.success && data.data && data.data.length >= 3) {
        // Backend has 3 or more items, use backend data
        setGalleryItems(data.data);
        setUseFallback(false);
      } else if (data.success && data.data && data.data.length > 0) {
        // Backend has less than 3 items, combine with Cloudinary fallback
        console.log(`Backend has only ${data.data.length} items, combining with Cloudinary fallback`);
        const cloudinaryItems = galleryConfig.items || [];
        const combinedItems = [...data.data, ...cloudinaryItems];
        setGalleryItems(combinedItems);
        setUseFallback(true);
      } else {
        // No backend data, use Cloudinary fallback
        console.log('Backend API failed or no data, using Cloudinary fallback');
        setUseFallback(true);
        setGalleryItems(galleryConfig.items || []);
      }
    } catch (err) {
      console.error('Backend API error, using Cloudinary fallback:', err);
      setUseFallback(true);
      setGalleryItems(galleryConfig.items || []);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      // Prevent scrolling
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.height = '100%';
      html.style.overflow = 'hidden';
      html.style.height = '100%';
      
      // Prevent touch scrolling on mobile
      body.style.touchAction = 'none';
      html.style.touchAction = 'none';
      
      // Store scroll position for restoration
      body.setAttribute('data-scroll-y', scrollY.toString());
      
      return () => {
        // Restore scrolling
        const storedScrollY = body.getAttribute('data-scroll-y');
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.height = '';
        body.style.touchAction = '';
        html.style.overflow = '';
        html.style.height = '';
        html.style.touchAction = '';
        body.removeAttribute('data-scroll-y');
        
        // Restore scroll position
        if (storedScrollY) {
          window.scrollTo(0, parseInt(storedScrollY));
        }
      };
    }
  }, [isModalOpen]);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[500px] border-t-2 border-blue-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading gallery...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error && !useFallback) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[500px] border-t-2 border-blue-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-lg mb-2">Failed to load gallery</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button 
              onClick={loadGalleryItems}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[500px] border-t-2 border-blue-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Kent Healthcare Gallery
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover our facilities and services through photos and videos
          </p>
          {useFallback && (
            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded-md">
              <p className="text-blue-800 text-sm">
                Showing backend media + Cloudinary fallback (less than 3 backend items)
              </p>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {galleryItems && galleryItems.length > 0 ? galleryItems.map((item, index) => (
            <Card 
              key={item.id || index} 
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-lg shadow-md border border-gray-200"
              onClick={() => openModal(item)}
            >
              <div className="relative aspect-video overflow-hidden">
                {item.file_type === 'video' || item.type === 'video' ? (
                  <>
                    <img 
                      src={item.thumbnail_path ? `http://localhost:8080/backend/${item.thumbnail_path.replace('../', '')}` : (item.thumbnail || item.src)} 
                      alt={item.title || 'Video thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img 
                    src={item.file_path ? `http://localhost:8080/backend/${item.file_path.replace('../', '')}` : item.src} 
                    alt={item.title || item.alt || item.original_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>
              
              {/* Media Info - Hidden as requested */}
            </Card>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No images or videos available at the moment</p>
              <p className="text-gray-400 text-sm mt-2">Content will be added soon</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal for Media Viewing */}
      {isModalOpen && selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeModal}
          style={{
            animation: 'modalFadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="relative max-w-4xl max-h-[95vh] sm:max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'modalSlideIn 0.3s ease-out'
            }}
          >
            <button
              onClick={closeModal}
              className="absolute -top-8 sm:-top-12 right-0 text-white text-xl sm:text-2xl hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
            >
              ✕
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video">
                {(selectedMedia.file_type === 'video' || selectedMedia.type === 'video') ? (
                  <video 
                    controls 
                    autoPlay 
                    className="w-full h-full object-cover"
                    poster={selectedMedia.thumbnail_path ? `http://localhost:8080/backend/${selectedMedia.thumbnail_path.replace('../', '')}` : selectedMedia.thumbnail}
                  >
                    <source src={selectedMedia.file_path ? `http://localhost:8080/backend/${selectedMedia.file_path.replace('../', '')}` : selectedMedia.src} type="video/webm" />
                    <source src={selectedMedia.file_path ? `http://localhost:8080/backend/${selectedMedia.file_path.replace('../', '')}` : selectedMedia.src} type="video/mp4" />
                    Your browser does not support video playback
                  </video>
                ) : (
                  <img 
                    src={selectedMedia.file_path ? `http://localhost:8080/backend/${selectedMedia.file_path.replace('../', '')}` : selectedMedia.src} 
                    alt={selectedMedia.title || 'Gallery image'}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Media Details */}
              {(selectedMedia.title || selectedMedia.description) && (
                <div className="p-4 bg-white">
                  {selectedMedia.title && (
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {selectedMedia.title}
                    </h3>
                  )}
                  {(selectedMedia.description || selectedMedia.alt) && (
                    <p className="text-gray-600 text-sm">
                      {selectedMedia.description || selectedMedia.alt}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes modalFadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .modal-container {
            padding: 1rem;
          }
          
          .modal-content {
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default GalleryWithFallback;
