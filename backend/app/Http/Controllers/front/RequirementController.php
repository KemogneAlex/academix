<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Requirement;
use Illuminate\Support\Facades\Validator;

class RequirementController extends Controller
{
    
    // This method will return all requirements of a course
    public function index(Request $request)
    {
        $requirements = Requirement::where('course_id', $request->course_id)
                                ->orderBy('sort_order', "asc")
                                ->get();
        return response()->json([
            'status' => '200',
            'data' => $requirements,
            'message' => 'Les exigences ont été récupérées avec succès.'
        ],200);
        
    }

    // This method will store/save a requirement
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'requirement' => 'required',
            'course_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }

        $requirement = new Requirement();
        $requirement->course_id = $request->course_id;
        $requirement->text = $request->requirement;
        $requirement->sort_order = 1000;
        $requirement->save();

        return response()->json([
            'status' => '200',
            'data' => $requirement,
            'message' => 'L\'exigence a été créée avec succès.'
        ],200);
        
    }

    // This method update a requirement
    public function update($id, Request $request)
    {

        $requirement = Requirement::find($id);

        if ($requirement == null) {
            return response()->json([
                'status' => '404',
                'message' => 'L\'exigence n\'a pas été trouvée.'
            ],404);
        }
        
        $validator = Validator::make($request->all(), [
            'requirement' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }

  
        $requirement->text = $request->requirement;
        $requirement->save();

        return response()->json([
            'status' => '200',
            'data' => $requirement,
            'message' => 'Le resultat a été mis à jour avec succès.'
        ],200);
        
    }

    // This method delete a requirement
    public function destroy($id)
    {
        $requirement = Requirement::find($id);

        if ($requirement == null) {
            return response()->json([
                'status' => '404',
                'message' => 'L\'exigence n\'a pas été trouvée.'
            ],404);
        }
        
        $requirement->delete();

        return response()->json([
            'status' => '200',
            'message' => 'L\'exigence a été supprimée avec succès.'
        ],200);
        
    }

    // This method sort requirements
    public function sortRequirements(Request $request){
        if(!empty($request->requirements)){
            foreach ($request->requirements as $key => $requirement) {
                Requirement::where('id', $requirement['id'])->update([
                    'sort_order' => $key
                ]);
                
            }
        }
        return response()->json([
            'status' => '200',
            'message' => 'Les exigences ont été triées avec succès.'
        ],200);
    }
}
