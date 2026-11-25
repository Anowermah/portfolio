<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private function defaultSettings(): array
    {
        return [
            'general' => [
                'site_title' => 'মো: আনোয়ার হোসাইন - Web Developer, Graphics Designer & Video Editor',
                'logo_url' => '',
                'logo_text' => 'মো: আনোয়ার হোসাইন',
                'tagline' => 'পোর্টফোলিও',
                'favicon_url' => '/favicon.ico',
            ],
            'hero' => [
                'badge' => 'স্বাগতম আমার পোর্টফোলিওতে',
                'avatar_url' => '/images/profile/hero-portrait.jpg',
                'name' => 'মো: আনোয়ার হোসাইন',
                'title' => 'Web Developer • Graphics Designer • Video Editor',
                'bio' => 'প্রযুক্তিগত সকল বিষয়ে পারদর্শী একজন ক্রিয়েটিভ প্রফেশনাল। ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন এবং ভিডিও এডিটিং এ দক্ষতার সাথে আধুনিক ও আকর্ষণীয় সমাধান প্রদান করি।',
                'btn_contact_text' => 'যোগাযোগ করুন',
                'btn_portfolio_text' => 'আমার পোর্টফোলিও দেখুন',
                'stats' => [
                    ['number' => '৫+', 'label' => 'বছর অভিজ্ঞতা'],
                    ['number' => '৫০+', 'label' => 'সফল প্রজেক্ট'],
                    ['number' => '৩০+', 'label' => 'সন্তুষ্ট ক্লায়েন্ট'],
                    ['number' => '১০০%', 'label' => 'কাজের গুণগত মান']
                ]
            ],
            'about' => [
                'badge' => 'আমার সম্পর্কে জানুন',
                'section_title' => 'পরিচিতি ও কর্মজীবন',
                'section_subtitle' => 'প্রযুক্তি ও ক্রিয়েটিভিটির সমন্বয়ে আধুনিক ডিজিটাল সমাধান তৈরিতে আমি নিবেদিত',
                'story_heading' => 'ডিজিটাল উদ্ভাবন এবং আধুনিক ওয়েব আর্কিটেকচারে পারদর্শী',
                'story_p1' => 'আসসালামু আলাইকুম, আমি মো: আনোয়ার হোসাইন। ওয়েব ডেভেলপমেন্ট, আধুনিক গ্রাফিক্স ডিজাইন এবং প্রফেশনাল ভিডিও এডিটিং এ আমার দীর্ঘ অভিজ্ঞতা রয়েছে। আমি ক্লিন কোড, রেসপন্সিভ ডিজাইন এবং ইউজার-ফ্রেন্ডলি ইন্টারফেস তৈরিতে বিশ্বাসী।',
                'story_p2' => 'ক্যারিয়ারে বিভিন্ন ইসলামিক ও সামাজিক সংস্থা, ই-কমার্স ব্র্যান্ড এবং মিডিয়া এজেন্সির সাথে সফলতার সাথে কাজ করেছি। প্রতিটি প্রজেক্টকে নিজের মনে করে সর্বোচ্চ মান বজায় রেখে ক্লায়েন্টের লক্ষ্য পূরণ করাই আমার প্রধান উদ্দেশ্য।',
                'resume_url' => '',
                'avatar_url' => '/images/profile/profile-formal.jpg',
                'story_photo_1' => '/images/profile/about-story.jpg',
                'story_photo_2' => '/images/profile/seminar.jpg',
                'availability' => 'Available for Freelance & Remote Work',
                'info_items' => [
                    ['label' => 'পূর্ণ নাম', 'value' => 'মো: আনোয়ার হোসাইন'],
                    ['label' => 'অভিজ্ঞতা', 'value' => '৫+ বছর'],
                    ['label' => 'অবস্থান', 'value' => 'ঢাকা, বাংলাদেশ'],
                    ['label' => 'ভাষা', 'value' => 'বাংলা (মাতৃভাষা), ইংরেজি'],
                    ['label' => 'শিক্ষাগত যোগ্যতা', 'value' => 'কম্পিউটার সায়েন্স / টেকনোলজি'],
                    ['label' => 'কাজের ধরন', 'value' => 'ফুল-টাইম / ফ্রিল্যান্স / রিমোট']
                ],
                'highlights' => [
                    ['title' => 'আধুনিক কোডিং', 'desc' => 'React, TypeScript, Laravel ও আধুনিক ক্লিন আর্কিটেকচার'],
                    ['title' => 'দৃষ্টিনন্দন ডিজাইন', 'desc' => 'ব্র্যান্ড আইডেন্টিটি, UI/UX ও ভেক্টর গ্রাফিক্স আর্ট'],
                    ['title' => 'সিনেমাটিক এডিটিং', 'desc' => 'ভিডিও কালার গ্রেডিং, মোশন ইফেক্ট ও অডিও এনহ্যান্সমেন্ট']
                ]
            ],
            'skills' => [
                'section_title' => 'আমার দক্ষতা',
                'section_subtitle' => 'ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং এবং প্রযুক্তিগত সকল ক্ষেত্রে ব্যাপক অভিজ্ঞতা',
                'categories' => [
                    [
                        'title' => 'ওয়েব ডেভেলপমেন্ট',
                        'icon' => 'Code',
                        'skills' => ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Laravel', 'PHP', 'Node.js']
                    ],
                    [
                        'title' => 'ডাটাবেস ও ব্যাকএন্ড',
                        'icon' => 'Database',
                        'skills' => ['MySQL', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Redis']
                    ],
                    [
                        'title' => 'গ্রাফিক্স ডিজাইন',
                        'icon' => 'Globe',
                        'skills' => ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Canva', 'Logo Design', 'UI/UX Design']
                    ],
                    [
                        'title' => 'ভিডিও এডিটিং',
                        'icon' => 'Server',
                        'skills' => ['Adobe Premiere Pro', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve', 'Motion Graphics']
                    ],
                    [
                        'title' => 'ডেভেলপমেন্ট টুলস',
                        'icon' => 'Shield',
                        'skills' => ['Git', 'Docker', 'VS Code', 'Figma to Code', 'Responsive Design', 'Performance Optimization']
                    ],
                    [
                        'title' => 'অন্যান্য প্রযুক্তি',
                        'icon' => 'Zap',
                        'skills' => ['SEO', 'Digital Marketing', 'Content Writing', 'Social Media Management', 'E-commerce Solutions']
                    ]
                ]
            ],
            'services' => [
                'section_title' => 'আমার সেবা সমূহ',
                'section_subtitle' => 'আপনার বিজনেসের প্রসারে আধুনিক, দৃষ্টিনন্দন ও মানসম্মত ডিজিটাল সলিউশন',
                'items' => [
                    [
                        'title' => 'ওয়েব ডেভেলপমেন্ট',
                        'description' => 'আধুনিক ও রেসপন্সিভ ওয়েবসাইট, ই-কমার্স ও কাস্টম ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট।',
                        'features' => ['কাস্টম ডিজাইন', 'মোবাইল ফ্রেন্ডলি', 'SEO অপ্টিমাইজড', 'ফাস্ট স্পিড']
                    ],
                    [
                        'title' => 'গ্রাফিক্স ডিজাইন',
                        'description' => 'ব্র্যান্ড আইডেন্টিটি, লোগো, সোশ্যাল মিডিয়া ব্যানার ও প্রিন্ট মিডিয়া ডিজাইন।',
                        'features' => ['লোগো ডিজাইন', 'সোশ্যাল মিডিয়া কিট', 'ব্যানার ও পোস্টার', 'ভেক্টর আর্ট']
                    ],
                    [
                        'title' => 'ভিডিও এডিটিং',
                        'description' => 'ইউটিউব, রিলস, বিজ্ঞাপন ও কর্পোরেট ভিডিওর মানসম্মত ও সিনেমাটিক এডিটিং।',
                        'features' => ['কালার গ্রেডিং', 'সাউন্ড ডিজাইন', 'মোশন গ্রাফিক্স', 'দ্রুত ডেলিভারি']
                    ]
                ]
            ],
            'experience' => [
                'section_title' => 'কর্মঅভিজ্ঞতা',
                'section_subtitle' => 'বিভিন্ন প্রতিষ্ঠানে কাজের অভিজ্ঞতা এবং দক্ষতা অর্জনের যাত্রা',
                'items' => [
                    [
                        'title' => 'সিনিয়র ওয়েব ডেভেলপার',
                        'company' => 'টেক সলিউশন্স বিডি',
                        'location' => 'ঢাকা, বাংলাদেশ',
                        'period' => '২০২২ - বর্তমান',
                        'description' => 'React, Node.js এবং MongoDB ব্যবহার করে আধুনিক ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট।',
                        'skills' => ['React', 'Node.js', 'MongoDB', 'TypeScript']
                    ],
                    [
                        'title' => 'গ্রাফিক্স ডিজাইনার',
                        'company' => 'ক্রিয়েটিভ এজেন্সি',
                        'location' => 'চট্টগ্রাম, বাংলাদেশ',
                        'period' => '২০২০ - ২০২২',
                        'description' => 'ব্র্যান্ড আইডেন্টিটি, প্রিন্ট মিডিয়া এবং ডিজিটাল গ্রাফিক্স ডিজাইন।',
                        'skills' => ['Adobe Creative Suite', 'Branding', 'UI/UX Design']
                    ],
                    [
                        'title' => 'ভিডিও এডিটর',
                        'company' => 'মিডিয়া প্রোডাকশন হাউস',
                        'location' => 'সিলেট, বাংলাদেশ',
                        'period' => '২০১৮ - ২০২০',
                        'description' => 'প্রোমোশনাল ভিডিও, ডকুমেন্টারি এবং সোশ্যাল মিডিয়া কন্টেন্ট এডিটিং।',
                        'skills' => ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve']
                    ]
                ]
            ],
            'projects' => [
                'section_title' => 'আমার প্রজেক্ট',
                'section_subtitle' => 'ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন এবং ভিডিও এডিটিং এর বিভিন্ন প্রজেক্টের নমুনা',
                'items' => [
                    [
                        'title' => 'জমঈয়ত শুব্বানে আহলে হাদীস বাংলাদেশ',
                        'description' => 'ইসলামিক ধর্মীয় সংস্থার অফিসিয়াল ওয়েবসাইট - সংস্থার পরিচিতি, কার্যক্রম, দায়িত্বশীল তালিকা এবং যোগাযোগের তথ্য সহ সম্পূর্ণ ওয়েবসাইট।',
                        'technologies' => ['PHP', 'MySQL', 'Bootstrap', 'HTML5', 'CSS3', 'JavaScript'],
                        'demo' => 'https://www.shubbanbd.org/',
                        'image' => '',
                        'featured' => true,
                        'category' => 'ধর্মীয় সংস্থা ওয়েবসাইট'
                    ],
                    [
                        'title' => 'লামাআন শপ - ডিজিটাল মার্কেটপ্লেস',
                        'description' => 'ওয়ার্ডপ্রেস থিম ও প্লাগিনের অনলাইন দোকান - ডিজিটাল পণ্য বিক্রয়, কাস্টমার সাপোর্ট এবং পেমেন্ট সিস্টেম সহ সম্পূর্ণ ই-কমার্স সাইট।',
                        'technologies' => ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'PayPal', 'Stripe'],
                        'demo' => 'https://lamaan.shop/',
                        'image' => '',
                        'featured' => true,
                        'category' => 'ই-কমার্স ওয়েবসাইট'
                    ],
                    [
                        'title' => 'কাস্টম ওয়েবসাইট ডেভেলপমেন্ট',
                        'description' => 'বিভিন্ন ব্যবসায়িক প্রতিষ্ঠানের জন্য কাস্টম ওয়েবসাইট তৈরি - রেসপন্সিভ ডিজাইন, SEO অপটিমাইজেশন এবং দ্রুত লোডিং।',
                        'technologies' => ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Bootstrap'],
                        'demo' => 'https://www.shubbanbd.org/',
                        'image' => '',
                        'featured' => true,
                        'category' => 'কাস্টম ওয়েব ডেভেলপমেন্ট'
                    ]
                ]
            ],
            'contact' => [
                'section_title' => 'যোগাযোগ করুন',
                'section_subtitle' => 'আপনার কোনো প্রশ্ন বা প্রজেক্ট নিয়ে আলোচনা করতে সরাসরি যোগাযোগ করতে পারেন',
                'email' => 'anower9135@gmail.com',
                'phone' => '01777028791',
                'whatsapp' => '8801777028791',
                'address' => 'ঢাকা, বাংলাদেশ',
                'github' => 'https://github.com/anowerhossain',
                'linkedin' => 'https://linkedin.com/in/anowerhossain',
                'facebook' => 'https://facebook.com',
                'twitter' => 'https://twitter.com'
            ],
            'footer' => [
                'bio' => 'প্রযুক্তিগত সকল বিষয়ে পারদর্শী একজন ক্রিয়েটিভ প্রফেশনাল। আধুনিক ও মানসম্মত ডিজিটাল সমাধান দিতে সর্বদা প্রস্তুত।',
                'copyright' => '© ২০২৬ মো: আনোয়ার হোসাইন। সর্বস্বত্ব সংরক্ষিত।'
            ]
        ];
    }

    public function index()
    {
        $defaults = $this->defaultSettings();
        $stored = SiteSetting::all()->pluck('value', 'key')->toArray();

        $merged = [];
        foreach ($defaults as $key => $defaultValue) {
            if (isset($stored[$key])) {
                $decoded = json_decode($stored[$key], true);
                $merged[$key] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $stored[$key];
            } else {
                $merged[$key] = $defaultValue;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $merged
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }

    public function update(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $val) {
            SiteSetting::set($key, $val);
        }

        return response()->json([
            'success' => true,
            'message' => 'সাইট সেটিংস সফলভাবে আপডেট করা হয়েছে।',
            'data' => $this->index()->original['data']
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,webp,gif,svg,ico|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads'), $filename);

            return response()->json([
                'success' => true,
                'url' => '/uploads/' . $filename,
                'message' => 'ছবি সফলভাবে আপলোড হয়েছে'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'কোনো ছবি পাওয়া যায়নি'
        ], 400);
    }
}
