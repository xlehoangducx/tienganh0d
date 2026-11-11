# -*- coding: utf-8 -*-
import os, subprocess, numpy as np
from vieneu import Vieneu

audio_dir = r"d:\WEB_HOC_TIENG_ANH_AI\assets\audio"
os.makedirs(audio_dir, exist_ok=True)

print("Initializing VieNeu-TTS engine for English words & phrases...")
v = Vieneu()

def make_audio_file(text, voice, out_name, tempo=0.95, pause_sec=0.2):
    a = v.infer(text, voice=voice)
    tmp_wav = os.path.join(audio_dir, f"tmp_{out_name}.wav")
    final_mp3 = os.path.join(audio_dir, out_name)
    v.save(a, tmp_wav)
    subprocess.run(["ffmpeg", "-y", "-i", tmp_wav, "-filter:a", f"atempo={tempo}", "-b:a", "192k", final_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(tmp_wav):
        os.remove(tmp_wav)
    print(f"Generated: {out_name} ({os.path.getsize(final_mp3)} bytes)")

# 1. Module 1 English Words (Voice: Adam - US English)
words_data = [
    ("thank-you.mp3", "Thank you"),
    ("think.mp3", "Think"),
    ("nice.mp3", "Nice"),
    ("thanks.mp3", "Thanks"),
    ("see.mp3", "See"),
    ("meet.mp3", "Meet"),
    ("great.mp3", "Great"),
    ("wait.mp3", "Wait")
]

for fname, txt in words_data:
    make_audio_file(txt, voice="Adam", out_name=fname, tempo=0.92)

# 2. Module 2 English Chunks (Voice: Adam - US English)
chunks_data = [
    ("hi-nice-to-meet-you.mp3", "Hi, nice to meet you!"),
    ("hi-great-to-meet-you.mp3", "Hi, great to meet you!"),
    ("good-to-see-you-again.mp3", "Good to see you again!"),
    ("thank-you-so-much.mp3", "Thank you so much!"),
    ("thank-you-for-your-help.mp3", "Thank you for your help!"),
    ("thanks-a-lot.mp3", "Thanks a lot!"),
    ("have-a-great-day.mp3", "Have a great day!"),
    ("have-a-good-one.mp3", "Have a good one!"),
    ("take-care-see-you-later.mp3", "Take care! See you later!")
]

for fname, txt in chunks_data:
    make_audio_file(txt, voice="Adam", out_name=fname, tempo=0.92)

# 3. Slide 1 re-generate without "10 nam" (Voice: Hai Dang)
slide1_txt = "Chào bạn! Chào mừng bạn đến với Buổi học đầu tiên trên hành trình học tiếng Anh từ số 0. Nhiều người học thường cảm thấy bối rối vì trước đây hay bắt đầu bằng các công thức ngữ pháp khô khan, trong khi não bộ con người không thể tiếp nhận quy tắc trừu tượng trước khi có cảm xúc và bối cảnh thực tế. Trẻ em bản xứ nói hàng nghìn câu trước khi học chữ viết. Hôm nay, chúng ta bắt đầu bằng chính bản năng tự nhiên nhất: Kết nối con người qua những âm vị và câu chào đời thường."

# Use the multi-sentence combiner for slide 1
clean_text = slide1_txt.replace("!", ".").replace("?", ".")
sentences = [s.strip() for s in clean_text.split(".") if s.strip()]
combined = []
silence = np.zeros(int(48000 * 0.45), dtype=np.float32)
for idx, s in enumerate(sentences):
    a = v.infer(s, voice="Hải Đăng")
    combined.append(a)
    if idx < len(sentences) - 1:
        combined.append(silence)
full = np.concatenate(combined)
tmp_wav = os.path.join(audio_dir, "tmp_lecture-buoi-01-slide-1.wav")
final_mp3 = os.path.join(audio_dir, "lecture-buoi-01-slide-1.mp3")
v.save(full, tmp_wav)
subprocess.run(["ffmpeg", "-y", "-i", tmp_wav, "-filter:a", "atempo=0.90", "-b:a", "192k", final_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
if os.path.exists(tmp_wav):
    os.remove(tmp_wav)
print(f"Re-generated: lecture-buoi-01-slide-1.mp3 ({os.path.getsize(final_mp3)} bytes)")

print("ALL WORDS & PHRASES AUDIO READY!")
