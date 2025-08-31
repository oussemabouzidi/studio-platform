// components/DashboardSection.jsx
import Link from 'next/link';

const DashboardSection = ({ bookings }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-2xl  border border-gray-500 border-t-white/30 border-l-white/30 p-6 md:p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white font-special-regular">My Bookings</h2>
        <div className="flex space-x-2">
          <button className="font-special-regular bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
            Upcoming
          </button>
          <button className="font-special-regular bg-gray-900 hover:bg-gray-700 text-gray-400 px-4 py-2 rounded-lg">
            Past
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-special-regular">No bookings yet</h3>
          <p className="text-gray-500 max-w-md mx-auto font-special-regular">
            You haven't booked any studio sessions. Start exploring studios to book your first session.
          </p>
          <Link href="/studios">
            <button className="font-special-regular mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
              Browse Studios
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.bookingId} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-850 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{booking.studio.name}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-900 text-green-300' 
                        : booking.status === 'pending' 
                          ? 'bg-yellow-900 text-yellow-300'
                          : booking.status === 'completed'
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-red-900 text-red-300'
                    }`}>
                      {/*{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}*/}
                    </span>
                    <span className="ml-3 text-gray-400">{booking.bookingDate} • {booking.bookingTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-white font-medium">${booking.service.price}</div>
                  <div className="flex space-x-2">
                    <Link href={`/studios/${booking.studio.id}`}>
                      <button className="font-special-regular text-sm bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
                        View Studio
                      </button>
                    </Link>
                    {booking.canCancel && (
                      <button className="font-special-regular text-sm bg-red-900 hover:bg-red-800 text-red-200 py-2 px-4 rounded-lg">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSection;