import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(user.name || "");
  const [gender, setGender] = useState(user.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [location, setLocation] = useState(user.location || "");
  const [skillsWantedList, setSkillsWantedList] = useState(user.skillsWanted || []);
  const [skillsOfferedList, setSkillsOfferedList] = useState(user.skillsOffered || []);
  const [availabilityDays, setAvailabilityDays] = useState(user.availabilityDays || "Weekdays");
  const [availabilityTimes, setAvailabilityTimes] = useState(user.availabilityTimes || "Morning");
  const [visibility, setVisibility] = useState((user.visibility || "Public").toLowerCase());
  const [showToast, setShowToast] = useState(false);
  const [skillInputWanted, setSkillInputWanted] = useState("");
  const [skillInputOffered, setSkillInputOffered] = useState("");

  const handleSkillAdd = (type) => {
    const value = type === "wanted" ? skillInputWanted.trim() : skillInputOffered.trim();
    if (!value) return;

    const setter = type === "wanted" ? setSkillsWantedList : setSkillsOfferedList;
    const list = type === "wanted" ? skillsWantedList : skillsOfferedList;
    if (!list.includes(value)) {
      setter([...list, value]);
    }

    type === "wanted" ? setSkillInputWanted("") : setSkillInputOffered("");
  };

  const removeSkill = (type, index) => {
    const list = type === "wanted" ? skillsWantedList : skillsOfferedList;
    const setter = type === "wanted" ? setSkillsWantedList : setSkillsOfferedList;
    setter(list.filter((_, i) => i !== index));
  };

  const editProfile = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/profile/edit`,
        {
          name,
          gender,
          photoUrl,
          about,
          location,
          skillsWanted: skillsWantedList,
          skillsOffered: skillsOfferedList,
          availabilityDays,
          availabilityTimes,
          visibility: visibility.toLowerCase(),
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const labelClass = "w-44 text-base font-medium text-white";
  const inputClass = "w-60 text-sm border-b border-gray-400 focus:outline-none focus:border-white bg-transparent py-1 text-white placeholder-gray-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-8 py-12">
      <div className="bg-gray-700 rounded-lg p-10 w-full max-w-5xl">
        <div className="flex justify-between">
          <div className="w-2/3 max-w-3xl">
            <div className="flex items-center mb-5">
              <label className={labelClass}>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-center mb-5">
              <label className={labelClass}>Photo URL</label>
              <input type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-center mb-5">
              <label className={labelClass}>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-center mb-5">
              <label className={labelClass}>Gender</label>
              <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="w-1/3 flex justify-center -mt-4">
            {photoUrl && (
              <div className="avatar">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white">
                  <img src={photoUrl} alt="Profile" className="object-cover w-full h-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-20 mt-10">
          <div className="w-1/2">
            <label className={labelClass + " mb-1 inline-block"}>Skills Wanted</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsWantedList.map((skill, index) => (
                <div key={index} className="bg-gray-200 rounded-full px-3 py-1 flex items-center">
                  <span className="text-sm">{skill}</span>
                  <button className="ml-2 text-xs" onClick={() => removeSkill("wanted", index)}>✕</button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={skillInputWanted}
              onChange={(e) => setSkillInputWanted(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSkillAdd("wanted")}
              className={inputClass}
              placeholder="Type and press Enter"
            />
          </div>
          <div className="w-1/2">
            <label className={labelClass + " mb-1 inline-block"}>Skills Offered</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skillsOfferedList.map((skill, index) => (
                <div key={index} className="bg-gray-200 rounded-full px-3 py-1 flex items-center">
                  <span className="text-sm">{skill}</span>
                  <button className="ml-2 text-xs" onClick={() => removeSkill("offered", index)}>✕</button>
                </div>
              ))}
            </div>
            <input
              type="text"
              value={skillInputOffered}
              onChange={(e) => setSkillInputOffered(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSkillAdd("offered")}
              className={inputClass}
              placeholder="Type and press Enter"
            />
          </div>
        </div>

        <div className="flex gap-20 mt-5">
          <div className="flex items-center w-1/2">
            <label className={labelClass}>Availability (Days)</label>
            <select className={inputClass} value={availabilityDays} onChange={(e) => setAvailabilityDays(e.target.value)}>
              <option>Weekdays</option>
              <option>Weekends</option>
            </select>
          </div>
          <div className="flex items-center w-1/2">
            <label className={labelClass}>Availability (Time)</label>
            <select className={inputClass} value={availabilityTimes} onChange={(e) => setAvailabilityTimes(e.target.value)}>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
          </div>
        </div>

        <div className="flex items-start mt-5">
          <label className={labelClass + " pt-2"}>About</label>
          <textarea className={inputClass + " h-24"} value={about} onChange={(e) => setAbout(e.target.value)} />
        </div>

        <div className="flex items-center mt-5">
          <label className={labelClass}>Profile Visibility</label>
          <div className="flex gap-4">
            {['Public', 'Private'].map((type) => (
              <label key={type} className="label cursor-pointer text-white">
                <input type="radio" name="visibility" value={type.toLowerCase()} checked={visibility === type.toLowerCase()} onChange={(e) => setVisibility(e.target.value)} className="radio" />
                <span className="label-text ml-2 text-sm text-white">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <label className="w-44" />
          <button className="btn btn-primary" onClick={editProfile}>Save</button>
        </div>

        {showToast && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-info">
              <span>Profile Saved Successfully</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;