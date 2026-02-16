const Login = () => {

  const googleLogin = () => {
    window.location.href =
      "http://localhost:1002/signup";
  };

  return (
    <div className="h-screen flex items-center justify-center">
     <button
  onClick={googleLogin}
  className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200"
>
  Continue with Google
</button>

    </div>
  );
};

export default Login;
