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
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { success, loading, error } = useAppSelector(
        (state) => state.auth
    );


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerUserSchema)
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        dispatch(registerUser(data));
    };



    if (success) return (
        <div className='flex  flex-col items-center justify-center h-screen'>
            <h1 className='text-3xl font-bold '>Signup successful!</h1>
            <p className='text-gray-600 mt-2'>Please check your email to verify your account.</p>
            <Link to="/auth/login" className="text-blue-500 hover:underline">
                Log in
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-[#FFE1AF]">
            <Card className="w-full max-w-md bg-[#2A2A2A]/70 border-[#B77466]/30 text-[#FFE1AF] shadow-xl rounded-2xl">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-3xl font-semibold text-[#E2B59A]">
                        AuthenX
                    </CardTitle>
                    <p className="text-sm text-[#E2B59A]/70 mt-1">
                        Create your account to get started.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FFE1AF]">
                                Full Name
                            </label>
                            <Input
                                {...register("fullname", { required: true })}
                                placeholder="Enter your full name"
                                className="bg-[#1A1A1A] border-[#B77466]/30 text-[#FFE1AF] placeholder-[#E2B59A]/50 focus:border-[#B77466]"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FFE1AF]">
                                Username
                            </label>
                            <Input
                                {...register("username", { required: true })}
                                placeholder="Choose a username"
                                className="bg-[#1A1A1A] border-[#B77466]/30 text-[#FFE1AF] placeholder-[#E2B59A]/50 focus:border-[#B77466]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FFE1AF]">
                                Email
                            </label>
                            <Input
                                {...register("email", { required: true })}
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#1A1A1A] border-[#B77466]/30 text-[#FFE1AF] placeholder-[#E2B59A]/50 focus:border-[#B77466]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FFE1AF]">
                                Password
                            </label>
                            <Input
                                {...register("password", { required: true })}
                                type="password"
                                placeholder="Enter your password"
                                className="bg-[#1A1A1A] border-[#B77466]/30 text-[#FFE1AF] placeholder-[#E2B59A]/50 focus:border-[#B77466]"
                            />
                        </div>

                        {/* Signup Button */}
                        <Button
                            type="submit"
                            className="w-full mt-3 bg-[#B77466] text-[#1A1A1A] hover:bg-[#E2B59A] transition font-medium"
                        >
                            Sign Up
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px flex-1 bg-[#957C62]/20"></div>
                        <span className="text-xs text-[#E2B59A]/60">or</span>
                        <div className="h-px flex-1 bg-[#957C62]/20"></div>
                    </div>

                    {/* Google Signup */}
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 border-[#B77466]/30 text-[#E2B59A] hover:bg-[#B77466]/10"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </Button>

                    {/* Footer */}
                    <p className="text-center text-xs mt-5 text-[#E2B59A]/60">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="font-medium text-[#B77466] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}