"use client";

// React and Next.
import { useState } from "react";

// External packages.
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Components.
import ClientOnly from "@/components/ClientOnly";
import Button from "@/components/ui/Button";

// Lib and utils.
import { addFriendValidator } from "@/lib/validations/addFriend";

interface AddFriendClientProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendClient: React.FC<AddFriendClientProps> = ({}) => {
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriendHandler = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", { email: validatedEmail });
      setShowSuccessState(true);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError("email", { message: err.message });
        return;
      }
      if (err instanceof axios.AxiosError) {
        setError("email", { message: err.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  };

  const formSubmitHandler = (data: FormData) => addFriendHandler(data.email);

  return (
    <ClientOnly>
      <h1 className="mb-8 text-5xl font-bold">Add a friend</h1>
      <form
        onSubmit={handleSubmit(formSubmitHandler)}
        className="mx-auto max-w-sm"
      >
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-slate-400"
        >
          Add friend by E-Mail
        </label>
        <div className="mt-2 flex gap-4">
          <input
            type="text"
            placeholder="you@example.com"
            {...register("email", { required: true })}
            className="focus:ring-primary-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
          <Button>Add</Button>
        </div>
        <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
        {showSuccessState ? (
          <p className="mt-1 text-sm text-green-600">Friend request sent.</p>
        ) : null}
      </form>
    </ClientOnly>
  );
};

export default AddFriendClient;
