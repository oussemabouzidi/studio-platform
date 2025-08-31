import { FaHeart } from 'react-icons/fa';

const FavoritesLink = () => {
  return (
    <div className="relative ml-3">
      <div className="flex items-center">
          <a href="profile/favorite" className="flex items-center text-sm rounded-2xl focus:outline-none group relative">
            <div className="bg-gray-800/30 backdrop-blur-lg p-1 pl-3 pr-3 rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] shadow-2xl transition-all duration-300">
              <div className="rounded-2xl p-2 flex items-center justify-center w-10 h-10">
                <FaHeart className="text-gray-200 group-hover:text-red-400 text-lg transition-colors duration-300" />
              </div>
            </div>
          </a>
      </div>
    </div>
  );
};

export default FavoritesLink;