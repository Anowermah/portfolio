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
        Schema::create('client_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('service_category')->default('Web Development');
            $table->text('description')->nullable();
            $table->decimal('budget', 12, 2)->default(0.00);
            $table->string('paid_status')->default('unpaid'); // unpaid, partial, paid
            $table->integer('progress')->default(0); // 0 - 100
            $table->string('status')->default('pending'); // pending, in_progress, in_review, delivered, completed, cancelled
            $table->dateTime('deadline')->nullable();
            $table->string('delivery_link')->nullable(); // Demo link, GitHub, Drive, etc.
            $table->text('delivery_notes')->nullable();
            $table->text('client_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_projects');
    }
};
