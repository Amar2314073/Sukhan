import { useState } from 'react';

const UserForm = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    avatar: user.avatar || '',
    preferredLanguage: user.preferredLanguage || 'hindi',
    notificationSettings: user.notificationSettings || {
      emailNotifications: true,
      newContentAlerts: true
    }
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between">
          <h2 className="text-xl font-serif">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          <input
            className="w-full bg-gray-800 px-4 py-2 rounded-lg"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            rows={3}
            className="w-full bg-gray-800 px-4 py-2 rounded-lg"
            placeholder="Bio"
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
          />

          <input
            className="w-full bg-gray-800 px-4 py-2 rounded-lg"
            placeholder="Location"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />

          <select
            className="w-full bg-gray-800 px-4 py-2 rounded-lg"
            value={form.preferredLanguage}
            onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}
          >
            <option value="hindi">Hindi</option>
            <option value="roman">Roman</option>
          </select>

          <input type="text"  
            className="w-full bg-base-100 px-4 py-2 rounded-lg text-base-content"
            placeholder="Image URL"
            value={form.avatar}
            onChange={e => setForm({ ...form, avatar: e.target.value })}
          />

          {/* Avatar Preview */}
          {form.avatar && (
            <div className="flex items-center gap-4 mt-2">
              <img
                src={form.avatar}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border border-base-300"
                onError={(e) => {
                  e.target.src = '';
                }}
              />
              <p className="text-sm text-base-content/60">
                Preview
              </p>
            </div>
          )}


          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.notificationSettings.emailNotifications}
              onChange={e =>
                setForm({
                  ...form,
                  notificationSettings: {
                    ...form.notificationSettings,
                    emailNotifications: e.target.checked
                  }
                })
              }
            />
            Email notifications
          </label>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.notificationSettings.newContentAlerts}
              onChange={e =>
                setForm({
                  ...form,
                  notificationSettings: {
                    ...form.notificationSettings,
                    newContentAlerts: e.target.checked
                  }
                })
              }
            />
            New content alerts
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-800 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 bg-white text-black rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
