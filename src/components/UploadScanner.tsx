import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Camera, Upload, RefreshCw, Check, AlertTriangle, Crop, Sparkles, X, ZoomIn, ZoomOut, Utensils, Ban } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoProducts';
import { LabelAnalysisResult } from '../types';
import { ProductSearch } from './ProductSearch';
import { checkIsNonEdible } from '../utils/foodValidator';

interface UploadScannerProps {
  onAnalyzeImage: (base64Image: string, mimeType: string) => void;
  onSelectDemo: (demo: LabelAnalysisResult) => void;
  isLoading: boolean;
  onCancel?: () => void;
}

export const UploadScanner: React.FC<UploadScannerProps> = ({
  onAnalyzeImage,
  onSelectDemo,
  isLoading,
  onCancel
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [nonEdibleError, setNonEdibleError] = useState<string | null>(null);
  
  // Interactive cropping / framing controls
  const [isCropMode, setIsCropMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cropBox, setCropBox] = useState({ top: 10, left: 10, width: 80, height: 80 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser. Please use the file upload option.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err?.message || 'Could not access camera. Please upload an image file directly.');
      setIsCameraActive(false);
      // Trigger native file capture fallback
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedImage(dataUrl);
      setMimeType('image/jpeg');
      stopCamera();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setNonEdibleError(null);
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, or WEBP)');
      return;
    }

    // Security & resource check: enforce 10MB maximum file upload size
    if (file.size > 10 * 1024 * 1024) {
      alert('The selected image exceeds the 10MB size limit. Please choose a smaller photo.');
      return;
    }

    // Pre-screen filename for obvious non-edible indicators (e.g., iphone.jpg, plastic_bottle.png, shoes.webp)
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const check = checkIsNonEdible(baseName);
    if (check.isNonEdible) {
      setNonEdibleError(
        `Cannot scan non-edible item: "${file.name}" was identified as a non-food item (${check.matchedCategory}). LabelLens only scans and analyzes edible food and beverage packages.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Perform crop by drawing selected region onto canvas
  const applyCropAndAnalyze = () => {
    if (!selectedImage) return;

    if (!isCropMode) {
      onAnalyzeImage(selectedImage, mimeType);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const sx = (cropBox.left / 100) * img.naturalWidth;
      const sy = (cropBox.top / 100) * img.naturalHeight;
      const sWidth = (cropBox.width / 100) * img.naturalWidth;
      const sHeight = (cropBox.height / 100) * img.naturalHeight;

      canvas.width = sWidth;
      canvas.height = sHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
        const croppedBase64 = canvas.toDataURL(mimeType, 0.92);
        onAnalyzeImage(croppedBase64, mimeType);
      } else {
        onAnalyzeImage(selectedImage, mimeType);
      }
    };
    img.src = selectedImage;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-stone-100">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-display flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-600" />
            Scan Food Label
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Capture or upload a clear photo of the Nutrition Facts & Ingredients panel.
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Non-Edible File Rejection Warning */}
      {nonEdibleError && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start justify-between gap-3 text-xs leading-relaxed animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-amber-200 text-amber-800 shrink-0 mt-0.5">
              <Ban className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <span className="font-bold text-amber-900 block text-sm">Non-Edible Object Detected</span>
              <p className="text-amber-800 mt-0.5">{nonEdibleError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNonEdibleError(null)}
            className="p-1 text-amber-600 hover:text-amber-900 rounded-lg hover:bg-amber-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Strict Edibility Notice */}
      <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950 flex items-start gap-3 text-xs leading-relaxed">
        <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
          <Utensils className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-emerald-900 block">Strictly Edible Foods & Beverages Only</span>
          <span className="text-emerald-800">
            LabelLens is engineered exclusively for packaged food items, groceries, snacks, and drinks. Non-edible objects (such as phones, electronics, plastics, clothing, hardware, or cleaning chemicals) are strictly rejected.
          </span>
        </div>
      </div>

      {/* Hidden file input supporting environment camera capture */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Live Stream View */}
      {isCameraActive ? (
        <div className="mt-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border-2 border-emerald-500 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Overlay target frame for guiding alignment */}
            <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between">
                <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
                <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
              </div>
              <p className="text-center text-xs font-semibold text-emerald-200 bg-black/60 py-1 px-3 rounded-full mx-auto backdrop-blur-xs">
                Align Nutrition Facts & Ingredients inside this box
              </p>
              <div className="flex justify-between">
                <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-300" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-100"
            >
              Cancel Camera
            </button>
            <button
              onClick={capturePhoto}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-500 flex items-center gap-2 active:scale-95 transition-transform"
            >
              <Camera className="w-4 h-4" />
              Snap Photo
            </button>
          </div>
        </div>
      ) : selectedImage ? (
        /* Image Preview & Crop Stage */
        <div className="mt-6 space-y-5">
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 aspect-4/3 flex items-center justify-center max-h-[460px]">
            <img
              src={selectedImage}
              alt="Uploaded Food Label"
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Interactive Crop Outline when in crop mode */}
            {isCropMode && (
              <div 
                className="absolute border-2 border-emerald-400 bg-emerald-500/10 rounded-lg pointer-events-none shadow-outline"
                style={{
                  top: `${cropBox.top}%`,
                  left: `${cropBox.left}%`,
                  width: `${cropBox.width}%`,
                  height: `${cropBox.height}%`,
                }}
              >
                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Label Area Focus
                </span>
              </div>
            )}
          </div>

          {/* Framing / Zoom toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCropMode(!isCropMode)}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  isCropMode ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                {isCropMode ? 'Crop Region Active' : 'Focus / Crop Label'}
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
                className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-stone-500 font-mono">{Math.round(zoomLevel * 100)}%</span>
            </div>

            <button
              onClick={() => {
                setSelectedImage(null);
                setIsCropMode(false);
                setZoomLevel(1);
              }}
              className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake / Choose Another
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedImage(null);
                setIsCropMode(false);
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-100"
            >
              Cancel
            </button>

            <button
              id="analyze-label-submit-btn"
              onClick={applyCropAndAnalyze}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-2 active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isLoading ? 'Analyzing Label...' : 'Extract & Standardize Nutrition'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Upload & Dropzone Choice Area */
        <div className="mt-6 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
                : 'border-stone-300 hover:border-emerald-400 bg-stone-50/60 hover:bg-emerald-50/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <Upload className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 font-display">
              Upload Food Label Photo
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              Drag & drop your photo here, or click to browse files. Supports JPG, PNG, and WEBP.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50"
              >
                Select Photo File
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-500 flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                Use Camera
              </button>
            </div>
          </div>

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Search Product Option Below Scan Label */}
          <div className="pt-4 border-t border-stone-100">
            <ProductSearch onSelectProduct={onSelectDemo} compact />
          </div>
        </div>
      )}
    </div>
  );
};
