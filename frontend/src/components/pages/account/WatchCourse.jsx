import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Layout from '../../common/Layout';
import { apiUrl, token } from '../../common/Config';

const WatchCourse = () => {
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const params = useParams();

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${apiUrl}/enroll/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        setCourse(result.data);
        setActiveLesson(result.activeLesson);
        setCompletedLessons(result.completedLessons);
        setProgress(result.progress);
      } else {
        console.log('Une erreur est survenue');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showLesson = async (lesson) => {
    setActiveLesson(lesson);
    const data = {
      chapter_id: lesson.chapter_id,
      course_id: params.id,
      lesson_id: lesson.id,
    };
    try {
      const res = await fetch(`${apiUrl}/save-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === '200') {
        toast.success(result.message);
      } else {
        console.log('Une erreur est survenue');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsComplete = async (activeLesson) => {
    const data = {
      chapter_id: activeLesson.chapter_id,
      course_id: params.id,
      lesson_id: activeLesson.id,
    };
    try {
      const res = await fetch(`${apiUrl}/mark-as-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.status === '200') {
        toast.success(result.message);

        setCompletedLessons((prev) => [...prev, activeLesson.id]);

        if (course) {
          const totalLessons = course.chapters.reduce(
            (acc, chapter) => acc + (chapter.lessons?.length || 0),
            0
          );
          const newCompletedCount = [...completedLessons, activeLesson.id].length;
          const newProgress = Math.round((newCompletedCount / totalLessons) * 100);
          setProgress(newProgress);
        }
      } else {
        console.log('Une erreur est survenue');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <Layout>
      {course && (
        <section className='section-5 my-5'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8'>
                {activeLesson && (
                  <>
                    <div className='video'>
                      <ReactPlayer
                        src={activeLesson.video_url}
                        width='100%'
                        height='100%'
                        controls
                        playing={false}
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload',
                            },
                          },
                        }}
                      />
                    </div>
                    <div className='meta-content'>
                      <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                        <h3 className='pt-2'>{activeLesson.title}</h3>
                        <div>
                          <Link
                            onClick={() => markAsComplete(activeLesson)}
                            className={`${completedLessons && completedLessons.includes(activeLesson.id) ? 'disabled' : ''} btn btn-primary px-3`}
                          >
                            Marquer comme terminé <IoMdCheckmarkCircleOutline size={20} />
                          </Link>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: activeLesson.description }}></div>
                    </div>
                  </>
                )}
              </div>
              <div className='col-md-4'>
                <div className='card rounded-0'>
                  <div className='card-body'>
                    <div className='h6'>
                      <strong>{course.title}</strong>
                    </div>
                    <div className='py-2'>
                      <ProgressBar now={progress} />
                      <div className='pt-2' key={`progress-${progress}`}>
                        Progression : {progress}% terminé
                      </div>
                    </div>
                    <Accordion flush>
                      {course?.chapters?.map((chapter) => (
                        <Accordion.Item key={chapter.id} eventKey={chapter.id}>
                          <Accordion.Header>{chapter.title}</Accordion.Header>
                          <Accordion.Body className='pt-2 pb-0 ps-0'>
                            <ul className='lessons mb-0'>
                              {chapter.lessons?.map((lesson) => (
                                <li key={lesson.id} className='pb-2'>
                                  <Link
                                    className={`${completedLessons && completedLessons.includes(lesson.id) ? 'text-success' : ''}`}
                                    onClick={() => showLesson(lesson)}
                                  >
                                    <MdSlowMotionVideo size={20} /> {lesson.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default WatchCourse;
