<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop staro polje
            $table->dropColumn('name');

            // Dodaj nova polja
            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
            $table->enum('role', ['patient','doctor','admin'])->after('password');
            $table->string('phone')->after('role');
            $table->foreignId('specialty_id')->nullable()->constrained('specializations')->nullOnDelete()->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Vraćamo nazad staro stanje
            $table->string('name')->after('id');
            $table->dropColumn(['first_name','last_name','role','phone','specialty_id']);
        });
    }
};
