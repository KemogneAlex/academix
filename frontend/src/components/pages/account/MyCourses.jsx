import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import Layout from '../../common/Layout';
import UserSidebar from '../../common/UserSidebar';
import EditCourse from '../../common/EditCourse';
import { apiUrl, token } from '../../common/Config';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await fetch(`${apiUrl}/my-courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (result.status === '200') {
      setCourses(result.courses);
    } else {
      console.log('une erreur est survenue');
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      const res = await fetch(`${apiUrl}/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        const newCourses = courses.filter((course) => course.id !== id);
        setCourses(newCourses);
        toast.success(result.message);
      } else {
        console.log('une erreur est survenue');
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 mt-5 mb-3'>
            <div className='d-flex justify-content-between'>
              <h2 className='h4 mb-0 pb-0'>Mes Cours</h2>
              <Link to='/account/courses/create' className='btn btn-primary'>
                Créer un cours
              </Link>
            </div>
          </div>
          <div className='col-lg-3 account-sidebar'>
            <UserSidebar />
          </div>
          <div className='col-lg-9'>
            <div className='row gy-4'>
              {courses &&
                courses.map((course) => {
                  return <EditCourse key={course.id} course={course} deleteCourse={deleteCourse} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyCourses;
