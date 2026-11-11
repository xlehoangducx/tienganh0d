# -*- coding: utf-8 -*-
with open('d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js', 'r', encoding='utf-8') as f:
    curr = f.read()

# 1. Update mouthTechniques words with audioFile
curr = curr.replace(
    '{ word: "Thank you", ipa: "/ˈθæŋk juː/", meaning: "Cảm ơn bạn", context: "Bày tỏ lòng biết ơn chân thành khi nhận trợ giúp" },',
    '{ word: "Thank you", ipa: "/ˈθæŋk juː/", meaning: "Cảm ơn bạn", context: "Bày tỏ lòng biết ơn chân thành khi nhận trợ giúp", audioFile: "assets/audio/thank-you.mp3" },'
)
curr = curr.replace(
    '{ word: "Think", ipa: "/θɪŋk/", meaning: "Suy nghĩ / Tôi nghĩ", context: "Bày tỏ ý kiến cá nhân: I think so (Tôi nghĩ vậy)" }',
    '{ word: "Think", ipa: "/θɪŋk/", meaning: "Suy nghĩ / Tôi nghĩ", context: "Bày tỏ ý kiến cá nhân: I think so (Tôi nghĩ vậy)", audioFile: "assets/audio/think.mp3" }'
)
curr = curr.replace(
    '{ word: "Nice", ipa: "/naɪs/", meaning: "Tốt đẹp / Dễ mến", context: "Lời khen ngợi: Nice to meet you" },',
    '{ word: "Nice", ipa: "/naɪs/", meaning: "Tốt đẹp / Dễ mến", context: "Lời khen ngợi: Nice to meet you", audioFile: "assets/audio/nice.mp3" },'
)
curr = curr.replace(
    '{ word: "Thanks", ipa: "/θæŋks/", meaning: "Cảm ơn nha (thân mật)", context: "Dùng với bạn bè đồng trang lứa" },',
    '{ word: "Thanks", ipa: "/θæŋks/", meaning: "Cảm ơn nha (thân mật)", context: "Dùng với bạn bè đồng trang lứa", audioFile: "assets/audio/thanks.mp3" },'
)
curr = curr.replace(
    '{ word: "See", ipa: "/siː/", meaning: "Nhìn thấy / Gặp lại", context: "Gặp lại người quen: See you soon" }',
    '{ word: "See", ipa: "/siː/", meaning: "Nhìn thấy / Gặp lại", context: "Gặp lại người quen: See you soon", audioFile: "assets/audio/see.mp3" }'
)
curr = curr.replace(
    '{ word: "Meet", ipa: "/miːt/", meaning: "Gặp gỡ", context: "Gặp ai đó lần đầu hoặc hẹn gặp" },',
    '{ word: "Meet", ipa: "/miːt/", meaning: "Gặp gỡ", context: "Gặp ai đó lần đầu hoặc hẹn gặp", audioFile: "assets/audio/meet.mp3" },'
)
curr = curr.replace(
    '{ word: "Great", ipa: "/ɡreɪt/", meaning: "Tuyệt vời", context: "Cảm xúc hào hứng: Have a great day!" },',
    '{ word: "Great", ipa: "/ɡreɪt/", meaning: "Tuyệt vời", context: "Cảm xúc hào hứng: Have a great day!", audioFile: "assets/audio/great.mp3" },'
)
curr = curr.replace(
    '{ word: "Wait", ipa: "/weɪt/", meaning: "Chờ đợi", context: "Nhờ người khác nán lại: Wait a minute" }',
    '{ word: "Wait", ipa: "/weɪt/", meaning: "Chờ đợi", context: "Nhờ người khác nán lại: Wait a minute", audioFile: "assets/audio/wait.mp3" }'
)

# 2. Update chunks with audioFile
chunks_replacements = [
    ('audioText: "Hi, nice to meet you!",', 'audioFile: "assets/audio/hi-nice-to-meet-you.mp3",\n          audioText: "Hi, nice to meet you!",'),
    ('audioText: "Hi, great to meet you!",', 'audioFile: "assets/audio/hi-great-to-meet-you.mp3",\n          audioText: "Hi, great to meet you!",'),
    ('audioText: "Good to see you again!",', 'audioFile: "assets/audio/good-to-see-you-again.mp3",\n          audioText: "Good to see you again!",'),
    ('audioText: "Thank you so much!",', 'audioFile: "assets/audio/thank-you-so-much.mp3",\n          audioText: "Thank you so much!",'),
    ('audioText: "Thank you for your help!",', 'audioFile: "assets/audio/thank-you-for-your-help.mp3",\n          audioText: "Thank you for your help!",'),
    ('audioText: "Thanks a lot!",', 'audioFile: "assets/audio/thanks-a-lot.mp3",\n          audioText: "Thanks a lot!",'),
    ('audioText: "Have a great day!",', 'audioFile: "assets/audio/have-a-great-day.mp3",\n          audioText: "Have a great day!",'),
    ('audioText: "Have a good one!",', 'audioFile: "assets/audio/have-a-good-one.mp3",\n          audioText: "Have a good one!",'),
    ('audioText: "Take care! See you later!",', 'audioFile: "assets/audio/take-care-see-you-later.mp3",\n          audioText: "Take care! See you later!",')
]

for old, new in chunks_replacements:
    curr = curr.replace(old, new)

with open('d:/WEB_HOC_TIENG_ANH_AI/js/curriculum-data.js', 'w', encoding='utf-8') as f:
    f.write(curr)

print("Updated curriculum-data.js with direct audioFile properties!")

# Now update app.js to use audioFile directly
with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# In selectMouthWord: play audioFile
app_js = app_js.replace(
    'selectedMouthWords[techIdx] = wordObj;\n  speakText(wordObj.word);',
    'selectedMouthWords[techIdx] = wordObj;\n  if (wordObj.audioFile) { window.playTrack(wordObj.audioFile); } else { speakText(wordObj.word); }'
)

# In replaySelectedMouthWord: play audioFile
app_js = app_js.replace(
    'window.replaySelectedMouthWord = function(techIdx) {\n  const currentWord = selectedMouthWords[techIdx];\n  if (currentWord) {\n    speakText(currentWord.word);\n  }\n};',
    'window.replaySelectedMouthWord = function(techIdx) {\n  const currentWord = selectedMouthWords[techIdx];\n  if (currentWord) {\n    if (currentWord.audioFile) { window.playTrack(currentWord.audioFile); } else { speakText(currentWord.word); }\n  }\n};'
)

# In handleListenChunk: play audioFile
app_js = app_js.replace(
    'window.handleListenChunk = function(phrase) {\n  speakText(phrase);\n  markChunkListened(phrase);\n};',
    '''window.handleListenChunk = function(phrase) {
  const lesson = CURRICULUM_DATA.lessons.find(l => l.id === currentActiveLessonId);
  const chunkObj = lesson?.chunks?.find(c => c.phrase === phrase);
  if (chunkObj && chunkObj.audioFile) {
    window.playTrack(chunkObj.audioFile);
  } else {
    speakText(phrase);
  }
  markChunkListened(phrase);
};'''
)

with open('d:/WEB_HOC_TIENG_ANH_AI/js/app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Updated app.js to play audioFile directly via playTrack!")
