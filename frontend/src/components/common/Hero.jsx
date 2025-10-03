import HeroImg from '../../assets/images/hero-4.png';

const Hero = () => {
  return (
    <section className='section-1'>
      <div className='container '>
        <div className='row align-items-center'>
          <div className='col-md-6'>
            <h1 className='display-3 fw-bold'>Apprenez à votre rythme, où que vous soyez</h1>
            <p className='lead'>
              Rejoignez notre plateforme d&apos;apprentissage et découvrez une large gamme de formations pour développer
              vos compétences et atteindre vos objectifs professionnels.
            </p>
            <a href='#courses' className='btn btn-white'>
              Découvrir les Formations
            </a>
          </div>
          <div className='col-md-6 text-center'>
            <img src={HeroImg} alt='Étudiant en apprentissage' className='img-fluid' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
