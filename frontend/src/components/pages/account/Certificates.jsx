import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../common/Layout';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl, token } from '../../common/Config';
import { FaCertificate } from 'react-icons/fa';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/certificates`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.status === '200') setCertificates(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <h2 className='h4 mb-0'>Mes certificats</h2>
            </div>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>
            <div className='col-lg-9'>
              {loading && <p>Chargement...</p>}

              {!loading && certificates.length === 0 && (
                <div className='text-center py-5'>
                  <FaCertificate size={48} className='text-muted mb-3' />
                  <h5 className='text-muted'>Aucun certificat pour le moment</h5>
                  <p className='text-muted'>Terminez un cours pour obtenir votre certificat.</p>
                  <Link to='/courses' className='btn btn-primary'>
                    Découvrir les cours
                  </Link>
                </div>
              )}

              <div className='row gy-3'>
                {certificates.map((cert) => (
                  <div key={cert.id} className='col-md-6'>
                    <div className='card border-0 shadow-sm h-100'>
                      <div className='card-body d-flex align-items-center gap-3'>
                        <FaCertificate size={36} className='text-warning flex-shrink-0' />
                        <div>
                          <h6 className='mb-1 fw-semibold'>{cert.course?.title}</h6>
                          <small className='text-muted d-block'>
                            N° {cert.certificate_number}
                          </small>
                          <small className='text-muted'>
                            Délivré le {new Date(cert.issued_at).toLocaleDateString('fr-FR')}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Certificates;
