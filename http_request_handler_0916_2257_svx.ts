// 代码生成时间: 2025-09-16 22:57:17
import axios, { AxiosError, AxiosResponse } from 'axios';

// Define custom error types for better type checking
class HttpRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HttpRequestError';
  }
}

// The HttpRequestHandler class
class HttpRequestHandler {
  // Base URL for API requests
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Generic GET request method
  public async get<T>(endpoint: string): Promise<T> {
    try {
      // Make the GET request
      const response: AxiosResponse<T> = await axios.get<T>(`${this.baseUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      throw new HttpRequestError((error as AxiosError).message);
    }
  }

  // Generic POST request method
  public async post<T>(endpoint: string, payload: any): Promise<T> {
    try {
      // Make the POST request
      const response: AxiosResponse<T> = await axios.post<T>(`${this.baseUrl}${endpoint}`, payload);
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      throw new HttpRequestError((error as AxiosError).message);
    }
  }

  // Additional methods such as PUT, DELETE, etc., can be added as needed.
}

// Example usage of HttpRequestHandler
// const apiClient = new HttpRequestHandler('https://api.example.com/');
// apiClient.get('users').then(data => console.log(data)).catch(error => console.error(error));