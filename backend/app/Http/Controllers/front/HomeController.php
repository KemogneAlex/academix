<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Course;
use App\Models\Level;
use App\Models\Enrollment;
use App\Models\Language;


class HomeController extends Controller
{
    public function fetchCategories(){
        $categories = Category::orderBy('name', 'asc')
        ->where('status', 1)
        ->get();
        return response()->json([
            'status' => '200',
            'data' => $categories,
            'message' => 'Les catégories ont été récupérées avec succès.'
        ],200);
    }

    public function fetchLevels(){
        $levels = Level::orderBy('created_at', 'asc')
        ->where('status', 1)
        ->get();
        return response()->json([
            'status' => '200',
            'data' => $levels,
            'message' => 'Les niveaux ont été récupérés avec succès.'
        ],200);
    }
    public function fetchLanguages(){
        $languages = Language::orderBy('name', 'asc')
        ->where('status', 1)
        ->get();
        return response()->json([
            'status' => '200',
            'data' => $languages,
            'message' => 'Les langues ont été récupérées avec succès.'
        ],200);
    }


    public function fetchFeaturedCourses(){
        $courses = Course::orderBy('title', 'asc')
        ->with('level')
        ->withCount('enrollments')
        ->withCount('reviews')
        ->withSum('reviews', 'rating')
        ->where('is_featured', 'yes')
        ->where('status', 1)
        ->get();

        $courses->map(function ($course){
            $course->rating = $course->reviews_count > 0 ? number_format(($course->reviews_sum_rating/ $course->reviews_count), 1) : "0.0";
        });
        return response()->json([
            'status' => '200',
            'data' => $courses,
            'message' => 'Les cours ont été récupérés avec succès.'
        ],200);
    }

    public function courses(Request $request){
        $courses = Course::where('status', 1)
        ->withCount('enrollments')
        ->with('level')
        ->withCount('reviews')
        ->withSum('reviews', 'rating');
        // Filter Course by keyword
        if(!empty($request->keyword)){
            $courses=$courses->where('title', 'like', '%'.$request->keyword.'%');
        }


        // Filter Course by category
        if(!empty($request->category)){
            $categoryArr = explode(',', $request->category);
            if(!empty($categoryArr)){
                $courses=$courses->whereIn('category_id', $categoryArr);
            }
        }

        // Filter Course by level
        if(!empty($request->level)){
            $levelArr = explode(',', $request->level);
            if (!empty($levelArr)){
                $courses=$courses->whereIn('level_id', $levelArr);
            }
        }

        // Filter Course by language
        if(!empty($request->language)){
            $languageArr = explode(',', $request->language);
            if (!empty($languageArr)){
                $courses=$courses->whereIn('language_id', $languageArr);
            }
        }

        if(!empty($request->sort)){
            $sortArr  = ['asc', 'desc'];
            if(in_array($request->sort, $sortArr)){
                $courses=$courses->orderBy('created_at', $request->sort);
            } else {
                $courses=$courses->orderBy('created_at', 'desc');
            }
            
        }

        $courses = $courses->get();
        $courses->map(function ($course){
            $course->rating = $course->reviews_count > 0 ? number_format(($course->reviews_sum_rating/ $course->reviews_count), 1) : "0.0";
        });
        return response()->json([
            'status' => '200',
            'data' => $courses,
            'message' => 'Les cours ont été récupérés avec succès.'
        ],200);
        
    }

    public function course($id){
        $course = Course::where('id', $id)
        ->withCount('enrollments')
        ->withCount('reviews')
        ->withSum('reviews', 'rating')
        ->withCount('chapters')
        ->with(['level', 
        'reviews',
        'reviews.user',
        'category', 
        'language',
        'chapters' => function ($query) {
            $query->withCount(['lessons' => function ($q){
                $q->where('status', 1);
                $q->whereNotNull('video');
            }]); 
            $query->withSum(['lessons' => function ($q){
                $q->where('status', 1);
                $q->whereNotNull('video');
            }], 'duration');

        },
        'chapters.lessons'=>function($q) {
            $q->where('status', 1);
            $q->whereNotNull('video');  
        },
        'outcomes', 
        'requirements'])
        ->first();
       
        if($course == null){
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ],404);
        }

        $totalDuration = $course->chapters->sum('lessons_sum_duration');
        $totalLessons = $course->chapters->sum('lessons_count');
        $course->total_duration = $totalDuration;
        $course->total_lessons = $totalLessons;
        $course->rating = $course->reviews_count > 0 ? number_format(($course->reviews_sum_rating/ $course->reviews_count), 1) : "0.0";
        return response()->json([
            'status' => '200',
            'data' => $course,
            'message' => 'Le cours a été récupéré avec succès.'
        ],200);
    }

    function enroll(Request $request){
        $Course = Course::find($request->course_id);
        if($Course == null){
            return response()->json([
                'status' => '404',
                'message' => 'Le cours n\'a pas été trouvé.'
            ],404);
        }
       $count = Enrollment::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
        ])->count();
        if($count > 0){
            return response()->json([
                'status' => '409',
                'message' => 'Le cours a déjà été inscrit.'
            ],409);
        }
       
       $enrollment = new Enrollment();
       $enrollment->user_id = $request->user()->id;
       $enrollment->course_id = $request->course_id;
       $enrollment->save();
        return response()->json([
            'status' => '200',
            'message' => 'Le cours a été inscrit avec succès.'
        ],200);
    }
}
