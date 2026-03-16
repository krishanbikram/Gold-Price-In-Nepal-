import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting exact data seed after DB reset...')

  // Read Parsed Prices
  const pricesRaw = fs.readFileSync('/tmp/gold_parse/prices.json', 'utf-8')
  const prices = JSON.parse(pricesRaw)
  
  console.log(`Seeding ${prices.length} historical price records...`)

  for (const record of prices) {
    const date = new Date(record.date)
    
    const tolaInGrams = 11.6638
    const ounceInGrams = 31.1035

    const goldPerGram = record.price_per_tola / tolaInGrams
    const silverPerGram = record.silver_per_tola / tolaInGrams

    await prisma.goldPrice.upsert({
      where: { date },
      update: {},
      create: {
        date: date,
        price_per_tola: record.price_per_tola,
        price_per_10g: Math.round(goldPerGram * 10),
        price_per_ounce: Math.round(goldPerGram * ounceInGrams),
      }
    })

    await prisma.silverPrice.upsert({
      where: { date },
      update: {},
      create: {
        date: date,
        silver_per_tola: record.silver_per_tola,
        silver_per_10g: Math.round(silverPerGram * 10),
        silver_per_ounce: Math.round(silverPerGram * ounceInGrams),
      }
    })
  }

  // Seed Admin User
  const hashedPassword = await bcrypt.hash('&mq8_BeT_?EqLfy', 10)
  await prisma.adminUser.upsert({
    where: { email: 'krishanbikramsah@gmail.com' },
    update: {
      password_hash: hashedPassword
    },
    create: {
      email: 'krishanbikramsah@gmail.com',
      password_hash: hashedPassword,
      name: 'Admin',
    },
  })

  // Seed some dummy blog posts (Optional, to keep site looking full)
  console.log('Seeding blog posts...')
  const blogPosts = [
    {
      title: 'How to Check Gold Purity in Nepal',
      slug: 'how-to-check-gold-purity-nepal',
      content: '<p>Checking gold purity is essential before making any purchase...</p>',
      meta_title: 'Check Gold Purity in Nepal | Guide',
      meta_description: 'Learn how to verify the purity of 24K and 22K gold before buying jewelry in Nepal.',
      focus_keyword: 'gold purity nepal',
      category: 'Guide',
      tags: ['Guide', 'Purity', 'Buying Tips'],
      is_published: true,
      published_at: new Date('2024-05-10'),
    },
    {
      title: 'Current Trends in Nepal Gold Market',
      slug: 'current-trends-nepal-gold-market',
      content: '<p>The gold market in Nepal has seen significant fluctuations recently...</p>',
      meta_title: 'Nepal Gold Market Trends 2024',
      meta_description: 'An analysis of recent gold price trends and future predictions for the Nepali market.',
      focus_keyword: 'gold market trends nepal',
      category: 'Market Analysis',
      tags: ['Trends', 'Analysis'],
      is_published: true,
      published_at: new Date('2024-05-05'),
    }
  ]
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({ 
      where: { slug: post.slug },
      update: {},
      create: post 
    })
  }

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
