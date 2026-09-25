import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, Plus, Calendar, Image as ImageIcon, X } from 'lucide-react';

export const ProgressPhotosView: React.FC = () => {
  const { progressPhotos, addProgressPhoto, profile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [photoType, setPhotoType] = useState<'front' | 'side' | 'back'>('front');
  const [notes, setNotes] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-400" />
            <span>Physique Transformation Photos</span>
          </h3>
          <p className="text-xs text-gray-400">Visual progress speaks louder than scale fluctuations</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Photos Grid */}
      {progressPhotos.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-gray-800 bg-gray-900/50">
          <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-300">No progress photos added yet</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Take consistent front, side, and back photos in the same lighting every 2-4 weeks.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-colors"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressPhotos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden shadow-md group"
            >
              <div className="aspect-[3/4] bg-gray-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] uppercase font-bold text-white">
                  {photo.photoType}
                </span>
                {photo.weightAtTime && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-orange-500/80 backdrop-blur-sm text-[10px] font-bold text-white">
                    {photo.weightAtTime} kg
                  </span>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{photo.title}</span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {photo.date}
                  </span>
                </div>
                {photo.notes && (
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1 italic">
                    "{photo.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
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
                <label className="text-xs text-gray-300 block mb-1">Select Photo File *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-orange-400 hover:file:bg-gray-700"
                  required
                />
              </div>

              {imagePreview && (
                <div className="w-28 h-36 rounded-xl overflow-hidden border border-gray-700 mx-auto">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Pose Angle</label>
                  <select
                    value={photoType}
                    onChange={(e) => setPhotoType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  >
                    <option value="front">Front View</option>
                    <option value="side">Side Profile</option>
                    <option value="back">Back Pose</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Weeks Cutting"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Fasted morning pump, daylight"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md"
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
