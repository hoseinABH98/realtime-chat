'use client';
import { FC, useState } from 'react';
// Common components
import { Button } from './ui/Button';
// Libraries
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Hooks
import { useForm } from 'react-hook-form';
// Validator
import { addFriendSchema } from '@/lib/validations/add-friend';

interface Props {}

type FormData = z.infer<typeof addFriendSchema>;

const AddFriendButton: FC<Props> = (props) => {
  const [isSuccessful, setIsSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendSchema),
  });

  async function addFriend(email: string) {
    try {
      const validateEmail = addFriendSchema.parse({ email });
      await axios.post('/api/friends/add', { email: validateEmail });
      setIsSuccessful(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return setError('email', { message: error.message });
      }
      if (error instanceof AxiosError) {
        return setError('email', { message: error.response?.data });
      }
      setError('email', { message: 'Somethings went wrong.' });
    }
  }

  function onSubmit(data: FormData) {
    addFriend(data.email);
  }

  return (
    <form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add Friend By E-mail
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {isSuccessful ? (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
