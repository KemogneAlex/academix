import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import toast from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

const EditCover = ({ course, setCourse }) => {
  const [files, setFiles] = useState([]);

  return (
    <>
      <div className='card shadow-lg border-0 mt-3'>
        <div className='card-body p-4'>
          <div className='d-flex '>
            <h4 className='h5 mb-3'>Modifier la couverture</h4>
          </div>

          <FilePond
            acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
            credits={false}
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={false}
            maxFiles={1}
            server={{
              process: {
                url: `${apiUrl}/save-course-image/${course.id}`,
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                onload: (response) => {
                  response = JSON.parse(response);
                  toast.success(response.message);
                  setCourse((prevCourse) => ({
                    ...prevCourse,
                    image: response.data.course.image,
                    course_small_image: response.data.course_small_image,
                  }));
                  setFiles([]);
                },
                onerror: (errors) => {
                  console.log(errors);
                },
              },
            }}
            name='image'
            labelIdle='Glissez-déposez vos fichiers ou <span class="filepond--label-action">Parcourir</span>'
            labelFileProcessing='Téléchargement en cours...'
            labelFileProcessingComplete='Téléchargement terminé'
            labelTapToCancel='Cliquer pour annuler'
            labelTapToUndo='Cliquer pour supprimer'
          />
          {course.course_small_image && (
            <img src={course.course_small_image} className='w-100 rounded' alt='' />
          )}
        </div>
      </div>
    </>
  );
};

export default EditCover;
