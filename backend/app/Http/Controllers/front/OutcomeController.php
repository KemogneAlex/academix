<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Outcome;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    // This method will return all outcomes of a course
    public function index(Request $request)
    {
        $outcomes = Outcome::where('course_id', $request->course_id)
                         ->orderBy('sort_order')
                         ->get();
        return response()->json([
            'status' => '200',
            'data' => $outcomes,
            'message' => 'Les resultats ont été récupérés avec succès.'
        ],200);
        
    }

    // This method will store/save a outcome
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
            'course_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }

        $outcome = new Outcome();
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => '200',
            'data' => $outcome,
            'message' => 'Le resultat a été créé avec succès.'
        ],200);
        
    }

    // This method update a outcome
    public function update($id, Request $request)
    {

        $outcome = Outcome::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => '404',
                'message' => 'Le resultat n\'a pas été trouvé.'
            ],404);
        }
        
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors()
            ],400);
        }

  
        $outcome->text = $request->outcome;
        $outcome->save();

        return response()->json([
            'status' => '200',
            'data' => $outcome,
            'message' => 'Le resultat a été mis à jour avec succès.'
        ],200);
        
    }

    // This method delete a outcome
    public function destroy($id)
    {
        $outcome = Outcome::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => '404',
                'message' => 'Le resultat n\'a pas été trouvé.'
            ],404);
        }
        
        $outcome->delete();

        return response()->json([
            'status' => '200',
            'message' => 'Le resultat a été supprimé avec succès.'
        ],200);
        
    }

    // This method sort outcomes
    public function sortOutcomes(Request $request){
        if(!empty($request->outcomes)){
            foreach ($request->outcomes as $key => $outcome) {
                Outcome::where('id', $outcome['id'])->update([
                    'sort_order' => $key
                ]);
                
            }
        }
        return response()->json([
            'status' => '200',
            'message' => 'Les resultats ont été triés avec succès.'
        ],200);
    }
}
