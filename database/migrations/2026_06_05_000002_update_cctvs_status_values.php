<?php

use App\Models\Cctv;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Cctv::where('status', 'active')->update(['status' => 'online']);
        Cctv::whereIn('status', ['inactive', 'maintenance'])->update(['status' => 'offline']);
    }

    public function down(): void
    {
        Cctv::where('status', 'online')->update(['status' => 'active']);
        Cctv::where('status', 'offline')->update(['status' => 'inactive']);
    }
};
