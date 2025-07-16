import axios from "axios";
const API_URL = "/api/timetable";

const getTimetableByParentId = async (parentId) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/by-parent/${parentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(res.data);
  return res.data;
};

export default { getTimetableByParentId };
