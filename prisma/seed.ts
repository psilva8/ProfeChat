const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // Create a sample lesson plan
  await prisma.lessonPlan.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      userId: user.id,
      grade: '9',
      subject: 'Mathematics',
      topic: 'Algebra Basics',
      duration: 60,
      objectives: 'Understand basic algebraic concepts and solve simple equations',
      content: 'Introduction to variables, constants, and basic algebraic operations',
    },
  });

  // Create a sample rubric
  await prisma.rubric.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      userId: user.id,
      title: 'Math Problem Solving Rubric',
      subject: 'Mathematics',
      grade: '9',
      criteria: JSON.stringify([
        { level: 'Excellent', description: 'Shows complete understanding and clear solution' },
        { level: 'Good', description: 'Shows good understanding with minor errors' },
        { level: 'Fair', description: 'Shows basic understanding with some errors' },
        { level: 'Poor', description: 'Shows limited understanding with major errors' },
      ]),
      content: 'A comprehensive rubric for evaluating mathematical problem-solving skills',
    },
  });

  // Create a sample activity
  await prisma.activity.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      userId: user.id,
      title: 'Group Algebra Challenge',
      subject: 'Mathematics',
      grade: '9',
      type: 'group',
      duration: 45,
      objectives: 'Practice solving algebraic equations in a collaborative setting',
      content: 'Students work in groups to solve increasingly complex algebraic equations',
      materials: JSON.stringify([
        'Algebra worksheets',
        'Graph paper',
        'Calculators',
      ]),
    },
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 