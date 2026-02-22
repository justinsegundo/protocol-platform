<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProtocolFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['Nutrition', 'Recovery', 'Movement', 'Mental Health', 'Sleep', 'Detox', 'Breathwork'];
        $tagPool = ['fasting', 'anti-inflammatory', 'gut-health', 'sleep', 'meditation', 'mobility', 'cold-therapy', 'herbal', 'breathwork', 'detox', 'hydration', 'grounding'];

        $titles = [
            '72-Hour Gut Reset Protocol',
            'Morning Breathwork and Cold Exposure Routine',
            'Anti-Inflammatory Nutrition Plan',
            'Deep Sleep Optimization Protocol',
            'Daily Mobility and Joint Health Routine',
            '7-Day Mental Clarity Detox',
            'Intermittent Fasting for Metabolic Health',
            'Herbal Adaptogen Protocol for Stress',
            'Grounding and Nervous System Reset',
            'Post-Workout Recovery Stack',
            'Seasonal Immune Boosting Protocol',
            'Digital Detox and Mindfulness Reset',
        ];

        $contents = [
            "This protocol is designed to reset your gut microbiome over 72 hours using targeted nutrition and supplementation.\n\nDay 1: Begin with a 16-hour fast. Break your fast with bone broth and fermented vegetables. Avoid processed foods, gluten, and dairy entirely.\n\nDay 2: Introduce probiotic-rich foods such as kefir, kimchi, and sauerkraut. Drink at least 2 liters of filtered water. Add a psyllium husk supplement before bed.\n\nDay 3: Reintroduce whole foods gradually. Focus on leafy greens, wild-caught fish, and prebiotic fibers. Monitor energy levels and digestion.",
            "Cold exposure combined with breathwork can dramatically improve mental resilience, metabolism, and mood.\n\nStep 1: Begin with 3 rounds of Wim Hof breathing — 30 deep breaths, hold, and release. Do this before your shower.\n\nStep 2: Start your shower at a comfortable temperature. In the last 2 minutes, switch to cold water and focus on your breath.\n\nStep 3: After the shower, spend 5 minutes in stillness — no phone, no music. Notice how your body feels.",
            "Chronic inflammation is the root of most modern diseases. This 30-day protocol addresses it through targeted food choices.\n\nWeek 1: Eliminate seed oils, refined sugar, and processed grains. Replace with olive oil, whole fruits, and root vegetables.\n\nWeek 2: Add omega-3 supplementation — 2g of EPA/DHA daily with meals. Introduce turmeric and ginger tea each morning.\n\nWeek 3-4: Track energy, skin clarity, and joint comfort. Most people notice significant changes by day 21.",
        ];

        return [
            'user_id' => User::factory(),
            'title' => $this->faker->randomElement($titles),
            'content' => $this->faker->randomElement($contents),
            'tags' => $this->faker->randomElements($tagPool, rand(2, 4)),
            'category' => $this->faker->randomElement($categories),
        ];
    }
}