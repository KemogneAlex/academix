import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import Layout from '../common/Layout';
import { apiUrl } from '../common/Config';
import { AuthContext } from '../context/Auth';
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    //console.log(data);

    await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === '200') {
          const userInfo = {
            name: result.name,
            id: result.id,
            token: result.token,
          };
          localStorage.setItem('userInfoLms', JSON.stringify(userInfo));
          login(userInfo);
          navigate('/account/dashboard');
        } else {
          toast.error(result.message);
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
                <h3 className='border-bottom pb-3 mb-3'>Connexion</h3>
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
                  <input
                    {...register('password', {
                      required: 'Le mot de passe est obligatoire',
                    })}
                    type='password'
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    placeholder='votre mot de passe'
                  />
                  {errors.password && <p className='invalid-feedback'>{errors.password.message}</p>}
                </div>

                <div className='d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4'>
                  <button className='btn btn-primary mb-2 mb-sm-0 w-100 w-sm-auto'>
                    Se connecter
                  </button>
                  <Link to={`/account/register`} className='text-secondary text-center text-sm-end mt-2 mt-sm-0 w-100 w-sm-auto'>
                    Créer un compte
                  </Link>
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

export default Login;
