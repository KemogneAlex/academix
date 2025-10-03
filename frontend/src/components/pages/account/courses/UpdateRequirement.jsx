import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

const UpdateRequirement = ({
  showRequirements,
  handleClose,
  requirements,
  setRequirements,
  requirementsData,
}) => {
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
      const res = await fetch(`${apiUrl}/requirements/${requirementsData.id}`, {
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
        const updatedRequirements = requirements.map((requirement) =>
          requirement.id === result.data.id
            ? { ...requirement, text: result.data.text }
            : requirement
        );
        setRequirements(updatedRequirements);

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
    if (requirementsData) {
      reset({ requirement: requirementsData.text });
    }
  }, [reset, requirementsData]);
  return (
    <>
      <Modal size='lg' show={showRequirements} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title> Mise à jour de l&apos;exigence</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='mb-3'>
              <label htmlFor='' className='form-label'>
                Exigence
              </label>
              <input
                {...register('requirement', { required: "L'exigence est obligatoire" })}
                type='text'
                className={`form-control ${errors.requirement && 'is-invalid'}`}
                placeholder='Exigence'
              />
              {errors.requirement && (
                <p className='invalid-feedback'>{errors.requirement.message}</p>
              )}
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

export default UpdateRequirement;
