import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
import ManageOutcome from './ManageOutcome';
import ManageRequirement from './ManageRequirement';
import EditCover from './EditCover';
import ManageChapter from './ManageChapter';
const EditCourse = () => {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  // Fonction pour récupérer le cours et les meta-data
  const fetchCourseAndMeta = useCallback(async () => {
    try {
      // Récupérer les meta-data
      const metaRes = await fetch(`${apiUrl}/courses/meta-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const metaResult = await metaRes.json();
      if (metaResult.status === '200') {
        setCategories(metaResult.categories);
        setLevels(metaResult.levels);
        setLanguages(metaResult.languages);
      }

      // Récupérer le cours
      const courseRes = await fetch(`${apiUrl}/courses/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const courseResult = await courseRes.json();
      if (courseResult.status === '200') {
        reset({
          title: courseResult.data.title,
          category: courseResult.data.category_id,
          level: courseResult.data.level_id,
          language: courseResult.data.language_id,
          description: courseResult.data.description,
          sell_price: courseResult.data.price,
          cross_price: courseResult.data.cross_price,
        });
        setCourse(courseResult.data);
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
  }, [params.id, reset]);

  const changeStatus = async (course) => {
    const status = course.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`${apiUrl}/change-course-status/${course.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: status }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        setCourse({ ...course, status: status });
      } else {
        // Afficher le message d'erreur du serveur
        if (result.message) {
          toast.error(result.message);
        } else if (result.errors) {
          // Gestion des erreurs de validation
          const errors = result.errors;
          Object.keys(errors).forEach((field) => {
            setError(field, { message: errors[field][0] });
          });
        } else {
          toast.error('Une erreur est survenue lors de la publication du cours.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast.error('Une erreur est survenue lors de la communication avec le serveur.');
    }
  };

  useEffect(() => {
    fetchCourseAndMeta();
  }, [fetchCourseAndMeta]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/courses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setLoading(false);
      if (result.status === '200') {
        toast.success(result.message);
      } else {
        const errors = result.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
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
                Modifier un cours
              </li>
            </ol>
          </nav>
          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>Modifier un cours</h2>
                <div>
                  {course.status === 0 && (
                    <Link onClick={() => changeStatus(course)} className='btn btn-secondary'>
                      Publier
                    </Link>
                  )}
                  {course.status === 1 && (
                    <Link onClick={() => changeStatus(course)} className='btn btn-primary'>
                      Despublier
                    </Link>
                  )}
                  <Link to={`/account/my-courses`} className='btn btn-light ms-2'>
                    Retour
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>
            <div className='col-lg-9'>
              <div className='row'>
                <div className='col-md-7'>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='card border-0 shadow-lg'>
                      <div className='card-body p-4'>
                        <h4 className='h5 border-bottom pb-3 mb-3'>Details du cours</h4>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='title'>
                            Titre
                          </label>
                          <input
                            type='text'
                            {...register('title', { required: 'Le titre est obligatoire.' })}
                            className={`form-control ${errors.title && 'is-invalid'}`}
                            placeholder='Titre'
                          />
                          {errors.title && (
                            <p className='invalid-feedback'>{errors.title.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='category'>
                            Categorie
                          </label>
                          <select
                            className={`form-select ${errors.category && 'is-invalid'}`}
                            id='category'
                            {...register('category', { required: 'La categorie est obligatoire.' })}
                          >
                            <option value=''>Selectionner une categorie</option>
                            {categories &&
                              categories.map((category) => {
                                return (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.category && (
                            <p className='invalid-feedback'>{errors.category.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='level'>
                            Niveau
                          </label>
                          <select
                            className={`form-select ${errors.level && 'is-invalid'}`}
                            id='level'
                            {...register('level', { required: 'le niveau est obligatoire.' })}
                          >
                            <option value=''>Selectionner un niveau</option>
                            {levels &&
                              levels.map((level) => {
                                return (
                                  <option key={level.id} value={level.id}>
                                    {level.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.level && (
                            <p className='invalid-feedback'>{errors.level.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='language' id='language'>
                            Langue
                          </label>
                          <select
                            className={`form-select ${errors.language && 'is-invalid'}`}
                            id='language'
                            {...register('language', { required: 'la langue est obligatoire.' })}
                          >
                            <option value=''>Selectionner une langue</option>
                            {languages &&
                              languages.map((language) => {
                                return (
                                  <option key={language.id} value={language.id}>
                                    {language.name}
                                  </option>
                                );
                              })}
                          </select>
                          {errors.language && (
                            <p className='invalid-feedback'>{errors.language.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='description'>
                            Description
                          </label>
                          <textarea
                            {...register('description')}
                            id='description'
                            rows={5}
                            placeholder='Description'
                            className='form-control'
                          ></textarea>
                        </div>

                        <h4 className='h5 border-bottom pb-3 mb-3'>Prix du cours</h4>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='sell_price'>
                            Prix de vente
                          </label>
                          <input
                            type='text'
                            {...register('sell_price', {
                              required: 'Le prix de vente est obligatoire.',
                            })}
                            className={`form-control ${errors.sell_price && 'is-invalid'}`}
                            placeholder='Prix de vente'
                            id='sell_price'
                          />
                          {errors.sell_price && (
                            <p className='invalid-feedback'>{errors.sell_price.message}</p>
                          )}
                        </div>
                        <div className='mb-3'>
                          <label className='form-label' htmlFor='cross_price'>
                            Prix initial
                          </label>
                          <input
                            type='text'
                            {...register('cross_price')}
                            className='form-control'
                            placeholder='Prix initial'
                            id='cross_price'
                          />
                        </div>

                        <button disabled={loading} className='btn btn-primary'>
                          {loading === false ? 'Enregistrer' : `s'il vous plait patientez...`}
                        </button>
                      </div>
                    </div>
                  </form>
                  <ManageChapter course={course} params={params} />
                </div>
                <div className='col-md-5'>
                  <ManageOutcome />
                  <ManageRequirement />
                  <EditCover course={course} setCourse={setCourse} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
