import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';
const SortChapters = ({
  showSortChapters,
  handleCloseSortChapters,
  course,
  setChapters,
  chapters,
}) => {
  const [chaptersData, setChaptersData] = useState([]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(chaptersData);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setChaptersData(reorderedItems);
    saveOrder(reorderedItems);
  };
  const saveOrder = async (updatedChapters) => {
    try {
      const res = await fetch(`${apiUrl}/sort-chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chapters: updatedChapters }),
      });
      const result = await res.json();
      //setLoading(false);
      if (result.status === '200') {
        setChapters({ type: 'SET_CHAPTERS', payload: result.data });
        toast.success(result.message);
      } else {
        toast.error('Une erreur est survenue.');
      }
    } catch {
      toast.error('Une erreur est survenue.');
    }
  };

  useEffect(() => {
    setChaptersData(chapters);
  }, [chapters]);
  return (
    <>
      <Modal size='lg' show={showSortChapters} onHide={handleCloseSortChapters}>
        <Modal.Header closeButton>
          <Modal.Title> Trier les chapitres</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='list'>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                  {chaptersData.map((chapter, index) => (
                    <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className='mt-2 border px-3 py-2 bg-white shadow-lg  rounded'
                        >
                          {chapter.title}
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

export default SortChapters;
