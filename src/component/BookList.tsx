import React, { useEffect, useState } from 'react';
import BookDetailModal from './BookDetailModal.tsx';
import { Book } from '../type/book.ts';
import { fetchBooks, updateBook } from '../api/index.ts';

type BookPreview = Pick<Book, 'id' | 'title' | 'coverImage'>;

type ReadStatus = 'Read' | 'Unread' | 'All';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<ReadStatus>('All');
  const [isDataChanged, setIsDataChanged] = useState(false);

  useEffect(() => {
    const fetchAndSetBooks = async () => {
      try {
        const data = await fetchBooks();
        if (data) {
          const updatedBooks = data.map((book: Book) => ({
            ...book,
            read: book.read,
          }));
          setBooks(updatedBooks);
        } else {
          console.error('Failed to fetch books or received undefined');
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      }
    };

    fetchAndSetBooks();
    setIsDataChanged(false);
  }, [isDataChanged]);

  const toggleBookReadStatus = async (id: number) => {
    let readStatus;

    const updatedBooks = books.map((book) => {
      if (book.id === id) readStatus = !book.read;
      return book.id === id ? { ...book, read: !book.read } : book;
    });

    setBooks(updatedBooks);

    try {
      await updateBook(id, '', readStatus);
    } catch (error) {
      console.error(error);
      alert('읽음 상태를 갱신하는 데 실패했습니다. 다시 시도해주세요.');
    }
  };

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const getFilteredBooks = (status: ReadStatus) => {
    if (status === 'All') return books;
    return books.filter((book) => (status === 'Read' ? book.read : !book.read));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>독서 목록</h1>
      <div style={styles.buttonGroup}>
        {['All', 'Read', 'Unread'].map((status, index) => (
          <button
            key={index}
            onClick={() => setFilterStatus(status as ReadStatus)}
            style={{
              ...styles.button,
              backgroundColor: filterStatus === status ? '#007BFF' : '#f0f0f0',
              color: filterStatus === status ? '#fff' : '#000',
            }}
          >
            {status === 'Read'
              ? '읽은 책만 보기'
              : status === 'Unread'
              ? '읽지 않은 책만 보기'
              : '모든 책 보기'}
          </button>
        ))}
      </div>
      <ul style={styles.list}>
        {getFilteredBooks(filterStatus).map((book) => {
          const bookPreview: BookPreview = {
            id: book.id,
            title: book.title,
            coverImage: book.coverImage,
          };
          return (
            <li key={bookPreview.id} style={styles.listItem}>
              <input
                type='checkbox'
                checked={book.read}
                onChange={() => toggleBookReadStatus(book.id)}
                style={{ transform: 'scale(1.5)' }}
              />
              <img
                src={bookPreview.coverImage}
                alt='커버 이미지'
                style={styles.image}
              />
              <h3 style={{ margin: 0 }}>{bookPreview.title}</h3>
              <button
                onClick={() => openModal(book)}
                style={{
                  ...styles.button,
                  backgroundColor: '#007BFF',
                  color: '#fff',
                }}
              >
                상세 보기
              </button>
            </li>
          );
        })}
      </ul>
      {modalOpen && selectedBook && (
        <div style={styles.modalOverlay}>
          <BookDetailModal
            book={selectedBook}
            onClose={closeModal}
            id={selectedBook.id}
            onReviewChanged={setIsDataChanged}
          />
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', marginBottom: '20px' },
  buttonGroup: {
    marginBottom: '50px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
  },
  list: { listStyle: 'none', padding: 0 },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '10px',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
  },
  image: {
    width: '150px',
    height: '200px',
    borderRadius: '5px',
    objectFit: 'cover',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
};
export default BookList;
