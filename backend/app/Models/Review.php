<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DateTimeInterface;

class Review extends Model
{
   
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    protected $casts = [    
        
    ];
    
    protected function serializeDate(DateTimeInterface $date): string
    {
        return Carbon::instance($date)
            ->locale('fr')
            ->translatedFormat('d F Y'); 
            
    }
}
