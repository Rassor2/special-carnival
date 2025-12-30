#!/usr/bin/env python3
"""
Seed script to populate the database with initial categories and 15 articles
for the RestfulMind website.
"""

import asyncio
import os
import sys
from datetime import datetime, timezone, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import uuid
import bcrypt

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')

# Categories data
CATEGORIES = [
    {
        "id": str(uuid.uuid4()),
        "name": "Sleep & Rest",
        "slug": "sleep-rest",
        "description": "Explore the science of sleep, understand sleep cycles, and discover practical tips to improve your sleep quality for better health and well-being.",
        "image_url": "https://images.unsplash.com/photo-1758243954982-cd1d5a8b9f97?w=600",
        "meta_title": "Sleep & Rest Articles | RestfulMind",
        "meta_description": "Science-backed articles about sleep quality, sleep cycles, and rest for better health.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Mental Health",
        "slug": "mental-health",
        "description": "Resources and insights on maintaining mental wellness, understanding emotions, and building psychological resilience in daily life.",
        "image_url": "https://images.unsplash.com/photo-1758274539654-23fa349cc090?w=600",
        "meta_title": "Mental Health Resources | RestfulMind",
        "meta_description": "Informational articles about mental wellness, emotional health, and psychological well-being.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Stress & Anxiety",
        "slug": "stress-anxiety",
        "description": "Understanding stress and anxiety, their impacts on daily life, and evidence-based strategies for management and relief.",
        "image_url": "https://images.unsplash.com/photo-1665764356520-3daa0e8326b1?w=600",
        "meta_title": "Stress & Anxiety Management | RestfulMind",
        "meta_description": "Learn about stress management and anxiety relief through science-backed approaches.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Productivity & Focus",
        "slug": "productivity-focus",
        "description": "Strategies and techniques to enhance focus, boost productivity, and achieve more while maintaining balance and well-being.",
        "image_url": "https://images.unsplash.com/photo-1700554565325-aea824405166?w=600",
        "meta_title": "Productivity & Focus Tips | RestfulMind",
        "meta_description": "Evidence-based strategies to improve focus, productivity, and work-life balance.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Lifestyle & Habits",
        "slug": "lifestyle-habits",
        "description": "Building healthy habits and lifestyle choices that support overall well-being, from nutrition to daily routines.",
        "image_url": "https://images.unsplash.com/photo-1628743270481-123e2501e518?w=600",
        "meta_title": "Healthy Lifestyle & Habits | RestfulMind",
        "meta_description": "Articles about building healthy habits and lifestyle choices for better living.",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Research & Studies",
        "slug": "research-studies",
        "description": "Deep dives into scientific research and studies on sleep, mental health, and productivity, explained in accessible language.",
        "image_url": "https://images.unsplash.com/photo-1692035072849-93a511f35b2c?w=600",
        "meta_title": "Sleep & Mental Health Research | RestfulMind",
        "meta_description": "Scientific research and studies about sleep, mental health, and productivity explained.",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

# Articles content
def get_articles(categories):
    cat_map = {c["slug"]: c["id"] for c in categories}
    
    articles = [
        {
            "title": "How Sleep Affects Mental Health",
            "slug": "how-sleep-affects-mental-health",
            "category_id": cat_map["sleep-rest"],
            "excerpt": "Discover the profound connection between sleep quality and mental well-being, and learn why prioritizing rest is essential for psychological health.",
            "featured_image": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
            "reading_time": 8,
            "is_featured": True,
            "content": """<h2>The Sleep-Mental Health Connection</h2>
<p>Sleep and mental health share a bidirectional relationship that scientists are only beginning to fully understand. Poor sleep can contribute to the development of mental health issues, while mental health conditions often disrupt sleep patterns.</p>

<h3>How Sleep Affects Your Brain</h3>
<p>During sleep, your brain performs critical maintenance functions. The glymphatic system clears toxic waste products, memories are consolidated, and emotional experiences are processed. When sleep is disrupted, these processes suffer.</p>

<p>Research has shown that even one night of poor sleep can increase anxiety levels by up to 30%. Chronic sleep deprivation is associated with higher rates of depression, anxiety disorders, and other mental health conditions.</p>

<h3>The Role of REM Sleep</h3>
<p>REM (Rapid Eye Movement) sleep plays a particularly important role in emotional regulation. During this stage, the brain processes emotional experiences from the day, helping to reduce their intensity and integrate them into memory.</p>

<p>Studies have found that people who get adequate REM sleep are better able to:</p>
<ul>
<li>Recognize and respond to emotional cues</li>
<li>Regulate their emotional responses</li>
<li>Maintain stable moods throughout the day</li>
<li>Process traumatic or stressful experiences</li>
</ul>

<h3>Breaking the Cycle</h3>
<p>If you're caught in a cycle of poor sleep and declining mental health, there are steps you can take. Cognitive Behavioral Therapy for Insomnia (CBT-I) has shown remarkable effectiveness in improving both sleep and mental health symptoms.</p>

<h3>Practical Steps for Better Sleep</h3>
<p>Consider implementing these evidence-based strategies:</p>
<ul>
<li>Maintain a consistent sleep schedule, even on weekends</li>
<li>Create a relaxing bedtime routine</li>
<li>Limit screen time in the hour before bed</li>
<li>Keep your bedroom cool, dark, and quiet</li>
<li>Avoid caffeine and alcohol close to bedtime</li>
</ul>

<blockquote>Sleep is not a luxury but a necessity for mental health. Treating it as optional is like treating food or water as optional.</blockquote>

<h3>When to Seek Help</h3>
<p>If sleep problems persist or significantly impact your daily functioning, consider consulting a healthcare provider. Conditions like sleep apnea, restless leg syndrome, or circadian rhythm disorders may require professional treatment.</p>"""
        },
        {
            "title": "Best Habits to Improve Sleep Quality",
            "slug": "best-habits-improve-sleep-quality",
            "category_id": cat_map["lifestyle-habits"],
            "excerpt": "Transform your sleep with these scientifically-proven habits that can help you fall asleep faster, stay asleep longer, and wake up refreshed.",
            "featured_image": "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=800",
            "reading_time": 7,
            "is_featured": True,
            "content": """<h2>Building a Foundation for Better Sleep</h2>
<p>Quality sleep isn't just about the hours you spend in bed—it's about the habits you cultivate throughout the day. These evidence-based strategies can transform your sleep quality.</p>

<h3>Morning Habits That Improve Night Sleep</h3>
<p>What you do in the morning sets the stage for how you'll sleep at night. Light exposure is particularly crucial.</p>

<ul>
<li><strong>Get morning sunlight:</strong> Exposure to bright light within 30-60 minutes of waking helps regulate your circadian rhythm</li>
<li><strong>Exercise early:</strong> Morning workouts can improve sleep quality without interfering with falling asleep</li>
<li><strong>Eat a balanced breakfast:</strong> Proper nutrition supports stable energy and better sleep hormones</li>
</ul>

<h3>Afternoon Strategies</h3>
<p>The afternoon is when many people unknowingly sabotage their sleep:</p>

<ul>
<li><strong>Cut off caffeine:</strong> Stop consuming caffeine at least 6-8 hours before bed</li>
<li><strong>Strategic napping:</strong> If you nap, keep it short (20-30 minutes) and early (before 3 PM)</li>
<li><strong>Manage stress:</strong> Practice stress-reduction techniques before problems accumulate</li>
</ul>

<h3>Evening Routines for Better Sleep</h3>
<p>Your evening routine signals to your body that it's time to wind down:</p>

<p>Start dimming lights 2-3 hours before bed. This helps your body produce melatonin naturally. Consider using warm-toned lights or candles in the evening.</p>

<h3>The 10-3-2-1 Rule</h3>
<p>A simple framework for better sleep:</p>
<ul>
<li><strong>10 hours before bed:</strong> No more caffeine</li>
<li><strong>3 hours before bed:</strong> No more food or alcohol</li>
<li><strong>2 hours before bed:</strong> No more work</li>
<li><strong>1 hour before bed:</strong> No more screens</li>
</ul>

<h3>Optimizing Your Sleep Environment</h3>
<p>Your bedroom should be a sanctuary for sleep:</p>
<ul>
<li>Temperature: Keep it between 65-68°F (18-20°C)</li>
<li>Darkness: Use blackout curtains or a sleep mask</li>
<li>Quiet: Consider white noise if you're in a noisy environment</li>
<li>Comfort: Invest in a quality mattress and pillows</li>
</ul>

<blockquote>Small changes in daily habits can lead to dramatic improvements in sleep quality over time.</blockquote>"""
        },
        {
            "title": "How Stress Impacts Daily Productivity",
            "slug": "how-stress-impacts-daily-productivity",
            "category_id": cat_map["stress-anxiety"],
            "excerpt": "Understanding the relationship between stress and productivity can help you work smarter, not harder, while protecting your well-being.",
            "featured_image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            "reading_time": 9,
            "is_featured": True,
            "content": """<h2>The Stress-Productivity Paradox</h2>
<p>A small amount of stress can enhance performance—this is known as eustress. However, chronic or excessive stress impairs cognitive function and decimates productivity. Understanding this balance is key to sustainable high performance.</p>

<h3>How Stress Affects Your Brain</h3>
<p>When stressed, your brain releases cortisol and adrenaline. While useful for immediate threats, these hormones impair:</p>
<ul>
<li><strong>Working memory:</strong> Your ability to hold and manipulate information</li>
<li><strong>Executive function:</strong> Planning, decision-making, and impulse control</li>
<li><strong>Attention:</strong> Focus and concentration on tasks</li>
<li><strong>Creativity:</strong> Novel problem-solving and innovative thinking</li>
</ul>

<h3>The Productivity Death Spiral</h3>
<p>Stress often creates a vicious cycle: stress leads to poor performance, which creates more stress, further degrading performance. Breaking this cycle requires intentional intervention.</p>

<h3>Signs Your Stress is Hurting Productivity</h3>
<p>Watch for these warning signs:</p>
<ul>
<li>Difficulty concentrating or frequent mind-wandering</li>
<li>Procrastination on important tasks</li>
<li>Making more mistakes than usual</li>
<li>Feeling overwhelmed by normal workloads</li>
<li>Physical symptoms like headaches or tension</li>
</ul>

<h3>Evidence-Based Strategies</h3>
<p>Research supports these approaches for managing stress while maintaining productivity:</p>

<p><strong>Time blocking:</strong> Schedule focused work periods with built-in breaks. The Pomodoro Technique (25 minutes of work, 5 minutes of rest) can help.</p>

<p><strong>Prioritization:</strong> Use frameworks like the Eisenhower Matrix to focus on what truly matters, reducing stress from feeling overwhelmed.</p>

<p><strong>Physical activity:</strong> Even a 10-minute walk can reduce stress hormones and improve cognitive function.</p>

<h3>Recovery is Productive</h3>
<p>Counter-intuitively, taking breaks and time for recovery increases overall productivity. This includes:</p>
<ul>
<li>Regular short breaks throughout the workday</li>
<li>Adequate sleep each night</li>
<li>Weekends and vacations free from work</li>
<li>Hobbies and social connections</li>
</ul>

<blockquote>Productivity isn't about working more hours—it's about optimizing the hours you work while protecting your capacity to perform.</blockquote>"""
        },
        {
            "title": "Sleep Deprivation: Causes and Effects",
            "slug": "sleep-deprivation-causes-effects",
            "category_id": cat_map["research-studies"],
            "excerpt": "A comprehensive look at what causes sleep deprivation, its wide-ranging effects on health and performance, and what research tells us about solutions.",
            "featured_image": "https://images.unsplash.com/photo-1512418490979-92798cec1380?w=800",
            "reading_time": 10,
            "content": """<h2>Understanding Sleep Deprivation</h2>
<p>Sleep deprivation occurs when an individual fails to get enough sleep. While the recommended amount varies by age, most adults need 7-9 hours per night. Chronic sleep deprivation has become a public health concern affecting millions worldwide.</p>

<h3>Common Causes of Sleep Deprivation</h3>
<p>Understanding what causes sleep deprivation is the first step to addressing it:</p>

<p><strong>Lifestyle factors:</strong></p>
<ul>
<li>Work demands and long hours</li>
<li>Social obligations and screen time</li>
<li>Irregular schedules and shift work</li>
<li>Caffeine and alcohol consumption</li>
</ul>

<p><strong>Medical conditions:</strong></p>
<ul>
<li>Sleep apnea and other sleep disorders</li>
<li>Chronic pain conditions</li>
<li>Mental health disorders</li>
<li>Medications that affect sleep</li>
</ul>

<h3>Short-Term Effects</h3>
<p>Even one night of poor sleep can cause:</p>
<ul>
<li>Impaired cognitive function and memory</li>
<li>Decreased alertness and reaction time</li>
<li>Mood changes and irritability</li>
<li>Reduced immune function</li>
</ul>

<h3>Long-Term Consequences</h3>
<p>Chronic sleep deprivation is associated with serious health risks:</p>

<p><strong>Physical health:</strong> Increased risk of obesity, type 2 diabetes, cardiovascular disease, and weakened immune system.</p>

<p><strong>Mental health:</strong> Higher rates of depression, anxiety, and other mental health conditions.</p>

<p><strong>Cognitive decline:</strong> Accelerated brain aging and increased risk of dementia.</p>

<h3>What Research Shows</h3>
<p>Key findings from sleep research:</p>
<ul>
<li>Sleep debt accumulates and cannot be fully recovered with a single good night's sleep</li>
<li>The effects of sleep deprivation on driving are comparable to alcohol intoxication</li>
<li>Sleep deprivation affects emotional regulation before cognitive function</li>
<li>Individual sleep needs vary, but chronic restriction below 6 hours is harmful for most people</li>
</ul>

<h3>Addressing Sleep Deprivation</h3>
<p>Solutions depend on the underlying cause but may include:</p>
<ul>
<li>Sleep hygiene improvements</li>
<li>Treatment of underlying medical conditions</li>
<li>Cognitive Behavioral Therapy for Insomnia (CBT-I)</li>
<li>Lifestyle modifications</li>
</ul>

<blockquote>Sleep deprivation is one of the few conditions where the treatment—sleep—is free, available to everyone, and has only positive side effects.</blockquote>"""
        },
        {
            "title": "Anxiety and Sleep: What Science Says",
            "slug": "anxiety-sleep-what-science-says",
            "category_id": cat_map["mental-health"],
            "excerpt": "Explore the scientific research on how anxiety affects sleep and vice versa, plus evidence-based strategies for breaking the cycle.",
            "featured_image": "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
            "reading_time": 8,
            "content": """<h2>The Anxiety-Sleep Connection</h2>
<p>Anxiety and sleep problems often go hand in hand, creating a challenging cycle. Research has revealed the biological and psychological mechanisms behind this relationship.</p>

<h3>How Anxiety Disrupts Sleep</h3>
<p>Anxiety activates the body's stress response, which is designed to keep you alert for danger—the opposite of what you need for sleep:</p>

<ul>
<li><strong>Hyperarousal:</strong> The nervous system remains in a heightened state</li>
<li><strong>Racing thoughts:</strong> The mind continues processing worries</li>
<li><strong>Physical tension:</strong> Muscle tension prevents physical relaxation</li>
<li><strong>Cortisol elevation:</strong> Stress hormones remain elevated</li>
</ul>

<h3>How Poor Sleep Worsens Anxiety</h3>
<p>The relationship works both ways. Sleep deprivation:</p>
<ul>
<li>Amplifies activity in the amygdala (the brain's fear center)</li>
<li>Reduces prefrontal cortex function (rational thinking)</li>
<li>Increases negative emotional reactivity</li>
<li>Impairs the ability to distinguish threats from non-threats</li>
</ul>

<h3>Research Findings</h3>
<p>Key scientific discoveries about anxiety and sleep:</p>

<p><strong>Brain imaging studies</strong> show that sleep-deprived individuals have 60% more activity in the amygdala when viewing emotional images.</p>

<p><strong>REM sleep deprivation</strong> specifically impairs emotional processing and is linked to increased anxiety symptoms.</p>

<p><strong>Genetic factors</strong> may make some individuals more vulnerable to both anxiety and sleep problems.</p>

<h3>Breaking the Cycle</h3>
<p>Evidence-based approaches that address both anxiety and sleep:</p>

<p><strong>Cognitive Behavioral Therapy (CBT):</strong> Addresses both anxious thinking patterns and sleep behaviors. CBT-I (for insomnia) is particularly effective.</p>

<p><strong>Relaxation techniques:</strong> Progressive muscle relaxation, deep breathing, and meditation can reduce both anxiety and improve sleep.</p>

<p><strong>Sleep restriction therapy:</strong> Counterintuitively, limiting time in bed can reduce anxiety about sleep and improve sleep quality.</p>

<h3>When to Seek Professional Help</h3>
<p>Consider professional support if:</p>
<ul>
<li>Sleep problems persist for more than a few weeks</li>
<li>Anxiety significantly impacts daily functioning</li>
<li>You've tried self-help strategies without success</li>
<li>You're experiencing physical health symptoms</li>
</ul>

<blockquote>Understanding that anxiety and sleep problems are connected—not separate issues—is the first step toward effective treatment.</blockquote>"""
        },
        {
            "title": "How to Improve Focus Without Medication",
            "slug": "improve-focus-without-medication",
            "category_id": cat_map["productivity-focus"],
            "excerpt": "Natural strategies and lifestyle changes that can significantly improve your ability to focus and concentrate throughout the day.",
            "featured_image": "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800",
            "reading_time": 9,
            "content": """<h2>Natural Focus Enhancement</h2>
<p>While medication can be helpful for some, many people can significantly improve their focus through natural methods. These evidence-based strategies work with your brain's natural processes.</p>

<h3>Understanding Focus</h3>
<p>Focus is not a fixed trait—it's a skill that can be developed. Your ability to focus depends on:</p>
<ul>
<li>Sleep quality and quantity</li>
<li>Nutritional status</li>
<li>Physical activity levels</li>
<li>Environmental factors</li>
<li>Mental habits and training</li>
</ul>

<h3>Sleep: The Foundation of Focus</h3>
<p>Sleep deprivation is one of the most significant impairments to focus. Even mild sleep restriction affects:</p>
<ul>
<li>Sustained attention</li>
<li>Working memory</li>
<li>Decision-making</li>
<li>Reaction time</li>
</ul>

<p>Prioritizing 7-9 hours of quality sleep is perhaps the single most effective focus intervention.</p>

<h3>Nutrition for Cognitive Function</h3>
<p>What you eat affects how you think:</p>

<p><strong>Brain-supporting nutrients:</strong></p>
<ul>
<li>Omega-3 fatty acids (fish, walnuts, flaxseed)</li>
<li>Antioxidants (berries, dark chocolate, green tea)</li>
<li>B vitamins (whole grains, leafy greens)</li>
<li>Protein for neurotransmitter production</li>
</ul>

<p><strong>What to limit:</strong></p>
<ul>
<li>Excessive sugar (causes energy crashes)</li>
<li>Heavy meals during work hours</li>
<li>Excessive caffeine (can increase anxiety)</li>
</ul>

<h3>Exercise and Focus</h3>
<p>Physical activity immediately improves cognitive function and has lasting effects on brain health:</p>
<ul>
<li>Even a 10-minute walk boosts attention</li>
<li>Regular exercise increases brain-derived neurotrophic factor (BDNF)</li>
<li>Morning exercise can improve focus throughout the day</li>
</ul>

<h3>Environmental Optimization</h3>
<p>Your environment significantly impacts focus:</p>
<ul>
<li><strong>Minimize distractions:</strong> Phone in another room, browser blockers</li>
<li><strong>Optimize lighting:</strong> Natural light or full-spectrum bulbs</li>
<li><strong>Control noise:</strong> Silence, white noise, or instrumental music</li>
<li><strong>Temperature:</strong> Slightly cool environments promote alertness</li>
</ul>

<h3>Mental Training</h3>
<p>Like a muscle, focus can be strengthened:</p>
<ul>
<li><strong>Meditation:</strong> Even 10 minutes daily improves attention over time</li>
<li><strong>Single-tasking:</strong> Practice focusing on one thing at a time</li>
<li><strong>Progressive challenges:</strong> Gradually increase focus duration</li>
</ul>

<blockquote>Improving focus is not about willpower—it's about creating conditions where focus becomes natural.</blockquote>"""
        },
        {
            "title": "Evening Routines That Improve Sleep",
            "slug": "evening-routines-improve-sleep",
            "category_id": cat_map["lifestyle-habits"],
            "excerpt": "Create a powerful evening routine that signals to your body it's time to wind down and prepares you for restorative sleep.",
            "featured_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
            "reading_time": 7,
            "content": """<h2>The Power of Evening Routines</h2>
<p>A consistent evening routine is one of the most effective tools for improving sleep quality. It helps transition your body and mind from the alertness of day to the relaxation needed for sleep.</p>

<h3>Why Routines Work</h3>
<p>Evening routines leverage several psychological and physiological principles:</p>
<ul>
<li><strong>Conditioning:</strong> Your brain learns to associate routine activities with sleep</li>
<li><strong>Stress reduction:</strong> Predictable routines reduce anxiety</li>
<li><strong>Circadian support:</strong> Consistent timing reinforces your body clock</li>
</ul>

<h3>Building Your Routine: The 90-Minute Wind-Down</h3>
<p>Consider structuring your evening into three 30-minute phases:</p>

<p><strong>Phase 1 (90-60 minutes before bed): Practical preparation</strong></p>
<ul>
<li>Complete any remaining tasks or plan tomorrow</li>
<li>Prepare items needed for the morning</li>
<li>Begin dimming lights</li>
</ul>

<p><strong>Phase 2 (60-30 minutes before bed): Physical relaxation</strong></p>
<ul>
<li>Take a warm bath or shower (the subsequent body cooling promotes sleep)</li>
<li>Light stretching or gentle yoga</li>
<li>Change into comfortable sleepwear</li>
</ul>

<p><strong>Phase 3 (30-0 minutes before bed): Mental wind-down</strong></p>
<ul>
<li>Reading (preferably physical books)</li>
<li>Meditation or deep breathing</li>
<li>Journaling or gratitude practice</li>
</ul>

<h3>What to Avoid</h3>
<p>Certain activities can sabotage your wind-down:</p>
<ul>
<li>Screen time (blue light suppresses melatonin)</li>
<li>Work emails or stressful conversations</li>
<li>Heavy meals or excessive fluids</li>
<li>Intense exercise</li>
<li>Stimulating content (news, action movies)</li>
</ul>

<h3>Customizing Your Routine</h3>
<p>The best routine is one you'll actually follow. Consider:</p>
<ul>
<li>Your natural preferences (reading vs. meditation)</li>
<li>Time constraints (shorter routines can work)</li>
<li>Living situation (shared spaces, noise)</li>
<li>Work schedule (shift workers need adapted approaches)</li>
</ul>

<h3>Sample Evening Routines</h3>
<p><strong>The Minimalist (30 minutes):</strong> Dim lights, brief stretching, 10 minutes of reading, lights out.</p>

<p><strong>The Comprehensive (90 minutes):</strong> Task review, warm shower, skincare, herbal tea, 30 minutes of reading, brief meditation, lights out.</p>

<blockquote>Consistency is more important than complexity. A simple routine done every night beats an elaborate one done sporadically.</blockquote>"""
        },
        {
            "title": "Mental Fatigue Explained",
            "slug": "mental-fatigue-explained",
            "category_id": cat_map["mental-health"],
            "excerpt": "Understanding what causes mental fatigue, how it differs from physical tiredness, and what you can do to restore your mental energy.",
            "featured_image": "https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800",
            "reading_time": 8,
            "content": """<h2>What Is Mental Fatigue?</h2>
<p>Mental fatigue is a state of cognitive exhaustion characterized by decreased ability to concentrate, think clearly, or make decisions. Unlike physical fatigue, which results from muscle exertion, mental fatigue stems from prolonged cognitive activity.</p>

<h3>Signs of Mental Fatigue</h3>
<p>Mental fatigue manifests in various ways:</p>
<ul>
<li>Difficulty concentrating or maintaining attention</li>
<li>Increased errors in work or decision-making</li>
<li>Feeling overwhelmed by simple tasks</li>
<li>Irritability or mood changes</li>
<li>Physical symptoms like headaches</li>
<li>Reduced motivation and creativity</li>
</ul>

<h3>What Causes Mental Fatigue</h3>
<p>Several factors contribute to mental exhaustion:</p>

<p><strong>Cognitive demands:</strong></p>
<ul>
<li>Extended periods of focused attention</li>
<li>Complex problem-solving</li>
<li>Information overload</li>
<li>Multitasking</li>
</ul>

<p><strong>Emotional demands:</strong></p>
<ul>
<li>Stress and worry</li>
<li>Emotional labor</li>
<li>Difficult relationships</li>
<li>Suppressing emotions</li>
</ul>

<p><strong>Lifestyle factors:</strong></p>
<ul>
<li>Poor sleep quality</li>
<li>Inadequate nutrition</li>
<li>Lack of physical activity</li>
<li>Insufficient breaks</li>
</ul>

<h3>The Science Behind Mental Fatigue</h3>
<p>Research suggests mental fatigue involves:</p>
<ul>
<li>Depletion of glucose in the brain</li>
<li>Accumulation of adenosine (a sleep-promoting chemical)</li>
<li>Reduced activity in the prefrontal cortex</li>
<li>Changes in neurotransmitter levels</li>
</ul>

<h3>Recovery Strategies</h3>
<p>Different types of mental fatigue require different recovery approaches:</p>

<p><strong>Short-term recovery:</strong></p>
<ul>
<li>Brief breaks (5-10 minutes every hour)</li>
<li>Physical movement</li>
<li>Nature exposure</li>
<li>Social interaction</li>
</ul>

<p><strong>Long-term recovery:</strong></p>
<ul>
<li>Quality sleep</li>
<li>Regular exercise</li>
<li>Hobbies and leisure activities</li>
<li>Vacations and time off</li>
</ul>

<h3>Prevention Strategies</h3>
<p>Preventing mental fatigue is easier than recovering from it:</p>
<ul>
<li>Schedule demanding tasks during peak energy times</li>
<li>Build in regular breaks</li>
<li>Limit multitasking</li>
<li>Practice stress management</li>
<li>Maintain boundaries between work and rest</li>
</ul>

<blockquote>Mental fatigue is your brain's signal that it needs restoration. Ignoring it leads to diminishing returns and potential burnout.</blockquote>"""
        },
        {
            "title": "Sleep Myths Debunked",
            "slug": "sleep-myths-debunked",
            "category_id": cat_map["research-studies"],
            "excerpt": "Separating fact from fiction: common sleep myths that might be harming your rest, and what science actually tells us about sleep.",
            "featured_image": "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800",
            "reading_time": 7,
            "content": """<h2>Common Sleep Myths</h2>
<p>Misinformation about sleep is widespread. Let's examine some common myths and what research actually shows.</p>

<h3>Myth 1: You Can Catch Up on Sleep Over the Weekend</h3>
<p><strong>Reality:</strong> While weekend sleep can partially reduce sleep debt, research shows it doesn't fully compensate for weekday sleep loss. Studies find that weekend catch-up sleep doesn't reverse metabolic dysregulation from chronic sleep restriction.</p>

<h3>Myth 2: Older Adults Need Less Sleep</h3>
<p><strong>Reality:</strong> Sleep needs don't significantly decrease with age. Older adults still need 7-8 hours. What changes is the ability to sleep—older adults often have more fragmented sleep and less deep sleep, but this isn't a reduced need.</p>

<h3>Myth 3: Alcohol Helps You Sleep</h3>
<p><strong>Reality:</strong> While alcohol may help you fall asleep faster, it significantly disrupts sleep quality:</p>
<ul>
<li>Reduces REM sleep in the first half of the night</li>
<li>Causes fragmented sleep as it metabolizes</li>
<li>Worsens sleep apnea</li>
<li>Leads to more nighttime awakenings</li>
</ul>

<h3>Myth 4: Snoring Is Harmless</h3>
<p><strong>Reality:</strong> While occasional, light snoring may be benign, regular or loud snoring can indicate sleep apnea—a serious condition linked to cardiovascular disease, diabetes, and cognitive decline. If you snore regularly, consider a sleep evaluation.</p>

<h3>Myth 5: If You Can't Sleep, Stay in Bed</h3>
<p><strong>Reality:</strong> Sleep research shows that lying awake in bed can create an association between bed and wakefulness. If you can't sleep after 20 minutes, experts recommend getting up and doing something relaxing until you feel sleepy.</p>

<h3>Myth 6: Everyone Needs 8 Hours</h3>
<p><strong>Reality:</strong> Sleep needs vary. While 7-9 hours is the recommendation for most adults, some people function well on 6 hours while others need 9-10. The key is how you feel and function—not hitting a specific number.</p>

<h3>Myth 7: Watching TV Helps You Fall Asleep</h3>
<p><strong>Reality:</strong> Screens emit blue light that suppresses melatonin production. Additionally, engaging content keeps your mind active. If you use TV for sleep, consider:</p>
<ul>
<li>Using night mode or blue light filters</li>
<li>Choosing calm, familiar content</li>
<li>Setting a sleep timer</li>
</ul>

<h3>Myth 8: You Can Train Yourself to Need Less Sleep</h3>
<p><strong>Reality:</strong> While you may adapt to feeling less sleepy, this doesn't mean you're functioning optimally. Research consistently shows that chronic sleep restriction impairs cognitive performance, even when people don't feel sleepy.</p>

<blockquote>Good sleep isn't about following rigid rules—it's about understanding your body and creating conditions that support natural, restorative rest.</blockquote>"""
        },
        {
            "title": "How Much Sleep Do You Really Need?",
            "slug": "how-much-sleep-do-you-need",
            "category_id": cat_map["sleep-rest"],
            "excerpt": "Science-based guidelines for optimal sleep duration at every age, and how to determine your personal sleep needs.",
            "featured_image": "https://images.unsplash.com/photo-1455642305367-68834a1da7ab?w=800",
            "reading_time": 6,
            "content": """<h2>Sleep Requirements by Age</h2>
<p>Sleep needs change throughout life. Here are the current scientific recommendations:</p>

<h3>Sleep Duration Guidelines</h3>
<ul>
<li><strong>Newborns (0-3 months):</strong> 14-17 hours</li>
<li><strong>Infants (4-11 months):</strong> 12-15 hours</li>
<li><strong>Toddlers (1-2 years):</strong> 11-14 hours</li>
<li><strong>Preschoolers (3-5 years):</strong> 10-13 hours</li>
<li><strong>School-age (6-13 years):</strong> 9-11 hours</li>
<li><strong>Teenagers (14-17 years):</strong> 8-10 hours</li>
<li><strong>Young adults (18-25 years):</strong> 7-9 hours</li>
<li><strong>Adults (26-64 years):</strong> 7-9 hours</li>
<li><strong>Older adults (65+ years):</strong> 7-8 hours</li>
</ul>

<h3>Individual Variation</h3>
<p>These are guidelines, not rigid rules. Several factors influence individual needs:</p>

<p><strong>Genetics:</strong> Some people are genetically short sleepers (needing only 6 hours) while others are long sleepers (needing 9+ hours). True short sleepers are rare—about 1-3% of the population.</p>

<p><strong>Activity level:</strong> Physical or mental demands may increase sleep needs.</p>

<p><strong>Health status:</strong> Illness, recovery, and chronic conditions affect sleep requirements.</p>

<h3>How to Determine Your Sleep Needs</h3>
<p>Try this experiment when you have a flexible schedule:</p>
<ol>
<li>Go to bed when you feel sleepy</li>
<li>Wake without an alarm</li>
<li>Track how long you sleep for 1-2 weeks</li>
<li>Note how you feel and perform</li>
</ol>

<p>Your natural sleep duration during this period likely reflects your true needs.</p>

<h3>Signs You're Not Getting Enough Sleep</h3>
<ul>
<li>Needing an alarm to wake up</li>
<li>Difficulty getting out of bed</li>
<li>Feeling drowsy during the day</li>
<li>Falling asleep within 5 minutes of lying down</li>
<li>Needing caffeine to function</li>
<li>Sleeping much longer on weekends</li>
</ul>

<h3>Quality vs. Quantity</h3>
<p>Duration isn't everything. Sleep quality matters equally:</p>
<ul>
<li>Time spent in deep sleep</li>
<li>Adequate REM sleep</li>
<li>Minimal awakenings</li>
<li>Feeling refreshed upon waking</li>
</ul>

<blockquote>The right amount of sleep is the amount that allows you to feel alert, energetic, and capable throughout the day without relying on stimulants.</blockquote>"""
        },
        {
            "title": "Burnout Warning Signs",
            "slug": "burnout-warning-signs",
            "category_id": cat_map["stress-anxiety"],
            "excerpt": "Recognize the early warning signs of burnout before it becomes severe, and understand what makes burnout different from ordinary stress.",
            "featured_image": "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800",
            "reading_time": 9,
            "content": """<h2>Understanding Burnout</h2>
<p>Burnout is more than feeling stressed or tired. It's a state of chronic stress that leads to physical and emotional exhaustion, cynicism and detachment, and feelings of ineffectiveness and lack of accomplishment.</p>

<h3>The Three Dimensions of Burnout</h3>
<p><strong>1. Exhaustion:</strong> Feeling emotionally drained and physically depleted. You lack the energy to face another day.</p>

<p><strong>2. Cynicism/Detachment:</strong> Developing a negative, callous attitude toward work and people. You feel disconnected from what once mattered to you.</p>

<p><strong>3. Reduced Efficacy:</strong> Feeling incompetent and unproductive. Your confidence in your abilities decreases.</p>

<h3>Early Warning Signs</h3>
<p>Burnout develops gradually. Watch for these early indicators:</p>

<p><strong>Physical signs:</strong></p>
<ul>
<li>Chronic fatigue that doesn't improve with rest</li>
<li>Frequent illness (weakened immune system)</li>
<li>Changes in appetite or sleep</li>
<li>Headaches, muscle pain</li>
</ul>

<p><strong>Emotional signs:</strong></p>
<ul>
<li>Sense of dread about work</li>
<li>Feeling trapped or hopeless</li>
<li>Increased irritability</li>
<li>Loss of motivation</li>
<li>Feeling detached or alone</li>
</ul>

<p><strong>Behavioral signs:</strong></p>
<ul>
<li>Withdrawing from responsibilities</li>
<li>Isolating from others</li>
<li>Procrastinating more than usual</li>
<li>Using food, alcohol, or drugs to cope</li>
<li>Taking frustrations out on others</li>
</ul>

<h3>Burnout vs. Stress</h3>
<p>Understanding the difference is crucial:</p>

<p><strong>Stress:</strong> Characterized by overengagement. Emotions are overreactive. Produces urgency and hyperactivity. Loss of energy. Leads to anxiety disorders. Primary damage is physical.</p>

<p><strong>Burnout:</strong> Characterized by disengagement. Emotions are blunted. Produces helplessness and hopelessness. Loss of motivation and hope. Leads to detachment and depression. Primary damage is emotional.</p>

<h3>Risk Factors</h3>
<p>Certain situations increase burnout risk:</p>
<ul>
<li>Lack of control over your work</li>
<li>Unclear job expectations</li>
<li>Dysfunctional workplace dynamics</li>
<li>Mismatch in values</li>
<li>Poor work-life balance</li>
<li>Lack of social support</li>
</ul>

<h3>Prevention Strategies</h3>
<p>If you recognize early signs:</p>
<ul>
<li>Set boundaries around work time</li>
<li>Prioritize sleep and exercise</li>
<li>Connect with supportive people</li>
<li>Rediscover what gives you meaning</li>
<li>Consider talking to a professional</li>
</ul>

<blockquote>Burnout isn't a sign of weakness—it's a sign that something in your life needs to change. Recognizing it early gives you more options.</blockquote>"""
        },
        {
            "title": "Natural Ways to Reduce Stress",
            "slug": "natural-ways-reduce-stress",
            "category_id": cat_map["lifestyle-habits"],
            "excerpt": "Evidence-based natural approaches to stress reduction that don't require medication or expensive treatments.",
            "featured_image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            "reading_time": 8,
            "content": """<h2>Natural Stress Reduction</h2>
<p>While chronic or severe stress may require professional help, many people can significantly reduce stress through natural approaches. These methods work by activating your body's relaxation response.</p>

<h3>Physical Approaches</h3>

<p><strong>Exercise:</strong> One of the most effective stress reducers. Benefits include:</p>
<ul>
<li>Reduces stress hormones (cortisol, adrenaline)</li>
<li>Releases endorphins (natural mood elevators)</li>
<li>Improves sleep quality</li>
<li>Boosts confidence and well-being</li>
</ul>
<p>Even a 10-minute walk can help. Aim for 150 minutes of moderate activity weekly.</p>

<p><strong>Deep breathing:</strong> Activates the parasympathetic nervous system. Try:</p>
<ul>
<li>4-7-8 breathing: Inhale for 4 counts, hold for 7, exhale for 8</li>
<li>Box breathing: 4 counts each for inhale, hold, exhale, hold</li>
<li>Diaphragmatic breathing: Deep belly breaths</li>
</ul>

<p><strong>Progressive muscle relaxation:</strong> Systematically tensing and releasing muscle groups reduces physical tension and promotes calm.</p>

<h3>Mind-Based Approaches</h3>

<p><strong>Meditation:</strong> Regular practice changes brain structure and function:</p>
<ul>
<li>Reduces amygdala activity (stress response)</li>
<li>Increases prefrontal cortex activity (rational thinking)</li>
<li>Improves emotional regulation</li>
</ul>
<p>Start with just 5-10 minutes daily using apps like Headspace or Calm.</p>

<p><strong>Mindfulness:</strong> Paying attention to the present moment without judgment. Can be practiced:</p>
<ul>
<li>During daily activities (eating, walking)</li>
<li>Through formal meditation</li>
<li>With brief "check-ins" throughout the day</li>
</ul>

<h3>Lifestyle Factors</h3>

<p><strong>Sleep:</strong> Poor sleep increases stress vulnerability. Prioritize 7-9 hours of quality sleep.</p>

<p><strong>Nutrition:</strong> Certain foods support stress resilience:</p>
<ul>
<li>Complex carbohydrates (whole grains)</li>
<li>Foods rich in omega-3s</li>
<li>Magnesium-rich foods (leafy greens, nuts)</li>
<li>Limited caffeine and alcohol</li>
</ul>

<p><strong>Nature exposure:</strong> Time in nature reduces cortisol levels. Even 20 minutes in a park helps.</p>

<p><strong>Social connection:</strong> Supportive relationships buffer stress. Prioritize meaningful connections.</p>

<h3>Creating a Stress Reduction Plan</h3>
<p>Choose approaches that fit your life:</p>
<ol>
<li>Pick one physical and one mental technique</li>
<li>Schedule them like important appointments</li>
<li>Start small and build gradually</li>
<li>Track what works for you</li>
</ol>

<blockquote>Stress reduction isn't about eliminating stress—it's about building resilience and recovery capacity.</blockquote>"""
        },
        {
            "title": "Productivity vs Overworking",
            "slug": "productivity-vs-overworking",
            "category_id": cat_map["productivity-focus"],
            "excerpt": "Understanding the crucial difference between being productive and overworking, and why more hours don't mean more results.",
            "featured_image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
            "reading_time": 8,
            "content": """<h2>The Productivity Paradox</h2>
<p>In a culture that glorifies busyness, it's easy to confuse working more with achieving more. However, research consistently shows that overworking actually decreases productivity and damages health.</p>

<h3>What the Research Shows</h3>
<p>Studies on working hours and productivity reveal surprising findings:</p>
<ul>
<li>Productivity per hour declines sharply after 50 hours per week</li>
<li>Workers who work 70 hours produce no more than those working 55 hours</li>
<li>Long hours increase errors and accidents</li>
<li>Overwork impairs decision-making and creativity</li>
</ul>

<h3>Signs You're Overworking, Not Productive</h3>

<p><strong>Diminishing returns:</strong></p>
<ul>
<li>Taking longer to complete simple tasks</li>
<li>Making more mistakes</li>
<li>Struggling to think clearly</li>
<li>Forgetting important details</li>
</ul>

<p><strong>Health impacts:</strong></p>
<ul>
<li>Chronic fatigue</li>
<li>Frequent illness</li>
<li>Sleep problems</li>
<li>Weight changes</li>
</ul>

<p><strong>Life imbalance:</strong></p>
<ul>
<li>Neglecting relationships</li>
<li>No time for exercise or hobbies</li>
<li>Missing important events</li>
<li>Feeling like work is your whole identity</li>
</ul>

<h3>True Productivity Principles</h3>

<p><strong>Focus on outcomes, not hours:</strong> What matters is what you accomplish, not how long you sit at your desk.</p>

<p><strong>Leverage your peak hours:</strong> Identify when you're most alert and schedule important work then.</p>

<p><strong>Embrace rest:</strong> Recovery is part of productivity. Regular breaks, adequate sleep, and time off improve performance.</p>

<p><strong>Set boundaries:</strong> Protect non-work time fiercely. It's what allows you to perform well during work time.</p>

<h3>Practical Strategies</h3>

<p><strong>Work in focused blocks:</strong> 90-minute focused work periods with 15-20 minute breaks.</p>

<p><strong>Practice saying no:</strong> Not every opportunity is worth taking. Protect your capacity.</p>

<p><strong>Eliminate low-value work:</strong> Audit how you spend time. Delegate, automate, or eliminate tasks that don't matter.</p>

<p><strong>Create transition rituals:</strong> Clear boundaries between work and personal time.</p>

<h3>Sustainable High Performance</h3>
<p>The highest performers:</p>
<ul>
<li>Prioritize sleep</li>
<li>Take regular vacations</li>
<li>Have hobbies outside work</li>
<li>Maintain strong relationships</li>
<li>Practice regular recovery</li>
</ul>

<blockquote>Productivity isn't about doing more—it's about doing what matters most with the energy and focus that comes from sustainable practices.</blockquote>"""
        },
        {
            "title": "Sleep and Memory: The Connection",
            "slug": "sleep-memory-connection",
            "category_id": cat_map["research-studies"],
            "excerpt": "Explore how sleep affects memory formation, consolidation, and recall, and why a good night's rest is essential for learning.",
            "featured_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
            "reading_time": 9,
            "content": """<h2>Sleep's Role in Memory</h2>
<p>Sleep isn't just rest—it's an active process essential for memory. During sleep, the brain processes, consolidates, and integrates new information with existing knowledge.</p>

<h3>How Memory Works</h3>
<p>Memory formation involves three stages:</p>
<ol>
<li><strong>Encoding:</strong> Taking in new information (happens while awake)</li>
<li><strong>Consolidation:</strong> Stabilizing and integrating memories (primarily during sleep)</li>
<li><strong>Recall:</strong> Accessing stored memories (requires prior consolidation)</li>
</ol>

<h3>What Happens During Sleep</h3>

<p><strong>Non-REM Sleep:</strong></p>
<ul>
<li>Particularly important for declarative memory (facts and events)</li>
<li>Hippocampus replays the day's experiences</li>
<li>Information transfers to long-term storage in the cortex</li>
<li>Slow waves synchronize brain regions for memory integration</li>
</ul>

<p><strong>REM Sleep:</strong></p>
<ul>
<li>Important for procedural memory (skills and how-to knowledge)</li>
<li>Helps integrate emotional memories</li>
<li>Supports creative problem-solving</li>
<li>Strengthens neural connections formed during learning</li>
</ul>

<h3>Research Evidence</h3>
<p>Studies consistently demonstrate sleep's role in memory:</p>

<p><strong>Learning studies:</strong> People who sleep after learning retain information better than those who stay awake the same duration.</p>

<p><strong>Sleep deprivation studies:</strong> Even one night of poor sleep impairs memory formation the following day.</p>

<p><strong>Nap studies:</strong> Brief naps (60-90 minutes) that include REM sleep improve learning.</p>

<p><strong>Aging studies:</strong> Sleep quality decline contributes to memory problems in older adults.</p>

<h3>Optimizing Sleep for Learning</h3>

<p><strong>Before learning:</strong></p>
<ul>
<li>Get adequate sleep the night before studying</li>
<li>Avoid sleep deprivation before important learning</li>
</ul>

<p><strong>After learning:</strong></p>
<ul>
<li>Sleep soon after learning new material</li>
<li>Avoid alcohol, which disrupts memory consolidation</li>
<li>Consider a nap after learning complex material</li>
</ul>

<p><strong>Ongoing:</strong></p>
<ul>
<li>Maintain consistent sleep schedules</li>
<li>Prioritize sleep quality, not just quantity</li>
<li>Address sleep disorders that may impair memory</li>
</ul>

<h3>Sleep and Different Types of Memory</h3>
<ul>
<li><strong>Vocabulary/facts:</strong> Deep non-REM sleep is most important</li>
<li><strong>Skills/procedures:</strong> REM sleep and stage 2 non-REM are crucial</li>
<li><strong>Emotional memories:</strong> REM sleep helps process and integrate</li>
<li><strong>Insight/creativity:</strong> Full sleep cycles support creative connections</li>
</ul>

<blockquote>Sleep is not time away from learning—it's when learning actually happens. Skipping sleep to study more is counterproductive.</blockquote>"""
        },
        {
            "title": "How Lifestyle Impacts Mental Health",
            "slug": "lifestyle-impacts-mental-health",
            "category_id": cat_map["mental-health"],
            "excerpt": "Understanding how daily choices about sleep, exercise, nutrition, and social connection affect your mental well-being.",
            "featured_image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
            "reading_time": 10,
            "content": """<h2>The Lifestyle-Mental Health Connection</h2>
<p>Mental health isn't determined solely by genetics or life circumstances. Daily lifestyle choices significantly influence psychological well-being—for better or worse.</p>

<h3>Sleep and Mental Health</h3>
<p>Sleep is foundational to mental health:</p>
<ul>
<li>Poor sleep increases anxiety and depression risk</li>
<li>Sleep deprivation impairs emotional regulation</li>
<li>Insomnia often precedes depressive episodes</li>
<li>Improving sleep can reduce mental health symptoms</li>
</ul>

<p><strong>Recommendations:</strong> Prioritize 7-9 hours of quality sleep. Maintain consistent sleep schedules. Address sleep problems promptly.</p>

<h3>Exercise and Mental Health</h3>
<p>Physical activity is a powerful mental health intervention:</p>
<ul>
<li>Reduces symptoms of depression and anxiety</li>
<li>Releases endorphins and other mood-enhancing chemicals</li>
<li>Improves self-esteem and body image</li>
<li>Provides healthy coping mechanism for stress</li>
</ul>

<p>Research shows exercise can be as effective as medication for mild to moderate depression.</p>

<p><strong>Recommendations:</strong> Aim for 150 minutes of moderate activity weekly. Any movement helps—find activities you enjoy. Outdoor exercise may provide additional benefits.</p>

<h3>Nutrition and Mental Health</h3>
<p>What you eat affects how you feel:</p>

<p><strong>Brain-supporting nutrients:</strong></p>
<ul>
<li>Omega-3 fatty acids (reduce inflammation, support brain function)</li>
<li>B vitamins (crucial for neurotransmitter production)</li>
<li>Vitamin D (deficiency linked to depression)</li>
<li>Magnesium (calming effect on nervous system)</li>
</ul>

<p><strong>Patterns to consider:</strong></p>
<ul>
<li>Mediterranean diet associated with lower depression rates</li>
<li>Processed food consumption linked to poorer mental health</li>
<li>Gut health influences brain health (gut-brain axis)</li>
</ul>

<h3>Social Connection</h3>
<p>Humans are social creatures:</p>
<ul>
<li>Loneliness is a significant mental health risk factor</li>
<li>Quality relationships buffer against stress</li>
<li>Social support aids recovery from mental health challenges</li>
<li>Giving support can be as beneficial as receiving it</li>
</ul>

<p><strong>Recommendations:</strong> Prioritize meaningful relationships. Seek community through shared interests. Consider professional support when needed.</p>

<h3>Other Lifestyle Factors</h3>

<p><strong>Nature exposure:</strong> Time outdoors reduces stress and improves mood.</p>

<p><strong>Purpose and meaning:</strong> Having meaningful activities supports mental well-being.</p>

<p><strong>Screen time:</strong> Excessive social media use linked to poorer mental health.</p>

<p><strong>Substance use:</strong> Alcohol and drugs often worsen mental health over time.</p>

<h3>Creating Change</h3>
<p>Improving mental health through lifestyle:</p>
<ol>
<li>Start with one area (often sleep provides the best foundation)</li>
<li>Make small, sustainable changes</li>
<li>Build on successes gradually</li>
<li>Seek support when needed</li>
</ol>

<blockquote>While lifestyle changes aren't a substitute for professional treatment when needed, they form the foundation of mental wellness and can significantly improve outcomes.</blockquote>"""
        }
    ]
    
    # Add metadata to all articles
    now = datetime.now(timezone.utc)
    for i, article in enumerate(articles):
        article["id"] = str(uuid.uuid4())
        article["is_published"] = True
        article["is_featured"] = article.get("is_featured", False)
        article["views"] = 0
        article["meta_title"] = article["title"] + " | RestfulMind"
        article["meta_description"] = article["excerpt"]
        # Stagger dates for variety
        days_ago = i * 2
        article["created_at"] = (now - timedelta(days=days_ago)).isoformat()
        article["updated_at"] = (now - timedelta(days=max(0, days_ago - 7))).isoformat()
        article["whats_new"] = "Updated with the latest research and practical recommendations." if i < 5 else None
    
    return articles


async def seed_database():
    """Seed the database with initial data."""
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Clear existing data
        print("Clearing existing data...")
        await db.categories.delete_many({})
        await db.articles.delete_many({})
        await db.users.delete_many({})
        
        # Insert categories
        print("Inserting categories...")
        await db.categories.insert_many(CATEGORIES)
        print(f"  Inserted {len(CATEGORIES)} categories")
        
        # Insert articles
        print("Inserting articles...")
        articles = get_articles(CATEGORIES)
        await db.articles.insert_many(articles)
        print(f"  Inserted {len(articles)} articles")
        
        # Create admin user
        print("Creating admin user...")
        password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@restfulmind.com",
            "name": "Admin User",
            "password_hash": password_hash,
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        print(f"  Created admin user: admin@restfulmind.com / admin123")
        
        print("\nDatabase seeded successfully!")
        print("\nAdmin credentials:")
        print("  Email: admin@restfulmind.com")
        print("  Password: admin123")
        
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
