import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../common/Layout';
import UserSidebar from '../../common/UserSidebar';
import { useAuth } from '../../context/Auth';
import axios from 'axios';

const Dashboard = () => {
  const { token, role } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/account/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [token]);

  const isInstructor = role === 'instructor';

  return (
    <Layout>
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
              <div className='d-flex justify-content-between align-items-center'>
                <h2 className='h4 mb-0 pb-0'>Tableau de bord</h2>
              </div>
            </div>

            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>
              {loading ? (
                <div className='text-center py-5'>
                  <div className='spinner-border text-primary' role='status' />
                </div>
              ) : isInstructor ? (
                <InstructorStats stats={stats} />
              ) : (
                <StudentStats stats={stats} />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ── Formateur ─────────────────────────────────────────────────── */
const InstructorStats = ({ stats }) => (
  <>
    <div className='row g-3 mb-4'>
      <StatCard
        value={stats?.total_enrollments ?? 0}
        label='Inscriptions totales'
        icon='bi bi-people-fill'
        color='primary'
        link='/account/my-courses'
        linkLabel='Voir les cours'
      />
      <StatCard
        value={stats?.active_courses ?? 0}
        label='Cours actifs'
        icon='bi bi-play-circle-fill'
        color='success'
        link='/account/my-courses'
        linkLabel='Gérer'
      />
      <StatCard
        value={`${stats?.total_revenue ?? '0.00'} €`}
        label='Revenus (complétés)'
        icon='bi bi-cash-stack'
        color='warning'
      />
      <StatCard
        value={stats?.total_courses ?? 0}
        label='Cours créés'
        icon='bi bi-journal-bookmark-fill'
        color='info'
        link='/account/my-courses'
        linkLabel='Voir tout'
      />
    </div>

    <div className='card shadow-sm border-0'>
      <div className='card-body'>
        <h5 className='card-title mb-3'>Actions rapides</h5>
        <div className='d-flex flex-wrap gap-2'>
          <Link to='/account/create-course' className='btn btn-sm btn-primary'>
            <i className='bi bi-plus-circle me-1' /> Nouveau cours
          </Link>
          <Link to='/account/my-courses' className='btn btn-sm btn-outline-secondary'>
            <i className='bi bi-list-ul me-1' /> Mes cours
          </Link>
        </div>
      </div>
    </div>
  </>
);

/* ── Étudiant ──────────────────────────────────────────────────── */
const StudentStats = ({ stats }) => (
  <>
    <div className='row g-3 mb-4'>
      <StatCard
        value={stats?.total_enrollments ?? 0}
        label='Cours suivis'
        icon='bi bi-book-fill'
        color='primary'
        link='/account/my-learning'
        linkLabel='Continuer à apprendre'
      />
      <StatCard
        value={`${stats?.avg_progress ?? 0} %`}
        label='Progression moyenne'
        icon='bi bi-graph-up-arrow'
        color='success'
      />
      <StatCard
        value={stats?.total_certificates ?? 0}
        label='Certificats obtenus'
        icon='bi bi-patch-check-fill'
        color='warning'
        link='/account/certificates'
        linkLabel='Voir les certificats'
      />
    </div>

    <div className='card shadow-sm border-0'>
      <div className='card-body'>
        <h5 className='card-title mb-3'>Actions rapides</h5>
        <div className='d-flex flex-wrap gap-2'>
          <Link to='/account/my-learning' className='btn btn-sm btn-primary'>
            <i className='bi bi-play-circle me-1' /> Continuer à apprendre
          </Link>
          <Link to='/' className='btn btn-sm btn-outline-secondary'>
            <i className='bi bi-search me-1' /> Explorer des cours
          </Link>
        </div>
      </div>
    </div>
  </>
);

/* ── Carte stat réutilisable ───────────────────────────────────── */
const StatCard = ({ value, label, icon, color, link, linkLabel }) => (
  <div className='col-md-6 col-xl-3'>
    <div className={`card shadow-sm border-0 border-start border-${color} border-3`}>
      <div className='card-body p-3'>
        <div className='d-flex align-items-center justify-content-between mb-2'>
          <span className={`fs-4 text-${color}`}>
            <i className={icon} />
          </span>
          <h3 className='mb-0 fw-bold'>{value}</h3>
        </div>
        <p className='text-muted small mb-0'>{label}</p>
      </div>
      {link && linkLabel && (
        <div className='card-footer bg-transparent border-0 pt-0 pb-2 px-3'>
          <Link to={link} className={`text-${color} small text-decoration-none`}>
            {linkLabel} →
          </Link>
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;
