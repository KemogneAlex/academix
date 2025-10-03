import { useReducer, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import { RiDragMove2Fill } from 'react-icons/ri';
import { BsPencilSquare } from 'react-icons/bs';
import { apiUrl, token } from '../../../common/Config';
import UpdateChapter from './UpdateChapter';
import CreateLesson from './CreateLesson';
import LessonsSort from './LessonsSort';
import SortChapters from './SortChapters';

const ManageChapter = ({ course, params }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState();

  // Update Chapter Modal

  const [showChapter, setShowChapter] = useState(false);
  const [lessonsData, setLessonsData] = useState([]);

  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setChapterData(chapter);
    setShowChapter(true);
  };

  // Create Lesson Modal
  const [showLessonModal, setShowLessonModal] = useState(false);
  const handleShowLessonModal = () => setShowLessonModal(true);
  const handleCloseLessonModal = () => setShowLessonModal(false);

  // Lessons Sort Modal
  const [showLessonsSort, setShowLessonsSort] = useState(false);
  const handleShowLessonsSort = (lessons) => {
    setLessonsData(lessons);
    setShowLessonsSort(true);
  };
  const handleCloseLessonsSort = () => setShowLessonsSort(false);

  // Sort Chapters Modal
  const [showSortChapters, setShowSortChapters] = useState(false);
  const handleShowSortChapters = () => setShowSortChapters(true);
  const handleCloseSortChapters = () => setShowSortChapters(false);

  const chapterReducer = (state, action) => {
    switch (action.type) {
      case 'SET_CHAPTERS':
        return action.payload;
      case 'ADD_CHAPTER':
        return [...state, action.payload];
      case 'UPDATE_CHAPTER':
        return state.map((chapter) =>
          chapter.id === action.payload.id ? action.payload : chapter
        );
      case 'DELETE_CHAPTER':
        return state.filter((chapter) => chapter.id !== action.payload);
      case 'ADD_LESSON':
        return state.map((chapter) => {
          if (chapter.id === action.payload.chapter_id) {
            return {
              ...chapter,
              lessons: [...(chapter.lessons ?? []), action.payload],
            };
          }
          return chapter;
        });
      default:
        return state;
    }
  };
  const [chapters, setChapters] = useReducer(chapterReducer, []);
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = {
      ...data,
      course_id: params.id,
    };
    try {
      const res = await fetch(`${apiUrl}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setLoading(false);
      if (result.status === '200') {
        setChapters({ type: 'ADD_CHAPTER', payload: result.data });
        toast.success(result.message);
        reset();
      } else {
        const errors = result.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };
  const deleteChapter = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/chapters/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        setChapters({ type: 'DELETE_CHAPTER', payload: id });
        toast.success(result.message);
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };
  const deleteLesson = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette leçon ?')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/lessons/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        setChapters({ type: 'UPDATE_CHAPTER', payload: result.chapter });
        toast.success(result.message);
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };

  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: 'SET_CHAPTERS', payload: course.chapters });
    }
  }, [course]);

  return (
    <>
      <div className='card shadow-lg border-0 mt-4'>
        <div className='card-body p-4'>
          <div className='d-flex '>
            <div className='d-flex justify-content-between w-100'>
              <h4 className='h5 mb-3'>Chapitre</h4>

              <div>
                <Link onClick={() => handleShowLessonModal()}>
                  {' '}
                  <FaPlus size={12} /> <strong>Ajouter une leçon</strong>{' '}
                </Link>
                <Link className='ms-2' onClick={() => handleShowSortChapters()}>
                  {' '}
                  <RiDragMove2Fill />
                  <strong>Réorganiser les chapitres</strong>{' '}
                </Link>
              </div>
            </div>
          </div>
          <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-3'>
              <input
                {...register('chapter', { required: 'Le chapitre est obligatoire' })}
                type='text'
                className={`form-control ${errors.chapter && 'is-invalid'}`}
                placeholder='Chapitre'
              />
              {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
            </div>
            <button disabled={loading} className='btn btn-primary'>
              {loading === false ? 'Enregistrer' : `s'il vous plait patientez...`}
            </button>
          </form>

          <Accordion>
            {chapters.map((chapter, index) => {
              return (
                <Accordion.Item eventKey={index} key={index}>
                  <Accordion.Header>{chapter.title}</Accordion.Header>

                  <Accordion.Body>
                    <div className='row'>
                      <div className='col-md-12'>
                        <div className='d-flex justify-content-between mb-2 mt-4'>
                          <h4 className='h5'>Leçons</h4>
                          <Link
                            className='h6'
                            onClick={() => handleShowLessonsSort(chapter.lessons)}
                            data-discover='true'
                          >
                            {' '}
                            <strong>Réorganiser les leçons</strong>
                          </Link>
                        </div>
                      </div>

                      <div className='col-md-12'>
                        {chapter.lessons &&
                          chapter.lessons.map((lesson) => {
                            return (
                              <div className='card shadow px-3 py-2 mb-2' key={lesson.id}>
                                <div className='row'>
                                  <div className='col-md-7'>{lesson.title}</div>
                                  <div className='col-md-5 text-end'>
                                    {lesson.duration > 0 && (
                                      <small className='fw-bold text-muted me-2'>
                                        {lesson.duration} min
                                      </small>
                                    )}
                                    {lesson.is_free_preview === 'yes' && (
                                      <span className='badge bg-success'> Aperçu </span>
                                    )}

                                    <Link
                                      to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`}
                                      className='ms-2'
                                    >
                                      <BsPencilSquare />
                                    </Link>
                                    <Link
                                      onClick={() => deleteLesson(lesson.id)}
                                      className='ms-2 text-danger   '
                                    >
                                      <FaTrashAlt />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className='col-md-12 mt-3'>
                        <div className='d-flex '>
                          <button
                            onClick={() => handleShow(chapter)}
                            className='btn btn-primary btn-sm '
                          >
                            Modifier le chapitre
                          </button>
                          <button
                            onClick={() => deleteChapter(chapter.id)}
                            className='btn btn-danger btn-sm ms-2'
                          >
                            Supprimer le chapitre
                          </button>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </div>
      <UpdateChapter
        showChapter={showChapter}
        handleClose={handleClose}
        chapterData={chapterData}
        setChapters={setChapters}
      />
      <CreateLesson
        showLessonModal={showLessonModal}
        handleCloseLessonModal={handleCloseLessonModal}
        course={course}
        setChapters={setChapters}
        chapters={chapters}
      />
      <LessonsSort
        showLessonsSort={showLessonsSort}
        handleCloseLessonsSort={handleCloseLessonsSort}
        lessonsData={lessonsData}
        setChapters={setChapters}
      />
      <SortChapters
        showSortChapters={showSortChapters}
        handleCloseSortChapters={handleCloseSortChapters}
        course={course}
        setChapters={setChapters}
        chapters={chapters}
      />
    </>
  );
};

export default ManageChapter;
