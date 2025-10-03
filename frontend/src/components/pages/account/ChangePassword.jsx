import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../common/Layout';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl, token } from '../../common/Config';

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const newPassword = watch('new_password');

  const onSubmit = async (data) => {
    setLoading(true);
    await fetch(`${apiUrl}/update-password`, {
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
        setLoading(false);
        if (result.status === '200') {
          toast.success(result.message);
          reset();
        } else {
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        }
      });
  };
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
                Changer le mot de passe
              </li>
            </ol>
          </nav>
          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>Changer le mot de passe</h2>
              </div>
            </div>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>
            <div className='col-lg-9'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='card p-4 border-0 shadow-lg'>
                    <div className='card-body'>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                          <label className='form-label'>Ancien mot de passe</label>
                          <input
                            type='password'
                            {...register('old_password', {
                              required: 'Veuillez entrer votre ancien mot de passe.',
                            })}
                            placeholder='Ancien mot de passe'
                            className={`form-control ${errors.old_password && 'is-invalid'}`}
                          />
                          {errors.old_password && (
                            <p className='invalid-feedback'>{errors.old_password?.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Nouveau mot de passe</label>
                          <input
                            type='password'
                            {...register('new_password', {
                              required: 'Veuillez entrer votre nouveau mot de passe.',
                            })}
                            placeholder='Nouveau mot de passe'
                            className={`form-control ${errors.new_password && 'is-invalid'}`}
                          />
                          {errors.new_password && (
                            <p className='invalid-feedback'>{errors.new_password?.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label'>Confirmer le nouveau mot de passe</label>
                          <input
                            type='password'
                            {...register('confirm_new_password', {
                              required: 'Veuillez confirmer votre nouveau mot de passe.',
                              validate: (value) => {
                                return (
                                  newPassword === value || 'Les mots de passe ne correspondent pas.'
                                );
                              },
                            })}
                            placeholder='Confirmer le nouveau mot de passe'
                            className={`form-control ${errors.confirm_new_password && 'is-invalid'}`}
                          />
                          {errors.confirm_new_password && (
                            <p className='invalid-feedback'>
                              {errors.confirm_new_password?.message}
                            </p>
                          )}
                        </div>

                        <button disabled={loading} className='btn btn-primary'>
                          {loading ? " S'il vous plaît, patientez..." : 'Changer de mot de passe'}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChangePassword;
