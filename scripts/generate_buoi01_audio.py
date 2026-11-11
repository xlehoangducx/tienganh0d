import os, subprocess, numpy as np
from vieneu import Vieneu

audio_dir = r"d:\WEB_HOC_TIENG_ANH_AI\assets\audio"
os.makedirs(audio_dir, exist_ok=True)

print("Initializing VieNeu-TTS engine...")
v = Vieneu()

def make_audio_file(text, voice, out_name, tempo=0.90, pause_sec=0.45):
    # Split text into clean sentences without "/" or weird symbols
    clean_text = text.replace("/", " ").replace("!", ".").replace("?", ".")
    sentences = [s.strip() for s in clean_text.split(".") if s.strip()]
    if not sentences:
        sentences = [clean_text]
        
    combined = []
    silence = np.zeros(int(48000 * pause_sec), dtype=np.float32)
    for idx, s in enumerate(sentences):
        a = v.infer(s, voice=voice)
        combined.append(a)
        if idx < len(sentences) - 1:
            combined.append(silence)
            
    full = np.concatenate(combined)
    tmp_wav = os.path.join(audio_dir, f"tmp_{out_name}.wav")
    final_mp3 = os.path.join(audio_dir, out_name)
    v.save(full, tmp_wav)
    
    subprocess.run(["ffmpeg", "-y", "-i", tmp_wav, "-filter:a", f"atempo={tempo}", "-b:a", "192k", final_mp3], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(tmp_wav):
        os.remove(tmp_wav)
    print(f"Generated: {out_name} ({os.path.getsize(final_mp3)} bytes)")

# 1. 5 Slides Thuyet Giang Tab 0 (Giong Nam Bac: Hai Dang)
slides_data = [
    ("lecture-buoi-01-slide-1.mp3", 
     "Chào bạn! Chào mừng bạn đến với Buổi học đầu tiên trên hành trình chinh phục tiếng Anh từ số 0. Bạn có từng thắc mắc: Tại sao 10 năm qua học ngữ pháp rất nhiều, nhưng chúng ta vẫn không dám mở miệng khi gặp người nước ngoài? Bởi vì não bộ không thể tiếp nhận công thức khô khan trước khi có cảm xúc thực tế. Trẻ em bản xứ nói hàng nghìn câu trước khi biết viết chữ A. Hôm nay, chúng ta bắt đầu từ chính bản năng giao tiếp nguyên thủy nhất: Kết nối con người."),
     
    ("lecture-buoi-01-slide-2.mp3",
     "Vì sao chúng ta lại bắt đầu bằng 3 âm vị: âm thè lưỡi Theta, âm gió ét sì, và âm bật tê? Tiếng Việt là tiếng đơn âm, người Việt thường rụt lưỡi vào trong nói Thank you thành Thanh kiu, và nuốt sạch âm đuôi biến Nice thành Nai. 3 âm này là liệu pháp tái cấu trúc cơ miệng, ép hàm và lưỡi thoát khỏi quán tính tiếng mẹ đẻ ngay từ ngày đầu tiên."),
     
    ("lecture-buoi-01-slide-3.mp3",
     "Theo kho ngữ liệu 1 tỷ từ của Mỹ, âm gió ét sì và âm bật tê chiếm hơn 65% toàn bộ ngữ pháp tiếng Anh. Từ danh từ số nhiều, động từ ngôi thứ ba, đến thì quá khứ ed. Nắm chắc 2 âm này ở Buổi 1 là bạn đã xây xong cái móng nhà vững chãi cho toàn bộ ngữ pháp sau này."),
     
    ("lecture-buoi-01-slide-4.mp3",
     "Người mới học thường mang nỗi sợ bị đánh giá. Tam giác sinh tồn: Chào hỏi làm quen: Hi, nice to meet you. Biết ơn chân thành: Thank you so much. Và Chúc lành tạm biệt: Have a great day. Đây là chiếc chìa khóa vạn năng khiến người bản xứ mỉm cười và đón nhận bạn nồng nhiệt, đập tan nỗi sợ giao tiếp."),
     
    ("lecture-buoi-01-slide-5.mp3",
     "Lộ trình 25 phút hôm nay gồm 6 bước đa giác quan: Soi gương cơ miệng, Nghe âm chuẩn, Nói vào micro cho AI chấm điểm, Trắc nghiệm, Thẻ 3D, Đối thoại và Gõ phím. Đạt đủ 7 lần lặp thực chất là bạn đã khắc sâu bài học vào vỏ não dài hạn. Hãy cùng bắt đầu nhé!")
]

for fname, txt in slides_data:
    make_audio_file(txt, voice="Hải Đăng", out_name=fname, tempo=0.90, pause_sec=0.45)

# 2. 6 Loi Dan Cua Thay Giao Huong Dan Tung Buoc (Hai Dang)
guides_data = [
    ("guide-buoi-01-step-1.mp3",
     "Chào mừng bạn đến với Bước 1: Khẩu hình và Phát âm. Ở bước này, bạn hãy quan sát kỹ khẩu hình của âm thè lưỡi Theta, âm gió ét sì, và âm bật tê. Bạn có thể bật gương camera để soi miệng của mình, bấm loa nghe âm chuẩn, và bấm nút micro màu tím để nói thử cho AI chấm điểm nhé. Hãy phát âm thử cả 3 âm để mở khóa Bước 2!"),
     
    ("guide-buoi-01-step-2.mp3",
     "Tuyệt vời! Bây giờ chúng ta bước sang Bước 2: Cụm từ phản xạ đời thường. Hãy lắng nghe từng câu mẫu và nhại theo ngữ điệu người Mỹ. Mỗi lần bạn nghe, nói, gõ chữ hay đối thoại, thước đo khắc sâu nơ ron sẽ ghi nhận để bạn chạm mốc 7 lần ghi nhớ vĩnh viễn!"),
     
    ("guide-buoi-01-step-3.mp3",
     "Chào mừng bạn đến với Bước 3: Kiểm tra trắc nghiệm phản xạ. Hãy đọc kỹ tình huống đời sống và chọn câu ứng xử tự nhiên nhất của người bản xứ. Đạt từ 70% trở lên là bạn sẽ giải mã được Bước tiếp theo!"),
     
    ("guide-buoi-01-step-4.mp3",
     "Xuất sắc! Chúng ta đến với Bước 4: Sổ thẻ ghi nhớ 3D. Hãy chạm vào từng thẻ để lật xem nghĩa tiếng Việt và bối cảnh sử dụng, giúp khắc sâu hình ảnh không gian vào trí nhớ dài hạn nhé!"),
     
    ("guide-buoi-01-step-5.mp3",
     "Bây giờ là lúc bước lên sân khấu thực chiến! Bạn vừa hạ cánh xuống sân bay JFK New York. Hãy bấm nút micro màu tím và đối đáp tự tin với người bạn David theo từng lượt thoại nhé!"),
     
    ("guide-buoi-01-step-6.mp3",
     "Bước cuối cùng: Gõ phản xạ và ghép khối câu. Hãy chạm vào các khối từ để xếp lại thành câu chuẩn xác. Hoàn thành bước này là bạn đã làm chủ trọn vẹn Buổi học số 1!")
]

for fname, txt in guides_data:
    make_audio_file(txt, voice="Hải Đăng", out_name=fname, tempo=0.90, pause_sec=0.45)

# 3. Boi Canh San Bay (Hai Dang)
story_txt = "Bạn vừa hạ cánh xuống sân bay quốc tế JFK New York sau một chuyến bay dài. Bạn đang đứng đợi lấy hành lý bên băng chuyền, thì một người đàn ông Mỹ thân thiện tên là David đứng cạnh quay sang nhìn bạn, mỉm cười và chào hỏi. Bạn hãy mỉm cười và đáp lại câu chào làm quen: Hi, nice to meet you! Sau đó, hãy cảm ơn khi anh ấy nhiệt tình giúp bạn nhấc chiếc vali nặng: Thank you so much! Và trước khi chia tay, đừng quên chúc anh ấy một ngày thật tuyệt vời nhé: Have a great day!"
make_audio_file(story_txt, voice="Hải Đăng", out_name="story-buoi-01.mp3", tempo=0.90, pause_sec=0.50)

# 4. Giong My Ban Xu David (Giong Adam)
david_turns = [
    ("david-buoi-01-turn-1.mp3", "Hi there! Nice day, isn't it?"),
    ("david-buoi-01-turn-2.mp3", "Here is your heavy luggage. Let me help you with that!"),
    ("david-buoi-01-turn-3.mp3", "You're very welcome! Have a wonderful trip in New York!")
]

for fname, txt in david_turns:
    make_audio_file(txt, voice="Adam", out_name=fname, tempo=0.95, pause_sec=0.3)

print("ALL VIENEU-TTS AUDIO ASSETS GENERATED SUCCESSFULLY!")
