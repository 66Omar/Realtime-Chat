import { AiOutlineLoading3Quarters } from "react-icons/ai";
const AuthLoading = () => {
  return (
    <div className="fixed inset-0 bg-background z-5 grid place-items-center">
      <AiOutlineLoading3Quarters className="animate-spin text-4xl text-accent" />
    </div>
  );
}

export default AuthLoading