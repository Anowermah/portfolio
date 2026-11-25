<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get setting value by key, with optional default.
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        $decoded = json_decode($setting->value, true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : $setting->value;
    }

    /**
     * Set setting value by key.
     */
    public static function set(string $key, $value): static
    {
        $encoded = is_array($value) || is_object($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : $value;
        return static::updateOrCreate(['key' => $key], ['value' => $encoded]);
    }
}
