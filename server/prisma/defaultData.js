import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1️. Create default post
  const post = await prisma.post.create({
    data: {
      title: "Thinking About Hooking Up With Drew Dumontier?",
      slug: "drew-dumontier",
      image: "images/drew1.png",
      content: "Check the reviews first. Spoiler alert: 2.3 stars.",
    },
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

  // Update comment likes & createdAt
  await prisma.comment.update({
    where: { id: comment1.id },
    data: { 
      likeCount: 17,
      createdAt: new Date('2026-02-28T08:23:19.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment2.id },
    data: { 
      likeCount: 54,
      createdAt: new Date('2026-02-28T08:23:19.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment3.id },
    data: { 
      likeCount: 8,
      createdAt: new Date('2026-02-28T08:23:19.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment4.id },
    data: { 
      likeCount: 5,
      createdAt: new Date('2026-02-28T08:23:19.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment5.id },
    data: { 
      likeCount: 87,
      createdAt: new Date('2026-02-28T08:23:19.931Z')
    },
  });

  await prisma.comment.update({
    where: { id: comment6.id },
    data: { 
      likeCount: 26,
      createdAt: new Date('2026-02-28T08:23:19.931Z')
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