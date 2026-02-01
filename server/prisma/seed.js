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
      image: "/images/drew1.png",
      content: "This is the default post. Feel free to comment!",
    },
  });

  // 2️. Create top-level comments
  const comment1 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "First comment! This site is awesome.",
      authorName: "Anon1",
      avatarId: 1,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      postId: post.id,
      content: "Can't wait to see what people post here!",
      authorName: "Anon2",
      avatarId: 2,
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
    },
  });

  const reply2 = await prisma.comment.create({
    data: {
      postId: post.id,
      parentCommentId: comment1.id,
      content: "Me too!",
      authorName: "Anon4",
      avatarId: 4,
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
      score: 3,
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