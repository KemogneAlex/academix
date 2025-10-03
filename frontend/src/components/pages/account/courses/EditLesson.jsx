import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';

import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
import LessonVideo from './LessonVideo';

const EditLesson = ({ placeholder }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState();
  const [lesson, setLesson] = useState([]);
  const params = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [checked, setChecked] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Commencez à taper...',
      buttons: [
        'source', '|', 
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|',
        'font', 'fontsize', 'paragraph', '|',
        'table', 'link', '|',
        'left', 'center', 'right', 'justify', '|',
        'undo', 'redo'
      ],
      height: 300,
      removeButtons: [],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      askBeforePasteHTML: true,
      askBeforePasteFromWord: true,
      defaultActionOnPaste: 'insert_clear_html',
      allowTabNavigation: true,
      cleanHTML: {
        fillEmptyParagraph: true,
        replaceNBSP: true
      },
      sourceEditor: 'area',
      defaultMode: '1'
    }),
    [placeholder]
  );

  const onSubmit = async (data) => {
    try {
      // Préparer les données à envoyer
      const dataToSend = {
        lesson: data.lesson,
        chapter: data.chapter_id,
        duration: data.duration,
        status: data.status,
        free_preview: checked,
        description: content
      };
      
      console.log('Données envoyées au serveur:', dataToSend);
      
      setLoading(true);
      
      const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      
      const result = await response.json();
      console.log('Réponse du serveur:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }
      
      if (result.status === '200') {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les chapitres
        const chaptersRes = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const chaptersResult = await chaptersRes.json();

        // Récupérer la leçon
        const lessonRes = await fetch(`${apiUrl}/lessons/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const lessonResult = await lessonRes.json();

        if (chaptersResult.status === '200') {
          setChapters(chaptersResult.data);
        }

        if (lessonResult.status === '200') {
          setLesson(lessonResult.data);
          // Mettre à jour le formulaire avec les données de la leçon
          reset({
            lesson: lessonResult.data.title,
            chapter_id: lessonResult.data.chapter_id,
            duration: lessonResult.data.duration,
            status: lessonResult.data.status,
          });
          // Nettoyer le contenu avant de le charger
          const cleanDescription = lessonResult.data.description?.replace(/Ma descriptible/g, '').trim() || '';
          // Utiliser setTimeout pour s'assurer que l'éditeur est bien monté
          setTimeout(() => {
            setContent(cleanDescription);
          }, 0);
          setChecked(lessonResult.data.is_free_preview === 'yes');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        toast.error('Une erreur est survenue lors du chargement des données.');
      }
    };

    fetchData();
  }, [params.courseId, params.id, reset, token]);

  return (
    <>
      <Layout>
        <section className='section-4'>
          <div className='container pb-5 pt-3'>
            <div className='row'>
              <div className='col-md-12 mt-5 mb-3'>
                <div className='d-flex justify-content-between'>
                  <h2 className='h4 mb-0 pb-0'>Modifier une leçon</h2>
                  <Link className='btn btn-primary' to={`/account/courses/edit/${params.courseId}`}>
                    Retour
                  </Link>
                </div>
              </div>
              <div className='col-lg-3 account-sidebar'>
                <UserSidebar />
              </div>
              <div className='col-lg-9'>
                <div className='row'>
                  <div className='col-md-8'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className='card border-0 shadow-lg'>
                        <div className='card-body p-4'>
                          <h4 className='h5 border-bottom pb-3 mb-3'>Informations de base</h4>
                          <div className='mb-3'>
                            <label htmlFor='' className='form-label'>
                              Titre
                            </label>
                            <input
                              {...register('lesson', {
                                required: 'Le titre est obligatoire',
                              })}
                              type='text'
                              className={`form-control ${errors.lesson ? 'is-invalid' : ''}`}
                              placeholder='Titre'
                            />
                            {errors.lesson && (
                              <p className='invalid-feedback'>{errors.lesson.message}</p>
                            )}
                          </div>

                          <div className='mb-3'>
                            <label htmlFor='' className='form-label'>
                              Chapitre
                            </label>
                            <select
                              {...register('chapter_id', {
                                required: 'Le chapitre est obligatoire',
                              })}
                              className={`form-select ${errors.chapter_id ? 'is-invalid' : ''}`}
                            >
                              <option value=''> Selectionner un chapitre </option>
                              {chapters &&
                                chapters.map((chapter) => {
                                  return (
                                    <option key={chapter.id} value={chapter.id}>
                                      {chapter.title}
                                    </option>
                                  );
                                })}
                            </select>
                            {errors.chapter_id && (
                              <p className='invalid-feedback'>{errors.chapter_id.message}</p>
                            )}
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='' className='form-label'>
                              Duré(min)
                            </label>

                            <input
                              {...register('duration', {
                                required: 'La durée est obligatoire',
                              })}
                              type='number'
                              className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                              placeholder='Duré'
                            />
                            {errors.duration && (
                              <p className='invalid-feedback'>{errors.duration.message}</p>
                            )}
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='' className='form-label'>
                              Description
                            </label>

                            <div className='jodit-editor-container'>
                              <JoditEditor
                                key={`editor-${content}`}
                                ref={editor}
                                value={content}
                                config={config}
                                tabIndex={1}
                                onBlur={(newContent) => {
                                  // Nettoyer le contenu avant de le sauvegarder
                                  const cleanContent = newContent.replace(/Ma descriptible/g, '').trim();
                                  setContent(cleanContent);
                                }}
                                onChange={(_newContent) => {}}
                              />
                            </div>
                          </div>
                          <div className='mb-3'>
                            <label htmlFor='' className='form-label'>
                              Statuts
                            </label>
                            <select
                              {...register('status', {
                                required: 'Le statut est obligatoire',
                              })}
                              className='form-select'
                            >
                              <option value='1'> Actif </option>
                              <option value='0'> Inactif </option>
                            </select>
                          </div>
                          <div className='d-flex'>
                            <input
                              {...register('free_preview')}
                              type='checkbox'
                              className='form-check-input'
                              id='freeLesson'
                              checked={checked}
                              onChange={(e) => setChecked(e.target.checked)}
                            />
                            <label className='form-check-label ms-2' htmlFor='freeLesson'>
                              Cours gratuit
                            </label>
                          </div>
                          <button disabled={loading} type='submit' className='btn btn-primary mt-4'>
                            {loading ? `s'il vous plait patientez...` : 'Enregistrer'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className='col-md-4'>
                    <LessonVideo lesson={lesson} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default EditLesson;
