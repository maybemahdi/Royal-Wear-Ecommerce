import { Link } from "react-router-dom";

function UnauthPage() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <h1 className="font-bold text-3xl">You don't have access to view this page</h1>
      <Link to={"/"} className="bg-gray-800 transition-all duration-300 hover:bg-black text-white px-8 py-3 rounded-md">Back 2 Home</Link>
    </div>
  );
}

export default UnauthPage;
