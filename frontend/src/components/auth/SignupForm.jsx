import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { registerUserSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/redux/features/authThunks";
import { useNavigate } from "@tanstack/react-router";

export default function SignupForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { success, loading, error } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerUserSchema),
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        dispatch(registerUser(data));
    };

    if (success)
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold">Signup successful!</h1>
                <p className="text-gray-600 mt-2">
                    Please check your email to verify your account.
                </p>
                <Link to="/auth/login" className="text-blue-500 hover:underline">
                    Log in
                </Link>
            </div>
        );

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#181818] text-[#FCE7C8]">
            <Card className="w-full max-w-md bg-[#232323]/70 border-[#C67B5B]/30 text-[#FCE7C8] shadow-xl rounded-2xl">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-3xl font-semibold text-[#E5B7A3]">
                        AuthenX
                    </CardTitle>
                    <p className="text-sm text-[#E5B7A3]/70 mt-1">
                        Create your account to get started.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FCE7C8]">
                                Full Name
                            </label>
                            <Input
                                {...register("fullname", { required: true })}
                                placeholder="Enter your full name"
                                className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FCE7C8]">
                                Username
                            </label>
                            <Input
                                {...register("username", { required: true })}
                                placeholder="Choose a username"
                                className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FCE7C8]">Email</label>
                            <Input
                                {...register("email", { required: true })}
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FCE7C8]">
                                Password
                            </label>
                            <Input
                                {...register("password", { required: true })}
                                type="password"
                                placeholder="Enter your password"
                                className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
                            />
                        </div>

                        {/* Signup Button */}
                        <Button
                            type="submit"
                            className="w-full mt-3 bg-[#C67B5B] text-[#181818] hover:bg-[#EAC1A2] transition font-medium"
                        >
                            Sign Up
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px flex-1 bg-[#A4886D]/20"></div>
                        <span className="text-xs text-[#E5B7A3]/60">or</span>
                        <div className="h-px flex-1 bg-[#A4886D]/20"></div>
                    </div>

                    {/* Google Signup */}
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-[#C67B5B]/30 text-[#E5B7A3] hover:bg-[#C67B5B]/10"
                        onClick={() =>
                            (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`)
                        }
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </Button>

                    {/* Footer */}
                    <p className="text-center text-xs mt-5 text-[#E5B7A3]/60">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="font-medium text-[#C67B5B] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
