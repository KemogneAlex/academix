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
      <div className='container py-5 mt-5'>
        <div className='d-flex align-items-center justify-content-center'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='card border-0 shadow register'>
              <div className='card-body p-4'>
                <h3 className='border-bottom pb-3 mb-3'>Créer un compte</h3>

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

                <div>
                  <button className='btn btn-primary w-100'>S&apos;inscrire</button>
                </div>

                <div className='d-flex justify-content-center py-3'>
                  Vous avez déjà un compte ? &nbsp;
                  <Link className='text-secondary' to={`/account/login`}>
                    {' '}
                    Connectez-vous
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
