import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl, token } from '../common/Config';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = () => {
    fetch(`${apiUrl}/fetch-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === '200') {
          setCategories(result.data || []);
        } else {
          console.log('une erreur est survenue');
        }
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className='section-2'>
      <div className='container'>
        <div className='section-title py-3  mt-4'>
          <h2 className='h3'>Explorer les catégories</h2>
          <p>
            Découvrez des catégories conçues pour vous aider à exceller dans votre développement
            professionnel et personnel.
          </p>
        </div>
        <div className='row gy-3'>
          {categories &&
            categories.map((category) => {
              return (
                <div key={category.id} className='col-6 col-md-6 col-lg-3'>
                  <div className='card shadow border-0'>
                    <div className='card-body'>
                      <Link>{category.name}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
