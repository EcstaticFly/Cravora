import { REGISTER_USER } from "@/src/graphql/actions/register.action";
import styles from "@/src/utils/style";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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
  const [registerUserMutation, { loading }] = useMutation(REGISTER_USER);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const response = await registerUserMutation({
        variables: data,
      });
      console.log("Registration response:", response.data);
      localStorage.setItem(
        "activation_token",
        response.data.register.activation_token
      );
      toast.success("OTP sent to your email. Please verify to continue");
      reset();
      setActiveState("verification");
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };
  return (
    <div>
      <h1 className={`${styles.title}`}>Register with Cravora</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative mb-3">
          <label className={`${styles.label}`}>Enter your Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="John Doe"
            className={`${styles.input}`}
          />
          {errors.name && (
            <span className="text-red-500 mt-1">{`${errors.name.message}`}</span>
          )}
        </div>

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
        <div className="w-full relative mt-3">
          <label className={`${styles.label}`}>Enter your Phone Number</label>
          <input
            {...register("phone_number", { valueAsNumber: true })}
            type="number"
            placeholder="123*******"
            className={`${styles.input}`}
          />
          {errors.phone_number && (
            <span className="text-red-500 block mt-1">{`${errors.phone_number.message}`}</span>
          )}
        </div>
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
          <span className="text-red-500 mt-1">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-5">
          <input
            type="submit"
            value={`${loading ? `Sending OTP...` : "Register"}`}
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-white">
          Or join with
        </h5>
        <div
          className="flex items-center justify-center my-3"
          onClick={() => signIn()}
        >
          <FcGoogle className="cursor-pointer mr-2" size={30} />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account?
          <span
            className="text-[#2190ff] pl-1 hover:underline cursor-pointer"
            onClick={() => setActiveState("login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Register;
