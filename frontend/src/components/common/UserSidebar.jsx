import { FaChartBar, FaDesktop, FaUserLock, FaUser } from 'react-icons/fa';
import { BsMortarboardFill } from 'react-icons/bs';
import { MdLogout } from 'react-icons/md';

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';
const UserSidebar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className='card border-0 shadow-lg'>
      <div className='card-body  p-4'>
        <ul>
          <li className='d-flex align-items-center'>
            <Link to='/account/dashboard'>
              <FaChartBar size={16} className='me-2 ' /> Tableau de bord
            </Link>
          </li>
          <li className='d-flex align-items-center'>
            <Link to='/account/profile'>
              <FaUser size={16} className='me-2 ' /> Profile
            </Link>
          </li>

          <li className='d-flex align-items-center'>
            <Link to='/account/my-learning'>
              <BsMortarboardFill size={16} className='me-2' /> Ma formation
            </Link>
          </li>
          <li className='d-flex align-items-center'>
            <Link to='/account/my-courses'>
              <FaDesktop size={16} className='me-2' /> Mes cours
            </Link>
          </li>
          <li className='d-flex align-items-center '>
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
