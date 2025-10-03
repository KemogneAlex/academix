<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Lesson;
use Illuminate\Support\Facades\File;
use App\Models\Chapter;


class LessonController extends Controller
{
     // This method will store/save a lesson
   public function store(Request $request)
   {
       $validator = Validator::make($request->all(), [
           'lesson' => 'required',
           'chapter' => 'required',
       ]);

       if ($validator->fails()) {
           return response()->json([
               'status' => '400',
               'errors' => $validator->errors()
           ],400);
       }

       $lesson = new Lesson();
       $lesson->chapter_id = $request->chapter; // Ajout de cette ligne
       $lesson->title = $request->lesson;
       $lesson->sort_order = 1000;
       $lesson->status = $request->status;
       $lesson->save();

       // Récupérer le chapitre mis à jour avec toutes ses leçons
       $chapter = Chapter::where('id', $request->chapter)->with('lessons')->first();

    return response()->json([
        'status' => '200',
        'data' => $chapter,
        'message' => 'La leçon a été créée avec succès.'
    ],200);
       
   }

   // This method fetch lesson data
   public function show($id)
{
       $lesson = Lesson::find($id);

       if ($lesson == null) {
           return response()->json([
               'status' => '404',
               'message' => 'La leçon n\'a pas été trouvée.'
           ],404);
       }
       
       return response()->json([
           'status' => '200',
           'data' => $lesson,
           'message' => 'La leçon a été trouvée avec succès.'
       ],200);
   }

   // This method will update a lesson
   public function update($id, Request $request)
   {

       $lesson = Lesson::find($id);

       if ($lesson == null) {
           return response()->json([
               'status' => '404',
               'message' => 'La leçon n\'a pas été trouvée.'
           ],404);
       }
       
       $validator = Validator::make($request->all(), [
           'lesson' => 'required',
           'chapter' => 'required|exists:chapters,id',
       ]);

       if ($validator->fails()) {
           return response()->json([
               'status' => '400',
               'errors' => $validator->errors()
           ], 400);
       }

       // Utiliser $request->chapter qui vient du formulaire
       $lesson->chapter_id = $request->chapter;
       $lesson->title = $request->lesson;
       $lesson->is_free_preview = $request->boolean('free_preview') ? 'yes' : 'no';
       $lesson->duration = $request->duration;
       $lesson->description = $request->description;
       $lesson->status = $request->status;
       $lesson->save();

       return response()->json([
           'status' => '200',
           'data' => $lesson,
           'message' => 'La leçon a été mise à jour avec succès.'
       ],200);
       
   }

   // This method delete a lesson
   public function destroy($id)
   {
       $lesson = Lesson::find($id);

       if ($lesson == null) {
           return response()->json([
               'status' => '404',
               'message' => 'La leçon n\'a pas été trouvée.'
           ],404);
       }
       $chapterId = $lesson->chapter_id;
       
       $lesson->delete();
       $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();
       return response()->json([
           'status' => '200',
           'chapter' => $chapter,
           'message' => 'La leçon a été supprimée avec succès.'
       ],200);
       
   }
 // This method will save a lesson video
   public function saveVideo($id, Request $request){
    $lesson = Lesson::find($id);

    if($lesson == null){
        return response()->json([
            'status' => '404',
            'message' => 'La leçon n\'a pas été trouvé.'
        ],404);
    }

    $validator = Validator::make($request->all(), [
        'video' => 'required|mimes:mp4',
    ]);
    
    if($validator->fails()){
        return response()->json([
            'status' => '400',
            'errors' => $validator->errors()
        ],400);
    }
 if ($lesson->video != "") {
    if(File::exists(public_path('uploads/course/videos/' .$lesson->video))){
        File::delete(public_path('uploads/course/videos/' .$lesson->video));
    }
}

    $video = $request->video;
    $ext = $video->getClientOriginalExtension();
    $videoName = strtotime("now")."-" .$id."." .$ext;
    $video->move(public_path('uploads/course/videos'), $videoName);


    $lesson->video = $videoName;
    $lesson->save();
    

    // Mettre à jour l'URL de la vidéo dans l'objet lesson
    $lesson->video_url = asset('uploads/course/videos/' . $videoName);
    
    return response()->json([
        'status' => '200',
        'data' => [
            'lesson' => $lesson
        ],
        'message' => 'La vidéo de la leçon a été téléchargée avec succès.'
    ], 200);
}
  // This method will sort lessons
public function sortLessons(Request $request){
    $chapterId = '';
    if(!empty($request->lessons)){
        foreach ($request->lessons as $key => $lesson) {
            $chapterId = $lesson['chapter_id'];
            Lesson::where('id', $lesson['id'])->update([
                'sort_order' => $key
            ]);
            
        }
    }

    $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();
    return response()->json([
        'status' => '200',
        'chapter' => $chapter,
        'message' => 'Les leçons ont été triées avec succès.'
    ],200);
}


}
