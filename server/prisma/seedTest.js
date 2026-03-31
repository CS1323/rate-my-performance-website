import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Utility to hash a fake IP address for testing votes
 */
const fakeIpHash = async (ip) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(ip, salt);
}

async function main() {
  console.log("Seeding database...");

  // 1️. Create default post
  const post = await prisma.post.create({
    data: {
      title: "Thinking About Hooking Up With Drew Dumontier?",
      slug: "drew-dumontier",
      image: "images/post-drew.webp",
      content: "This is the default post. Feel free to comment!",
    },
  });

  // 1b. Create translated posts (same image, locale-suffixed slugs)
  await prisma.post.createMany({
    data: [
      {
        title: "Tu penses à coucher avec Drew Dumontier ?",
        slug: "drew-dumontier-fr",
        image: "images/post-drew.webp",
        content: "Ceci est le post par défaut. N'hésitez pas à commenter !",
      },
      {
        title: "Denkst du darüber nach, mit Drew Dumontier rumzumachen?",
        slug: "drew-dumontier-de",
        image: "images/post-drew.webp",
        content: "Dies ist der Standardbeitrag. Kommentiere gerne!",
      },
      {
        title: "Stai pensando di andare a letto con Drew Dumontier?",
        slug: "drew-dumontier-it",
        image: "images/post-drew.webp",
        content: "Questo è il post predefinito. Sentiti libero di commentare!",
      },
      {
        title: "Denk je eraan om met Drew Dumontier het bed in te duiken?",
        slug: "drew-dumontier-nl",
        image: "images/post-drew.webp",
        content: "Dit is het standaard bericht. Voel je vrij om te reageren!",
      },
    ],
  });

  // 2️. Create top-level comments
  const comment1 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "First comment! This site is awesome.",
      authorName: "Anon1",
      avatarId: 1,
      llmScore: 0,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "Can't wait to see what people post here!",
      authorName: "Anon2",
      avatarId: 2,
      llmScore: 6,
    },
  });

  // 3️. Nested replies
  const reply1 = await prisma.comment.create({
    data: {
      postId: post.id,
      parentCommentId: comment1.id,
      content: "I agree, totally!",
      authorName: "Anon3",
      avatarId: 3,
      llmScore: 3,
    },
  });

  const reply2 = await prisma.comment.create({
    data: {
      postId: post.id,
      parentCommentId: comment1.id,
      content: "Me too!",
      authorName: "Anon4",
      avatarId: 4,
      llmScore: 1,
    },
  });

  // 4️. Votes
  const ip1 = await fakeIpHash("127.0.0.1");
  const ip2 = await fakeIpHash("127.0.0.2");
  const ip3 = await fakeIpHash("127.0.0.3");

  await prisma.vote.createMany({
    data: [
      { commentId: comment1.id, ipHash: ip1, type: "LIKE" },
      { commentId: comment1.id, ipHash: ip2, type: "LIKE" },
      { commentId: comment2.id, ipHash: ip3, type: "DISLIKE" },
    ],
  });

  // Update comment scores manually
  await prisma.comment.update({
    where: { id: comment1.id },
    data: { likeCount: 2 },
  });

  await prisma.comment.update({
    where: { id: comment2.id },
    data: { dislikeCount: 1 },
  });

  // 5️. Reports
  await prisma.report.create({
    data: {
      commentId: comment2.id,
      reason: "Inappropriate language",
      ipHash: await fakeIpHash("127.0.0.4"),
    },
  });

  // Hide comment if reports exceed threshold (simulate)
  await prisma.comment.update({
    where: { id: comment2.id },
    data: { status: "HIDDEN" },
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