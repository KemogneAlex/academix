import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams, Link } from 'react-router-dom';

import { apiUrl, token } from '../../../common/Config';
import UpdateOutcome from './UpdateOutcome';
const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomesData, setOutcomesData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();
  const params = useParams();
  const [showOutcomes, setShowOutcomes] = useState(false);

  const handleClose = () => setShowOutcomes(false);
  const handleShow = (outcome) => {
    setOutcomesData(outcome);
    setShowOutcomes(true);
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(outcomes);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setOutcomes(reorderedItems);
    saveOrder(reorderedItems);
  };
  const saveOrder = async (updatedOutcomes) => {
    try {
      const res = await fetch(`${apiUrl}/sort-outcomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ outcomes: updatedOutcomes }),
      });
      const result = await res.json();
      setLoading(false);
      if (result.status === '200') {
        toast.success(result.message);
      } else {
        console.log('Une erreur est survenue.');
        toast.error('Une erreur est survenue.');
      }
    } catch (error) {
      console.error('Erreur lors du tri des resultats:', error);
      toast.error('Une erreur est survenue.');
    }
  };
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = {
      ...data,
      course_id: params.id,
    };
    try {
      const res = await fetch(`${apiUrl}/outcomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setLoading(false);
      if (result.status === '200') {
        const newOutcomes = [...outcomes, result.data];
        setOutcomes(newOutcomes);
        toast.success(result.message);
        reset();
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

  const fetchOutcomes = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      console.log(result);
      if (result.status === '200') {
        setOutcomes(result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  }, [params.id]);

  const deleteOutcome = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce resultat ?')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/outcomes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        const NewOutcomes = outcomes.filter((outcome) => outcome.id !== id);
        setOutcomes(NewOutcomes);
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'outcome:", error);
      toast.error('Une erreur est survenue.');
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, [fetchOutcomes]);

  return (
    <>
      <div className='card shadow-lg border-0'>
        <div className='card-body p-4'>
          <div className='d-flex '>
            <h4 className='h5 mb-3'>Resultat du cours</h4>
          </div>
          <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-3'>
              <input
                {...register('outcome', { required: 'Le resultat est obligatoire' })}
                type='text'
                className={`form-control ${errors.outcome && 'is-invalid'}`}
                placeholder='Resultat'
              />
              {errors.outcome && <p className='invalid-feedback'>{errors.outcome.message}</p>}
            </div>
            <button disabled={loading} className='btn btn-primary'>
              {loading === false ? 'Enregistrer' : `s'il vous plait patientez...`}
            </button>
          </form>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='list'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                  {outcomes.map((outcome, index) => (
                    <Draggable key={outcome.id} draggableId={`${outcome.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='mt-2 border  bg-white shadow-lg  rounded'
                        >
                          <div className='card-body p-2 d-flex'>
                            <div>
                              <MdDragIndicator />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                              <div className='ps-2'>{outcome.text}</div>
                              <div className='d-flex'>
                                <Link
                                  onClick={() => handleShow(outcome)}
                                  className='text-primary me-1'
                                >
                                  <BsPencilSquare />
                                </Link>
                                <Link
                                  onClick={() => deleteOutcome(outcome.id)}
                                  className='text-danger'
                                >
                                  <FaTrashAlt />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {/* {outcomes &&
            outcomes.map((outcome) => {
              return (
                 <div className='card shadow mb-2' key={outcome.id}>
                  <div className='card-body p-2 d-flex'>
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className='d-flex justify-content-between w-100'>
                      <div className='ps-2'>{outcome.text}</div>
                      <div className='d-flex'>
                        <Link onClick={() => handleShow(outcome)} className='text-primary me-1'>
                          <BsPencilSquare />
                        </Link>
                        <Link onClick={() => deleteOutcome(outcome.id)} className='text-danger'>
                          <FaTrashAlt />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div> 
              );
})} */}
        </div>
      </div>
      <UpdateOutcome
        outcomesData={outcomesData}
        showOutcomes={showOutcomes}
        handleClose={handleClose}
        outcomes={outcomes}
        setOutcomes={setOutcomes}
      />
    </>
  );
};

export default ManageOutcome;
