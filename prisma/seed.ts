import { PrismaClient } from '@prisma/client';
import { timify } from 'src/common/functions/timify';
import { Seeder } from './seeder';

const prisma = new PrismaClient();

async function main() {
  const seeder = new Seeder(prisma);
  const hasDataChanges = timify(
    seeder.hasDataChanges.bind(seeder),
    'check-data-changes',
  );

  // Skip the seeder if if there are no data changes.
  console.log('Checking for data changes...\n');
  if (!(await hasDataChanges())) {
    console.log('There are no data changes. Seeder is skipped.');
    return;
  }
  console.log('Data changes found!');

  console.log('Deleting all data...');
  await timify(seeder.deleteUserAdmin.bind(seeder), 'delete-user-admin')();
  await timify(seeder.deleteVillages.bind(seeder), 'delete-villages')();
  await timify(seeder.deleteDistricts.bind(seeder), 'delete-districts')();
  await timify(seeder.deleteRegencies.bind(seeder), 'delete-regencies')();
  await timify(seeder.deleteIslands.bind(seeder), 'delete-regencies')();
  await timify(seeder.deleteProvinces.bind(seeder), 'delete-provinces')();

  console.log('Inserting all data...');
  await timify(seeder.insertUserAdmin.bind(seeder), 'insert-user-admin')();
  await timify(seeder.insertProvinces.bind(seeder), 'insert-provinces')();
  await timify(seeder.insertRegencies.bind(seeder), 'insert-regencies')();
  await timify(seeder.insertIslands.bind(seeder), 'insert-regencies')();
  await timify(seeder.insertDistricts.bind(seeder), 'insert-districts')();
  await timify(seeder.insertVillages.bind(seeder), 'insert-villages')();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err: Error) => {
    console.error(`${err.name}: ${err.message}`);
    await prisma.$disconnect();
    process.exit(1);
  });
