const NotFound = ({ text }) => {
  return (
    <div className='col-12'>
      <div className='card shadow border-0 py-5 text-center'>
        <h4>{text ? text : 'Elément non trouvé'}</h4>
        <p>
          Nous n&apos;avons trouvé aucun élément correspondant. Veuillez ajuster votre recherche ou
          vos filtres et réessayer.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
