import { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import { Accordion, Badge, ListGroup, Card } from 'react-bootstrap';
// import ReactPlayer from 'react-player';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LuMonitorPlay } from 'react-icons/lu';
import toast from 'react-hot-toast';
import Layout from '../common/Layout';
import { apiUrl, convertMinutesToHours, token } from '../common/Config';
import Loading from '../common/Loading';
import FreePreview from '../common/FreePreview';
const Detail = () => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [freeLesson, setFreeLesson] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (lesson) => {
    setShow(true);
    setFreeLesson(lesson);
  };

  const fetchCourses = () => {
    setLoading(true);
    fetch(`${apiUrl}/fetch-course/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.status === '200') {
          setCourse(result.data || []);
        } else {
          console.log('une erreur est survenue');
        }
      });
  };

  const enrollCourse = async () => {
    var data = {
      course_id: course.id,
    };
    await fetch(`${apiUrl}/enroll-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const result = await response.json();
        return {
          httpStatus: response.status,
          data: result,
        };
      })
      .then(({ httpStatus, data }) => {
        if (httpStatus === 200) {
          toast.success(data.message);
        } else if (httpStatus === 401) {
          toast.error('Veuillez vous connecter pour vous inscrire à ce cours');
          navigate('/account/login');
        } else {
          toast.error(data.message);
        }
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <Layout>
      {freeLesson && <FreePreview show={show} handleClose={handleClose} freeLesson={freeLesson} />}
      {loading === true && (
        <div className='mt-5'>
          <Loading />
        </div>
      )}
      {loading === false && course && (
        <div className='container pb-5 pt-3'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <a href='/'>Accueil</a>
              </li>
              <li className='breadcrumb-item'>
                <a href='/courses'>Formations</a>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                {course.title}
              </li>
            </ol>
          </nav>
          <div className='row my-5'>
            <div className='col-lg-8'>
              <h2>{course.title}</h2>
              <div className='d-flex'>
                <div className='mt-1'>
                  <span className='badge bg-green'>{course.category.name}</span>
                </div>
                <div className='d-flex ps-3'>
                  <div className='text pe-2 pt-1'>{course?.rating}</div>
                  <Rating readonly initialValue={course?.rating || 0} size={20} />
                </div>
              </div>
              <div className='row mt-4'>
                {/* <div className="col">
                            <span className="text-muted d-block">Last Updates</span>
                            <span className="fw-bold">Aug 2021</span>
                        </div> */}
                <div className='col'>
                  <span className='text-muted d-block'>Niveau</span>
                  <span className='fw-bold'>{course.level.name}</span>
                </div>
                <div className='col'>
                  <span className='text-muted d-block'>Étudiants</span>
                  <span className='fw-bold'>{course?.enrollments_count}</span>
                </div>
                <div className='col'>
                  <span className='text-muted d-block'>Langue</span>
                  <span className='fw-bold'>{course.language.name}</span>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3 h4'>Aperçu du cours</h3>
                    {course.description}
                  </div>
                </div>
                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3 h4'>Ce que vous allez apprendre</h3>
                    <ul className='list-unstyled mt-3'>
                      {course.outcomes &&
                        course.outcomes.map((outcome) => {
                          return (
                            <li className='d-flex align-items-center mb-2' key={outcome.id}>
                              <span className='text-success me-2'>&#10003;</span>
                              <span>{outcome.text}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>

                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3 h4'>Prérequis</h3>
                    <ul className='list-unstyled mt-3'>
                      {course.requirements &&
                        course.requirements.map((requirement) => {
                          return (
                            <li className='d-flex align-items-center mb-2' key={requirement.id}>
                              <span className='text-success me-2'>&#10003;</span>
                              <span>{requirement.text}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>

                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='h4 mb-3'>Structure du cours</h3>
                    <p>
                      {course.chapters_count} chapitres - {course.total_lessons} Lectures -{' '}
                      {convertMinutesToHours(course.total_duration)}
                    </p>
                    <Accordion defaultActiveKey='0' id='courseAccordion'>
                      {course.chapters &&
                        course.chapters.map((chapter, index) => {
                          return (
                            <Accordion.Item key={chapter.id || index} eventKey={String(index)}>
                              <Accordion.Header>
                                {chapter.title}
                                <span className='ms-3 text-muted'>
                                  ({chapter.lessons_count} lectures -{' '}
                                  {convertMinutesToHours(chapter.lessons_sum_duration)})
                                </span>
                              </Accordion.Header>
                              <Accordion.Body>
                                <ListGroup>
                                  {chapter.lessons &&
                                    chapter.lessons.map((lesson) => {
                                      return (
                                        <ListGroup.Item key={`${chapter.id || index}-1`}>
                                          <div className='row'>
                                            <div className='col-md-9'>
                                              <LuMonitorPlay className='me-2' />
                                              {lesson.title}
                                            </div>
                                            <div className='col-md-3'>
                                              <div className='d-flex justify-content-end'>
                                                {lesson.is_free_preview === 'yes' && (
                                                  <Badge bg='primary'>
                                                    <Link
                                                      onClick={() => handleShow(lesson)}
                                                      className='text-white text-decoration-none'
                                                    >
                                                      Aperçu
                                                    </Link>
                                                  </Badge>
                                                )}
                                                <span className='text-muted ms-2'>
                                                  {convertMinutesToHours(lesson.duration)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </ListGroup.Item>
                                      );
                                    })}
                                </ListGroup>
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        })}
                    </Accordion>
                  </div>
                </div>

                <div className='col-md-12 mt-4'>
                  <div className='border bg-white rounded-3 p-4'>
                    <h3 className='mb-3 h4'>Avis</h3>
                    <p>Ce que nos étudiants pensent de cette formation</p>

                    <div className='mt-4'>
                      {course.reviews &&
                        course.reviews.map((review, index) => {
                          return (
                            <div
                              key={review.id || index}
                              className='d-flex align-items-start mb-4 border-bottom pb-3'
                            >
                              <div>
                                <h6 className='mb-0'>
                                  {review?.user?.name} &nbsp;
                                  <span className='text-muted fs-6'>{review.created_at}</span>
                                </h6>
                                <div className='text-warning mb-2'>
                                  <Rating initialValue={review.rating} size={20} readonly />
                                </div>
                                <p className='mb-0'>{review.comment}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='border rounded-3 bg-white p-4 shadow-sm'>
                <Card.Img src={course.course_small_image} />
                <Card.Body className='mt-3'>
                  <h3 className='fw-bold'>€{course.price}</h3>
                  {course.cross_price && (
                    <div className='text-muted text-decoration-line-through'>
                      €{course.cross_price}
                    </div>
                  )}
                  {/* Buttons */}
                  <div className='mt-4'>
                    <button
                      onClick={() => enrollCourse(course.id)}
                      className='btn btn-primary w-100'
                    >
                      <i className='bi bi-cart-plus me-2'></i> S&apos;inscrire
                    </button>
                  </div>
                </Card.Body>
                <Card.Footer className='mt-4'>
                  <h6 className='fw-bold'>Ce cours comprend</h6>
                  <ListGroup variant='flush'>
                    <ListGroup.Item className='ps-0'>
                      <i className='bi bi-infinity text-primary me-2'></i>
                      Accès à vie
                    </ListGroup.Item>
                    <ListGroup.Item className='ps-0'>
                      <i className='bi bi-phone text-primary me-2'></i>
                      Accès mobile et TV
                    </ListGroup.Item>
                    <ListGroup.Item className='ps-0'>
                      <i className='bi bi-award-fill text-primary me-2'></i>
                      Certificat de réussite
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Footer>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Detail;
