import { Mail, Loader2, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { verifyUser } from "@/redux/features/authThunks";

const VerifyEmail = () => {
    const { token } = useParams({ from: "/auth/verify/$token" });
    const dispatch = useAppDispatch();
    const { success, isLoading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (token) dispatch(verifyUser(token));
    }, [token, dispatch]);

    // 🌀 Loading State
    if (isLoading)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1A1A] text-[#FFE1AF]">
                <Loader2 className="w-10 h-10 text-[#B77466] animate-spin" />
                <p className="text-[#E2B59A]/70 mt-4 text-sm">
                    Verifying your email address... Please wait a moment.
                </p>
            </div>
        );

    // ❌ Error State
    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#1A1A1A] text-[#FFE1AF] px-4">
                <Card className="max-w-md w-full bg-[#2A2A2A]/80 border-[#B77466]/30 rounded-2xl text-center p-8 shadow-lg">
                    <CardContent className="flex flex-col items-center gap-4">
                        <XCircle className="w-12 h-12 text-red-500" />
                        <p className="text-[#E2B59A] font-semibold text-lg">
                            Verification Failed!
                        </p>
                        <p className="text-[#E2B59A]/70 text-sm max-w-sm">
                            The verification link might be expired or invalid. Please try
                            requesting a new one.
                        </p>
                        <Link to="/auth/resend-email" className="w-full mt-3">
                            <Button className="w-full bg-[#B77466] text-[#1A1A1A] hover:bg-[#E2B59A] transition">
                                Resend Verification Email
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );

    // ✅ Success State
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1A1A1A] text-[#FFE1AF] px-4">
            <Card className="max-w-md w-full bg-[#2A2A2A]/80 border-[#B77466]/30 rounded-2xl text-center p-8 shadow-lg">
                <CardContent className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <p className="text-[#E2B59A] font-semibold text-lg">
                        Email Verified Successfully!
                    </p>
                    <p className="text-[#E2B59A]/70 text-sm max-w-sm">
                        You can now log in and start exploring all the features of AuthenX.
                    </p>
                    <Link to="/auth/login" className="w-full mt-3">
                        <Button className="w-full bg-[#B77466] text-[#1A1A1A] hover:bg-[#E2B59A] transition">
                            Go to Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmail;

