# -*- coding: utf-8 -*-
import os, asyncio, edge_tts

audio_dir = r"d:\WEB_HOC_TIENG_ANH_AI\assets\audio"
os.makedirs(audio_dir, exist_ok=True)

# 1. Module 1 Words (Crystal Clear American Native Pronunciation)
words = [
    ("thank-you.mp3", "Thank you"),
    ("think.mp3", "Think"),
    ("nice.mp3", "Nice"),
    ("thanks.mp3", "Thanks"),
    ("see.mp3", "See"),
    ("meet.mp3", "Meet"),
    ("great.mp3", "Great"),
    ("wait.mp3", "Wait")
]

# 2. Module 2 Chunks (Natural American Conversational Cadence)
chunks = [
    ("hi-nice-to-meet-you.mp3", "Hi, nice to meet you!"),
    ("hi-great-to-meet-you.mp3", "Hi, great to meet you!"),
    ("good-to-see-you-again.mp3", "Good to see you again!"),
    ("thank-you-so-much.mp3", "Thank you so much!"),
    ("thank-you-for-your-help.mp3", "Thank you for your help!"),
    ("thanks-a-lot.mp3", "Thanks a lot!"),
    ("have-a-great-day.mp3", "Have a great day!"),
    ("have-a-good-one.mp3", "Have a good one!"),
    ("have-a-nice-weekend.mp3", "Have a nice weekend!"),
    ("have-a-safe-trip.mp3", "Have a safe trip!"),
    ("take-care-see-you-later.mp3", "Take care! See you later!")
]

# 3. Module 5 Dialogue with David at JFK airport
dialogues = [
    ("david-buoi-01-turn-1.mp3", "Hi there! Nice day, isn't it?"),
    ("david-buoi-01-turn-2.mp3", "Here is your heavy luggage. Let me help you with that!"),
    ("david-buoi-01-turn-3.mp3", "You're welcome! Enjoy your trip!")
]

async def generate_all():
    print("Generating Authentic American Native English Audio via Neural Engine...")
    all_items = words + chunks + dialogues
    for fname, text in all_items:
        out_path = os.path.join(audio_dir, fname)
        # Using rate=-5% for crystal clear learning articulation
        comm = edge_tts.Communicate(text, "en-US-ChristopherNeural", rate="-6%")
        await comm.save(out_path)
        print(f"Generated [US Native]: {fname} ({os.path.getsize(out_path)} bytes)")

asyncio.run(generate_all())
print("ALL AUTHENTIC AMERICAN NATIVE AUDIO GENERATED!")
