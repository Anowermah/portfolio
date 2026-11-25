<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\ClientProject;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard summary statistics including marketplace data.
     */
    public function stats()
    {
        $totalMessages = ContactMessage::count();
        $unreadMessages = ContactMessage::where('read_status', false)->count();
        $totalUsers = User::count();
        $recentMessages = ContactMessage::orderBy('created_at', 'desc')->take(5)->get();

        // Marketplace stats
        $totalOrders = ClientProject::count();
        $activeOrders = ClientProject::whereIn('status', ['in_progress', 'in_review'])->count();
        $deliveredOrders = ClientProject::where('status', 'delivered')->count();
        $completedOrders = ClientProject::where('status', 'completed')->count();
        $totalRevenue = ClientProject::whereIn('paid_status', ['paid', 'partial'])->sum('budget');
        $recentOrders = ClientProject::with('client:id,name,email')->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'totalMessages' => $totalMessages,
                'unreadMessages' => $unreadMessages,
                'totalUsers' => $totalUsers,
                'recentMessages' => $recentMessages,
                // Marketplace Metrics
                'totalOrders' => $totalOrders,
                'activeOrders' => $activeOrders,
                'deliveredOrders' => $deliveredOrders,
                'completedOrders' => $completedOrders,
                'totalRevenue' => $totalRevenue,
                'recentOrders' => $recentOrders,
            ]
        ]);
    }

    /**
     * Get list of users with their true role.
     */
    public function users()
    {
        $users = User::select('id', 'name', 'email', 'role', 'phone', 'company', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'user_id' => (string) $user->id,
                    'display_name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? 'client',
                    'roles' => [$user->role ?? 'client'],
                    'phone' => $user->phone ?? '',
                    'company' => $user->company ?? '',
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Update user role (e.g. promote client to admin or vice versa).
     */
    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:admin,client',
        ]);

        $user = User::findOrFail($id);

        // Prevent self-demotion if only 1 admin
        if ($user->id === $request->user()->id && $request->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'আপনি নিজের অ্যাডমিন রোল পরিবর্তন করতে পারবেন না।'
            ], 422);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'message' => "ব্যবহারকারীর রোল সফলভাবে '{$request->role}' হিসেবে আপডেট হয়েছে।",
            'data' => $user
        ]);
    }
}
