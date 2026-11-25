<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Submit a contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string|min:5|max:5000',
        ]);

        $contact = ContactMessage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!',
            'data' => $contact
        ], 201);
    }

    /**
     * List all contact messages (Admin).
     */
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    /**
     * Mark message as read (Admin).
     */
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['read_status' => true]);

        return response()->json([
            'success' => true,
            'message' => 'বার্তাটি পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে।',
            'data' => $message
        ]);
    }

    /**
     * Delete message (Admin).
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'বার্তাটি সফলভাবে মুছে ফেলা হয়েছে।'
        ]);
    }
}
