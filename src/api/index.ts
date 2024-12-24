import { Book, BookListResponse, BookResponse } from '../type/book';
const BASE_URL = 'http://localhost:4000';

// 서버에서 모든 책 데이터 가져오기
export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${BASE_URL}/books`);
  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.statusText}`);
  }
  const data: BookListResponse = await response.json();
  return data.data;
};

// 서버에서 특정 책 데이터 가져오기
export const fetchBookDetail = async (
  id: number
): Promise<Book | { error: string | null; time: string }> => {
  const response = await fetch(`${BASE_URL}/books/${id}`);

  const data: BookResponse = await response.json();
  if (!response.ok) {
    return { error: data.error, time: data.time };
  }
  return data.data;
};

// 책 데이터 업데이트 하기
export const updateBook = async (
  id: number,
  review: Book['review']
): Promise<Book | { error: string | null; time: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ review }),
    });
    const data: BookResponse = await response.json();
    if (!response.ok) {
      return { error: data.error, time: data.time };
    }
    return data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw new Error(`Failed to fetch Book ${id}`);
  }
};

// 새로운 책 추가하기
export const addBook = async (
  title: string,
  description: string,
  genre: string,
  coverImage: string
): Promise<Book | { error: string | null; time: string }> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, genre, coverImage }),
    });
    const data: BookResponse = await response.json();
    if (!response.ok) {
      return { error: data.error, time: data.time };
    }
    return data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw new Error(`Failed to add Book`);
  }
};
