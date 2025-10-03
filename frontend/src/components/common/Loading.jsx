import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <div className='w-full d-flex justify-content-center'>
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Chargement...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
