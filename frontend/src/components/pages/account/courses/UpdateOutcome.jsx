import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';
const UpdateOutcome = ({ outcomesData, showOutcomes, handleClose, outcomes, setOutcomes }) => {
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
      const res = await fetch(`${apiUrl}/outcomes/${outcomesData.id}`, {
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
        const updatedOutcomes = outcomes.map((outcome) =>
          outcome.id === result.data.id ? { ...outcome, text: result.data.text } : outcome
        );
        setOutcomes(updatedOutcomes);

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
    if (outcomesData) {
      reset({ outcome: outcomesData.text });
    }
  }, [reset, outcomesData]);
  return (
    <>
      <Modal size='lg' show={showOutcomes} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title> Mise à jour du résultat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <label htmlFor='' className='form-label'>
                Resultat
              </label>
              <input
                {...register('outcome', { required: 'Le resultat est obligatoire' })}
                type='text'
                className={`form-control ${errors.outcome && 'is-invalid'}`}
                placeholder='Resultat'
              />
              {errors.outcome && <p className='invalid-feedback'>{errors.outcome.message}</p>}
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

export default UpdateOutcome;
