import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage } from '~/.server/session';
import bcrypt from 'bcryptjs';
import { prisma } from '~/.server/db';
import { User } from '@prisma/client';

// Create an authenticator instance
export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get('email');
    let password = form.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Invalid form submission');
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    let isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    return user;
  }),
  'user-pass'
);

export async function registerUser(email: string, password: string) {
  let passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
  });
}
