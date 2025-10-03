import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

const UpdateChapter = ({ showChapter, handleClose, chapterData, setChapters }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/chapters/${chapterData.id}`, {
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
        setChapters({ type: 'UPDATE_CHAPTER', payload: result.data });

        toast.success(result.message);
      } else {
        const errors = result.errors;
        Object.keys(errors).forEach((field) => {
          setError(field, { message: errors[field][0] });
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast.error('Une erreur est survenue.');
    }
  };
  useEffect(() => {
    if (chapterData) {
      reset({ chapter: chapterData.title });
    }
  }, [reset, chapterData]);
  return (
    <>
      <Modal size='lg' show={showChapter} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title> Mise à jour du chapitre</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <label htmlFor='' className='form-label'>
                Chapitre
              </label>
              <input
                {...register('chapter', { required: 'Le titre du chapitre est obligatoire' })}
                type='text'
                className={`form-control ${errors.chapter && 'is-invalid'}`}
                placeholder='Chapitre'
              />
              {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button disabled={loading} className='btn btn-primary'>
              {loading === false ? 'Enregistrer' : `s'il vous plait patientez...`}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default UpdateChapter;
