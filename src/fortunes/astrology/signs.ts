export type Sign = {
  name: string;          // 牡羊座
  alias: string;         // Aries
  symbol: string;        // ♈
  range: string;         // 表示用
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  element: '火' | '土' | '風' | '水';
  ruler: string;
  catchphrase: string;
  summary: string;
  general: string;
  love: string;
  work: string;
  growth: string;
  shadow: string;
  luckyColor: string;
  luckyItem: string;
  advice: string;
};

export const SIGNS: Sign[] = [
  {
    name: '牡羊座', alias: 'Aries', symbol: '♈', range: '3/21〜4/19',
    startMonth: 3, startDay: 21, endMonth: 4, endDay: 19,
    element: '火', ruler: '火星',
    catchphrase: '最初の一歩を踏み出す勇気の人',
    summary: '思い立ったらすぐ動く、率直で熱量のあるタイプ。停滞よりも挑戦が似合う星です。',
    general: '直感のスピードが速く、頭で考える前に体が動いていることがしばしば。新しいことを始める瞬発力に長けています。',
    love: '気持ちをためこまず、好きはまっすぐ伝えるタイプ。駆け引きより、素直さが恋を進めます。',
    work: '立ち上げ・開拓フェーズで力を発揮。長く続く調整作業よりも、最初の火を起こす役割が向いています。',
    growth: '勢いだけで突き抜けようとすると周囲が置いていかれがち。仲間のペースに少し耳を傾ける時間が、信頼を太くします。',
    shadow: '怒りや苛立ちを瞬間的に表に出しやすいとき。深呼吸ひとつ、間を置く習慣がお守りに。',
    luckyColor: '緋色',
    luckyItem: 'スポーツシューズ',
    advice: '迷ったら、まず一歩。',
  },
  {
    name: '牡牛座', alias: 'Taurus', symbol: '♉', range: '4/20〜5/20',
    startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
    element: '土', ruler: '金星',
    catchphrase: '自分の心地よさを大切に育む人',
    summary: '五感を信頼し、本当にいいものをじっくり見極めるタイプ。安定と豊かさに敏感です。',
    general: '決めるまで時間がかかっても、決めた後の継続力は折り紙付き。地に足のついた歩みが信頼につながります。',
    love: 'ゆっくり距離が縮まるほど、深く根を張る関係に。スキンシップや美味しい食事が愛情表現になります。',
    work: '丁寧で品のある仕事ぶり。ものづくり、金融、飲食、美容など「実体のあるもの」と相性が良い星です。',
    growth: '頑なになりすぎると、新しいご縁を逃すことも。心地よさの「枠」を広げる遊び心を時々取り戻して。',
    shadow: '所有欲が独占欲に変わるとき。手放すほどに豊かになる感覚を思い出してみて。',
    luckyColor: '若草色',
    luckyItem: '陶器のカップ',
    advice: 'ゆっくりが、いちばん早い。',
  },
  {
    name: '双子座', alias: 'Gemini', symbol: '♊', range: '5/21〜6/21',
    startMonth: 5, startDay: 21, endMonth: 6, endDay: 21,
    element: '風', ruler: '水星',
    catchphrase: '言葉と好奇心で世界をつなぐ人',
    summary: '軽やかな会話と機転の利く頭脳が魅力。情報を集めて、人と人を結ぶ達人です。',
    general: '退屈が苦手で、いくつもの興味を同時に追いかけられるタイプ。広く浅く、が深さに変わる瞬間があります。',
    love: '同じ話題で笑い合える相手と相性◎。マンネリよりも、新しい体験を一緒に重ねたい人。',
    work: '広報、編集、企画、教育、IT など、情報と言葉を扱う仕事で本領発揮。複数案件の並走も得意。',
    growth: '気が散りやすい日は、扱うテーマをひとつに絞ると深さが出ます。締切は最高の友。',
    shadow: '飽きっぽさが薄情さに見えてしまう瞬間も。ひとつだけ、続けるテーマを持ってみて。',
    luckyColor: 'レモン色',
    luckyItem: 'メモ帳',
    advice: '今日の発見を一行だけ書き残す。',
  },
  {
    name: '蟹座', alias: 'Cancer', symbol: '♋', range: '6/22〜7/22',
    startMonth: 6, startDay: 22, endMonth: 7, endDay: 22,
    element: '水', ruler: '月',
    catchphrase: '誰かを守る温度をいつも持っている人',
    summary: '家庭的で記憶力が良く、大切な人の小さな変化に気づける優しさを持つタイプ。',
    general: '感情の豊かさが宝物。安心できる「場所」をつくる才能があり、周囲の心の温度も上げてくれます。',
    love: '安全な関係を築くのが得意。一度信頼したら長く付き合える、献身的なパートナーになれる人。',
    work: 'ケア、教育、医療、人事、飲食、家庭にまつわる分野で力を発揮。チームの心の支えになりがち。',
    growth: '気を遣いすぎて疲れてしまう日は、ひとり時間を意識的に確保して。自分を守ることも愛情のひとつ。',
    shadow: '過去にとらわれて前に進めなくなることも。手放す勇気が、新しい温度を運んでくれます。',
    luckyColor: '銀鼠',
    luckyItem: '小さな写真立て',
    advice: '自分に「お疲れさま」を言ってあげて。',
  },
  {
    name: '獅子座', alias: 'Leo', symbol: '♌', range: '7/23〜8/22',
    startMonth: 7, startDay: 23, endMonth: 8, endDay: 22,
    element: '火', ruler: '太陽',
    catchphrase: '主役の華を惜しみなく分け与える人',
    summary: '存在感があり、誰かを照らすのが上手なタイプ。自分のドラマを生き切る情熱の持ち主です。',
    general: '真ん中に立つ覚悟と、注がれる視線をエネルギーに変える力。他者を励ます言葉が自然に出てきます。',
    love: '愛情表現は派手すぎるくらいでちょうどいい。プレゼントや言葉、笑顔をたっぷり贈り合いたい人。',
    work: 'リーダーシップ、表現、エンタメ、教育、ブランド系の仕事で輝きが増します。',
    growth: 'プライドが大切なぶん、傷ついたときに見せられる弱さが、人としての魅力をさらに引き立てます。',
    shadow: '注目を集めすぎることに依存していないか、ときどき内側の声を聞いて。',
    luckyColor: '黄金色',
    luckyItem: 'お気に入りの香水',
    advice: '今日のあなたが、いちばんの主役。',
  },
  {
    name: '乙女座', alias: 'Virgo', symbol: '♍', range: '8/23〜9/22',
    startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
    element: '土', ruler: '水星',
    catchphrase: '細やかさで世界を整える人',
    summary: '観察力と分析力に長け、他人の気づかないところまで気を配れる繊細さが魅力です。',
    general: 'コツコツと積み上げるのが上手で、信頼を裏切らないタイプ。完璧を目指すあまり、自分を厳しく追い込みすぎないで。',
    love: 'さりげない気配りが恋を支えます。相手の小さな変化に気づける感性が、長く続く関係をつくります。',
    work: '事務、編集、医療、品質管理、データ分析など「整える」仕事と相性◎。',
    growth: '完璧でなくても価値があると認めること。70点で出した行動が、100点の評価につながる日もあります。',
    shadow: '心配性が止まらないとき。書き出すことで、頭の中の靄が晴れていきます。',
    luckyColor: 'ベージュ',
    luckyItem: 'リスト帳',
    advice: '6割で世に出すことを、自分に許す。',
  },
  {
    name: '天秤座', alias: 'Libra', symbol: '♎', range: '9/23〜10/23',
    startMonth: 9, startDay: 23, endMonth: 10, endDay: 23,
    element: '風', ruler: '金星',
    catchphrase: '美しい調和を生み出す人',
    summary: 'バランス感覚に優れ、洗練された美意識を持つタイプ。人と人の間をなめらかにつなぎます。',
    general: '相手の立場を理解する力が高く、対立よりも対話で物事を整えます。場の空気を整えるセンスは抜群。',
    love: '相手の好みに寄り添うのが得意。ふたりで「いいね」と言い合える時間を大切にします。',
    work: 'デザイン、広報、外交、コーディネート、コンサル系で本領発揮。',
    growth: '決断を後回しにしがち。「どちらがより自分らしいか」で選ぶと、迷いが減ります。',
    shadow: '人に合わせすぎて自分の輪郭が薄くなる時。たまには「私はこう思う」を声に出して。',
    luckyColor: '空色',
    luckyItem: '香りのよいハンドクリーム',
    advice: '今日のあなたの「好き」を1つ宣言する。',
  },
  {
    name: '蠍座', alias: 'Scorpio', symbol: '♏', range: '10/24〜11/22',
    startMonth: 10, startDay: 24, endMonth: 11, endDay: 22,
    element: '水', ruler: '冥王星',
    catchphrase: '深く潜って真実を掴む人',
    summary: '集中力と洞察力が深く、表面では見えない本質に触れていくタイプ。一途で誠実な人。',
    general: '一度決めたら最後までやり遂げる粘り強さがあります。秘密を守る信頼感があり、深い関係性を育む達人。',
    love: '愛情はとても濃密で、相手の核心まで知りたいと願うタイプ。軽い関係よりも、運命的な絆を求めます。',
    work: '研究、心理、医療、調査、税務、執筆など「深く掘る」仕事に向いています。',
    growth: '抱え込みすぎてしまうとき。信頼できる人にひとつだけ預けてみると、肩がふっと軽くなります。',
    shadow: '嫉妬や独占欲が顔を出すとき。湧いた感情を否定せず、書き出して眺めてみて。',
    luckyColor: '深紅',
    luckyItem: '黒革のノート',
    advice: 'ひとつのテーマに、3時間だけ深く潜る。',
  },
  {
    name: '射手座', alias: 'Sagittarius', symbol: '♐', range: '11/23〜12/21',
    startMonth: 11, startDay: 23, endMonth: 12, endDay: 21,
    element: '火', ruler: '木星',
    catchphrase: '広い世界を駆け抜ける冒険家',
    summary: '楽観的で自由を愛し、未知への好奇心が尽きないタイプ。視野が広く、大きな絵を描ける人です。',
    general: '哲学や旅、語学、未知の文化に強く惹かれます。直感で動いた先で、大切な学びに出会いやすい人。',
    love: '自由を尊重してくれる相手と相性◎。束縛より、共に旅をする感覚が長続きの秘訣。',
    work: '海外、翻訳、教育、出版、観光、スポーツ、宗教などのフィールドで本領発揮。',
    growth: '広げるのが得意なぶん、収束させる力を意識すると一段大きく羽ばたけます。',
    shadow: '無責任に見えてしまう瞬間。約束を守る所作を増やすと、信頼が大きくなります。',
    luckyColor: '紫紺',
    luckyItem: '地図帳',
    advice: '半年後に行きたい場所を1つ決める。',
  },
  {
    name: '山羊座', alias: 'Capricorn', symbol: '♑', range: '12/22〜1/19',
    startMonth: 12, startDay: 22, endMonth: 1, endDay: 19,
    element: '土', ruler: '土星',
    catchphrase: '時間を味方にする戦略家',
    summary: '責任感が強く、長期的な視点で物事を組み立てるタイプ。粘り強く山を登る人です。',
    general: '計画性と忍耐力で、大きな目標を着実に達成する力があります。社会的な役割を引き受けることに誇りを感じる人。',
    love: '信頼を時間で築くタイプ。派手さはなくても、長く支え合える深い関係を育みます。',
    work: '経営、財務、建築、行政、伝統工芸など、長期にわたって積み上げる分野が得意。',
    growth: '頑張りすぎると体が悲鳴を上げます。計画の中に「休む日」を予定として入れてあげて。',
    shadow: '感情を後回しにしすぎる癖。ときどき自分の心と対話する時間を予定表に。',
    luckyColor: '濃茶',
    luckyItem: '革の長財布',
    advice: '今日の小さな一段を確実に登る。',
  },
  {
    name: '水瓶座', alias: 'Aquarius', symbol: '♒', range: '1/20〜2/18',
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
    element: '風', ruler: '天王星',
    catchphrase: '未来の風を運んでくる革新者',
    summary: '独創性と公平さを大切にし、固定観念を軽やかに飛び越えていくタイプ。',
    general: '個性を尊重し、コミュニティの中で新しい価値を生み出すことに喜びを感じます。テクノロジーや社会変革に敏感。',
    love: '友達のような対等な関係から愛が育つタイプ。束縛されないことが愛情の証になります。',
    work: 'IT、研究、デザイン、社会活動、新規事業など、既存の枠を超える仕事で輝きます。',
    growth: '頭で考えすぎると感情が置き去りに。心の声に時々戻ると、人間関係がより深まります。',
    shadow: '冷たく見えてしまう瞬間。あたたかい言葉をひとつ添えるだけで印象が変わります。',
    luckyColor: 'ターコイズ',
    luckyItem: '機能的な腕時計',
    advice: '昨日と違うルートで歩いてみる。',
  },
  {
    name: '魚座', alias: 'Pisces', symbol: '♓', range: '2/19〜3/20',
    startMonth: 2, startDay: 19, endMonth: 3, endDay: 20,
    element: '水', ruler: '海王星',
    catchphrase: '境界をやさしく溶かす夢想家',
    summary: '共感力と想像力が豊かで、人や世界の痛みを感じ取れる繊細なアンテナを持つ人。',
    general: '芸術や音楽、物語、スピリチュアルなものに惹かれやすく、目に見えないものを大切にします。',
    love: '相手の気持ちに寄り添う愛情表現が魅力。境界線を意識すると、より健やかな関係に。',
    work: 'アート、音楽、医療、福祉、執筆、占術、カウンセリングなど、感性を活かす分野で本領発揮。',
    growth: '感情の波に流されたら、紙に書く・歩く・水に触れるなどで現実に戻る習慣を持って。',
    shadow: '逃避したくなるとき。逃げてもいい、けれど寝る前にひとつだけ「今日の良かったこと」を。',
    luckyColor: '海色',
    luckyItem: '水色のハンカチ',
    advice: '思いついたイメージを絵か言葉で残す。',
  },
];

export function findSign(month: number, day: number): Sign {
  for (const s of SIGNS) {
    if (s.startMonth < s.endMonth || (s.startMonth === s.endMonth && s.startDay <= s.endDay)) {
      if (
        (month === s.startMonth && day >= s.startDay) ||
        (month === s.endMonth && day <= s.endDay) ||
        (month > s.startMonth && month < s.endMonth)
      ) {
        return s;
      }
    } else {
      // 山羊座のように年を跨ぐ場合
      if (
        (month === s.startMonth && day >= s.startDay) ||
        (month === s.endMonth && day <= s.endDay) ||
        month > s.startMonth ||
        month < s.endMonth
      ) {
        return s;
      }
    }
  }
  // フォールバック
  return SIGNS[0];
}
