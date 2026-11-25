<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;
use App\Models\User;
use Illuminate\Http\Request;

class ClientProjectController extends Controller
{
    /**
     * Get projects and stats for the authenticated client.
     */
    public function clientProjects(Request $request)
    {
        $user = $request->user();

        $projects = ClientProject::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_projects' => $projects->count(),
            'active_projects' => $projects->whereIn('status', ['in_progress', 'in_review'])->count(),
            'pending_projects' => $projects->where('status', 'pending')->count(),
            'completed_projects' => $projects->where('status', 'completed')->count(),
            'total_spent' => $projects->whereIn('paid_status', ['paid', 'partial'])->sum('budget'),
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'data' => $projects,
        ]);
    }

    /**
     * Client requests/submits a new project order.
     */
    public function clientStoreProject(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:200',
            'service_category' => 'required|string|max:100',
            'description' => 'required|string|max:3000',
            'budget' => 'nullable|numeric|min:0',
            'deadline' => 'nullable|date',
            'client_notes' => 'nullable|string|max:1000',
        ]);

        $project = ClientProject::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'service_category' => $request->service_category,
            'description' => $request->description,
            'budget' => $request->budget ?? 0,
            'paid_status' => 'unpaid',
            'progress' => 0,
            'status' => 'pending',
            'deadline' => $request->deadline,
            'client_notes' => $request->client_notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'আপনার নতুন প্রজেক্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে! ডেভেলপার দ্রুত পর্যালোচনা করে শুরু করবেন।',
            'data' => $project,
        ], 201);
    }

    /**
     * Client accepts delivery and marks project complete.
     */
    public function clientAcceptDelivery(Request $request, $id)
    {
        $user = $request->user();
        $project = ClientProject::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $project->update([
            'status' => 'completed',
            'progress' => 100,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ধন্যবাদ! প্রজেক্টটি সফলভাবে সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।',
            'data' => $project,
        ]);
    }

    /**
     * Admin: Get all client projects with marketplace statistics.
     */
    public function adminProjects(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'অননুমোদিত অ্যাক্সেস।'], 403);
        }

        $projects = ClientProject::with(['client:id,name,email,phone,company'])
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total_orders' => $projects->count(),
            'active_orders' => $projects->whereIn('status', ['in_progress', 'in_review'])->count(),
            'pending_orders' => $projects->where('status', 'pending')->count(),
            'delivered_orders' => $projects->where('status', 'delivered')->count(),
            'completed_orders' => $projects->where('status', 'completed')->count(),
            'total_revenue' => $projects->whereIn('paid_status', ['paid', 'partial'])->sum('budget'),
            'total_project_value' => $projects->sum('budget'),
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'data' => $projects,
        ]);
    }

    /**
     * Admin: Create and assign a project to a client.
     */
    public function adminStoreProject(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'অননুমোদিত অ্যাক্সেস।'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:200',
            'service_category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'budget' => 'nullable|numeric|min:0',
            'paid_status' => 'nullable|in:unpaid,partial,paid',
            'progress' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|in:pending,in_progress,in_review,delivered,completed,cancelled',
            'deadline' => 'nullable|date',
            'delivery_link' => 'nullable|string|max:500',
            'delivery_notes' => 'nullable|string',
        ]);

        $project = ClientProject::create([
            'user_id' => $request->user_id,
            'title' => $request->title,
            'service_category' => $request->service_category,
            'description' => $request->description,
            'budget' => $request->budget ?? 0,
            'paid_status' => $request->paid_status ?? 'unpaid',
            'progress' => $request->progress ?? 0,
            'status' => $request->status ?? 'in_progress',
            'deadline' => $request->deadline,
            'delivery_link' => $request->delivery_link,
            'delivery_notes' => $request->delivery_notes,
        ]);

        $project->load('client:id,name,email,phone,company');

        return response()->json([
            'success' => true,
            'message' => 'ক্লায়েন্টের জন্য নতুন প্রজেক্ট অর্ডার সফলভাবে তৈরি হয়েছে।',
            'data' => $project,
        ], 201);
    }

    /**
     * Admin: Update project progress, status, delivery links, budget.
     */
    public function adminUpdateProject(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'অননুমোদিত অ্যাক্সেস।'], 403);
        }

        $project = ClientProject::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'service_category' => 'sometimes|required|string|max:100',
            'budget' => 'nullable|numeric|min:0',
            'paid_status' => 'nullable|in:unpaid,partial,paid',
            'progress' => 'nullable|integer|min:0|max:100',
            'status' => 'nullable|in:pending,in_progress,in_review,delivered,completed,cancelled',
            'deadline' => 'nullable|date',
            'delivery_link' => 'nullable|string|max:500',
            'delivery_notes' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $data = $request->only([
            'title',
            'service_category',
            'description',
            'budget',
            'paid_status',
            'progress',
            'status',
            'deadline',
            'delivery_link',
            'delivery_notes',
        ]);

        // Auto set progress to 100 if completed
        if (isset($data['status']) && $data['status'] === 'completed' && (!isset($data['progress']) || $data['progress'] < 100)) {
            $data['progress'] = 100;
        }

        $project->update($data);
        $project->load('client:id,name,email,phone,company');

        return response()->json([
            'success' => true,
            'message' => 'প্রজেক্ট সফলভাবে আপডেট হয়েছে। ক্লায়েন্ট তার ড্যাশবোর্ডে নতুন তথ্য দেখতে পাবেন।',
            'data' => $project,
        ]);
    }

    /**
     * Admin: Delete project.
     */
    public function adminDeleteProject(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'অননুমোদিত অ্যাক্সেস।'], 403);
        }

        $project = ClientProject::findOrFail($id);
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'প্রজেক্ট অর্ডার মুছে ফেলা হয়েছে।',
        ]);
    }

    /**
     * Admin: Get all clients for assigning projects.
     */
    public function adminClients(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'অননুমোদিত অ্যাক্সেস।'], 403);
        }

        $clients = User::select('id', 'name', 'email', 'phone', 'role', 'company', 'created_at')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $clients,
        ]);
    }
}
