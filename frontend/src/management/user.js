import axios from "axios";

export async function createUser(newUser) {
  if (!isValidUser(newUser)) {
    return { success: false, message: "Please enter all the required fields" };
  }
  try {
    const { data } = await axios.post("/api/users/signup", newUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      success: true,
      message: data?.message || "Your account has been created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
}

function isValidUser(newUser) {
  return newUser.name && newUser.username && newUser.email && newUser.password;
}

export async function getUser(id) {
  try {
    const { data } = await axios.get(`/api/users/${id}`);
    if (!data.success)
      return { success: false, message: data.message, data: data.data };
    return { success: true, message: data.message, data: data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
}

export async function checkPassword(passwords) {
  try {
    const { data } = await axios.post("/api/users/check-password", passwords, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data.success) return { success: false, message: data.message };
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong.",
    };
  }
}
