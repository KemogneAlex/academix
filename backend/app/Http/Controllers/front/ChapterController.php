<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Chapter;
use Illuminate\Support\Facades\Validator;


class ChapterController extends Controller
{
   // This method will return all chapters of a course
   public function index(Request $request)
   {
       $chapters = Chapter::where('course_id', $request->course_id)
                        ->orderBy('sort_order')
                        ->get();
       return response()->json([
           'status' => '200',
           'data' => $chapters,
           'message' => 'Les chapitres ont été récupérés avec succès.'
       ],200);
       
   }

   // This method will store/save a chapter
   public function store(Request $request)
   {
       $validator = Validator::make($request->all(), [
           'chapter' => 'required',
           'course_id' => 'required',
       ]);

       if ($validator->fails()) {
           return response()->json([
               'status' => '400',
               'errors' => $validator->errors()
           ],400);
       }

       $chapter = new Chapter();
       $chapter->course_id = $request->course_id;
       $chapter->title = $request->chapter;
       $chapter->sort_order = 1000;
       $chapter->save();

       return response()->json([
           'status' => '200',
           'data' => $chapter,
           'message' => 'Le chapitre a été créé avec succès.'
       ],200);
       
   }

   // This method update a chapter
   public function update($id, Request $request)
   {

       $chapter = Chapter::find($id);

       if ($chapter == null) {
           return response()->json([
               'status' => '404',
               'message' => 'Le chapitre n\'a pas été trouvé.'
           ],404);
       }
       
       $validator = Validator::make($request->all(), [
           'chapter' => 'required',
       ]);

       if ($validator->fails()) {
           return response()->json([
               'status' => '400',
               'errors' => $validator->errors()
           ],400);
       }

 
       $chapter->title = $request->chapter;
       $chapter->save();

       $chapter-> load('lessons');

       return response()->json([
           'status' => '200',
           'data' => $chapter,
           'message' => 'Le chapitre a été mis à jour avec succès.'
       ],200);
       
   }

   // This method delete a chapter
   public function destroy($id)
   {
       $chapter = Chapter::find($id);

       if ($chapter == null) {
           return response()->json([
               'status' => '404',
               'message' => 'Le chapitre n\'a pas été trouvé.'
           ],404);
       }
       
       $chapter->delete();

       return response()->json([
           'status' => '200',
           'message' => 'Le chapitre a été supprimé avec succès.'
       ],200);
       
   }

   // This method sort chapters
   public function sortChapters(Request $request){
    $courseId = '';
       if(!empty($request->chapters)){
           foreach ($request->chapters as $key => $chapter) {
               $courseId = $chapter['course_id'];
               Chapter::where('id', $chapter['id'])->update([
                   'sort_order' => $key
               ]);
               
           }
       }

       $chapters = Chapter::where('course_id', $courseId)
       ->with('lessons')
       ->orderBy('sort_order', 'asc')->get();
       return response()->json([
           'status' => '200',
           'data' => $chapters,
           'message' => 'Les chapitres ont été triés avec succès.'
       ],200);
   }


}
