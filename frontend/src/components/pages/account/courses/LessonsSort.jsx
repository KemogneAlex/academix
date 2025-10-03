import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

const LessonsSort = ({ showLessonsSort, handleCloseLessonsSort, lessonsData, setChapters }) => {
  const [lessons, setLessons] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(lessons);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setLessons(reorderedItems);
    saveOrder(reorderedItems);
  };
  const saveOrder = async (updatedLessons) => {
    try {
      const res = await fetch(`${apiUrl}/sort-lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lessons: updatedLessons }),
      });
      const result = await res.json();
      //setLoading(false);
      if (result.status === '200') {
        setChapters({ type: 'UPDATE_CHAPTER', payload: result.chapter });
        toast.success(result.message);
      } else {
        toast.error('Une erreur est survenue.');
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };
  useEffect(() => {
    setLessons(lessonsData);
  }, [lessonsData]);
  return (
    <>
      <Modal size='lg' show={showLessonsSort} onHide={handleCloseLessonsSort}>
        <Modal.Header closeButton>
          <Modal.Title> Trier les leçons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='list'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                  {lessons.map((lesson, index) => (
                    <Draggable key={lesson.id} draggableId={`${lesson.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='mt-2 border px-3 py-2 bg-white shadow-lg  rounded'
                        >
                          {lesson.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default LessonsSort;
