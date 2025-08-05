import ResetPassword from "@/src/shared/Auth/ResetPassword";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) => {
  const params = await searchParams;
  const activationToken = params.verify ?? "";
  return (
    <div>
      <ResetPassword activationToken={activationToken}/>
    </div>
  )
};

export default Page;
