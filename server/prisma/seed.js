import { PrismaClient } from "@prisma/client";
import * as en from "./seedEN.js";
import * as fr from "./seedFR.js";
import * as de from "./seedDE.js";
import * as it from "./seedIT.js";
import * as nl from "./seedNL.js";

const prisma = new PrismaClient();

const locales = [en, fr, de, it, nl];

async function seedLocale(locale) {
  const { postData, comments, replies } = locale;

  // Skip if post already exists
  const existing = await prisma.post.findUnique({
    where: { slug: postData.slug },
  });
  if (existing) {
    console.log(`Post "${postData.slug}" already exists, skipping.`);
    return;
  }

  // Create post
  const post = await prisma.post.create({ data: postData });

  // Create comments
  let parentCommentForReplies = null;
  for (const commentData of comments) {
    const { hasReplies, likeCount, createdAt, ...data } = commentData;
    const comment = await prisma.comment.create({
      data: { ...data, postId: post.id },
    });
    await prisma.comment.update({
      where: { id: comment.id },
      data: { likeCount, createdAt },
    });
    if (hasReplies) {
      parentCommentForReplies = comment;
    }
  }

  // Create replies (attached to the comment marked with hasReplies)
  if (parentCommentForReplies) {
    for (const replyData of replies) {
      const { createdAt, ...data } = replyData;
      const reply = await prisma.comment.create({
        data: {
          ...data,
          postId: post.id,
          parentCommentId: parentCommentForReplies.id,
        },
      });
      await prisma.comment.update({
        where: { id: reply.id },
        data: { createdAt },
      });
    }
  }
}

async function main() {
  console.log("Seeding database...");

  for (const locale of locales) {
    await seedLocale(locale);
  }

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
