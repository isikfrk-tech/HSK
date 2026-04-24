export const STUDENT = {
  name: '鹏娜',
  pinyin: 'Péng Nà',
};

export const IMAGES = {
  hedef:           '/images/hedef.png',           // gece hayali, hiç ilerleme yok
  calisirken:      '/images/calisirken.png',       // masada çalışıyor, az ilerleme
  calismaMaratonu: '/images/calisma-maratonu.png', // maraton, quiz başlangıcı
  sabahErken:      '/images/sabah-erken.png',      // sabah 05:30, streak / ileri ilerleme
  sikilmisCalisiyor: '/images/sikilmis-calisiyor.png', // sıkılmış ama devam, uzun flashcard
  basarisizOlmus:  '/images/basarisiz-olmus.png',  // quiz düşük puan
  pandaKutlama2:   '/images/panda-kutlama2.png',   // quiz orta puan / milestone
  pandaKutlama1:   '/images/panda-kutlama1.png',   // quiz yüksek puan
  hedefineUlasti:  '/images/hedefine-ulasti.png',  // tüm kelimeler öğrenildi
  ogluyla:         '/images/ogluyla.png',          // sözlük sayfası
};

// İlerleme yüzdesine göre ana sayfa görseli
export function getHomeImage(progressPct: number): string {
  if (progressPct === 0)   return IMAGES.hedef;
  if (progressPct < 20)    return IMAGES.calisirken;
  if (progressPct < 50)    return IMAGES.calismaMaratonu;
  if (progressPct < 80)    return IMAGES.sabahErken;
  if (progressPct < 100)   return IMAGES.pandaKutlama2;
  return IMAGES.hedefineUlasti;
}

// Ana sayfa mesajları
export function getHomeMessage(progressPct: number): { title: string; sub: string } {
  if (progressPct === 0) return {
    title: `Hayalin seni bekliyor, ${STUDENT.name}! 🌙`,
    sub: 'HSK 6 sertifikası o rüyada değil — gerçekte seni bekliyor. İlk adımı at!',
  };
  if (progressPct < 20) return {
    title: `Başladın, dur ma ${STUDENT.name}! 📚`,
    sub: 'Panda da seninle. Her kelime seni bir adım öne taşıyor.',
  };
  if (progressPct < 50) return {
    title: `Maraton başladı ${STUDENT.name}! 🏃`,
    sub: '累吗？Evet. 放弃吗？Asla! Yarı yoldayken duranlar hiç bitiremez.',
  };
  if (progressPct < 80) return {
    title: `05:30'da kalkan kazanır, ${STUDENT.name}! ⭐`,
    sub: 'Bu çabayı gören seni tanırsan anlarsın. Bitiş çizgisi yakın!',
  };
  if (progressPct < 100) return {
    title: `Neredeyse bitti ${STUDENT.name}! 🎊`,
    sub: '又完成了一个重要目标！ Son kelimeler seni bekliyor.',
  };
  return {
    title: `我做到了！${STUDENT.name}, HSK 6 通过啦！ 🏆`,
    sub: '梦想 + 努力 = 成功 ❤️ Tüm kelimeleri öğrendin!',
  };
}

// Quiz sonuç mesajları
export function getQuizResult(score: number, total: number): {
  image: string; title: string; sub: string; color: string;
} {
  const pct = (score / total) * 100;
  if (pct >= 80) return {
    image: IMAGES.pandaKutlama1,
    title: `你太棒了，${STUDENT.name}！ 🎉`,
    sub: `${score}/${total} — 所有的努力，都是值得的！ Hot pot ödülün hak edildi!`,
    color: 'from-green-400 to-emerald-500',
  };
  if (pct >= 50) return {
    image: IMAGES.pandaKutlama2,
    title: `恭喜你又突破了，${STUDENT.name}！ 🌸`,
    sub: `${score}/${total} — 努力不一定立刻有收获，但一定会有更好的自己！`,
    color: 'from-blue-400 to-cyan-500',
  };
  return {
    image: IMAGES.basarisizOlmus,
    title: `咳… ${STUDENT.name}, bu sefer olmadı 😔`,
    sub: `${score}/${total} — 这次的失利，是为了下一次更好的成功！ 下一次一定！`,
    color: 'from-orange-400 to-red-500',
  };
}

// Flashcard oturum sonu mesajları
export function getFlashcardResult(known: number, total: number): {
  image: string; title: string; sub: string;
} {
  const pct = total > 0 ? (known / total) * 100 : 0;
  if (pct >= 80) return {
    image: IMAGES.pandaKutlama2,
    title: `Harika oturum, ${STUDENT.name}！ 🐼`,
    sub: `${known}/${total} kart bildin. 你很棒！`,
  };
  if (total >= 20) return {
    image: IMAGES.sikilmisCalisiyor,
    title: `好想睡觉… ama bırakmadın, ${STUDENT.name}！ 💪`,
    sub: `${known}/${total} kart. 再学10分钟就休息！`,
  };
  return {
    image: IMAGES.calisirken,
    title: `Oturum tamamlandı, ${STUDENT.name}！`,
    sub: `${known}/${total} kart bildin. 坚持就是胜利！`,
  };
}
