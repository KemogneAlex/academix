import { Link } from 'react-router-dom';
import Layout from '../../common/Layout';
import UserSidebar from '../../common/UserSidebar';
const Dashboard = () => {
  return (
    <Layout>
      {' '}
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <Link to='/account'>Compte</Link>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
Tableau de bord
              </li>
            </ol>
          </nav>
          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <div className='d-flex justify-content-between'>
                <h2 className='h4 mb-0 pb-0'>Tableau de bord</h2>
              </div>
            </div>
            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>
            <div className='col-lg-9'>
              <div className='row'>
                <div className='col-md-4'>
                  <div className='card shadow '>
                    <div className='card-body p-3'>
                      <h2>0</h2>
                      <span>Ventes</span>
                    </div>
                    <div className='card-footer'>
                      &nbsp;
                      {/* <Link to="">View Users</Link> */}
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card shadow '>
                    <div className='card-body p-3'>
                      <h2>0</h2>
                      <span>Utilisateurs inscrits</span>
                    </div>
                    <div className='card-footer'>&nbsp;</div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card shadow '>
                    <div className='card-body p-3'>
                      <h2>0</h2>
                      <span>Cours actifs</span>
                    </div>
                    <div className='card-footer'>
                      <Link to='/admin/orders'>Voir les cours</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
