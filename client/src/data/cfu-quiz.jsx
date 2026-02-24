import { useState, useEffect, useRef } from "react";

const questions = [
  {
    question: "It's Friday night. What's your ideal date?",
    answers: [
      { text: "Cozy night in playing video games together with homemade snacks", character: "foster" },
      { text: "A rowdy bar with karaoke, darts, and way too many stories", character: "drew" },
      { text: "A secret midnight swim under the stars", character: "liam" },
      { text: "Cooking dinner together while he roasts you with the driest humor you've ever heard", character: "gordy" },
    ],
  },
  {
    question: "You're having a terrible day. What do you need most from your person?",
    answers: [
      { text: "He shows up with your exact coffee order and doesn't even need to ask what's wrong—he just knows", character: "foster" },
      { text: "He makes you laugh so hard you forget why you were upset in the first place", character: "drew" },
      { text: "He pulls you into his arms without a word and holds you until the world stops spinning", character: "liam" },
      { text: "He sits with you in comfortable silence, then says the one brutally honest thing you needed to hear", character: "gordy" },
    ],
  },
  {
    question: "What's your biggest weakness when it comes to guys?",
    answers: [
      { text: "The ones who remember every little thing about you—your favorite flower, how you take your coffee, that story you told once at 2 AM", character: "foster" },
      { text: "The cocky ones with a sharp tongue who turn out to be absolute marshmallows underneath", character: "drew" },
      { text: "The ones who look at you like you're the only person in the room and aren't afraid to burn the world down for you", character: "liam" },
      { text: "The quiet ones who see right through you—the ones nobody else seems to notice until it's too late", character: "gordy" },
    ],
  },
  {
    question: "Pick a love language:",
    answers: [
      { text: "Thoughtful, handmade gifts that prove he's been paying attention", character: "foster" },
      { text: "Quality time—he drops everything and shows up every single day, no matter how chaotic life gets", character: "drew" },
      { text: "Physical touch—his hand always finding yours like it's instinct", character: "liam" },
      { text: "Acts of service—he quietly takes care of things before you even realize you needed help", character: "gordy" },
    ],
  },
  {
    question: "What's your favorite trope?",
    answers: [
      { text: "Secret identity / online romance that turns real", character: "foster" },
      { text: "Enemies-to-lovers with a baby (yes, really)", character: "drew" },
      { text: "Forbidden love / best friend's sibling", character: "liam" },
      { text: "Fake dating that becomes very, very real", character: "gordy" },
    ],
  },
  {
    question: "Your friends would describe your ideal guy as:",
    answers: [
      { text: "A golden retriever with a plan—sweet, steady, and endlessly patient", character: "foster" },
      { text: "The human equivalent of a firework—chaotic, loud, and impossible not to watch", character: "drew" },
      { text: "Dangerously charming with an accent that comes out when he's emotional", character: "liam" },
      { text: "A locked diary—mysterious, brilliant, and only soft for the right person", character: "gordy" },
    ],
  },
  {
    question: "Pick the gesture that would absolutely wreck you:",
    answers: [
      { text: "He builds you a handmade diorama of your favorite fictional world because he remembered every detail you ever mentioned", character: "foster" },
      { text: "He names his daughter something beautiful and becomes the kind of man she deserves—right before your eyes", character: "drew" },
      { text: "He stands up in front of everyone and declares his love for you after months of keeping it secret, accent thick and voice shaking", character: "liam" },
      { text: "He steps in to protect you from someone who hurt you, no questions asked, because he reads you better than anyone", character: "gordy" },
    ],
  },
  {
    question: "What's a dealbreaker for you?",
    answers: [
      { text: "Someone who can't be vulnerable—I need a guy who'll sing badly in front of a crowd just to make me smile", character: "foster" },
      { text: "Someone who can't grow—I need to see him become a better person, not just stay the same", character: "drew" },
      { text: "Someone who holds back—if he's all in, I need to feel it in every look and touch", character: "liam" },
      { text: "Someone who can't handle the real me—I need a guy who sees through the act and stays anyway", character: "gordy" },
    ],
  },
  {
    question: "You're stuck in a snowstorm with your CFU boy. What happens?",
    answers: [
      { text: "He already packed extra blankets, snacks, and a fully charged Switch because he planned for everything", character: "foster" },
      { text: "He dramatically declares it the \"best worst night ever\" and somehow makes the whole thing an adventure", character: "drew" },
      { text: "He pulls you close, traces circles on your skin, and tells you stories about his childhood in that low, quiet voice", character: "liam" },
      { text: "He builds a fire without saying a word, makes you the best hot chocolate you've ever had, and lets the silence say everything", character: "gordy" },
    ],
  },
  {
    question: "Finally—pick a quote that makes your heart skip:",
    answers: [
      { text: "\"I would've waited for however long it took. You are worth it.\"", character: "foster" },
      { text: "\"What kind of man do I want to be for her? Not the one I've been.\"", character: "drew" },
      { text: "\"You're not a secret. You should've never been a secret. You're the best thing that's ever happened to me.\"", character: "liam" },
      { text: "\"I've known you long enough to know the difference.\"", character: "gordy" },
    ],
  },
];

const results = {
  foster: {
    name: "Foster Kane",
    title: "The Devoted Captain",
    emoji: "🐻",
    accent: "#3b7dd8",
    accentLight: "#dbeafe",
    accentMid: "#93c5fd",
    gradient: "linear-gradient(135deg, #3b7dd8 0%, #60a5fa 50%, #93c5fd 100%)",
    gradientSoft: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
    description:
      "Your perfect CFU boyfriend is the team captain himself. Foster is the kind of guy who remembers your coffee order after hearing it once, builds you handmade gifts that reference inside jokes from months ago, and would sing Taylor Swift karaoke in front of a packed bar just to see you smile—even though he sounds like a dying cat. He's patient, thoughtful, and once he's yours, he's ALL in. He's the golden retriever boyfriend who also happens to have a multi-phase plan to win your heart.",
    bookQuote: "I would've waited for however long it took. You are worth it.",
    book: "Campus Crush",
    traits: ["Patient", "Thoughtful", "Devoted", "Steady"],
  },
  drew: {
    name: "Drew Dumontier",
    title: "The Redeemed Heartbreaker",
    emoji: "🔥",
    accent: "#dc5044",
    accentLight: "#fee2e2",
    accentMid: "#fca5a5",
    gradient: "linear-gradient(135deg, #dc5044 0%, #f87171 50%, #fca5a5 100%)",
    gradientSoft: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)",
    description:
      "Your CFU match is the bold, chaotic, utterly shameless Drew Dumontier. Sure, he used to go through girls like socks and his pranks were legendary (or criminal, depending on who you ask). But then a baby girl showed up and cracked his whole world open. Drew is the guy who'll make you laugh until you can't breathe, fight for you when the world is against you, and love you so fiercely it's almost scary—once he figures out how to stop being his own worst enemy. He's proof that the best love stories start with two people who can't stand each other.",
    bookQuote: "What kind of man do I want to be for her? Not the one I've been.",
    book: "Campus Rival",
    traits: ["Bold", "Funny", "Protective", "Fearless"],
  },
  liam: {
    name: "Liam Farrell",
    title: "The Passionate Protector",
    emoji: "🌙",
    accent: "#8b5cf6",
    accentLight: "#ede9fe",
    accentMid: "#c4b5fd",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #c4b5fd 100%)",
    gradientSoft: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)",
    description:
      "You got the Hot Irishman, and honestly? Lucky you. Liam Farrell is intense, fiercely loyal, and the kind of guy whose accent thickens when he's emotional—which is more often than he'd ever admit. He'll fight his own demons to be the man you deserve, quote poetry when he's drunk, and hold your hand in public like he's making up for every moment he ever held back. Liam loves HARD, and once he stops running from his feelings, there's no one on earth more devoted. He's the passionate, all-consuming love you didn't know you needed.",
    bookQuote: "You're not a secret. You should've never been a secret. You're the best thing that's ever happened to me.",
    book: "Campus Secret",
    traits: ["Intense", "Loyal", "Romantic", "Passionate"],
  },
  gordy: {
    name: "Harrison \"Gordy\" Gordon",
    title: "The Silent Guardian",
    emoji: "🧊",
    accent: "#64748b",
    accentLight: "#f1f5f9",
    accentMid: "#cbd5e1",
    gradient: "linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%)",
    gradientSoft: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
    description:
      "Your CFU boyfriend is the one nobody saw coming—including you. Gordy is the strong, silent type who reads people the way he reads shooters on the ice: every micro-expression, every tell, every thing you're trying to hide. He won't chase you. He won't perform. But he will show up when it matters, say the one thing no one else had the guts to say, and make mashed potatoes so good they'll ruin you for all other mashed potatoes. He's the still lake with hidden depths, and the only person he'll let call him Harry is you.",
    bookQuote: "I've known you long enough to know the difference.",
    book: "Campus Fake",
    traits: ["Perceptive", "Steady", "Protective", "Witty"],
  },
};

function ShuffledAnswers({ answers, selected, onSelect }) {
  const [shuffled, setShuffled] = useState([]);
  useEffect(() => {
    const arr = [...answers];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, [answers]);

  return shuffled.map((answer, i) => (
    <button
      key={i}
      onClick={() => onSelect(answer.character)}
      style={{
        display: "block",
        width: "100%",
        padding: "16px 20px",
        marginBottom: "12px",
        background: selected === answer.character ? "rgba(194, 112, 136, 0.08)" : "#ffffff",
        border: selected === answer.character ? "2px solid #c27088" : "2px solid #e8ddd4",
        borderRadius: "14px",
        color: "#4a3728",
        fontSize: "15px",
        lineHeight: "1.55",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.25s ease",
        fontFamily: "'Lora', serif",
        letterSpacing: "0.01em",
        boxShadow:
          selected === answer.character ? "0 2px 12px rgba(194, 112, 136, 0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        if (selected !== answer.character) {
          e.currentTarget.style.borderColor = "#d4a0b0";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(194, 112, 136, 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (selected !== answer.character) {
          e.currentTarget.style.borderColor = "#e8ddd4";
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        }
      }}
    >
      {answer.text}
    </button>
  ));
}

export default function CFUBoyfriendQuiz() {
  const [currentQ, setCurrentQ] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [fadeState, setFadeState] = useState("in");
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const transition = (callback) => {
    setFadeState("out");
    setTimeout(() => {
      callback();
      setFadeState("in");
    }, 400);
  };

  const handleAnswer = (character) => {
    setSelectedAnswer(character);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];

    if (currentQ === questions.length - 1) {
      const counts = { foster: 0, drew: 0, liam: 0, gordy: 0 };
      newAnswers.forEach((a) => counts[a]++);
      const winner = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
      transition(() => {
        setAnswers(newAnswers);
        setResult(winner);
        setCurrentQ(questions.length);
      });
    } else {
      transition(() => {
        setAnswers(newAnswers);
        setSelectedAnswer(null);
        setCurrentQ(currentQ + 1);
      });
    }
  };

  const startQuiz = () => {
    transition(() => {
      setCurrentQ(0);
      setAnswers([]);
      setResult(null);
      setSelectedAnswer(null);
    });
  };

  const restartQuiz = () => {
    transition(() => {
      setCurrentQ(-1);
      setAnswers([]);
      setResult(null);
      setSelectedAnswer(null);
    });
  };

  const progress = currentQ >= 0 && !result ? ((currentQ + 1) / questions.length) * 100 : 0;

  const r = result ? results[result] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fdf8f4",
        backgroundImage: `
          radial-gradient(ellipse at 20% 0%, rgba(212, 160, 176, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 100%, rgba(190, 170, 150, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(253, 248, 244, 1) 0%, rgba(250, 243, 235, 1) 100%)
        `,
        fontFamily: "'Lora', serif",
        color: "#4a3728",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#c27088",
            marginBottom: "8px",
            fontFamily: "'Lora', serif",
            fontWeight: 600,
          }}
        >
          Clark Fork University
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 900,
            fontStyle: "italic",
            margin: 0,
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #6b4a3a 0%, #c27088 50%, #d4a0b0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Who's Your CFU Boyfriend?
        </h1>
      </div>

      {/* Progress Bar */}
      {currentQ >= 0 && !result && (
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            height: "3px",
            background: "#edddd3",
            borderRadius: "2px",
            margin: "20px 0 8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c27088, #d4a0b0)",
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      )}

      {currentQ >= 0 && !result && (
        <div
          style={{
            fontSize: "12px",
            color: "#b8a090",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontWeight: 500,
          }}
        >
          {currentQ + 1} / {questions.length}
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          opacity: fadeState === "in" ? 1 : 0,
          transform: fadeState === "in" ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Intro Screen */}
        {currentQ === -1 && (
          <div style={{ textAlign: "center", paddingTop: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "24px" }}>🏒</div>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.7,
                color: "#6b5a4e",
                marginBottom: "12px",
                maxWidth: "440px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Four hockey players. One house. And one of them is meant for you.
            </p>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#a89585",
                marginBottom: "40px",
                maxWidth: "440px",
                marginLeft: "auto",
                marginRight: "auto",
                fontStyle: "italic",
              }}
            >
              Answer ten questions to discover if your perfect match is the devoted captain, the redeemed heartbreaker,
              the passionate protector, or the silent guardian.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "32px",
                marginBottom: "40px",
                flexWrap: "wrap",
              }}
            >
              {[
                { name: "Foster", emoji: "🐻", sub: "The Captain" },
                { name: "Drew", emoji: "🔥", sub: "The Heartbreaker" },
                { name: "Liam", emoji: "🌙", sub: "The Protector" },
                { name: "Gordy", emoji: "🧊", sub: "The Guardian" },
              ].map((c) => (
                <div key={c.name} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "6px" }}>{c.emoji}</div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#4a3728",
                    }}
                  >
                    {c.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#b8a090", letterSpacing: "1px" }}>{c.sub}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startQuiz}
              style={{
                padding: "16px 48px",
                background: "linear-gradient(135deg, #c27088 0%, #d4a0b0 100%)",
                border: "none",
                borderRadius: "40px",
                color: "#fff",
                fontSize: "15px",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "1px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 20px rgba(194, 112, 136, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(194, 112, 136, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(194, 112, 136, 0.25)";
              }}
            >
              Take the Quiz
            </button>
          </div>
        )}

        {/* Question Screen */}
        {currentQ >= 0 && currentQ < questions.length && (
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 700,
                fontStyle: "italic",
                lineHeight: 1.4,
                marginBottom: "28px",
                textAlign: "center",
                color: "#4a3728",
              }}
            >
              {questions[currentQ].question}
            </h2>

            <ShuffledAnswers answers={questions[currentQ].answers} selected={selectedAnswer} onSelect={handleAnswer} />

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                style={{
                  padding: "14px 40px",
                  background: selectedAnswer ? "linear-gradient(135deg, #c27088 0%, #d4a0b0 100%)" : "#edddd3",
                  border: "none",
                  borderRadius: "40px",
                  color: selectedAnswer ? "#fff" : "#c4b0a5",
                  fontSize: "14px",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  letterSpacing: "1px",
                  cursor: selectedAnswer ? "pointer" : "default",
                  transition: "all 0.3s ease",
                  boxShadow: selectedAnswer ? "0 4px 20px rgba(194, 112, 136, 0.25)" : "none",
                }}
              >
                {currentQ === questions.length - 1 ? "See My Result" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Result Screen */}
        {r && (
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <div
              style={{
                fontSize: "14px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#c27088",
                marginBottom: "16px",
                fontWeight: 600,
              }}
            >
              Your CFU Boyfriend is
            </div>

            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                background: r.gradientSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "40px",
                border: `2px solid ${r.accentMid}`,
                boxShadow: `0 4px 20px ${r.accentLight}`,
              }}
            >
              {r.emoji}
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 6vw, 44px)",
                fontWeight: 900,
                fontStyle: "italic",
                margin: "0 0 4px",
                background: r.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {r.name}
            </h2>

            <div
              style={{
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#b8a090",
                marginBottom: "24px",
              }}
            >
              {r.title}
            </div>

            {/* Traits */}
            <div
              style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}
            >
              {r.traits.map((trait) => (
                <span
                  key={trait}
                  style={{
                    padding: "6px 16px",
                    background: r.accentLight,
                    border: `1px solid ${r.accentMid}`,
                    borderRadius: "20px",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    color: r.accent,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>

            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#6b5a4e",
                maxWidth: "480px",
                margin: "0 auto 32px",
                textAlign: "left",
              }}
            >
              {r.description}
            </p>

            {/* Quote Card */}
            <div
              style={{
                background: r.gradientSoft,
                border: `1px solid ${r.accentMid}`,
                borderRadius: "16px",
                padding: "24px 28px",
                marginBottom: "32px",
                maxWidth: "440px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: "17px",
                  lineHeight: 1.6,
                  color: r.accent,
                  marginBottom: "12px",
                }}
              >
                "{r.bookQuote}"
              </div>
              <div style={{ fontSize: "12px", color: "#b8a090", letterSpacing: "1px" }}>
                — {r.name}, <em>{r.book}</em>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={restartQuiz}
                style={{
                  padding: "14px 36px",
                  background: "linear-gradient(135deg, #c27088 0%, #d4a0b0 100%)",
                  border: "none",
                  borderRadius: "40px",
                  color: "#fff",
                  fontSize: "14px",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontStyle: "italic",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(194, 112, 136, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "48px",
          fontSize: "11px",
          color: "#d4c4b8",
          letterSpacing: "2px",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        The CFU Series
      </div>
    </div>
  );
}
