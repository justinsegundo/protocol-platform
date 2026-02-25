<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Protocol;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    public function definition(): array
    {
        $reviews = [
            'This protocol completely changed my morning routine. I have more energy and mental clarity within the first week.',
            'Simple and effective. I was skeptical at first but the results after two weeks were hard to argue with.',
            'Very well structured. Each step builds on the last and the explanations make it easy to understand the reasoning.',
            'I have tried similar approaches before but this one is more practical for people with a busy schedule.',
            'Noticed a real difference in my sleep quality after following this consistently for ten days.',
            'The instructions are clear and the protocol is easy to follow even for beginners. Highly recommend.',
            'Started this with my partner and we both felt the benefits within the first two weeks. Great protocol.',
            'Good overall but takes some discipline in the first few days. Once you get past that it becomes routine.',
            'I appreciate how evidence-based this is. The approach is grounded and not just wellness trends.',
            'This is exactly what I was looking for. Practical, detailed, and actually works if you stick to it.',
            'Three weeks in and still going strong. The hardest part was the first few days but now it feels natural.',
            'Shared this with my doctor and she said the approach is sound. Feeling noticeably better overall.',
            'I modified a couple of steps to fit my lifestyle and it still works well. Flexible enough to adapt.',
            'Best protocol I have found on this platform. Clear instructions and the results speak for themselves.',
            'A solid foundation for anyone starting out. Easy to understand and the progression makes sense.',
        ];

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'protocol_id' => Protocol::inRandomOrder()->first()?->id ?? Protocol::factory(),
            'rating' => $this->faker->numberBetween(3, 5),
            'feedback' => $this->faker->randomElement($reviews),
        ];
    }
}