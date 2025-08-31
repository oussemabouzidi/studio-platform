// components/ReviewsSection.jsx
import Link from 'next/link';

const ReviewsSection = ({ reviews }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special-regular">My Reviews</h2>
        <div className="flex space-x-2">
          <button className="font-special-regular bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
            Recent
          </button>
          <button className="font-special-regular bg-gray-900 hover:bg-gray-700 text-gray-400 px-4 py-2 rounded-lg">
            All
          </button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-special-regular">No reviews yet</h3>
          <p className="text-gray-500 max-w-md mx-auto font-special-regular">
            You haven't reviewed any studios. After your booking is completed, you can leave a review.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, reviewIndex) => (
  <div 
    key={`review-${reviewIndex}`}   // ✅ always unique
    className="bg-gray-900 rounded-xl p-6 hover:bg-gray-850 transition-colors"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white font-special-regular">{review.studioName}</h3>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={`review-${reviewIndex}-star-${i}`}   // ✅ nested keys unique
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-700'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <span className="text-gray-500 text-sm font-special-regular">
        {new Date(review.date).toLocaleDateString("en-CA")}
      </span>
    </div>

    <p className="text-gray-400 mb-6 font-special-regular">{review.comment}</p>
    
    <div className="flex space-x-3">
      <Link href={`/studios/${review.studioId}`}>
        <button className="font-special-regular text-sm bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
          View Studio
        </button>
      </Link>
      <button className="font-special-regular text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
        Edit Review
      </button>
      <button className="font-special-regular text-sm bg-gray-900 hover:bg-gray-800 text-gray-400 py-2 px-4 rounded-lg">
        Delete
      </button>
    </div>
  </div>
))}


        </div>
      )}
    </div>
  );
};

export default ReviewsSection;