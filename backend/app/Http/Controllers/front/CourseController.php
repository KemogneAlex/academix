<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\Category;
use App\Models\Level;
use App\Models\Language;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    // This method will return all course for a specific user
    public function index()
    {
        
    }

    // This method will store/save a course in database as a draft.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required | min:5'
            
        ]);
         if($validator->fails()){
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }

        $course = new Course();
        $course->title = $request->title;
        $course->status = '0';
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => '200',
            'data' => $course,
            'message' => 'Le cours a été créé avec succès.'
        ],200);
    }
// This method will return a specific course
    public function show($id){
        $course = Course::with(['chapters','chapters.lessons'])->find($id);

        if($course == null){
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ],404);
        }
        return response()->json([
            'status' => '200',
            'data' => $course,
            'message' => 'Le cours a été récupéré avec succès.'
        ],200);
    }

    // This method will return categorie/levels/languages
    public function metaData(){
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => '200',
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
            'message' => 'Les données ont été récupérées avec succès.'
        ],200);
    }

    // This method will update a course basic data.
    public function update( $id, Request $request)
    {
        $course = Course::find($id);

        if($course == null){
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ],404);
        }


        $validator = Validator::make($request->all(), [
            'title' => 'required | min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required', 
            'sell_price' => 'required',
            
            
        ]);
         if($validator->fails()){
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }
       // This will update course in db
        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->price = $request->sell_price;
        $course->cross_price = $request->cross_price;
        $course->description = $request->description;
        $course->save();

        return response()->json([
            'status' => '200',
            'data' => $course,
            'message' => 'Le cours a été mis à jour avec succès.'
        ],200);
    }
    // This method will save/update course image
    public function saveCourseImage($id, Request $request){
        $course = Course::find($id);

        if($course == null){
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ],404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg',
        ]);
        
        if($validator->fails()){
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }

        if($course->image != ""){
         if(File::exists(public_path('uploads/course/' .$course->image))){
            File::delete(public_path('uploads/course/' .$course->image));
        }
         if(File::exists(public_path('uploads/course/small/' .$course->image))){
            File::delete(public_path('uploads/course/small/' .$course->image));
        } 
              
        }


        $image = $request->file('image');
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime("now")."-" .$id."." .$ext;
        $image->move(public_path('uploads/course'), $imageName);

        // Create Small Thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/course/' . $imageName));

        // crop the best fitting 5:3 (600x360) ratio and resize to 600x360 pixel
        $img->scaleDown(750, 450); 
        $img->save(public_path('uploads/course/small/' . $imageName));



        $course->image = $imageName;
        $course->save();
        

        return response()->json([
            'status' => '200',
            'data' => [
                'course' => $course,
                'course_small_image' => asset('uploads/course/small/' . $imageName)
            ],
            'message' => 'L\'image du cours a été téléchargée avec succès.'
        ], 200);
    }

    // Check if course is ready to be published
    protected function isCourseReadyToPublish($course)
    {
       
        $missingFields = [];
        
        if (empty($course->title)) $missingFields[] = 'titre';
        if (empty($course->category_id)) $missingFields[] = 'catégorie';
        if (empty($course->level_id)) $missingFields[] = 'niveau';
        if (empty($course->language_id)) $missingFields[] = 'langue';
        if ($course->price === null || $course->price === '') $missingFields[] = 'prix';
        if (empty($course->description)) $missingFields[] = 'description';
        if (empty($course->image)) $missingFields[] = 'image de couverture';

        if (!empty($missingFields)) {
            Log::warning('Champs manquants pour la publication du cours', [
                'course_id' => $course->id,
                'missing_fields' => $missingFields
            ]);
            
            return [
                'ready' => false,
                'message' => 'Veuillez renseigner tous les champs obligatoires : ' . implode(', ', $missingFields) . '.'
            ];
        }

       
        $chapters = Chapter::where('course_id', $course->id)
            ->with(['lessons' => function($query) {
                $query->whereNull('video');
            }])
            ->has('lessons')
            ->get();

        if ($chapters->isEmpty()) {
            return [
                'ready' => false,
                'message' => 'Veuillez ajouter au moins une leçon dans vos chapitres avant de publier.'
            ];
        }

        // Vérifier si toutes les leçons ont une vidéo
        $lessonsWithoutVideo = collect();
        foreach ($chapters as $chapter) {
            $invalidLessons = $chapter->lessons->filter(function($lesson) {
                return empty($lesson->video);
            });
            
            if ($invalidLessons->isNotEmpty()) {
                $lessonsWithoutVideo = $lessonsWithoutVideo->concat($invalidLessons);
            }
        }

        if ($lessonsWithoutVideo->isNotEmpty()) {
            return [
                'ready' => false,
                'message' => 'Veuillez ajouter une vidéo à toutes les leçons avant de publier le cours.'
            ];
        }

        return ['ready' => true, 'message' => 'Le cours est prêt à être publié.'];
    }

    // This method will change the status of a course(publish/unpublish)
    public function changeStatus($id, Request $request)
    {
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);
    
        if ($course == null) {
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ], 404);
        }

    
        if ($request->status == 1) {
            $check = $this->isCourseReadyToPublish($course);
            if (!$check['ready']) {
                return response()->json([
                    'status' => '400',
                    'message' => 'Impossible de publier le cours : ' . $check['message']
                ], 400);
            }
        }
        
        $course->status = $request->status;
        $course->save();
    
        $message = $request->status == 1 ? 'Le cours a été publié avec succès.' : 'Le cours a été enregistré comme brouillon.';
        return response()->json([
            'status' => '200',
            'course' => $course,
            'message' => $message
        ], 200);
    }
       public function delete($id, Request $request){ 
        $course = Course::where('id', $id)
        ->where('user_id', $request->user()->id)
        ->first();

        if($course == null){
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ],404);
        }
        
       
       $chapters = Chapter::where('course_id', $id)->get();
       if (!empty($chapters)){
        foreach ($chapters as $chapter) {
            $lessons = Lesson::where('chapter_id', $chapter->id)->get();
            if (!empty($lessons)){
                foreach ($lessons as $lesson) {
                   if ($lesson->video != ""){
                    if(File::exists(public_path('uploads/course/videos/' .$lesson->video))){
                        File::delete(public_path('uploads/course/videos/' .$lesson->video));
                    }
                   }
                  
                }
            }
           
        }
       }
       if($course->image != ""){
        if(File::exists(public_path('uploads/course/small/' .$course->image))){
            File::delete(public_path('uploads/course/small/' .$course->image));
        }
        if(File::exists(public_path('uploads/course/' .$course->image))){
            File::delete(public_path('uploads/course/' .$course->image));
        }
       }
       $course->delete();
       return response()->json([
           'status' => '200',
           'message' => 'Le cours a été supprimé avec succès.'
       ],200);
       }


}
