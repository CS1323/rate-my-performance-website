import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1️. Create default post
  const post = await prisma.post.create({
    data: {
      title: "Thinking About Hooking Up With Drew Dumontier?",
      slug: "drew-dumontier",
      image: "images/post-drew.webp",
      content: 
        `Welcome to RateMyPerformanceCFU — the website that launched 83 bathroom posters and made one very smug hockey player question everything he thought he knew about himself.
          
        This space was built in the spirit of Harper Tinsley's most unhinged, most iconic act of revenge. We're not here to be mean. We're here to be creative. Think of it as a safe space for anyone who's ever dated a guy who needed a little humbling.`,
    },
  });

  // 1b. Create translated posts (same image, locale-suffixed slugs)
  await prisma.post.createMany({
    data: [
      {
        title: "Tu penses à coucher avec Drew Dumontier ?",
        slug: "drew-dumontier-fr",
        image: "images/post-drew.webp",
        content: `Bienvenue sur RateMyPerformanceCFU — le site qui a lancé 83 affiches de salle de bain et a fait douter un joueur de hockey très suffisant de tout ce qu'il croyait savoir sur lui-même.\n\nCet espace a été créé dans l'esprit de l'acte de vengeance le plus déjanté et le plus emblématique de Harper Tinsley. On n'est pas là pour être méchants. On est là pour être créatifs. Considérez-le comme un espace sûr pour quiconque a déjà fréquenté un gars qui avait besoin d'une petite leçon d'humilité.`,
      },
      {
        title: "Denkst du darüber nach, mit Drew Dumontier rumzumachen?",
        slug: "drew-dumontier-de",
        image: "images/post-drew.webp",
        content: `Willkommen bei RateMyPerformanceCFU — die Website, die 83 Badezimmer-Poster hervorgebracht und einen sehr selbstgefälligen Eishockeyspieler dazu gebracht hat, alles in Frage zu stellen, was er über sich selbst zu wissen glaubte.\n\nDieser Raum wurde im Geiste von Harper Tinsleys unverschämtester, ikonischster Racheaktion geschaffen. Wir sind nicht hier, um gemein zu sein. Wir sind hier, um kreativ zu sein. Betrachte es als sicheren Raum für alle, die jemals mit einem Typen zusammen waren, der eine kleine Lektion in Bescheidenheit brauchte.`,
      },
      {
        title: "Stai pensando di andare a letto con Drew Dumontier?",
        slug: "drew-dumontier-it",
        image: "images/post-drew.webp",
        content: `Benvenuti su RateMyPerformanceCFU — il sito che ha lanciato 83 poster da bagno e ha fatto mettere in discussione a un giocatore di hockey molto presuntuoso tutto ciò che pensava di sapere su se stesso.\n\nQuesto spazio è stato creato nello spirito dell'atto di vendetta più folle e iconico di Harper Tinsley. Non siamo qui per essere cattivi. Siamo qui per essere creativi. Consideratelo come uno spazio sicuro per chiunque abbia mai frequentato un ragazzo che aveva bisogno di una piccola lezione di umiltà.`,
      },
      {
        title: "Denk je eraan om met Drew Dumontier het bed in te duiken?",
        slug: "drew-dumontier-nl",
        image: "images/post-drew.webp",
        content: `Welkom bij RateMyPerformanceCFU — de website die 83 badkamerposters heeft gelanceerd en een zeer zelfvoldane ijshockeyspeler alles heeft doen betwijfelen wat hij dacht te weten over zichzelf.\n\nDeze ruimte is gecreëerd in de geest van Harper Tinsley's meest gestoorde, meest iconische wraakactie. We zijn hier niet om gemeen te zijn. We zijn hier om creatief te zijn. Beschouw het als een veilige ruimte voor iedereen die ooit heeft gedatet met een jongen die een klein lesje in bescheidenheid nodig had.`,
      },
    ],
  });

  // 2️. Create top-level comments
  const comment1 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "All talk, no stick handling.",
      authorName: "Anonymous",
      avatarId: 1,
      llmScore: 0,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "Got more action from my electric toothbrush.",
      authorName: "Disappointed but not surprised",
      avatarId: 3,
      llmScore: 0,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "Took longer to find the condom than he lasted.",
      authorName: "Would not recommend",
      avatarId: 2,
      llmScore: 0,
    },
  });

  const comment4 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "Came, saw, ghosted. Did the same to my roommate.",
      authorName: "My vibrator does it better",
      avatarId: 3,
      llmScore: 0,
    },
  });

  const comment5 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "He talks a big game but finishes faster than a firework on the Fourth of July.",
      authorName: "Shocker",
      avatarId: 1,
      llmScore: 0,
    },
  });

  const comment6 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "He kept calling me by the wrong name. Multiple times. Mid-thrust.",
      authorName: "Double take",
      avatarId: 4,
      llmScore: 0,
    },
  });


  // 3️. Nested replies
  const reply1 = await prisma.comment.create({
    data: {
      postId: post.id,
      parentCommentId: comment6.id,
      content: "Girl, was the wrong name ‘Jesus’? Because that’s the only acceptable excuse.",
      authorName: "Your bestie",
      avatarId: 2,
      llmScore: 0,
    },
  });

  const reply2 = await prisma.comment.create({
    data: {
      postId: post.id,
      parentCommentId: comment6.id,
      content: "Me too!",
      authorName: "girl_nextdoor",
      avatarId: 1,
      llmScore: 0,
    },
  });

  // 4. Update comment likes & createdAt
  await prisma.comment.update({
    where: { id: comment1.id },
    data: { 
      likeCount: 17,
      createdAt: new Date('2026-02-28T10:25:16.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment2.id },
    data: { 
      likeCount: 54,
      createdAt: new Date('2026-02-28T11:08:21.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment3.id },
    data: { 
      likeCount: 8,
      createdAt: new Date('2026-03-02T13:00:09.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment4.id },
    data: { 
      likeCount: 5,
      createdAt: new Date('2026-03-02T17:07:46.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment5.id },
    data: { 
      likeCount: 87,
      createdAt: new Date('2026-03-03T10:51:32.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment6.id },
    data: { 
      likeCount: 26,
      createdAt: new Date('2026-03-04T16:18:56.931Z')
    },
  });

  // 5. Update replies' createdAt
  await prisma.comment.update({
    where: { id: reply1.id },
    data: {
      createdAt: new Date('2026-03-04T18:42:12.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: reply2.id },
    data: { 
      createdAt: new Date('2026-03-04T04:26:37.931Z')
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });