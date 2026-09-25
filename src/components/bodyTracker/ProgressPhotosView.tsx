import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressPhoto } from '../../types/bodyTracker';
import {
  Camera,
  Plus,
  Calendar,
  Image as ImageIcon,
  X,
  ArrowRightLeft,
  Columns,
  Scale,
  Sparkles
} from 'lucide-react';

export const ProgressPhotosView: React.FC = () => {
  const { progressPhotos, addProgressPhoto, profile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back'>('front');
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  // Comparison State
  const [beforePhotoId, setBeforePhotoId] = useState<string>(progressPhotos[0]?.id || '');
  const [afterPhotoId, setAfterPhotoId] = useState<string>(progressPhotos[progressPhotos.length - 1]?.id || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Please select an image file');
      return;
    }

    addProgressPhoto({
      title: title.trim() || `${photoType.toUpperCase()} Pose`,
      photoType,
      imageUrl: imagePreview,
      notes: notes.trim() || undefined
    });

    setIsModalOpen(false);
    setImagePreview('');
    setTitle('');
    setNotes('');
  };

  const beforePhoto = progressPhotos.find(p => p.id === beforePhotoId) || progressPhotos[0];
  const afterPhoto = progressPhotos.find(p => p.id === afterPhotoId) || progressPhotos[progressPhotos.length - 1];

  // Calculate day difference & weight delta if available
  const dayDifference = beforePhoto && afterPhoto
    ? Math.round((new Date(afterPhoto.date).getTime() - new Date(beforePhoto.date).getTime()) / (1000 * 3600 * 24))
    : 0;

  const weightDelta = beforePhoto?.weightAtTime && afterPhoto?.weightAtTime
    ? parseFloat((afterPhoto.weightAtTime - beforePhoto.weightAtTime).toFixed(1))
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-400" />
            <span>Physique Transformation Photos</span>
          </h3>
          <p className="text-xs text-gray-400">Visual progress speaks louder than scale fluctuations</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {progressPhotos.length >= 2 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gray-800 hover:bg-gray-750 border border-gray-700 text-cyan-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Compare Before/After</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      {progressPhotos.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-gray-800 bg-gray-900/50 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-850 text-gray-500 mx-auto flex items-center justify-center border border-gray-800">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200">No transformation photos uploaded yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Take consistent front, side, and back photos in the same lighting every 2-4 weeks to capture true hypertrophy and fat loss.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressPhotos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-3xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-md group hover:border-gray-700 transition-all flex flex-col justify-between"
            >
              <div className="aspect-[3/4] bg-gray-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[10px] uppercase font-bold text-white border border-white/10">
                  {photo.photoType}
                </span>
                {photo.weightAtTime && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-orange-500/85 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
                    {photo.weightAtTime} kg
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{photo.title}</span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-orange-400" /> {photo.date}
                  </span>
                </div>
                {photo.notes && (
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1 italic">
                    &ldquo;{photo.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareOpen && beforePhoto && afterPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col p-5 sm:p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Columns className="w-4 h-4 text-cyan-400" />
                  <span>Before vs After Physique Comparison</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Comparing {dayDifference > 0 ? `${dayDifference} days of transformation` : 'same day photos'}
                  {weightDelta !== null && ` • ${weightDelta > 0 ? `+${weightDelta}` : weightDelta} kg`}
                </p>
              </div>
              <button onClick={() => setIsCompareOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Before Photo (Start)</label>
                <select
                  value={beforePhotoId}
                  onChange={(e) => setBeforePhotoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none"
                >
                  {progressPhotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} - {p.title} ({p.photoType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">After Photo (Current)</label>
                <select
                  value={afterPhotoId}
                  onChange={(e) => setAfterPhotoId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none"
                >
                  {progressPhotos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.date} - {p.title} ({p.photoType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Side by Side Preview */}
            <div className="grid grid-cols-2 gap-4">
              {/* Before Card */}
              <div className="rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 relative">
                <div className="aspect-[3/4] relative">
                  <img src={beforePhoto.imageUrl} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-sm text-[10px] uppercase font-black text-rose-400 border border-rose-500/30">
                    BEFORE
                  </span>
                  {beforePhoto.weightAtTime && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white">
                      {beforePhoto.weightAtTime} kg
                    </span>
                  )}
                </div>
                <div className="p-2 text-center text-xs text-gray-400 bg-gray-900 border-t border-gray-800">
                  {beforePhoto.date}
                </div>
              </div>

              {/* After Card */}
              <div className="rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 relative">
                <div className="aspect-[3/4] relative">
                  <img src={afterPhoto.imageUrl} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-sm text-[10px] uppercase font-black text-emerald-400 border border-emerald-500/30">
                    AFTER
                  </span>
                  {afterPhoto.weightAtTime && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-emerald-500/90 text-[10px] font-bold text-white">
                      {afterPhoto.weightAtTime} kg
                    </span>
                  )}
                </div>
                <div className="p-2 text-center text-xs text-gray-400 bg-gray-900 border-t border-gray-800">
                  {afterPhoto.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="text-base font-bold text-white">Add Progress Photo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Select Photo File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-orange-400 hover:file:bg-gray-750"
                  required
                />
              </div>

              {imagePreview && (
                <div className="w-28 h-36 rounded-2xl overflow-hidden border border-gray-700 mx-auto shadow-md">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Pose Angle</label>
                  <select
                    value={photoType}
                    onChange={(e) => setPhotoType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none"
                  >
                    <option value="front">Front View (चेस्ट / एब्स)</option>
                    <option value="side">Side Profile</option>
                    <option value="back">Back Pose (लैट्स)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Week 8 Morning"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Notes / Cues</label>
                <input
                  type="text"
                  placeholder="e.g. Fasted morning lighting, feeling tight"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
