<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Activity;
use App\Models\Chapter;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    /**
     * Liste les certificats de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $certificates = Certificate::where('user_id', $request->user()->id)
            ->with(['course:id,title,slug,image'])
            ->orderByDesc('issued_at')
            ->get();

        return response()->json([
            'status'  => '200',
            'data'    => $certificates,
            'message' => 'Certificats récupérés avec succès.',
        ]);
    }

    /**
     * Récupère un certificat spécifique (par course_id).
     */
    public function show($courseId, Request $request)
    {
        $cert = Certificate::where('user_id', $request->user()->id)
            ->where('course_id', $courseId)
            ->with(['course:id,title,slug', 'user:id,name'])
            ->first();

        if (!$cert) {
            return response()->json([
                'status'  => '404',
                'message' => 'Certificat non trouvé. Complétez le cours pour l\'obtenir.',
            ], 404);
        }

        return response()->json([
            'status' => '200',
            'data'   => $cert,
        ]);
    }

    /**
     * Génère le certificat si le cours est 100% complété.
     * Appelé automatiquement depuis markAsComplete ou manuellement.
     */
    public static function generateIfCompleted(int $userId, int $courseId): ?Certificate
    {
        // Déjà un certificat ?
        $existing = Certificate::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();
        if ($existing) return $existing;

        // Calcule le total des leçons du cours
        $course = Course::with(['chapters' => function ($q) {
            $q->withCount(['lessons' => function ($q2) {
                $q2->where('status', 1)->whereNotNull('video');
            }]);
        }])->find($courseId);

        if (!$course) return null;

        $totalLessons = $course->chapters->sum('lessons_count');
        if ($totalLessons === 0) return null;

        // Leçons complétées
        $completedCount = Activity::where([
            'user_id'      => $userId,
            'course_id'    => $courseId,
            'is_completed' => 'yes',
        ])->count();

        if ($completedCount < $totalLessons) return null;

        // Tout complété → on génère le certificat
        return Certificate::create([
            'user_id'   => $userId,
            'course_id' => $courseId,
        ]);
    }
}
