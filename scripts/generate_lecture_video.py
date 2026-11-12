# -*- coding: utf-8 -*-
"""
Generate the Buổi 01 lecture as short, caption-synced video scenes.

- Vietnamese narration: VieNeu (Hải Đăng), the voice the author preferred.
- Every English target phrase is spoken by en-US-ChristopherNeural,
  never by the Vietnamese voice.
- Each scene is rendered from timed segments, so the caption ribbon in
  js/app.js can follow audio.currentTime exactly.
"""

import asyncio
import json
import os
import re
import subprocess
import tempfile

import numpy as np
from edge_tts import Communicate
from vieneu import Vieneu

AUDIO_DIR = r"D:\WEB_HOC_TIENG_ANH_AI\assets\audio"
TIMING_FILE = os.path.join(AUDIO_DIR, "lecture-buoi-01-timing.json")
SAMPLE_RATE = 48000
TEMPO = 0.95
GAP_SECONDS = 0.28
LEAD_SECONDS = 0.35


def silence(seconds):
    return np.zeros(int(SAMPLE_RATE * seconds), dtype=np.float32)


def ffmpeg_decode(path):
    result = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SAMPLE_RATE), "-"],
        capture_output=True,
        check=True,
    )
    return np.frombuffer(result.stdout, dtype=np.float32).copy()


def split_caption(text, max_len=78):
    pieces = [p.strip() for p in re.split(r"(?<=[,.!?;:])\s+", text) if p.strip()]
    if not pieces:
        return [text.strip()]
    merged = []
    for piece in pieces:
        if merged and len(merged[-1]) + 1 + len(piece) <= max_len:
            merged[-1] = f"{merged[-1]} {piece}"
        else:
            merged.append(piece)
    final = []
    for piece in merged:
        words = piece.split()
        line = ""
        for word in words:
            if line and len(line) + 1 + len(word) > max_len:
                final.append(line)
                line = word
            else:
                line = f"{line} {word}".strip()
        if line:
            final.append(line)
    return final


def add_caption_timing(captions, text, start, duration):
    chunks = split_caption(text)
    total_chars = sum(max(1, len(c)) for c in chunks)
    cursor = start
    for chunk in chunks:
        share = duration * (max(1, len(chunk)) / total_chars)
        captions.append({
            "start": round(cursor, 3),
            "end": round(cursor + share, 3),
            "text": chunk,
        })
        cursor += share


async def make_english(text, index):
    fd, path = tempfile.mkstemp(suffix=".mp3", dir=tempfile.gettempdir(), prefix=f"lecture_en_{index}_")
    os.close(fd)
    try:
        await Communicate(text, "en-US-ChristopherNeural", rate="-6%").save(path)
        return ffmpeg_decode(path)
    finally:
        try:
            os.remove(path)
        except OSError:
            pass


def make_vietnamese(engine, text):
    data = engine.infer(text, voice="Hải Đăng")
    return np.asarray(data, dtype=np.float32).reshape(-1)


async def render_scene(engine, out_name, segments, timing, caption_key):
    pieces = [silence(LEAD_SECONDS)]
    captions = []
    cursor = LEAD_SECONDS
    en_index = 0

    for kind, text in segments:
        if kind == "en":
            en_index += 1
            audio = await make_english(text, en_index)
        else:
            audio = make_vietnamese(engine, text)

        duration = len(audio) / SAMPLE_RATE
        add_caption_timing(captions, text, cursor, duration)
        pieces.append(audio)
        cursor += duration
        pieces.append(silence(GAP_SECONDS))
        cursor += GAP_SECONDS

    full = np.concatenate(pieces)
    total_without_tempo = len(full) / SAMPLE_RATE
    with tempfile.NamedTemporaryFile(suffix=".wav", dir=tempfile.gettempdir(), delete=False) as tmp:
        tmp_wav = tmp.name
    final_mp3 = os.path.join(AUDIO_DIR, out_name)
    try:
        engine.save(full, tmp_wav)
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", tmp_wav, "-filter:a", f"atempo={TEMPO}", "-b:a", "160k", final_mp3],
            check=True,
        )
    finally:
        try:
            os.remove(tmp_wav)
        except OSError:
            pass

    scale = 1.0 / TEMPO
    for caption in captions:
        caption["start"] = round(caption["start"] * scale, 3)
        caption["end"] = round(caption["end"] * scale, 3)

    timing[caption_key] = {
        "file": f"assets/audio/{out_name}",
        "duration": round(total_without_tempo * scale, 3),
        "captions": captions,
    }
    print(f"Generated {out_name}: {round(total_without_tempo * scale, 1)}s, {len(captions)} captions")


INTRO = [
    ("vi", "Chào bạn! Mình là Hải Đăng, người đồng hành cùng bạn trong buổi học đầu tiên."),
    ("vi", "Trước khi bắt đầu, hãy bấm Nghe Thuyết Giảng. Bài giảng sẽ chạy từng cảnh, và phụ đề sẽ chạy theo đúng lời mình nói."),
    ("vi", "Khi cần dừng, bạn chỉ cần bấm Tạm Dừng. Còn bây giờ, chúng ta cùng bắt đầu nhé."),
]

SCENES = [
    (
        "lecture-buoi-01-slide-1-scene-0.mp3",
        [
            ("vi", "Chào mừng bạn đến với Buổi 01: Đánh thức cơ miệng và ba cụm giao tiếp đầu tiên."),
            ("vi", "Mục tiêu hôm nay rất gọn: làm quen ba âm thè lưỡi, âm gió, âm bật, và dùng được ba câu chào hỏi, cảm ơn, tạm biệt."),
            ("vi", "Bạn không cần học thuộc bảng chữ cái hay công thức ngữ pháp. Chúng ta bắt đầu bằng những câu có thể nói được ngay."),
        ],
    ),
    (
        "lecture-buoi-01-slide-1-scene-1.mp3",
        [
            ("vi", "Bạn có từng thắc mắc: vì sao học ngữ pháp rất nhiều nhưng vẫn không dám mở miệng?"),
            ("vi", "Khi phải nhớ quá nhiều quy tắc cùng lúc, não bộ rơi vào quá tải nhận thức. Vùng hạch hạnh nhân bật tín hiệu phòng vệ, còn vùng Broca, nơi tạo câu nói, bị chậm lại."),
            ("vi", "Kết quả là bạn biết công thức, nhưng miệng không phản xạ kịp. Vì vậy buổi học này bắt đầu bằng âm thanh và ngữ cảnh, không bằng lý thuyết."),
        ],
    ),
    (
        "lecture-buoi-01-slide-1-scene-2.mp3",
        [
            ("vi", "Trẻ em bản xứ nói hàng nghìn câu trước khi biết viết chữ A."),
            ("vi", "Các em học qua khuôn mặt, giọng điệu, cảm xúc và những tình huống lặp lại mỗi ngày."),
            ("vi", "Người lớn cũng vậy. Khi một câu gắn với một khoảnh khắc thật, não bộ lưu nó như một trải nghiệm, không phải một bài học thuộc lòng."),
            ("vi", "Hôm nay bạn chỉ cần ba câu hạt nhân. Ít nhưng dùng được ngay, đó mới là điểm khởi đầu bền vững."),
        ],
    ),
    (
        "lecture-buoi-01-slide-2-scene-0.mp3",
        [
            ("vi", "Tiếng Việt là ngôn ngữ đơn âm. Thói quen rụt lưỡi và nuốt âm cuối khiến nhiều người Việt nói tiếng Anh rất khó nghe."),
            ("en", "Thank you"),
            ("vi", "thường bị đọc thành thanh kiu."),
            ("en", "Nice"),
            ("vi", "thành nai."),
            ("en", "Meet"),
            ("vi", "thành mít."),
            ("vi", "Người Mỹ vẫn hiểu đại ý, nhưng họ phải căng tai. Chúng ta sẽ sửa đúng ba điểm này ngay hôm nay."),
        ],
    ),
    (
        "lecture-buoi-01-slide-2-scene-1.mp3",
        [
            ("vi", "Với âm thè lưỡi, bạn kẹp nhẹ đầu lưỡi giữa hai hàm răng và thổi ra một luồng gió mát."),
            ("en", "Thank you."),
            ("vi", "Đầu lưỡi phải chạm nhẹ, không rụt vào."),
            ("vi", "Với âm gió, hai hàm răng khép gần lại, đầu lưỡi đặt sau răng cửa và xì hơi như xả lốp xe."),
            ("en", "Nice."),
            ("vi", "Với âm bật, đầu lưỡi nén lên nướu trên rồi bật ra dứt khoát."),
            ("en", "Meet."),
            ("vi", "Chỉ cần ba khẩu hình này đúng, ba câu hôm nay sẽ nghe tự nhiên hơn rất nhiều."),
        ],
    ),
    (
        "lecture-buoi-01-slide-3-scene-0.mp3",
        [
            ("vi", "Theo kho ngữ liệu tiếng Anh Mỹ, âm gió và âm bật xuất hiện trong hơn sáu mươi lăm phần trăm cấu trúc thường gặp."),
            ("vi", "Danh từ số nhiều thêm s, động từ ngôi thứ ba thêm s, thì quá khứ thêm ed, và sở hữu cách thêm s."),
            ("vi", "Nghĩa là chỉ cần làm chủ hai âm này, bạn đã xử lý phần lớn những đuôi từ khiến người Việt hay nuốt mất."),
            ("vi", "Đây là lý do buổi đầu tiên tập trung vào cơ miệng, thay vì chạy qua thật nhiều từ vựng."),
        ],
    ),
    (
        "lecture-buoi-01-slide-3-scene-1.mp3",
        [
            ("vi", "Hãy hình dung việc học nói như xây nhà. Hai mươi phần trăm công sức đầu tiên nằm ở móng và khung."),
            ("vi", "Khi khẩu hình đã chuẩn, bạn không còn phải nghĩ đến âm cuối mỗi lần nói. Não bộ giải phóng năng lượng cho việc chọn từ và diễn đạt."),
            ("vi", "Đó là hiệu ứng đòn bẩy: sửa một lần ở gốc, kết quả theo bạn suốt lộ trình."),
        ],
    ),
    (
        "lecture-buoi-01-slide-4-scene-0.mp3",
        [
            ("vi", "Ba câu hạt nhân của buổi hôm nay nằm trong một vòng giao tiếp tự nhiên."),
            ("en", "Hi, nice to meet you!"),
            ("vi", "khi gặp và làm quen."),
            ("en", "Thank you so much!"),
            ("vi", "khi nhận được giúp đỡ."),
            ("en", "Have a great day!"),
            ("vi", "khi tạm biệt."),
            ("vi", "Chúng ngắn, dễ nói và mở được hầu hết cuộc trò chuyện xã giao."),
        ],
    ),
    (
        "lecture-buoi-01-slide-4-scene-1.mp3",
        [
            ("vi", "Khi bạn nói đúng một câu và người bản xứ mỉm cười đáp lại, não bộ nhận một phần thưởng nhỏ."),
            ("vi", "Phần thưởng đó giải phóng dopamine, làm giảm căng thẳng và khiến bạn muốn nói thêm."),
            ("vi", "Vì vậy đừng chờ đến khi hoàn hảo. Hãy nói ba câu này ngay khi có cơ hội. Mỗi phản hồi tích cực là một lần củng cố phản xạ."),
        ],
    ),
    (
        "lecture-buoi-01-slide-5-scene-0.mp3",
        [
            ("vi", "Buổi học được chia thành sáu bước đa giác quan."),
            ("vi", "Bạn soi khẩu hình, nghe mẫu, nói vào micro để nhận phản hồi, làm trắc nghiệm, lật thẻ ghi nhớ, đối thoại cùng người bản xứ và ghép lại câu."),
            ("vi", "Mỗi bước đánh vào một vùng xử lý khác nhau, nên não bộ có nhiều đường để gọi lại kiến thức."),
            ("vi", "Bạn không cần làm tất cả trong một lần. Hãy đi theo thứ tự, não sẽ tự kết nối."),
        ],
    ),
    (
        "lecture-buoi-01-slide-5-scene-1.mp3",
        [
            ("vi", "Học một lần rồi bỏ quên là chuyện bình thường. Sau hai mươi bốn giờ, phần lớn chi tiết mới sẽ rơi rụng nếu không được gọi lại."),
            ("vi", "Ngược lại, mỗi lần bạn nhớ lại một cách chủ động, kết nối thần kinh lại mạnh thêm một chút."),
            ("vi", "Bảy lần lặp ngắt quãng, trải qua nghe, nói, gõ và đối thoại, là đủ để câu nói đi vào trí nhớ dài hạn."),
            ("vi", "Đó là mục tiêu của buổi hôm nay: không học cho biết, mà học để dùng được."),
        ],
    ),
]

STORY = [
    ("vi", "Bạn vừa hạ cánh xuống sân bay quốc tế JFK New York sau một chuyến bay dài."),
    ("vi", "Bạn đang đứng đợi lấy hành lý bên băng chuyền thì một người đàn ông Mỹ thân thiện tên David đứng cạnh, quay sang nhìn bạn, mỉm cười và chào hỏi."),
    ("vi", "Bạn hãy mỉm cười và đáp lại câu chào làm quen:"),
    ("en", "Hi, nice to meet you!"),
    ("vi", "Sau đó, hãy cảm ơn khi anh ấy nhiệt tình giúp bạn nhấc chiếc vali nặng:"),
    ("en", "Thank you so much!"),
    ("vi", "Và trước khi chia tay, đừng quên chúc anh ấy một ngày thật tuyệt vời:"),
    ("en", "Have a great day!"),
]


async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    print("Loading VieNeu voice...")
    engine = Vieneu()
    timing = {}

    await render_scene(engine, "lecture-buoi-01-intro.mp3", INTRO, timing, "lecture-buoi-01-intro.mp3")
    for name, segments in SCENES:
        await render_scene(engine, name, segments, timing, name)

    # The story is also Vietnamese narration with embedded English quotes.
    await render_scene(engine, "story-buoi-01.mp3", STORY, timing, "story-buoi-01.mp3")

    with open(TIMING_FILE, "w", encoding="utf-8") as f:
        json.dump(timing, f, ensure_ascii=False, indent=2)
    print(f"Timing map written: {TIMING_FILE}")


if __name__ == "__main__":
    asyncio.run(main())
