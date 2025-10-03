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
  } = useForm();

  const onSubmit = async (data) => {
    //console.log(data);

    await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status === '200') {
          toast.success(result.message);
          navigate('/account/login');
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
      <div className='container py-3 py-md-5 my-3 my-md-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-lg-6 col-xl-5'>
            <form onSubmit={handleSubmit(onSubmit)} className='w-100'>
              <div className='card border-0 shadow-sm'>
                <div className='card-body p-3 p-md-4'>
                  <h3 className='border-bottom pb-3 mb-4 text-center text-md-start'>Créer un compte</h3>

                  <div className='mb-3'>
                    <label className='form-label' htmlFor='name'>
                      Nom complet
                    </label>
                    <input
                      {...register('name', {
                        required: 'Le nom est obligatoire',
                      })}
                      type='text'
                      className={`form-control ${errors.name && 'is-invalid'}`}
                      placeholder='Votre nom complet'
                    />
                    {errors.name && <p className='invalid-feedback'>{errors.name.message}</p>}
                  </div>

                  <div className='mb-3'>
                    <label className='form-label' htmlFor='email'>
                      Adresse email
                    </label>
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

                  <div className='mb-3'>
                    <label className='form-label' htmlFor='password'>
                      Mot de passe
                    </label>
                    <input
                      {...register('password', {
                        required: 'Le mot de passe est obligatoire',
                      })}
                      type='password'
                      className={`form-control ${errors.password && 'is-invalid'}`}
                      placeholder='Créez un mot de passe sécurisé'
                    />
                    {errors.password && <p className='invalid-feedback'>{errors.password.message}</p>}
                  </div>

                  <div className='mt-4'>
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
