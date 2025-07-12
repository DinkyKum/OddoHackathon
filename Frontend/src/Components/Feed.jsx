import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  const handleFeed = async () => {
    // Fetch only if feed is null or undefined
    if (!feed || feed.length === 0) {
      try {
        const response = await axios.get(BASE_URL + '/user/feed', { withCredentials: true });
        dispatch(addFeed(response.data));
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    handleFeed();
  }, []);

  if (!feed) return null;

  const publicFeed = feed.filter((user) => user.visibility === 'public');
  const totalPages = Math.ceil(publicFeed.length / cardsPerPage);

  if (publicFeed.length === 0)
    return <h1 className="text-center mt-8 text-xl font-semibold">No public feed available</h1>;

  // Slice users for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = publicFeed.slice(indexOfFirstCard, indexOfLastCard);
  const emptySlots = cardsPerPage - currentCards.length;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      
      {/* Card Grid */}
      <div className="justify-center flex flex-wrap gap-4 min-h-[450px]">
        {currentCards.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}

        {/* Optional Empty Card Placeholders */}
        {[...Array(emptySlots)].map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="w-[48rem] h-[14rem] bg-transparent border-2 border-transparent rounded-3xl"
          ></div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-1 rounded bg-gray-700 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-1 rounded bg-gray-700 text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Feed;
