import { FiEdit2 } from "react-icons/fi";

interface UserProfile {
  email: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
}

interface ProfileDisplayProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileDisplay({ profile, onEdit }: ProfileDisplayProps) {
  return (
    <section className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 relative">
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
      >
        <FiEdit2 className="w-4 h-4" />
        <span className="text-sm">Edit</span>
      </button>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt="Profile"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover bg-gray-200"
          />
          <div className="text-center md:text-left">
            <h3 className="text-lg text-gray-800">{profile.nickname}</h3>
            <p className="text-gray-600 md:mt-1">{profile.email}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
        </div>
      </div>
    </section>
  );
}
