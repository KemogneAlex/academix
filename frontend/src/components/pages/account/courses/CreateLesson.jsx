import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

const CreateLesson = ({
  showLessonModal,
  handleCloseLessonModal,
  course: _course, // Renommage pour éviter l'avertissement de variable non utilisée
  chapters,
  setChapters,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const dataToSend = {
        chapter: formData.chapter,
        lesson: formData.lesson,
        status: formData.status
      };
      
      const res = await fetch(`${apiUrl}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await res.json();
      setLoading(false);
      
      if (result.status === '200') {
        toast.success(result.message);
        
        // Mise à jour du chapitre avec toutes ses leçons
        setChapters({
          type: 'UPDATE_CHAPTER',
          payload: result.data, // Le chapitre complet avec toutes ses leçons
        });

        reset({
          chapter: '',
          lesson: '',
          status: 1,
        });
        handleCloseLessonModal();
      } else {
        const errors = result.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      }
    } catch (error) {
      // Log d'erreur pour le débogage
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la création de la leçon:', error);
      toast.error('Une erreur est survenue lors de la création de la leçon');
      setLoading(false);
    }
  };

  return (
    <Modal size='lg' show={showLessonModal} onHide={handleCloseLessonModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Créer une leçon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-3'>
            <label htmlFor='' className='form-label'>
              Chapitre
            </label>
            <select
              {...register('chapter', { required: 'Veuillez sélectionner un chapitre' })}
              className={`form-select ${errors.chapter && 'is-invalid'}`}
              disabled={loading}
            >
              <option value=''>Sélectionner un chapitre</option>
              {chapters &&
                chapters.map((chapter) => (
                  <option value={chapter.id} key={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
            </select>
            {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
          </div>
          <div className='mb-3'>
            <label htmlFor='' className='form-label'>
              Leçon
            </label>
            <input
              {...register('lesson', { required: 'Le titre de la leçon est obligatoire' })}
              type='text'
              className={`form-control ${errors.lesson && 'is-invalid'}`}
              placeholder='Leçon'
              disabled={loading}
            />
            {errors.lesson && <p className='invalid-feedback'>{errors.lesson.message}</p>}
          </div>
          <div className='mb-3'>
            <label htmlFor='' className='form-label'>
              Statut
            </label>
            <select
              {...register('status', { required: 'Le statut est obligatoire' })}
              className='form-select'
              defaultValue='1'
              disabled={loading}
            >
              <option value='1'>Actif</option>
              <option value='0'>Inactif</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            type='button' 
            className='btn btn-secondary me-2' 
            onClick={handleCloseLessonModal}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type='submit' 
            className='btn btn-primary' 
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CreateLesson;
