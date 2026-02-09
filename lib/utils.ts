import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"

const API_URL = process.env.NEXT_PUBLIC_API_URL

console.log(API_URL)


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


export const showToaster = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
  toast(message, { type });
};