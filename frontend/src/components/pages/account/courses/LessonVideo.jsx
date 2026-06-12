import { useEffect, useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const LessonVideo = ({ lesson, videoType, onVideoTypeChange, onExternalUrlChange }) => {
  const [files, setFiles]     = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  useEffect(() => {
    if (lesson?.video_url) setVideoUrl(lesson.video_url);
    if (lesson?.video_url_external) setExternalUrl(lesson.video_url_external);
  }, [lesson]);

  /* URL à prévisualiser selon le type */
  const previewUrl = videoType === 'upload'
    ? videoUrl
    : (videoType === 'youtube' || videoType === 'vimeo') ? externalUrl : '';

  const handleExternalChange = (e) => {
    setExternalUrl(e.target.value);
    onExternalUrlChange?.(e.target.value);
  };

  return (
    <div className='card shadow-lg border-0'>
      <div className='card-body p-4'>
        <h4 className='h5 mb-3'>Vidéo de la leçon</h4>

        {/* ── Sélecteur type ── */}
        <div className='mb-3'>
          <label className='form-label fw-semibold'>Type de vidéo</label>
          <div className='d-flex gap-3'>
            {['upload', 'youtube', 'vimeo'].map((type) => (
              <div className='form-check' key={type}>
                <input
                  className='form-check-input'
                  type='radio'
                  id={`vtype-${type}`}
                  value={type}
                  checked={videoType === type}
                  onChange={() => onVideoTypeChange?.(type)}
                />
                <label className='form-check-label text-capitalize' htmlFor={`vtype-${type}`}>
                  {type === 'upload' ? 'Fichier MP4' : type === 'youtube' ? 'YouTube' : 'Vimeo'}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upload fichier ── */}
        {videoType === 'upload' && (
          <FilePond
            acceptedFileTypes={['video/mp4']}
            credits={false}
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={false}
            maxFiles={1}
            server={{
              process: {
                url: `${apiUrl}/save-lesson-video/${lesson.id}`,
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                onload: (response) => {
                  const res = JSON.parse(response);
                  toast.success(res.message);
                  setVideoUrl(res.data.lesson.video_url);
                  setFiles([]);
                },
                onerror: (err) => console.log(err),
              },
            }}
            name='video'
            labelIdle='Glissez-déposez ou <span class="filepond--label-action">Parcourir</span>'
            labelFileProcessing='Téléchargement en cours...'
            labelFileProcessingComplete='Terminé'
            labelTapToCancel='Annuler'
            labelTapToUndo='Supprimer'
          />
        )}

        {/* ── URL externe YouTube / Vimeo ── */}
        {(videoType === 'youtube' || videoType === 'vimeo') && (
          <div className='mb-3'>
            <label className='form-label'>
              {videoType === 'youtube' ? 'URL YouTube' : 'URL Vimeo'}
            </label>
            <input
              type='url'
              className='form-control'
              placeholder={
                videoType === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://vimeo.com/...'
              }
              value={externalUrl}
              onChange={handleExternalChange}
            />
            <div className='form-text text-muted'>
              {videoType === 'youtube'
                ? 'Copiez l\'URL complète depuis YouTube'
                : 'Copiez l\'URL complète depuis Vimeo'}
            </div>
          </div>
        )}

        {/* ── Aperçu ── */}
        {previewUrl && (
          <div className='mt-3'>
            <p className='small text-muted mb-1'>Aperçu :</p>
            <ReactPlayer width='100%' height='220px' controls url={previewUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonVideo;
