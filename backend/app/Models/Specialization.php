<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name'];

    public function doctor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
