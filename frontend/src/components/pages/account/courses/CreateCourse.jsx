import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
const CreateCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/courses`, {
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
          navigate(`/account/courses/edit/${result.data.id}`);
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <Layout>
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <Link to='/account'>Compte</Link>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                Créer un cours
              </li>
            </ol>
          </nav>
          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>Créer un cours</h2>
              </div>
            </div>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>
            <div className='col-lg-9'>
              <div className='row'></div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='card border-0 shadow-lg'>
                  <div className='card-body p-4'>
                    <div className='mb-3'>
                      <label htmlFor='title'>Titre</label>
                      <input
                        type='text'
                        {...register('title', { required: 'Le titre est obligatoire.' })}
                        className={`form-control ${errors.title && 'is-invalid'}`}
                        placeholder='Titre'
                      />
                      {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                    </div>
                    <button className='btn btn-primary'>Continuer</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CreateCourse;
