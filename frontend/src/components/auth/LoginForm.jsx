import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function LoginForm() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-[#FFE1AF]">
            <Card className="w-full max-w-md bg-[#2A2A2A]/70 border-[#B77466]/30 text-[#FFE1AF] shadow-xl rounded-2xl">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-3xl font-semibold text-[#E2B59A]">
                        AuthenX
                    </CardTitle>
                    <p className="text-sm text-[#E2B59A]/70 mt-1">
                        Welcome back! Please login to your account.
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        {/* Email */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FFE1AF]">Email</label>
                            <Input
                                {...register("email", { required: true })}
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#1A1A1A] border-[#B77466]/30 text-[#FFE1AF] placeholder-[#E2B59A]/50 focus:border-[#B77466]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs mb-1 text-[#FFE1AF]">Password</label>
                            <Input
                                {...register("password", { required: true })}
                                type="password"
                                placeholder="Enter your password"
                                className="bg-[#1A1A1A] border-[#B77466]/30 text-[#FFE1AF] placeholder-[#E2B59A]/50 focus:border-[#B77466]"
                            />
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="w-full mt-3 bg-[#B77466] text-[#1A1A1A] hover:bg-[#E2B59A] transition font-medium"
                        >
                            Login
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="h-px flex-1 bg-[#957C62]/20"></div>
                        <span className="text-xs text-[#E2B59A]/60">or</span>
                        <div className="h-px flex-1 bg-[#957C62]/20"></div>
                    </div>

                    {/* Google Login */}
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
                        Don’t have an account?{" "}
                        <Link
                            to="/auth/signup"
                            className="font-medium text-[#B77466] hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
