const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.theme.deleteMany();
  await prisma.category.deleteMany();
  await prisma.addOn.deleteMany();

  console.log('Creating categories...');
  const catCorporate = await prisma.category.create({ data: { name: 'Corporate' } });
  const catWedding = await prisma.category.create({ data: { name: 'Wedding' } });
  const catBirthday = await prisma.category.create({ data: { name: 'Birthday' } });
  const catTravel = await prisma.category.create({ data: { name: 'Travel' } });

  console.log('Creating themes...');
  await prisma.theme.createMany({
    data: [
      {
        name: 'Tech Summit Essentials',
        description: 'Perfect for tech conferences and summits, featuring modern decor and high-tech AV setup.',
        price: 150000.00,
        basePrice: 150000.00,
        baseGuestCount: 100,
        pricePerExtraGuest: 1000.00,
        venueDiscountAmount: 5000.00,
        category_id: catCorporate.id,
        status: 'Active'
      },
      {
        name: 'Executive Retreat',
        description: 'An elegant setup for executive meetings and offsites with premium catering.',
        price: 75000.00,
        basePrice: 75000.00,
        baseGuestCount: 20,
        pricePerExtraGuest: 2000.00,
        venueDiscountAmount: 0.00,
        category_id: catCorporate.id,
        status: 'Active'
      },
      {
        name: 'Royal Palace Wedding',
        description: 'A grand wedding theme with majestic floral arrangements and royal seating.',
        price: 500000.00,
        basePrice: 500000.00,
        baseGuestCount: 500,
        pricePerExtraGuest: 800.00,
        venueDiscountAmount: 20000.00,
        category_id: catWedding.id,
        status: 'Active'
      },
      {
        name: 'Beachfront Nuptials',
        description: 'Beautiful beach setting with floral arches and open-air seating.',
        price: 300000.00,
        basePrice: 300000.00,
        baseGuestCount: 200,
        pricePerExtraGuest: 1200.00,
        venueDiscountAmount: 10000.00,
        category_id: catWedding.id,
        status: 'Active'
      },
      {
        name: 'Neon Party Extravaganza',
        description: 'Fun, glowing birthday theme with neon lights, DJ setup, and colorful decor.',
        price: 50000.00,
        basePrice: 50000.00,
        baseGuestCount: 50,
        pricePerExtraGuest: 500.00,
        venueDiscountAmount: 0.00,
        category_id: catBirthday.id,
        status: 'Active'
      },
      {
        name: 'Adventure Mountain Getaway',
        description: 'A comprehensive travel package for mountain resorts including activities.',
        price: 120000.00,
        basePrice: 120000.00,
        baseGuestCount: 10,
        pricePerExtraGuest: 5000.00,
        venueDiscountAmount: 0.00,
        category_id: catTravel.id,
        status: 'Active'
      }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
