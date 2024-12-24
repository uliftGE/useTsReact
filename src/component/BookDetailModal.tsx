import React, { Dispatch, SetStateAction, useState } from 'react';
import { Book } from '../type/book';
import { updateBook } from '../api/index.ts';

type BookDetailModalProps = {
  onClose: () => void;
  book: Book;
  id: number;
  onReviewChanged?: Dispatch<SetStateAction<boolean>>;
};

const BookDetailModal = ({
  book,
  onClose,
  id,
  onReviewChanged,
}: BookDetailModalProps) => {
  const [review, setReview] = useState(book.review ?? '');
  const saveReview = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateBook(id, review);

      if (onReviewChanged) {
        onReviewChanged((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
      alert('리뷰를 저장하는 데 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>{book.title}</h2>
        <p style={styles.description}>{book.description}</p>
        <p style={styles.genre}>
          <span style={{ fontWeight: 800 }}>장르</span> {book.genre}
        </p>
        <img src={book.coverImage} alt='커버 이미지' style={styles.img} />
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder='리뷰를 입력하세요.'
          style={styles.textarea}
        />
        <div style={styles.buttonContainer}>
          <button onClick={saveReview} style={styles.saveButton}>
            저장
          </button>
          <button onClick={onClose} style={styles.closeButton}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '26px',
    width: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#555',
  },
  genre: {
    fontSize: '23px',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  img: {
    width: '300px',
    height: '400px',
  },
  textarea: {
    width: '80%',
    height: '80px',
    borderRadius: '8px',
    padding: '10px',
    margin: '20px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default BookDetailModal;
