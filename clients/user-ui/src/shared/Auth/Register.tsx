import styles from "@/src/utils/style";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long!"),
  email: z.string().email(),
  password: z.string().min(6, "Password must have at least 6 characters!"),
  phone_number: z
    .number()
    .min(10, "Phone number must be at least 10 digits long!"),
});

type RegisterSchema = z.infer<typeof formSchema>;

const Register = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log(data);
    reset();
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>Register with Cravora</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={`${styles.label}`}>Enter your Name</label>
        <input
          {...register("name")}
          type="text"
          placeholder="John Doe"
          className={`${styles.input}`}
        />
        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="example@domain.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">
            {`${errors.email.message}`}
          </span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your Password
          </label>
          <input
            {...register("password")}
            type={!showPassword ? "password" : "text"}
            placeholder="example@123"
            className={`${styles.input}`}
          />
          {errors.password && (
            <span className="text-red-500">{`${errors.password.message}`}</span>
          )}
          {!showPassword ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-2.5 right-3 z-1 cursor-pointer"
              size={20}
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-2.5 right-3 z-1 cursor-pointer"
              size={20}
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        <div className="w-full mt-5">
          <span
            className={`${styles.label} !text-[#2190ff] hover:underline block text-right cursor-pointer`}
          >
            Forgot your Password?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle className="cursor-pointer mr-2" size={30} />
          <AiFillGithub className="cursor-pointer ml-2" size={30} />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Don't have an account?
          <span
            className="text-[#2190ff] pl-1 hover:underline cursor-pointer"
            onClick={() => setActiveState("register")}
          >
            Register
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Register;
