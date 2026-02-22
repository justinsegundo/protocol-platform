<?php

namespace Database\Factories;

use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    public function definition(): array
    {
        $comments = [
            'This really resonates with my experience. I noticed the same thing around day 10.',
            'Great point. I would also add that hydration plays a huge role here — most people underestimate it.',
            'I tried this for two weeks and the difference in my sleep quality was noticeable.',
            'Has anyone combined this with intermittent fasting? Curious if there are synergies.',
            'The science behind this checks out. There is solid research supporting this approach.',
            'I struggled with this at first but consistency is the key. Give it at least 3 weeks.',
            'Thank you for sharing. This is exactly what I was looking for.',
            'I would recommend starting slow if you are new to this. Do not jump straight to the advanced version.',
            'Week two was the hardest for me but after that it became second nature.',
            'Does anyone know if this works the same way for older adults? Asking for my parents.',
            'I combined this with cold therapy and the results were even better than expected.',
            'The key thing nobody mentions is that you need to be consistent with the timing.',
            'Started this last month and my energy levels are completely different now.',
            'Really appreciate the detailed breakdown. Most protocols skip the why behind each step.',
        ];

        return [
            'user_id' => User::factory(),
            'thread_id' => Thread::factory(),
            'parent_id' => null,
            'body' => $this->faker->randomElement($comments),
        ];
    }
}