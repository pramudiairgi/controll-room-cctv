<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCctvRequest;
use App\Http\Requests\Api\UpdateCctvRequest;
use App\Http\Requests\Api\UpdateCctvStatusRequest;
use App\Http\Requests\Api\UpdateYoutubeUrlRequest;
use App\Http\Resources\CctvResource;
use App\Models\Cctv;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CctvController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Cctv::query();

        if ($search = $request->q) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('location', 'ilike', "%{$search}%");
            });
        }

        if ($status = $request->status) {
            $query->where('status', $status);
        }

        if ($category = $request->category) {
            $query->where('category', $category);
        }

        if ($request->has('has_stream')) {
            $query->whereNotNull('stream_id');
        }

        $sortField = $request->sort ?? '-name';
        $direction = str_starts_with($sortField, '-') ? 'desc' : 'asc';
        $sortField = ltrim($sortField, '-');

        if (in_array($sortField, ['name', 'status', 'category', 'created_at', 'updated_at'])) {
            $query->orderBy($sortField, $direction);
        }

        $perPage = min((int) ($request->per_page ?? 20), 100);

        return CctvResource::collection($query->paginate($perPage));
    }

    public function map(): JsonResponse
    {
        $cctvs = Cctv::where('status', 'online')->get();

        return response()->json([
            'data' => CctvResource::collection($cctvs),
        ]);
    }

    public function store(StoreCctvRequest $request): JsonResponse
    {
        $cctv = Cctv::create([
            'name' => $request->name,
            'category' => $request->category,
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'stream_id' => $request->stream_id,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'data' => new CctvResource($cctv),
        ], 201);
    }

    public function show(Cctv $cctv): JsonResponse
    {
        return response()->json([
            'data' => new CctvResource($cctv),
        ]);
    }

    public function update(UpdateCctvRequest $request, Cctv $cctv): JsonResponse
    {
        $data = $request->validated();

        if ($request->has('youtube_url')) {
            $data['stream_id'] = $request->stream_id;
            unset($data['youtube_url']);
        }

        if ($request->missing('youtube_url') && array_key_exists('youtube_url', $data)) {
            unset($data['youtube_url']);
        }

        $cctv->update($data);

        return response()->json([
            'data' => new CctvResource($cctv),
        ]);
    }

    public function destroy(Cctv $cctv): JsonResponse
    {
        $cctv->delete();

        return response()->json(null, 204);
    }

    public function updateStatus(UpdateCctvStatusRequest $request, Cctv $cctv): JsonResponse
    {
        $cctv->update([
            'status' => $request->status,
            'failed_checks_count' => 0,
        ]);

        return response()->json([
            'data' => new CctvResource($cctv),
        ]);
    }

    public function updateYoutubeUrl(UpdateYoutubeUrlRequest $request, Cctv $cctv): JsonResponse
    {
        $streamId = Cctv::extractYouTubeId($request->youtube_url);

        $cctv->update(['stream_id' => $streamId]);

        return response()->json([
            'data' => new CctvResource($cctv),
        ]);
    }
}
