"use client";
import { RESET_PASSWORD } from "@/src/graphql/actions/reset-password.action";
import styles from "@/src/utils/style";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema: any = z
  .object({
    password: z.string().min(6, "Password must have at least 6 characters!"),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    { message: "Passwords do not match!", path: ["confirmPassword"] }
  );

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({
  activationToken,
}: {
  activationToken: string | string[];
}) => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const response = await resetPassword({
        variables: {
          password: data.password,
          activationToken: activationToken,
        },
      });
      toast.success("Password reset successfully!");
    } catch (error: any) {
      console.log("Error during password reset:", error);
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="sm:w-[500px] w-full">
        <h1 className={`${styles.title}`}>Reset Your Cravora Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="example@123"
              className={`${styles.input}`}
            />
          </div>
          {errors.password && (
            <span className="text-red-500">{`${errors.password.message}`}</span>
          )}
          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Confirm Your Password
            </label>
            <input
              {...register("confirmPassword")}
              type="text"
              placeholder="example@123"
              className={`${styles.input}`}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
          )}
          <br />

          <input
            type="submit"
            value="Submit"
            disabled={isSubmitting || loading}
            className={`${styles.button} mt-3`}
          />
          <br />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
