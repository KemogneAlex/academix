import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Loading from '../../../common/Loading';
import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    await fetch(`${apiUrl}/fetch-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.status === '200') {
          setUser(result.data);
          reset({
            name: result.data.name,
            email: result.data.email,
          });
        } else {
          console.log('Une erreur est survenue.');
        }
      });
  };

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/update-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === '200') {
          toast.success(result.message);
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout>
      {' '}
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <Link to='/account'>Compte</Link>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                Profile
              </li>
            </ol>
          </nav>
          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>Profile</h2>
              </div>
            </div>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>
            <div className='col-lg-9'>
              <div className='row'>
                <div className='col-md-12'>
                  {loading && <Loading />}
                  {!loading && (
                    <div className='card p-4 border-0 shadow-lg'>
                      <div className='card-body'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className='mb-3'>
                            <label className='form-label'>Nom</label>
                            <input
                              type='text'
                              {...register('name', {
                                required: 'Veuillez entrer un nom.',
                              })}
                              placeholder='Nom'
                              className={`form-control ${errors.name && 'is-invalid'}`}
                            />
                            {errors.name && (
                              <p className='invalid-feedback'>{errors.name?.message}</p>
                            )}
                          </div>
                          <div className='mb-3'>
                            <label className='form-label'>Email</label>
                            <input
                              type='text'
                              {...register('email', {
                                required: 'Veuillez entrer un email.',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "L'adresse email doit être une adresse email valide",
                                },
                              })}
                              placeholder='Email'
                              className={`form-control ${errors.email && 'is-invalid'}`}
                            />
                            {errors.email && (
                              <p className='invalid-feedback'>{errors.email?.message}</p>
                            )}
                          </div>

                          <button className='btn btn-primary'>Modifier</button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
