export enum Genre {
  Fiction = 'Fiction',
  Mystery = 'Mystery',
  Romance = 'Romance',
  Fantasy = 'Fantasy',
  ScienceFiction = 'Science Fiction',
  Biography = 'Biography',
  SelfHelp = 'Self-Help',
}
export type Book = {
  id: number;
  title: string;
  description: string;
  read: boolean;
  genre: Genre;
  coverImage: string;
  review: string;
};

export type BookListResponse = {
  time: string;
  error: string | null;
  data: Book[];
};

export type BookResponse = {
  time: string;
  error: string | null;
  data: Book;
};
