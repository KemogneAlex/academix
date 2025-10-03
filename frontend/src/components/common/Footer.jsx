const Footer = () => {
  return (
    <footer>
      <div className='pt-5 container mt-5'>
        <div className='row pb-3 gy-4 justify-content-center'>
          <div className='col-lg-3 col-12'>
            <div className='col-lg-12 col-md-6 col-12 pe-lg-5'>
              <h2>Academix</h2>
              <p>
                Rejoignez notre plateforme d&apos;apprentissage et découvrez une large gamme de
                formations pour développer vos compétences et atteindre vos objectifs
                professionnels.
              </p>
            </div>
          </div>

          <div className='col-lg-3 col-md-6 col-12'>
            <h2>Catégories populaires</h2>
            <ul>
              <li>
                <a href='#'>Marketing digital</a>
              </li>
              <li>
                <a href='#'>Développement web</a>
              </li>
              <li>
                <a href='#'>Intelligence artificielle</a>
              </li>
              <li>
                <a href='#'>Conception Web</a>
              </li>
              <li>
                <a href='#'>Création de logo</a>
              </li>
              <li>
                <a href='#'>Design graphique</a>
              </li>
            </ul>
          </div>

          <div className='col-lg-3 col-md-6 col-12'>
            <h2>Liens Rapides</h2>
            <ul>
              <li>
                <a href='#'>Connexion</a>
              </li>
              <li>
                <a href='#'>Inscription</a>
              </li>
              <li>
                <a href='#'>Mon compte</a>
              </li>
              <li>
                <a href='#'>Formations</a>
              </li>
            </ul>
          </div>
        </div>
        <div className='row copyright'>
          <div className='col-md-12 text-center py-4'>&copy; 2025 Tous droits réservés</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
