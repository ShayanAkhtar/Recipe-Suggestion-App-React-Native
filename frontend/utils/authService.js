import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../constant";

export const registerUser = async ({name, location, email, password}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location, email, password }),
        });
        return await response.json();
    } catch (error) {
        console.error("Registration error:", error);
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.token) {
            await AsyncStorage.setItem("authToken", data.token);
            await AsyncStorage.setItem("userId", data.userId);
        }
        return data;
    } catch (error) {
        console.error("Login error:", error);
    }
};

export const getToken = async () => {
    return await AsyncStorage.getItem("authToken");
};

export const getUserId = async () => {
    return await AsyncStorage.getItem("userId");
};

export const logoutUser = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userId");
};
