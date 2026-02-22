<?php

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ThreadFactory extends Factory
{
    public function definition(): array
    {
        $tagPool = ['question', 'experience', 'tips', 'science', 'beginner', 'advanced', 'community', 'challenge'];

        $titles = [
            'Has anyone tried combining fasting with cold therapy?',
            'What results did you see after the gut reset protocol?',
            'Best time of day for breathwork — morning or evening?',
            'Tips for staying consistent with daily mobility work',
            'How long before you notice changes from the anti-inflammatory diet?',
            'My experience after 30 days on the sleep optimization protocol',
            'Anyone else struggle with the cold shower step?',
            'Adaptogens — which ones actually worked for you?',
            'Combining multiple protocols — is it too much?',
            'Beginner questions about intermittent fasting',
        ];

        $bodies = [
            "I have been following the gut reset protocol for about two weeks now and I am genuinely shocked by the results. My bloating has almost completely disappeared and my energy levels in the morning are noticeably higher.\n\nHas anyone else had a similar experience? I am curious whether the probiotic supplementation or the dietary changes had the bigger impact.",
            "Started the morning breathwork routine three weeks ago and I want to share what I have noticed so far.\n\nThe first week was rough — I felt lightheaded during the breathing rounds and almost gave up. By week two it started to feel natural. Now I actually look forward to it.\n\nThe cold shower part is still a challenge but I have cut it down from dreading it to just accepting it. Anyone have tips for making that part easier?",
            "I have a question for people who have done the anti-inflammatory protocol. The guide says to eliminate seed oils but I cook a lot of Asian food and sesame oil feels essential to the recipes.\n\nIs cold-pressed sesame oil acceptable or should I find a substitute? Would love to hear how others handled this.",
            "After 90 days on the sleep optimization protocol I want to give an honest review. The good: falling asleep is much faster and I wake up less during the night. The challenging: the no-screen rule for 2 hours before bed was genuinely hard to maintain consistently.\n\nMy overall rating would be 4 out of 5. The protocol works if you commit to it fully.",
        ];

        return [
            'user_id' => User::factory(),
            'protocol_id' => Protocol::factory(),
            'title' => $this->faker->randomElement($titles),
            'body' => $this->faker->randomElement($bodies),
            'tags' => $this->faker->randomElements($tagPool, rand(1, 3)),
        ];
    }
}