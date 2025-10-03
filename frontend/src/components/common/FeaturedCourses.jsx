import { useState, useEffect } from 'react';

import Course from './Course';
import { apiUrl, token } from '../common/Config';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const fetchFeaturedCourses = () => {
    fetch(`${apiUrl}/fetch-featured-courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === '200') {
          setCourses(result.data || []);
        } else {
          console.log('une erreur est survenue');
        }
      });
  };

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  return (
    <section className='section-3 my-5'>
      <div className='container'>
        <div className='section-title py-3  mt-4'>
          <h2 className='h3'>Formations en vedette</h2>
          <p>
            Découvrez des formations conçues pour vous aider à exceller dans votre développement
            professionnel et personnel.
          </p>
        </div>
        <div className='row gy-4'>
          {courses &&
            courses.map((course) => {
              return <Course key={course.id} course={course} customClasses='col-lg-3 col-md-6' />;
            })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
