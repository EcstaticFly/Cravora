import { LOGIN_USER } from "@/src/graphql/actions/login.actions";
import styles from "@/src/utils/style";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import Cookies from "js-cookie";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must have at least 6 characters!"),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login = ({
  setActiveState,
  setIsOpen,
}: {
  setActiveState: (e: string) => void;
  setIsOpen: (e: boolean) => void;
}) => {
  const [LoginUser, { loading }] = useMutation(LOGIN_USER);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    const loginData = {
      email: data.email,
      password: data.password,
    };
    try {
      const response = await LoginUser({
        variables: loginData,
      });

      if (response.data.Login.user) {
        toast.success("Login Successful!");
        Cookies.set("refresh_token", response.data.Login.refreshToken);
        Cookies.set("access_token", response.data.Login.accessToken);
        setIsOpen(false);
        reset();
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        throw new Error(response.data.Login.error.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unknown error occured");
    }
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>Login with Cravora</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-5">
          <span
            className={`${styles.label} !text-[#2190ff] hover:underline block text-right cursor-pointer`}
            onClick={() => setActiveState("forgot-password")}
          >
            Forgot your Password?
          </span>
          <input
            type="submit"
            value="Login"
            disabled={isSubmitting || loading}
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

export default Login;
