import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Loading from '../../../common/Loading';
import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const fileInputRef = useRef();

  /* ── Charger le profil ──────────────────────────────────────── */
  const fetchUser = async () => {
    setLoading(true);
    const res    = await fetch(`${apiUrl}/fetch-user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    const result = await res.json();
    setLoading(false);
    if (result.status === '200') {
      setUser(result.data);
      reset({
        name:  result.data.name,
        email: result.data.email,
        phone: result.data.phone ?? '',
        bio:   result.data.bio   ?? '',
      });
    }
  };

  useEffect(() => { fetchUser(); }, []);

  /* ── Upload avatar ──────────────────────────────────────────── */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview immédiat
    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    const res    = await fetch(`${apiUrl}/upload-avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      body: formData,
    });
    const result = await res.json();
    setUploading(false);

    if (result.status === '200') {
      toast.success('Photo de profil mise à jour');
      // Mettre à jour l'URL réelle depuis le serveur
      setUser((u) => ({ ...u, avatar: result.avatar }));
    } else {
      toast.error("Échec de l'upload");
      setAvatarPreview(null);
    }
  };

  /* ── Mise à jour infos ──────────────────────────────────────── */
  const onSubmit = async (data) => {
    const res    = await fetch(`${apiUrl}/update-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept:         'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.status === '200') {
      toast.success(result.message);
    } else {
      const errs = result.message ?? {};
      if (typeof errs === 'object') {
        Object.keys(errs).forEach((field) =>
          setError(field, { message: errs[field][0] })
        );
      }
    }
  };

  /* ── Avatar src ─────────────────────────────────────────────── */
  const avatarSrc = avatarPreview
    ?? (user?.avatar ? `${apiUrl.replace('/api', '')}/uploads/avatar/${user.avatar}` : null);

  return (
    <Layout>
      <section className='section-4'>
        <div className='container pb-5 pt-3'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'><Link to='/account'>Compte</Link></li>
              <li className='breadcrumb-item active' aria-current='page'>Profil</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-md-12 mt-5 mb-3'>
              <h2 className='h4 mb-0'>Profil</h2>
            </div>

            <div className='col-lg-3 account-sidebar'>
              <UserSidebar />
            </div>

            <div className='col-lg-9'>
              {loading && <Loading />}
              {!loading && (
                <div className='card p-4 border-0 shadow-lg'>
                  <div className='card-body'>

                    {/* ── Avatar ── */}
                    <div className='d-flex align-items-center gap-4 mb-4'>
                      <div
                        className='position-relative'
                        style={{ width: 90, height: 90, cursor: 'pointer' }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt='avatar'
                            className='rounded-circle object-fit-cover border'
                            style={{ width: 90, height: 90 }}
                          />
                        ) : (
                          <div
                            className='rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fs-2'
                            style={{ width: 90, height: 90 }}
                          >
                            <i className='bi bi-person-fill' />
                          </div>
                        )}
                        {/* overlay caméra */}
                        <div
                          className='position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center'
                          style={{ width: 28, height: 28 }}
                        >
                          {uploading
                            ? <span className='spinner-border spinner-border-sm text-white' style={{ width: 14, height: 14 }} />
                            : <i className='bi bi-camera-fill text-white' style={{ fontSize: 13 }} />
                          }
                        </div>
                      </div>

                      <div>
                        <p className='mb-1 fw-semibold'>Photo de profil</p>
                        <p className='text-muted small mb-0'>JPG, PNG — max 2 Mo</p>
                        <button
                          type='button'
                          className='btn btn-sm btn-outline-secondary mt-1'
                          onClick={() => fileInputRef.current.click()}
                          disabled={uploading}
                        >
                          Changer la photo
                        </button>
                      </div>

                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/png,image/jpeg,image/jpg'
                        className='d-none'
                        onChange={handleAvatarChange}
                      />
                    </div>

                    {/* ── Formulaire ── */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <label className='form-label'>Nom</label>
                          <input
                            type='text'
                            {...register('name', { required: 'Le nom est obligatoire.' })}
                            placeholder='Nom complet'
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          />
                          {errors.name && <p className='invalid-feedback'>{errors.name.message}</p>}
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label'>Email</label>
                          <input
                            type='email'
                            {...register('email', {
                              required: "L'email est obligatoire.",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email invalide',
                              },
                            })}
                            placeholder='Email'
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          />
                          {errors.email && <p className='invalid-feedback'>{errors.email.message}</p>}
                        </div>

                        <div className='col-md-6'>
                          <label className='form-label'>Téléphone</label>
                          <input
                            type='tel'
                            {...register('phone')}
                            placeholder='+33 6 00 00 00 00'
                            className='form-control'
                          />
                        </div>

                        <div className='col-12'>
                          <label className='form-label'>Bio</label>
                          <textarea
                            {...register('bio')}
                            rows={4}
                            placeholder='Parlez de vous en quelques mots…'
                            className='form-control'
                            maxLength={1000}
                          />
                          <div className='form-text'>Max 1000 caractères</div>
                        </div>
                      </div>

                      <button className='btn btn-primary mt-4'>
                        Enregistrer les modifications
                      </button>
                    </form>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
