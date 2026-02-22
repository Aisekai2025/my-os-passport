import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useRegisterSW } from 'virtual:pwa-register/react';

// === 多言語辞書（日・英・ポ） ===
const textDict = {
  ja: {
    tabAbout: "解説", tabInput: "入力", tabZukan: "ずかん", tabPassport: "提示",
    welcomeTitle: "どんな些細なことでも、大丈夫ですよ。",
    welcomeSub: "あなたは一人ではありません。このアプリは、お子様を評価するものではなく、力を最大限に発揮するための「取扱説明書（パスポート）」です。",
    conceptTitle: "「努力」から「戦略」へ",
    conceptBody: "「何度言ったらわかるの？」と思ってしまうことの多くは、実は脳の特性（OS）が関係しています。自分たちを責めるのではなく、お子様に合った「設定（戦略）」を一緒に見つけましょう。",
    parentCare: "☕ 保護者のためのケア",
    parentCareText: "今日も一日お疲れ様です。まずは、今日のお子様（そしてあなた自身！）の頑張りにスタンプを押しましょう！",
    stampSaved: "スタンプを記録しました！",
    nameLabel: "👤 お名前 / ニックネーム",
    namePlaceholder: "例：ギフ 太郎",
    addMemo: "追加メモ（音声入力可）",
    saveBtn: "💾 記録を保存する",
    savedAlert: "設定を保存しました！",
    qrHint: "このQRコードを支援者（保育園・学校・保健師さん）に読み取ってもらってください",
    simpleReport: "📄 提出用シンプル表示",
    // === 図鑑（Zukan）用データ ===
    zukanTitle: "👑 ぼく・わたしの OSずかん 👑",
    zukanEmpty: "やあ！ワシは ふくろうはかせ じゃ！\n『にゅうりょく』から きみの ひみつのぱわーを おしえておくれ！",
    zukanGreeting: "おお！きみは こんな『まほう』を もっておるんじゃな！すばらしいぞ！",
    zukanSparkle: "✨ きょうの キラリ（たからもの） ✨",
    zukanCategories: { sensor: "まほうの センサー 🪄", battery: "パワーの ひみつ 🔋", communication: "おはなしの まほう 🗣️" },
    zukanOptions: {
      sensor: ["🕶️ ひかりの まほうつかい", "🎧 おと キャッチ めいじん", "👕 おはだ センサー", "👃 におい めいたんてい"],
      battery: ["🔋 げんき じゅうでんき", "⚡ スーパー ダッシュ！", "🛌 おひるね マスター", "🐢 じっくり やさん"],
      communication: ["🗣️ おしゃべり はかせ", "🤫 ジェスチャー めいじん", "👀 みておぼえる しゃしんか", "🎨 えをかく アーティスト"]
    }
  },
  en: {
    tabAbout: "About", tabInput: "Input", tabZukan: "Book", tabPassport: "Passport",
    welcomeTitle: "Whatever it is, it's okay.",
    welcomeSub: "You are not alone. This app is not for evaluating your child, but a 'Passport' to help them thrive.",
    conceptTitle: "From 'Effort' to 'Strategy'",
    conceptBody: "Many things we struggle with are related to our brain's OS. Instead of blaming yourselves, let's find the right 'settings' (strategies) together.",
    parentCare: "☕ Parent Care",
    parentCareText: "Great job today! Tap a stamp to praise your child (and yourself)!",
    stampSaved: "Stamp saved!",
    nameLabel: "👤 Name / Nickname",
    namePlaceholder: "e.g. Leo",
    addMemo: "Additional Memo (Voice OK)",
    saveBtn: "💾 Save Data",
    savedAlert: "Settings saved!",
    qrHint: "Please have your supporter scan this QR code.",
    simpleReport: "📄 Simple Report Mode",
    zukanTitle: "👑 My OS Zukan 👑",
    zukanEmpty: "Hello! I'm Dr. Owl! Tell me your secret powers from the Input tab!",
    zukanGreeting: "Wow! You have these amazing magic powers!",
    zukanSparkle: "✨ Today's Sparkle (Treasures) ✨",
    zukanCategories: { sensor: "Magic Sensors 🪄", battery: "Secret Power 🔋", communication: "Magic Words 🗣️" },
    zukanOptions: {
      sensor: ["🕶️ Light Wizard", "🎧 Sound Catcher", "👕 Skin Sensor", "👃 Super Detective"],
      battery: ["🔋 Energy Charger", "⚡ Super Dasher!", "🛌 Nap Master", "🐢 Slow & Steady"],
      communication: ["🗣️ Talking Professor", "🤫 Gesture Master", "👀 Photo Memory", "🎨 Art Communicator"]
    }
  },
  pt: {
    tabAbout: "Sobre", tabInput: "Entrada", tabZukan: "Livro", tabPassport: "Passaporte",
    welcomeTitle: "Qualquer coisa, está tudo bem.",
    welcomeSub: "Você não está sozinho(a). Este app não avalia seu filho(a), é um 'Passaporte' para ajudá-lo(a) a brilhar.",
    conceptTitle: "Da 'Esforço' à 'Estratégia'",
    conceptBody: "Muitas dificuldades estão ligadas ao 'OS' do cérebro. Em vez de se culpar, vamos encontrar as 'configurações' certas juntos.",
    parentCare: "☕ Cuidado com os Pais",
    parentCareText: "Bom trabalho hoje! Toque num carimbo para elogiar seu filho (e você mesmo)!",
    stampSaved: "Carimbo salvo!",
    nameLabel: "👤 Nome / Apelido",
    namePlaceholder: "ex: Leo",
    addMemo: "Anotação (Voz OK)",
    saveBtn: "💾 Salvar Dados",
    savedAlert: "Configurações salvas!",
    qrHint: "Peça para o professor ou médico escanear este QR code.",
    simpleReport: "📄 Modo Relatório",
    zukanTitle: "👑 Meu OS Zukan 👑",
    zukanEmpty: "Olá! Sou o Dr. Coruja! Me conte seus poderes na aba de Entrada!",
    zukanGreeting: "Uau! Você tem esses poderes mágicos incríveis!",
    zukanSparkle: "✨ Brilho de Hoje (Tesouros) ✨",
    zukanCategories: { sensor: "Sensores Mágicos 🪄", battery: "Poder Secreto 🔋", communication: "Palavras Mágicas 🗣️" },
    zukanOptions: {
      sensor: ["🕶️ Mago da Luz", "🎧 Caçador de Som", "👕 Sensor de Pele", "👃 Super Detetive"],
      battery: ["🔋 Carregador de Energia", "⚡ Super Corredor!", "🛌 Mestre da Soneca", "🐢 Devagar e Sempre"],
      communication: ["🗣️ Professor Falante", "🤫 Mestre dos Gestos", "👀 Memória Fotográfica", "🎨 Artista Comunicador"]
    }
  }
};

const fieldOptions = {
  sensor: {
    icon: "📡", label: { ja: "センサー（感覚）", en: "Sensors (Senses)", pt: "Sensores (Sentidos)" },
    options: {
      ja: ["🕶️ まぶしいの苦手", "🎧 大きな音ビックリ", "👕 服のタグがチクチク", "👃 においに敏感"],
      en: ["🕶️ Dislikes bright light", "🎧 Sensitive to loud noise", "👕 Dislikes itchy clothes", "👃 Sensitive to smells"],
      pt: ["🕶️ Não gosta de luz forte", "🎧 Sensível a barulho", "👕 Etiquetas incomodam", "👃 Sensível a cheiros"]
    }
  },
  battery: {
    icon: "🔋", label: { ja: "バッテリー（体力・ペース）", en: "Battery (Energy)", pt: "Bateria (Energia)" },
    options: {
      ja: ["🔋 疲れやすい", "⚡ いつも全力ダッシュ", "🛌 お昼寝チャージ必須", "🐢 じっくりマイペース"],
      en: ["🔋 Tires easily", "⚡ Always running", "🛌 Needs nap to recharge", "🐢 Goes at own pace"],
      pt: ["🔋 Cansa fácil", "⚡ Sempre correndo", "🛌 Precisa de soneca", "🐢 No seu próprio ritmo"]
    }
  },
  communication: {
    icon: "💬", label: { ja: "つうしん（言葉・伝え方）", en: "Communication", pt: "Comunicação" },
    options: {
      ja: ["🗣️ おしゃべり大好き", "🤫 言葉より身振り手振り", "👀 見て覚えるのが得意", "🎨 絵や写真で伝えたい"],
      en: ["🗣️ Loves to talk", "🤫 Uses gestures more", "👀 Visual learner", "🎨 Communicates via drawing"],
      pt: ["🗣️ Adora falar", "🤫 Usa mais gestos", "👀 Aprende vendo", "🎨 Comunica-se desenhando"]
    }
  }
};

// ずかん用のテーマカラー定義
const categoryColors = {
  sensor: { bg: '#FFF9C4', border: '#FFCA28', text: '#E65100', shadow: '#FFE082' },        // 黄色系
  battery: { bg: '#E8F5E9', border: '#81C784', text: '#1B5E20', shadow: '#C8E6C9' },       // 緑色系
  communication: { bg: '#E3F2FD', border: '#64B5F6', text: '#0D47A1', shadow: '#BBDEFB' }  // 青色系
};

export default function App() {
  useRegisterSW({ onRegistered(r) { console.log('SW Registered'); } });

  const [lang, setLang] = useState('ja');
  const t = textDict[lang];

  const [activeTab, setActiveTab] = useState('about');
  const [simpleMode, setSimpleMode] = useState(false);
  const [osData, setOsData] = useState({
    name: '',
    sensor: { tags: [], memo: '' },
    battery: { tags: [], memo: '' },
    communication: { tags: [], memo: '' },
    stamps: []
  });

  const [isRecording, setIsRecording] = useState(false);
  const [currentRecordingField, setCurrentRecordingField] = useState(null);
  const recognitionRef = useRef(null);
  const currentFieldRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        setOsData(decoded);
        setActiveTab('passport');
      } catch (e) { console.error(e); }
    } else {
      const saved = localStorage.getItem('myOsDataV7');
      if (saved) setOsData(JSON.parse(saved));
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (currentFieldRef.current) {
          setOsData(prev => ({
            ...prev,
            [currentFieldRef.current]: { 
              ...prev[currentFieldRef.current], 
              memo: (prev[currentFieldRef.current].memo + ' ' + transcript).trim() 
            }
          }));
        }
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === 'ja' ? 'ja-JP' : lang === 'en' ? 'en-US' : 'pt-BR';
    }
  }, [lang]);

  const toggleTag = (field, tagIndex) => {
    setOsData(prev => {
      const currentTags = prev[field].tags;
      const isExist = currentTags.includes(tagIndex);
      const newTags = isExist ? currentTags.filter(t => t !== tagIndex) : [...currentTags, tagIndex];
      return { ...prev, [field]: { ...prev[field], tags: newTags } };
    });
  };

  const handleSave = () => {
    localStorage.setItem('myOsDataV7', JSON.stringify(osData));
    alert(t.savedAlert);
  };

  const addStamp = (emoji) => {
    const today = new Date().toLocaleDateString();
    setOsData(prev => {
      const newStamps = [{ date: today, emoji, id: Date.now() }, ...prev.stamps].slice(0, 15);
      return { ...prev, stamps: newStamps };
    });
    alert(`${emoji} ${t.stampSaved}`);
  };

  const toggleRecording = (field) => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      currentFieldRef.current = field;
      setCurrentRecordingField(field);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const getSharedUrl = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(osData)));
    return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  };

  const containerStyle = {
    maxWidth: '600px', margin: '0 auto', fontFamily: '"Nunito", "M PLUS Rounded 1c", sans-serif', 
    padding: '15px', color: '#333', backgroundColor: simpleMode ? '#fff' : '#F1F8E9', 
    minHeight: '100vh', boxSizing: 'border-box'
  };
  const cardStyle = {
    backgroundColor: '#fff', padding: '20px', borderRadius: '16px', 
    boxShadow: simpleMode ? 'none' : '0 4px 12px rgba(46,125,50,0.08)', 
    border: simpleMode ? '1px solid #ccc' : '2px solid #A5D6A7', marginBottom: '15px', boxSizing: 'border-box'
  };

  const isZukanEmpty = Object.keys(fieldOptions).every(fieldId => osData[fieldId].tags.length === 0);

  return (
    <div style={containerStyle}>
      {/* 🌟 CSSアニメーションの注入 */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes sparkleScale {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.15) rotate(5deg); filter: brightness(1.2); }
          100% { transform: scale(1); filter: brightness(1); }
        }
      `}</style>

      {/* ヘッダー・ナビゲーション部分（省略せずにそのまま） */}
      {!simpleMode && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h1 style={{ color: '#2E7D32', margin: '0', fontSize: '1.4rem' }}>🧭 My OS Passport</h1>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['ja', 'en', 'pt'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '4px 8px', borderRadius: '8px', border: '1px solid #A5D6A7', 
                backgroundColor: lang === l ? '#2E7D32' : '#fff', color: lang === l ? '#fff' : '#2E7D32',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {!simpleMode && (
        <nav style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
          {[
            { id: 'about', label: t.tabAbout, icon: '📖' },
            { id: 'assessment', label: t.tabInput, icon: '🧩' },
            { id: 'zukan', label: t.tabZukan, icon: '👑' },
            { id: 'passport', label: t.tabPassport, icon: '✨' }
          ].map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: '10px 4px', border: 'none', borderRadius: '15px', cursor: 'pointer',
              backgroundColor: activeTab === id ? '#4CAF50' : '#E8F5E9',
              color: activeTab === id ? 'white' : '#2E7D32', fontWeight: 'bold', fontSize: '0.85rem',
              boxShadow: activeTab === id ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      )}

      {/* --- 解説・入力タブ（既存コード同様） --- */}
      {activeTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ ...cardStyle, borderLeft: '6px solid #4CAF50', backgroundColor: '#E8F5E9' }}>
            <h2 style={{ color: '#1B5E20', marginTop: 0, fontSize: '1.2rem' }}>{t.welcomeTitle}</h2>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '0.95rem' }}>{t.welcomeSub}</p>
          </div>
          <div style={cardStyle}>
            <h3 style={{ color: '#2E7D32', borderBottom: '2px dashed #C8E6C9', paddingBottom: '8px' }}>{t.conceptTitle}</h3>
            <p style={{ lineHeight: '1.7' }}>{t.conceptBody}</p>
          </div>
        </div>
      )}

      {activeTab === 'assessment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ ...cardStyle, backgroundColor: '#FFF3E0', borderColor: '#FFB74D' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#E65100', fontSize: '1.1rem' }}>{t.parentCare}</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>{t.parentCareText}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
              {['🌟', '👏', '💖', '🎉'].map(emoji => (
                <button key={emoji} onClick={() => addStamp(emoji)} style={{
                  fontSize: '2rem', background: 'white', border: '2px solid #FFCC80', 
                  borderRadius: '50%', width: '60px', height: '60px', cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>{emoji}</button>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#2E7D32' }}>{t.nameLabel}</label>
            <input 
              type="text" value={osData.name} onChange={(e) => setOsData({...osData, name: e.target.value})}
              placeholder={t.namePlaceholder}
              style={{ width: '100%', padding: '15px', boxSizing: 'border-box', borderRadius: '12px', border: '2px solid #C8E6C9', fontSize: '1.1rem', backgroundColor: '#FAFAFA' }}
            />
          </div>

          {Object.keys(fieldOptions).map(fieldId => {
            const field = fieldOptions[fieldId];
            return (
              <div key={fieldId} style={cardStyle}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1B5E20', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {field.icon} {field.label[lang]}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  {field.options[lang].map((tagText, index) => {
                    const isSelected = osData[fieldId].tags.includes(index);
                    return (
                      <button key={index} onClick={() => toggleTag(fieldId, index)} style={{
                        padding: '10px 8px', borderRadius: '12px', cursor: 'pointer', 
                        border: isSelected ? 'none' : '2px solid #E8F5E9',
                        backgroundColor: isSelected ? '#4CAF50' : '#fff', 
                        color: isSelected ? '#fff' : '#555', 
                        fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'left',
                        boxShadow: isSelected ? '0 2px 4px rgba(76,175,80,0.3)' : 'none',
                        transition: 'all 0.2s'
                      }}>
                        {tagText}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <textarea
                    value={osData[fieldId].memo} onChange={(e) => setOsData({...osData, [fieldId]: {...osData[fieldId], memo: e.target.value}})}
                    placeholder={t.addMemo}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #eee', height: '60px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                  <button onClick={() => toggleRecording(fieldId)} style={{
                    width: '60px', borderRadius: '12px', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem',
                    backgroundColor: isRecording && currentRecordingField === fieldId ? '#EF5350' : '#81C784'
                  }}>{isRecording && currentRecordingField === fieldId ? '⏹️' : '🎤'}</button>
                </div>
              </div>
            );
          })}
          <button onClick={handleSave} style={{ padding: '18px', backgroundColor: '#2E7D32', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(46,125,50,0.3)' }}>
            {t.saveBtn}
          </button>
        </div>
      )}

      {/* --- ずかんタブ（子ども向けポップ表示） --- */}
      {activeTab === 'zukan' && (
        <div style={{ backgroundColor: '#fff', padding: '25px 15px', borderRadius: '24px', border: '4px solid #FFD54F', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#F57F17', fontSize: '1.4rem', marginBottom: '20px', backgroundColor: '#FFF9C4', display: 'inline-block', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 0 #FFE082' }}>
            {t.zukanTitle}
          </h2>

          {/* 🦉 ふくろうはかせ（キャラクターエリア） */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '4.5rem', animation: 'float 4s ease-in-out infinite' }}>🦉</div>
            <div style={{ 
              backgroundColor: '#FAFAFA', padding: '15px', borderRadius: '16px', border: '2px solid #E0E0E0', 
              position: 'relative', marginTop: '10px', maxWidth: '80%', color: '#424242', fontWeight: 'bold', lineHeight: '1.5'
            }}>
              {/* 吹き出しのしっぽ */}
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid #E0E0E0' }}></div>
              <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid #FAFAFA' }}></div>
              {isZukanEmpty ? t.zukanEmpty : t.zukanGreeting}
            </div>
          </div>

          {/* 🎨 まほうのカード（カテゴリーごとに色分け） */}
          {!isZukanEmpty && Object.keys(fieldOptions).map(fieldId => {
            const selectedIndices = osData[fieldId].tags;
            if (selectedIndices.length === 0) return null;
            const theme = categoryColors[fieldId];

            return (
              <div key={fieldId} style={{ marginBottom: '35px' }}>
                <h3 style={{ color: theme.text, fontSize: '1.1rem', borderBottom: `3px solid ${theme.border}`, display: 'inline-block', paddingBottom: '5px', marginBottom: '15px' }}>
                  {t.zukanCategories[fieldId]}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                  {selectedIndices.map(index => {
                    const zukanText = t.zukanOptions[fieldId][index];
                    const emoji = zukanText.match(/[\p{Emoji}]/gu)?.[0] || '✨';
                    const textOnly = zukanText.replace(emoji, '').trim();

                    return (
                      <div key={index} style={{
                        backgroundColor: theme.bg, borderRadius: '16px', padding: '20px 10px',
                        boxShadow: `0 6px 0 ${theme.shadow}`, width: '130px',
                        border: `3px solid ${theme.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '10px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.15))' }}>
                          {emoji}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: theme.text, lineHeight: '1.4' }}>
                          {textOnly}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ✨ きょうの キラリ（ほめスタンプ宝箱） */}
          {osData.stamps.length > 0 && (
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#FFF0F5', borderRadius: '24px', border: '4px dashed #F48FB1' }}>
              <h3 style={{ color: '#C2185B', marginTop: 0, marginBottom: '15px', fontSize: '1.1rem' }}>{t.zukanSparkle}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                {osData.stamps.map((stamp) => (
                  <div key={stamp.id} style={{ 
                    fontSize: '2.5rem', 
                    animation: 'sparkleScale 3s infinite',
                    animationDelay: `${Math.random()}s` // 少しずつタイミングをずらしてキラキラ感を出す
                  }}>
                    {stamp.emoji}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- 提示タブ (パスポート - 既存コード同様) --- */}
      {activeTab === 'passport' && (
        <div style={{ ...cardStyle, padding: simpleMode ? '10px' : '25px', position: 'relative' }}>
          {!simpleMode && (
            <button onClick={() => setSimpleMode(true)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: '1px solid #4CAF50', color: '#4CAF50', padding: '6px 10px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}>
              {t.simpleReport}
            </button>
          )}
          {simpleMode && (
            <button onClick={() => setSimpleMode(false)} style={{ marginBottom: '15px', background: 'none', border: 'none', color: '#2E7D32', textDecoration: 'underline', cursor: 'pointer' }}>
              ← 戻る
            </button>
          )}

          <div style={{ textAlign: 'center', borderBottom: '2px solid #f0f0f0', marginBottom: '20px', paddingBottom: '15px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '2px' }}>OS PASSPORT</span>
            <h2 style={{ margin: '5px 0', color: '#1B5E20', fontSize: '1.6rem' }}>{osData.name ? `${osData.name}` : "GUEST"}</h2>
          </div>

          {Object.keys(fieldOptions).map(fieldId => {
            const field = fieldOptions[fieldId];
            const selectedIndices = osData[fieldId].tags;
            const memo = osData[fieldId].memo;
            
            if (simpleMode && selectedIndices.length === 0 && !memo) return null;

            return (
              <div key={fieldId} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#4CAF50', borderBottom: '1px solid #E8F5E9', paddingBottom: '4px', marginBottom: '8px' }}>
                  {field.icon} {field.label[lang]}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {selectedIndices.map(index => (
                    <span key={index} style={{ backgroundColor: simpleMode ? '#fff' : '#E8F5E9', color: '#2E7D32', border: simpleMode ? '1px solid #4CAF50' : 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {field.options[lang][index]}
                    </span>
                  ))}
                  {!simpleMode && selectedIndices.length === 0 && <span style={{ color: '#ccc', fontSize: '0.8rem' }}>未選択</span>}
                </div>
                {memo && (
                  <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: simpleMode ? '#fff' : '#FAFAFA', border: simpleMode ? 'none' : '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
                    {memo}
                  </div>
                )}
              </div>
            );
          })}

          {!simpleMode && (
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '2px dashed #C8E6C9' }}>
              <div style={{ display: 'inline-block', padding: '15px', background: 'white', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <QRCodeCanvas value={getSharedUrl()} size={150} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '15px', fontWeight: 'bold' }}>
                {t.qrHint}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}