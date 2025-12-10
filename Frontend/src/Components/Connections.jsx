import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // form data
  const [type, setType] = useState("pay");
  const [skillToLearn, setSkillToLearn] = useState("");
  const [skillToTeach, setSkillToTeach] = useState("");
  const [fee, setFee] = useState("");

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0) return <h1>No Connections</h1>;

  const openPopup = (teacher) => {
    setSelectedTeacher(teacher);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setType("pay");
    setSkillToLearn("");
    setSkillToTeach("");
    setFee("");
  };

  const handleSubmit = async () => {
    try {
      const body = {
        teacherId: selectedTeacher._id,
        type,
        skillToLearn,
        skillToTeach: type === "swap" ? skillToTeach : undefined,
        fee: type === "pay" ? fee : undefined,
      };

      const res = await axios.post(BASE_URL + "/course/create", body, {
        withCredentials: true,
      });

      alert("Course created successfully!");
      closePopup();
    } catch (err) {
      console.log(err);
      alert("Error: " + err.response?.data);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold m-5">Connections</h1>

      {connections.map((connection) => {
        const { _id, name, gender, about, photoUrl } = connection;
        return (
          <div
            key={_id}
            className="flex items-center w-1/2 bg-base-300 m-2 gap-7 p-5 rounded-lg shadow-md"
          >
            <div>
              <img
                src={photoUrl}
                alt="Photo"
                className="w-20 h-20 rounded-full ml-3 object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-bold text-lg">{name}</p>
              <p>Gender: {gender}</p>
              <p>{about}</p>
            </div>

            {/* Start Learning Button */}
            <button
              onClick={() => openPopup(connection)}
              className="btn btn-primary px-4 py-2 rounded-lg text-white"
            >
              Start Learning
            </button>
          </div>
        );
      })}

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 p-7 rounded-xl w-96 shadow-lg">

            <h2 className="text-xl font-bold mb-4 text-center">
              Start Learning with {selectedTeacher?.name}
            </h2>

            {/* Select Pay or Swap */}
            <label className="font-semibold">Choose Learning Type</label>
            <select
              className="select select-bordered w-full mt-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="pay">Pay & Learn</option>
              <option value="swap">Swap Skills</option>
            </select>

            {/* Skill To Learn */}
            <label className="font-semibold mt-4 block">Skill You Want to Learn</label>
            <input
              type="text"
              className="input input-bordered w-full mt-1"
              value={skillToLearn}
              onChange={(e) => setSkillToLearn(e.target.value)}
              placeholder="Skill to learn"
            />

            {/* PAY UI */}
            {type === "pay" && (
              <>
                <label className="font-semibold mt-4 block">
                  Amount You Will Pay
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full mt-1"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="Enter amount"
                />
              </>
            )}

            {/* SWAP UI */}
            {type === "swap" && (
              <>
                <label className="font-semibold mt-4 block">
                  Skill You Will Teach
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full mt-1"
                  value={skillToTeach}
                  onChange={(e) => setSkillToTeach(e.target.value)}
                  placeholder="Skill to teach"
                />
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={closePopup}
                className="btn bg-gray-500 text-white rounded-lg px-4"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="btn btn-primary text-white rounded-lg px-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
