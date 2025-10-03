import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { apiUrl, token } from '../../../common/Config';
import UpdateRequirement from './UpdateRequirement';
const ManageRequirement = () => {
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [requirementsData, setRequirementsData] = useState([]);
  const params = useParams();
  const [showRequirements, setShowRequirements] = useState(false);

  const handleClose = () => setShowRequirements(false);
  const handleShow = (requirement) => {
    setRequirementsData(requirement);
    setShowRequirements(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = async (date) => {
    setLoading(true);
    const FormData = { ...date, course_id: params.id };
    try {
      const res = await fetch(`${apiUrl}/requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(FormData),
      });
      const result = await res.json();
      setLoading(false);
      if (result.status === '200') {
        const neWRequirements = [...requirements, result.data];
        setRequirements(neWRequirements);
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(requirements);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setRequirements(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updatedRequirements) => {
    try {
      const res = await fetch(`${apiUrl}/sort-requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requirements: updatedRequirements }),
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
      console.error('Erreur lors du tri des exigences:', error);
      toast.error('Une erreur est survenue.');
    }
  };

  const fetchRequirements = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        setRequirements(result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  }, [params.id]);

  const deleteRequirement = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette exigence ?')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/requirements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === '200') {
        const NewRequirements = requirements.filter((requirement) => requirement.id !== id);
        setRequirements(NewRequirements);
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'outcome:", error);
      toast.error('Une erreur est survenue.');
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return (
    <>
      <div className='card shadow-lg border-0 mt-4'>
        <div className='card-body p-4'>
          <div className='d-flex '>
            <h4 className='h5 mb-3'>Exigence du cours</h4>
          </div>
          <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-3'>
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
            <button disabled={loading} className='btn btn-primary'>
              {loading === false ? 'Enregistrer' : `s'il vous plait patientez...`}
            </button>
          </form>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='list'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                  {requirements.map((requirement, index) => (
                    <Draggable key={requirement.id} draggableId={`${requirement.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='mt-2 border bg-white shadow-lg  rounded'
                        >
                          <div className='card-body p-2 d-flex'>
                            <div>
                              <MdDragIndicator />
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                              <div className='ps-2'>{requirement.text}</div>
                              <div className='d-flex'>
                                <Link
                                  onClick={() => handleShow(requirement)}
                                  className='text-primary me-1'
                                >
                                  <BsPencilSquare />
                                </Link>
                                <Link
                                  onClick={() => deleteRequirement(requirement.id)}
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
          {/* {requirements &&
            requirements.map((requirement) => {
              return (
                <div className='card shadow mb-2' key={requirement.id}>
                  <div className='card-body p-2 d-flex'>
                    <div>
                      <MdDragIndicator />
                    </div>
                    <div className='d-flex justify-content-between w-100'>
                      <div className='ps-2'>{requirement.text}</div>
                      <div className='d-flex'>
                        <Link onClick={() => handleShow(requirement)} className='text-primary me-1'>
                          <BsPencilSquare />
                        </Link>
                        <Link
                          onClick={() => deleteRequirement(requirement.id)}
                          className='text-danger'
                        >
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
      <UpdateRequirement
        requirementsData={requirementsData}
        showRequirements={showRequirements}
        handleClose={handleClose}
        requirements={requirements}
        setRequirements={setRequirements}
      />
    </>
  );
};

export default ManageRequirement;
