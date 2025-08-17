import api from "./api";

const fetchUserNickname = async () => {
  try {
    const { data } = await api.get("/users");

    return data.nickname;
  } catch (error) {
    console.error("Failed to fetch user nickname:", error);

    return null;
  }
};

export default fetchUserNickname;
