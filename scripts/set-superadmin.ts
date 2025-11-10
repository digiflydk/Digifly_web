
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '../src/lib/firebase-admin';

async function setSuperadmin() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: tsx scripts/set-superadmin.ts <user@email.com>');
    process.exit(1);
  }

  try {
    const app = getAdminApp();
    const user = await getAuth(app).getUserByEmail(email);
    await getAuth(app).setCustomUserClaims(user.uid, { role: 'superadmin' });
    console.log(`✅ Success: Claim 'role: superadmin' set for ${email} (uid: ${user.uid})`);
  } catch (error: any) {
    console.error('❌ Error setting superadmin claim:');
    if (error.code === 'auth/user-not-found') {
      console.error(`  No user found with email: ${email}`);
    } else {
      console.error(' ', error.message);
    }
    process.exit(1);
  }
}

setSuperadmin();
