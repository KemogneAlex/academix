import { useEffect, useState, useCallback, useRef } from 'react';

import { useSearchParams } from 'react-router-dom';
import Course from '../common/Course';
import Layout from '../common/Layout';
import { apiUrl } from '../common/Config';
import Loading from '../common/Loading';
import NotFound from '../common/NotFound';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debounceTimeout = useRef(null);
  const [sort, setSort] = useState('desc');
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : [];
  });
  const [levelChecked, setLevelChecked] = useState(() => {
    const level = searchParams.get('level');
    return level ? level.split(',') : [];
  });
  const [languageChecked, setLanguageChecked] = useState(() => {
    const language = searchParams.get('language');
    return language ? language.split(',') : [];
  });

  const handleResetFilters = useCallback(() => {
    setKeyword('');
    setSort('desc');
    setCategoryChecked([]);
    setLevelChecked([]);
    setLanguageChecked([]);

    setSearchParams({});
  }, [setSearchParams]);

  const handleLanguage = useCallback((e) => {
    const { checked, value } = e.target;
    setLanguageChecked((prev) => (checked ? [...prev, value] : prev.filter((id) => id !== value)));
  }, []);

  const handleLevel = useCallback((e) => {
    const { checked, value } = e.target;
    setLevelChecked((prev) => (checked ? [...prev, value] : prev.filter((id) => id !== value)));
  }, []);

  // Fonctions de chargement des données
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch-categories`);
      const result = await response.json();
      if (result.status === '200') {
        setCategories(result.data);
      }
    } catch {
      // Gestion d'erreur silencieuse
    }
  }, []);

  const fetchLevels = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch-levels`);
      const result = await response.json();
      if (result.status === '200') {
        setLevels(result.data);
      }
    } catch {
      // Gestion d'erreur silencieuse
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch-languages`);
      const result = await response.json();
      if (result.status === '200') {
        setLanguages(result.data);
      }
    } catch {
      // Gestion d'erreur silencieuse
    }
  }, []);

  const handleCategory = useCallback((e) => {
    const { checked, value } = e.target;
    setCategoryChecked((prev) => (checked ? [...prev, value] : prev.filter((id) => id !== value)));
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (categoryChecked.length > 0) params.append('category', categoryChecked.join(','));
      if (levelChecked.length > 0) params.append('level', levelChecked.join(','));
      if (languageChecked.length > 0) params.append('language', languageChecked.join(','));
      if (keyword) params.append('keyword', keyword);
      if (sort) params.append('sort', sort);

      setSearchParams(params, { replace: true });

      const response = await fetch(`${apiUrl}/fetch-courses?${params.toString()}`);
      const result = await response.json();

      if (result.status === '200') {
        setCourses(result.data || []);
      }
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [categoryChecked, levelChecked, languageChecked, keyword, sort, setSearchParams]);

  useEffect(() => {
    fetchCategories();
    fetchLevels();
    fetchLanguages();

    const timer = setTimeout(() => {
      fetchCourses();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchCategories, fetchCourses, fetchLevels, fetchLanguages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(timer);
  }, [categoryChecked, levelChecked, languageChecked, keyword, sort, fetchCourses]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setKeyword(searchInput);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchInput]);

  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlCategory = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const urlLevel = searchParams.get('level')?.split(',').filter(Boolean) || [];
    const urlLanguage = searchParams.get('language')?.split(',').filter(Boolean) || [];

    setKeyword(urlKeyword);
    setSearchInput(urlKeyword);
    setCategoryChecked(urlCategory);
    setLevelChecked(urlLevel);
    setLanguageChecked(urlLanguage);
  }, [searchParams, setSearchInput]);
  return (
    <>
      <Layout>
        <div className='container pb-5 pt-3'>
          <nav aria-label='breadcrumb'>
            <ol className='breadcrumb'>
              <li className='breadcrumb-item'>
                <a href='#'>Accueil</a>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                Formations
              </li>
            </ol>
          </nav>
          <div className='row'>
            <div className='col-lg-3'>
              <div className='sidebar mb-5 card border-0'>
                <div className='card-body shadow'>
                  <div className='mb-3 input-group'>
                    <input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      type='text'
                      className='form-control'
                      placeholder='Rechercher par mot-clé'
                    />

                    <div>
                      <button className='btn btn-primary btn-sm'>Rechercher</button>
                    </div>
                  </div>
                  <div className='pt-3'>
                    <h3 className='h5 mb-2'>Catégories</h3>
                    <ul>
                      {categories &&
                        categories.map((category) => {
                          return (
                            <li key={category.id}>
                              <div className='form-check'>
                                <input
                                  checked={categoryChecked.includes(category.id.toString())}
                                  onChange={(e) => handleCategory(e)}
                                  className='form-check-input'
                                  type='checkbox'
                                  value={category.id}
                                  id={`category-${category.id}`}
                                />
                                <label
                                  className='form-check-label'
                                  htmlFor={`category-${category.id}`}
                                >
                                  {category.name}
                                </label>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className='mb-3'>
                    <h3 className='h5 mb-2'>Niveau</h3>
                    <ul>
                      {levels &&
                        levels.map((level) => {
                          return (
                            <li key={level.id}>
                              <div className='form-check'>
                                <input
                                  checked={levelChecked.includes(level.id.toString())}
                                  onChange={(e) => handleLevel(e)}
                                  className='form-check-input'
                                  type='checkbox'
                                  value={level.id}
                                  id={`level-${level.id}`}
                                />
                                <label className='form-check-label' htmlFor={`level-${level.id}`}>
                                  {level.name}
                                </label>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className='mb-3'>
                    <h3 className='h5 mb-2'>Langue</h3>
                    <ul>
                      {languages &&
                        languages.map((language) => {
                          return (
                            <li key={language.id}>
                              <div className='form-check'>
                                <input
                                  checked={languageChecked.includes(language.id.toString())}
                                  onChange={(e) => handleLanguage(e)}
                                  className='form-check-input'
                                  type='checkbox'
                                  value={language.id}
                                  id={`language-${language.id}`}
                                />
                                <label
                                  className='form-check-label'
                                  htmlFor={`language-${language.id}`}
                                >
                                  {language.name}
                                </label>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className='btn btn-link p-0 text-decoration-none clear-filter'
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </div>
            <div className='col-lg-9'>
              <section className='section-3'>
                <div className='d-flex justify-content-between mb-3 align-items-center'>
                  <div className='h5 mb-0'>{/* 10 courses found */}</div>
                  <div>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className='form-select'
                    >
                      <option value='desc'>Plus récent d&apos;abord</option>
                      <option value='asc'>Plus ancien d&apos;abord</option>
                    </select>
                  </div>
                </div>
                <div className='row gy-4'>
                  {loading === false && courses.length === 0 && <NotFound />}
                  {loading === true && <Loading />}
                  {loading === false &&
                    courses &&
                    courses.map((course) => (
                      <Course key={course.id} course={course} customClasses='col-lg-4 col-md-6' />
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Courses;
