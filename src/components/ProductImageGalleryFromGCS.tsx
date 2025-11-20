'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface ProductImage {
  name: string;
  url: string;
  publicUrl: string;
  signedUrl?: string;
  contentType: string;
  size: number;
  updated: string;
  metadata?: Record<string, string>;
}

interface ProductImageGalleryFromGCSProps {
  folder?: string;
  sku?: string;
  category?: string;
  limit?: number;
  columns?: number;
  showImageName?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export default function ProductImageGalleryFromGCS({
  folder,
  sku,
  category,
  limit = 100,
  columns = 4,
  showImageName = false,
  aspectRatio = 'square',
}: ProductImageGalleryFromGCSProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, [folder, sku, category, limit]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (folder) params.set('folder', folder);
      if (sku) params.set('sku', sku);
      if (category) params.set('category', category);
      params.set('limit', limit.toString());
      params.set('signed', 'true');

      const response = await fetch(`/api/products/images?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load images');
      }

      setImages(data.images || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const getGridColumns = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2 md:grid-cols-4';
      case 5:
        return 'grid-cols-2 md:grid-cols-5';
      case 6:
        return 'grid-cols-2 md:grid-cols-6';
      default:
        return 'grid-cols-2 md:grid-cols-4';
    }
  };

  const getAspectRatio = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  const getImageName = (fullPath: string) => {
    const parts = fullPath.split('/');
    return parts[parts.length - 1];
  };

  if (loading) {
    return (
      <div className="grid gap-4 w-full" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className={`${getAspectRatio()} animate-pulse bg-alumimundo-light`} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 mb-2">⚠️ Error Loading Images</div>
        <p className="text-sm text-alumimundo-gray">{error}</p>
        <button
          onClick={fetchImages}
          className="mt-4 px-4 py-2 bg-alumimundo-navy text-white rounded-full hover:bg-alumimundo-teal transition-colors"
        >
          Retry
        </button>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-alumimundo-gray mb-2">📁 No Images Found</div>
        <p className="text-sm text-alumimundo-slate">
          {folder && `No images found in folder: ${folder}`}
          {sku && `No images found for SKU: ${sku}`}
          {category && `No images found in category: ${category}`}
          {!folder && !sku && !category && 'No images found in bucket'}
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className={`grid ${getGridColumns()} gap-4 w-full`}>
        {images.map((image, index) => (
          <Card
            key={image.name}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => setSelectedImage(image)}
          >
            <div className={`relative ${getAspectRatio()} bg-alumimundo-light`}>
              <Image
                src={image.signedUrl || image.publicUrl}
                alt={getImageName(image.name)}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                unoptimized
              />
            </div>
            {showImageName && (
              <div className="p-2 bg-white">
                <p className="text-xs text-alumimundo-charcoal truncate">
                  {getImageName(image.name)}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage.signedUrl || selectedImage.publicUrl}
                alt={getImageName(selectedImage.name)}
                fill
                className="object-contain"
                sizes="90vw"
                unoptimized
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
              <p className="font-medium">{getImageName(selectedImage.name)}</p>
              <p className="text-sm text-gray-300">
                {(selectedImage.size / 1024).toFixed(2)} KB •{' '}
                {new Date(selectedImage.updated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
