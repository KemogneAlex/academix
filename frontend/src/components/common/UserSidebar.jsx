import { FaChartBar, FaDesktop, FaUserLock, FaUser, FaCertificate } from 'react-icons/fa';
import { BsMortarboardFill } from 'react-icons/bs';
import { MdLogout } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';

const UserSidebar = () => {
  const { logout, user, isInstructor, isStudent } = useContext(AuthContext);

  return (
    <div className='card border-0 shadow-lg'>
      <div className='card-body p-4'>
        {/* Nom + badge rôle */}
        <div className='mb-3 pb-3 border-bottom'>
          <p className='fw-bold mb-1'>{user?.name}</p>
          <span className={`badge ${isInstructor() ? 'bg-primary' : 'bg-success'}`}>
            {isInstructor() ? 'Formateur' : 'Étudiant'}
          </span>
        </div>

        <ul>
          <li className='d-flex align-items-center'>
            <Link to='/account/dashboard'>
              <FaChartBar size={16} className='me-2' /> Tableau de bord
            </Link>
          </li>

          <li className='d-flex align-items-center'>
            <Link to='/account/profile'>
              <FaUser size={16} className='me-2' /> Profil
            </Link>
          </li>

          {/* Étudiant uniquement */}
          {isStudent() && (
            <>
              <li className='d-flex align-items-center'>
                <Link to='/account/my-learning'>
                  <BsMortarboardFill size={16} className='me-2' /> Ma formation
                </Link>
              </li>
              <li className='d-flex align-items-center'>
                <Link to='/account/certificates'>
                  <FaCertificate size={16} className='me-2' /> Mes certificats
                </Link>
              </li>
            </>
          )}

          {/* Formateur uniquement */}
          {isInstructor() && (
            <li className='d-flex align-items-center'>
              <Link to='/account/my-courses'>
                <FaDesktop size={16} className='me-2' /> Mes cours
              </Link>
            </li>
          )}

          <li className='d-flex align-items-center'>
            <Link to='/account/change-password'>
              <FaUserLock size={16} className='me-2' /> Changer le mot de passe
            </Link>
          </li>

          <li>
            <Link onClick={logout} className='text-danger'>
              <MdLogout size={16} className='me-2' /> Déconnexion
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserSidebar;
