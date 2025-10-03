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

const LessonVideo = ({ lesson }) => {
  const [files, setFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState();

  useEffect(() => {
    if (lesson.video_url) {
      setVideoUrl(lesson.video_url);
    }
  }, [lesson]);
  return (
    <>
      <div className='card shadow-lg border-0'>
        <div className='card-body p-4'>
          <div className='d-flex '>
            <h4 className='h5 mb-3'>Vidéo de la leçon</h4>
          </div>

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
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                onload: (response) => {
                  response = JSON.parse(response);
                  toast.success(response.message);
                  setVideoUrl(response.data.lesson.video_url);
                  setFiles([]);
                },
                onerror: (errors) => {
                  console.log(errors);
                },
              },
            }}
            name='video'
            labelIdle='Glissez-déposez vos fichiers ou <span class="filepond--label-action">Parcourir</span>'
            labelFileProcessing='Téléchargement en cours...'
            labelFileProcessingComplete='Téléchargement terminé'
            labelTapToCancel='Cliquer pour annuler'
            labelTapToUndo='Cliquer pour supprimer'
          />
          {videoUrl && <ReactPlayer width='100%' height='100%' controls src={videoUrl} />}
        </div>
      </div>
    </>
  );
};

export default LessonVideo;
