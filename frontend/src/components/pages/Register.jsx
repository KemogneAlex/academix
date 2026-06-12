import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Layout from '../common/Layout';
import { apiUrl } from '../common/Config';

const Register = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({ defaultValues: { role: 'student' } });

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === '200') {
          toast.success(result.message);
          navigate('/account/login');
        } else {
          const errs = result.errors;
          Object.keys(errs).forEach((field) => {
            setError(field, { message: errs[field][0] });
          });
        }
      });
  };

  return (
    <Layout>
      <div className='container py-3 py-md-5 my-3 my-md-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-lg-6 col-xl-5'>
            <form onSubmit={handleSubmit(onSubmit)} className='w-100'>
              <div className='card border-0 shadow-sm'>
                <div className='card-body p-3 p-md-4'>
                  <h3 className='border-bottom pb-3 mb-4 text-center text-md-start'>Créer un compte</h3>

                  {/* Nom */}
                  <div className='mb-3'>
                    <label className='form-label'>Nom complet</label>
                    <input
                      {...register('name', { required: 'Le nom est obligatoire' })}
                      type='text'
                      className={`form-control ${errors.name && 'is-invalid'}`}
                      placeholder='Votre nom complet'
                    />
                    {errors.name && <p className='invalid-feedback'>{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className='mb-3'>
                    <label className='form-label'>Adresse email</label>
                    <input
                      {...register('email', {
                        required: "L'adresse email est obligatoire",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "L'adresse email doit être une adresse email valide",
                        },
                      })}
                      type='text'
                      className={`form-control ${errors.email && 'is-invalid'}`}
                      placeholder='votre@email.com'
                    />
                    {errors.email && <p className='invalid-feedback'>{errors.email.message}</p>}
                  </div>

                  {/* Mot de passe */}
                  <div className='mb-3'>
                    <label className='form-label'>Mot de passe</label>
                    <input
                      {...register('password', { required: 'Le mot de passe est obligatoire' })}
                      type='password'
                      className={`form-control ${errors.password && 'is-invalid'}`}
                      placeholder='Créez un mot de passe sécurisé'
                    />
                    {errors.password && <p className='invalid-feedback'>{errors.password.message}</p>}
                  </div>

                  {/* Rôle */}
                  <div className='mb-4'>
                    <label className='form-label fw-semibold'>Je m'inscris en tant que</label>
                    <div className='row g-2'>
                      <div className='col-6'>
                        <input
                          {...register('role')}
                          type='radio'
                          className='btn-check'
                          id='role-student'
                          value='student'
                        />
                        <label
                          htmlFor='role-student'
                          className='btn btn-outline-secondary w-100 d-flex flex-column align-items-center py-3'
                        >
                          <span style={{ fontSize: '1.5rem' }}>🎓</span>
                          <span className='fw-semibold mt-1'>Étudiant</span>
                          <small className='text-muted'>J'apprends</small>
                        </label>
                      </div>
                      <div className='col-6'>
                        <input
                          {...register('role')}
                          type='radio'
                          className='btn-check'
                          id='role-instructor'
                          value='instructor'
                        />
                        <label
                          htmlFor='role-instructor'
                          className='btn btn-outline-secondary w-100 d-flex flex-column align-items-center py-3'
                        >
                          <span style={{ fontSize: '1.5rem' }}>👨‍🏫</span>
                          <span className='fw-semibold mt-1'>Formateur</span>
                          <small className='text-muted'>Je crée des cours</small>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type='submit' className='btn btn-primary w-100 mb-3'>
                    S&apos;inscrire
                  </button>

                  <p className='text-center mb-0'>
                    Vous avez déjà un compte ?{' '}
                    <Link to='/account/login' className='text-primary fw-medium'>
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
