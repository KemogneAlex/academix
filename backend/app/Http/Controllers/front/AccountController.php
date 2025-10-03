<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Activity;
use App\Models\Chapter;
use App\Models\Lesson;
use App\Models\Review;


class AccountController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ], [
            'name.required' => 'Le nom est obligatoire',
            'name.min' => 'Le nom doit contenir au moins 5 caractères',
            'email.required' => "L'adresse email est obligatoire",
            'email.email' => "L'adresse email doit être une adresse email valide",
            'email.unique' => "L'adresse email est déjà utilisé",
            'password.required' => 'Le mot de passe est obligatoire',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas',
        ]);

        // This will return validation errors
        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Now save user info in database
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => 'Utilisateur enregistré avec succès',
        ], 200);
    }

    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'L\'adresse email est obligatoire',
            'email.email' => 'L\'adresse email doit être une adresse email valide',
            'password.required' => 'Le mot de passe est obligatoire',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
            ], 400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = User::find(Auth::id());
            $token = $user->createToken('token')->plainTextToken;
            
            return response()->json([
                'status' => '200',
                'token' => $token,
                'name' => $user->name,
                'id'=> Auth::user()->id
            ], 200);
            
        }else{
            return response()->json([
                'status' => '401',
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }

      

        
    }

    public function courses(Request $request){
        $courses = Course::where('user_id', $request->user()->id)
        ->withCount('enrollments')
        ->withCount('reviews')
        ->withSum('reviews', 'rating')
        ->with('level')
        ->get();

        $courses->map(function ($course){
            $course->rating = $course->reviews_count > 0 ? number_format(($course->reviews_sum_rating/ $course->reviews_count), 1) : "0.0";
        });
        return response()->json([
            'status' => '200',
            'courses' => $courses,
            'message' => 'Les cours ont été récupérés avec succès.'
        ],200);
    }

    public function enrollments(Request $request){
        $enrollments = Enrollment::where('user_id', $request->user()->id)
        ->with(['course' => function($query){
            $query->withCount('reviews');
            $query->withSum('reviews', 'rating');
            $query->withCount('enrollments');

        }, 'course.level'])
        ->get();

        $enrollments->map(function ($enrollment){
            $enrollment->course->rating = $enrollment->course->reviews_count > 0 ? number_format(($enrollment->course->reviews_sum_rating/ $enrollment->course->reviews_count), 1) : "0.0";
        });
        return response()->json([
            'status' => '200',
            'data' => $enrollments,
            'message' => 'Les inscriptions ont été récupérées avec succès.'
        ],200);
    }

    public function course($id,Request $request){
        $count = Enrollment::where([
            'user_id'=> $request->user()->id, 
            'course_id'=> $id
        ])->count();
        if($count == 0){
            return response()->json([
                'status' => '404',
                'message' => 'Vous ne pouvez pas accéder à ce cours'
            ],404);
        }

        $course = Course::where('id', $id)
        ->withCount('chapters')
        ->with(['level', 
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
        ])
        ->first();

        $totalLessons = $course->chapters->sum('lessons_count');
      
        $activeLesson = collect();
       // if no activity saved then show first lesson of first chapter

       $activityCount = Activity::where([
           'user_id'=> $request->user()->id, 
           'course_id'=> $id
       ])->count();
       
if($activityCount == 0){

        $chapter = Chapter::where('course_id', $id)
        ->orderBy('sort_order', 'asc')
        ->first();
    
        if (!$chapter) {
        return response()->json([
            'status' => '404',
            'message' => 'Aucun chapitre trouvé pour ce cours.'
        ], 404);
    }
        
            $lesson = Lesson::where('chapter_id', $chapter->id)
            ->where('status', 1)
            ->whereNotNull('video')
            ->orderBy('sort_order', 'asc')
            ->first();
        
            if (!$lesson) {
                return response()->json([
                    'status' => '404',
                    'message' => 'Aucune leçon disponible dans ce chapitre.'
                ], 404);
    }
    
           $activity = new Activity();
           $activity->user_id = $request->user()->id;
           $activity->course_id = $id;
           $activity->chapter_id = $chapter->id;
           $activity->lesson_id = $lesson->id;
           $activity->is_last_watched = "yes";
           $activity->save();

           $activeLesson = $lesson;
}else {
    $activity = Activity::where([
        'user_id'=> $request->user()->id, 
        'course_id'=> $id,
        'is_last_watched'=> 'yes'
    ])->first(); 

    if ($activity) {
        $activeLesson = Lesson::where('id', $activity->lesson_id)->first();
    } else {
     
        $chapter = Chapter::where('course_id', $id)->orderBy('sort_order', 'asc')->first();
        $activeLesson = Lesson::where('chapter_id', $chapter->id)
                              ->where('status', 1)
                              ->whereNotNull('video')
                              ->orderBy('sort_order', 'asc')
                              ->first();
    }
}

        // Fetch lessons which are completed
        $completedLessons = Activity::where([
            'user_id'=> $request->user()->id, 
            'course_id'=> $id,
            'is_completed'=> 'yes'
        ])
        ->pluck('lesson_id')
        ->toArray();

        $completedLessonsCount = Activity::where([
            'user_id'=> $request->user()->id, 
            'course_id'=> $id,
            'is_completed'=> 'yes'
        ])
        ->count();

        $progress = round(($completedLessonsCount / $totalLessons) * 100);
        return response()->json([
            'status' => '200',
            'data' => $course,
            'progress' => $progress,
            'activeLesson' => $activeLesson,
            'completedLessons' => $completedLessons,
            'message' => 'Le cours a été récupéré avec succès.'
        ],200);
}

public function saveUserActivity(Request $request){
    Activity::where([
        'user_id'=> $request->user()->id, 
        'course_id'=> $request->course_id
    ])->update([
        'is_last_watched'=> 'no'
    ]);

    Activity::updateOrInsert([
        'user_id'=> $request->user()->id, 
        'course_id'=> $request->course_id,
        'lesson_id'=> $request->lesson_id,
        'chapter_id'=> $request->chapter_id
    ], 
    [
        'is_last_watched'=> 'yes'
    ]
);

return response()->json([
    'status' => '200',
    'message' => 'Activité utilisateur enregistrée avec succès'
], 200);
}

public function markAsComplete(Request $request){
    Activity::where([
        'user_id'=> $request->user()->id, 
        'course_id'=> $request->course_id,
        'lesson_id'=> $request->lesson_id,
        'chapter_id'=> $request->chapter_id
    ])->update([
        'is_completed'=> 'yes'
    ]);

    // Fetch lessons which are completed
    $completedLessons = Activity::where([
        'user_id'=> $request->user()->id, 
        'course_id'=> $request->course_id,
        'is_completed'=> 'yes'
    ])
    ->pluck('lesson_id')
    ->toArray();

    $completedLessonsCount = Activity::where([
        'user_id'=> $request->user()->id, 
        'course_id'=> $request->course_id,
        'is_completed'=> 'yes'
    ])
    ->count();
    

    $course = Course::where('id', $request->course_id)
    ->withCount('chapters')
    ->with([   
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
    ])
    ->first();

    $totalLessons = $course->chapters->sum('lessons_count');
    $progress = round(($completedLessonsCount / $totalLessons) * 100);


    return response()->json([
        'status' => '200',
        'progress' => $progress,
        'completedLessons' => $completedLessons,
        'message' => 'Le cours a été marqué comme terminé avec succès'
    ], 200);
}

public function saveRating(Request $request){
    $course = Course::find($request->course_id);
    if($course == null){
        return response()->json([
            'status' => '404',
            'message' => 'Le cours n\'a pas été trouvé'
        ], 404);
    }

    $count = Review::where('course_id', $request->course_id)
    ->where('user_id', $request->user()->id)
    ->count();
    if($count > 0){
        return response()->json([
            'status' => '200',
            'message' => 'Vous avez déjà laissé un avis'
        ], 200);
    }
    $review = new Review();
    $review->user_id = $request->user()->id;
    $review->course_id = $request->course_id;
    $review->rating = $request->rating;
    $review->comment = $request->comment;
    $review->status = 1;
    $review->save();
    return response()->json([
        'status' => '200',
        'message' => 'Merci pour votre avis'
    ], 200);
}

public function fetchUser(Request $request){
    $user = User::find($request->user()->id);
   if($user == null){
        return response()->json([
            'status' => '404',
            'message' => 'Utilisateur non trouvé'
        ], 404);
    }
    return response()->json([
        'status' => '200',
        'data' => $user
    ], 200);
}
public function updateUser(Request $request){
    $user = User::find($request->user()->id);
    if($user == null){
        return response()->json([
            'status' => '404',
            'message' => 'Utilisateur non trouvé'
        ], 404);
    }
    $validator = Validator::make($request->all(), [
        'name' => 'required',
        'email' => 'required|email|unique:users,email,'.$request->user()->id, 'id'
    ]);
    if ($validator->fails()) {
        return response()->json([
            'status' => '400',
            'message' => $validator->errors()
        ], 400);
    }
    $user->name = $request->name;
    $user->email = $request->email;
    $user->save();
    return response()->json([
        'status' => '200',
        'message' => 'Utilisateur mis à jour avec succès'
    ], 200);
}

public function updatePassword(Request $request){
    $user = User::find($request->user()->id);
    if($user == null){
        return response()->json([
            'status' => '404',
            'message' => 'Utilisateur non trouvé'
        ], 404);
    }
    $validator = Validator::make($request->all(), [
        'old_password' => 'required',
        'new_password' => 'required|min:5',
    ]);
    if ($validator->fails()) {
        return response()->json([
            'status' => '400',
            'message' => $validator->errors()
        ], 400);
    }

    if (!Hash::check($request->old_password, $user->password)) {
        return response()->json([
            'status' => '400',
            'errors' => ['old_password' => ['Ancien mot de passe incorrect']]
        ], 400);
    }

    $user->password = $request->new_password;
    $user->save();
    return response()->json([
        'status' => '200',
        'message' => 'Mot de passe mis à jour avec succès'
    ], 200);
}
}
