const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../modules/user/userModel');
const Category = require('../modules/category/categoryModel');
const Post = require('../modules/post/postModel');
const config = require('../config/environment');
const logger = require('../utils/logger');

const coreCategories = [
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, music, web series, streaming culture, gaming, and entertainment news.',
    icon: 'Film',
    color: 'text-pink-400',
    subcategories: ['Movies', 'Music', 'Web Series', 'Memes', 'Gaming'],
    postsCount: 2,
    followersCount: 1840,
    isDynamic: false,
  },
  {
    name: 'Jobs & Careers',
    slug: 'jobs-careers',
    description: 'Verified job openings, internships, freelancing gigs, hiring calls, and career insights.',
    icon: 'Briefcase',
    color: 'text-emerald-400',
    subcategories: ['Jobs', 'Internships', 'Freelancing', 'Career Advice', 'Hiring'],
    postsCount: 2,
    followersCount: 2450,
    isDynamic: false,
  },
  {
    name: 'News',
    slug: 'news',
    description: 'Real-time verified national, international, technology, business, and global headlines.',
    icon: 'Newspaper',
    color: 'text-blue-400',
    subcategories: ['National', 'International', 'Technology', 'Business', 'Sports'],
    postsCount: 1,
    followersCount: 3120,
    isDynamic: false,
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Interactive courses, study guides, competitive examinations, and scholarship alerts.',
    icon: 'GraduationCap',
    color: 'text-amber-400',
    subcategories: ['Courses', 'Study Material', 'Exams', 'Scholarships'],
    postsCount: 1,
    followersCount: 1280,
    isDynamic: false,
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Artificial Intelligence, cloud computing, programming architectures, and startups.',
    icon: 'Cpu',
    color: 'text-purple-400',
    subcategories: ['Artificial Intelligence', 'Programming', 'Startups', 'Gadgets'],
    postsCount: 2,
    followersCount: 4210,
    isDynamic: false,
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Live match scores, athletic tournaments, cricket, football, basketball, and analysis.',
    icon: 'Trophy',
    color: 'text-red-400',
    subcategories: ['Cricket', 'Football', 'Basketball', 'Other Sports'],
    postsCount: 1,
    followersCount: 1560,
    isDynamic: false,
  },
];

const seedData = async () => {
  try {
    logger.info(`Connecting to MongoDB at: ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    logger.success('Connected to database for seeding.');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Post.deleteMany({}),
    ]);
    logger.info('Cleaned old records.');

    // 1. Seed Categories
    const insertedCategories = await Category.insertMany(coreCategories);
    logger.success(`Seeded ${insertedCategories.length} core categories.`);

    // 2. Seed Users
    const users = await User.create([
      {
        name: 'System Administrator',
        username: 'admin',
        email: 'admin@socialsphere.io',
        password: 'Password123!',
        role: 'admin',
        isVerified: true,
        bio: 'SocialSphere Platform Administrator & Governance.',
        interests: ['technology', 'news', 'jobs-careers'],
      },
      {
        name: 'Elena Rostova',
        username: 'elena_tech',
        email: 'creator@socialsphere.io',
        password: 'Password123!',
        role: 'creator',
        isVerified: true,
        bio: 'Cloud Architect & Tech Educator sharing weekly system design breakdowns.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
        location: 'Berlin, Germany',
        website: 'https://elenarostova.dev',
        interests: ['technology', 'education', 'news'],
        followersCount: 3890,
        followingCount: 210,
        postsCount: 2,
      },
      {
        name: 'Nexus Robotics Inc.',
        username: 'nexus_robotics',
        email: 'org@techcorp.com',
        password: 'Password123!',
        role: 'organization',
        isVerified: true,
        bio: 'Building autonomous distributed robotic platforms for global logistics.',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        location: 'San Francisco, CA',
        website: 'https://nexusrobotics.ai',
        interests: ['jobs-careers', 'technology'],
        followersCount: 8420,
        postsCount: 2,
      },
      {
        name: 'Alex Rivera',
        username: 'alexrivera',
        email: 'user@socialsphere.io',
        password: 'Password123!',
        role: 'user',
        isVerified: false,
        bio: 'Full-stack developer enthusiastic about open source and category discovery.',
        interests: ['technology', 'jobs-careers', 'entertainment'],
        followersCount: 140,
        followingCount: 35,
        postsCount: 1,
      },
    ]);
    logger.success(`Seeded ${users.length} demo users.`);

    const admin = users[0];
    const creator = users[1];
    const org = users[2];
    const user = users[3];

    // 3. Seed Posts
    await Post.create([
      {
        author: creator._id,
        title: 'Building scalable micro-frontends with React & Vite in 2026',
        content: 'Categorized social media is the cure to algorithm fatigue. By organizing streams into distinct channels like Technology, Jobs, and Education, users regain agency over their digital time.',
        category: 'technology',
        subcategory: 'Programming',
        tags: ['#technology', '#react', '#architecture', '#webdev'],
        postType: 'standard',
        media: [
          {
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
            mediaType: 'image',
          },
        ],
        likesCount: 142,
        commentsCount: 18,
        sharesCount: 12,
        savesCount: 45,
      },
      {
        author: org._id,
        title: 'Senior Full-Stack Engineer (React & Node.js)',
        content: 'We are expanding our core platform engineering team at Nexus Robotics. Join us in building distributed teleoperation and low-latency streaming tools.',
        category: 'jobs-careers',
        subcategory: 'Jobs',
        tags: ['#jobs', '#fullstack', '#hiring', '#react', '#nodejs'],
        postType: 'job',
        jobDetails: {
          companyName: 'Nexus Robotics Inc.',
          location: 'San Francisco, CA (Remote Option)',
          jobType: 'Full-Time',
          experienceLevel: 'Senior (4+ Years)',
          salaryRange: '$140,000 - $175,000 / year + Equity',
          skills: ['React.js', 'Node.js', 'Socket.IO', 'MongoDB', 'Distributed Systems'],
          applyUrl: 'https://nexusrobotics.ai/careers/senior-fullstack',
        },
        likesCount: 89,
        commentsCount: 7,
      },
      {
        author: creator._id,
        title: 'Top 5 Cinema Masterpieces Releasing This Quarter',
        content: 'From sci-fi epics to indie psychological thrillers, here is our breakdown of the most anticipated films coming to theaters and streaming platforms.',
        category: 'entertainment',
        subcategory: 'Movies',
        tags: ['#entertainment', '#movies', '#cinema', '#gaming'],
        postType: 'standard',
        media: [
          {
            url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
            mediaType: 'image',
          },
        ],
        likesCount: 230,
        commentsCount: 34,
      },
      {
        author: org._id,
        title: 'Global Semiconductor Alliance Announces Next-Gen Optical Computing Architecture',
        content: 'Breakthroughs in optical interconnects promise up to 10x reductions in AI training latency and power consumption across enterprise data centers.',
        category: 'news',
        subcategory: 'Technology',
        tags: ['#news', '#semiconductors', '#breakthrough', '#ai'],
        postType: 'news',
        newsDetails: {
          headline: 'Global Semiconductor Alliance Announces Next-Gen Optical Computing Architecture',
          summary: 'Breakthrough optical interconnects promise 10x energy reduction and ultra-low latency for AI data center clusters.',
          source: 'Nexus Global Newsroom',
          sourceUrl: 'https://technews.org/optical-computing-2026',
          isVerifiedSource: true,
        },
        likesCount: 95,
        commentsCount: 11,
      },
    ]);

    logger.success('Seeded initial demonstration posts across categories.');
    logger.success('✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedData();
