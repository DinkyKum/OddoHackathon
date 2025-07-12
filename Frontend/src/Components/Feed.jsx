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

  // Filter states
  const [timeAvailabilityFilter, setTimeAvailabilityFilter] = useState('');
  const [dayAvailabilityFilter, setDayAvailabilityFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const cardsPerPage = 3;

  const handleFeed = async () => {
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

  const publicFeed = (feed || []).filter(user => user.visibility === 'public');

  const filteredFeed = publicFeed.filter(user => {
    const matchesTimeAvailability = timeAvailabilityFilter
      ? user.timeAvailability === timeAvailabilityFilter
      : true;

    const matchesDayAvailability = dayAvailabilityFilter
      ? user.dayAvailability?.includes(dayAvailabilityFilter)
      : true;

    const matchesSearch = searchTerm.trim() === ''
      ? true
      : (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.about?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTimeAvailability && matchesDayAvailability && matchesSearch;
  });

  const totalPages = Math.ceil(filteredFeed.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredFeed.slice(indexOfFirstCard, indexOfLastCard);
  const emptySlots = cardsPerPage - currentCards.length;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTimeChange = (e) => {
    setTimeAvailabilityFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDayChange = (e) => {
    setDayAvailabilityFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col items-center mt-6 w-full">
      
      {/* Filters Bar */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {/* Time Availability Dropdown */}
        <select
          value={timeAvailabilityFilter}
          onChange={handleTimeChange}
          className="px-4 py-1 rounded bg-base-200  text-white border border-white"
        >
          <option value="">Time Availability</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="full time">Full Time</option>
        </select>

        {/* Day Availability Dropdown */}
        <select
          value={dayAvailabilityFilter}
          onChange={handleDayChange}
          className="px-4 py-1 rounded bg-base-200  text-white border border-white"
        >
          <option value="">Day Availability</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>

        {/* Search Input */}
        <div className="flex">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-1 rounded-l bg-[#1f1f1f] text-white border border-white outline-none"
          />
          <button className="px-3 py-1 bg-white text-black font-semibold rounded-r cursor-default">
            Search
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="justify-center flex flex-wrap gap-4 min-h-[450px]">
        {currentCards.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}

        {[...Array(emptySlots)].map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="w-[48rem] h-[14rem] bg-transparent border-2 border-transparent rounded-3xl"
          ></div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredFeed.length > 0 && (
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
      )}
    </div>
  );
};

export default Feed;
