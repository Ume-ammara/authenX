import { Link } from "@tanstack/react-router";
import { Moon } from "lucide-react";

export function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-500 bg-[#1A1A1A] text-[#FFE1AF]">
            {/* Header */}
            <header className="absolute top-6 left-8 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#B77466]"></div>
                <span className="text-lg font-semibold tracking-wide text-[#E2B59A]">
                    AuthenX
                </span>
            </header>

            {/* Dark mode icon (no functionality) */}
            <button
                disabled
                className="absolute top-6 right-8 p-2 rounded-full cursor-default opacity-80"
            >
                <Moon className="w-5 h-5 text-[#FFE1AF]" />
            </button>

            {/* Hero Section */}
            <main className="text-center mt-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#FFE1AF]">
                    Simple. Secure. Seamless.
                </h1>
                <p className="text-base max-w-xl mx-auto mb-6 leading-relaxed text-[#E2B59A]/80">
                    AuthenX makes authentication effortless — built with modern APIs,
                    secure tokens, and a developer-first experience.
                </p>

                <Link
                    to="/auth/login"
                    className="inline-flex items-center gap-2 font-medium px-5 py-2.5 rounded-md shadow-md transition bg-[#B77466] text-[#1A1A1A] hover:bg-[#E2B59A]"
                >
                    Get Started →
                </Link>
            </main>

            {/* Features Section */}
            <section className="mt-20 max-w-6xl w-full text-center px-6">
                <h3 className="text-2xl font-semibold mb-10 text-[#FFE1AF]">
                    Why Choose AuthenX?
                </h3>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Email Verification",
                            desc: "Ensure user authenticity with tokenized email verification links that protect against spam and unauthorized access.",
                            icon: "📧",
                        },
                        {
                            title: "Session Management",
                            desc: "Maintain secure and persistent sessions using HTTP-only cookies for safer logins and smoother user experiences.",
                            icon: "🧠",
                        },
                        {
                            title: "Data Validation",
                            desc: "All inputs are strictly validated on both client and server sides to prevent malicious data and injection attacks.",
                            icon: "🧩",
                        },
                        {
                            title: "Role-Based Access Control",
                            desc: "Manage permissions smartly — assign roles and control user access for a secure and scalable authorization flow.",
                            icon: "🛡️",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-lg border border-[#B77466]/30 bg-[#2A2A2A]/70 hover:bg-[#2A2A2A]/90 transition"
                        >
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h4 className="text-lg font-semibold mb-2 text-[#B77466]">
                                {feature.title}
                            </h4>
                            <p className="text-sm text-[#E2B59A]/90 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 text-sm opacity-80 border-t border-[#957C62]/30 pt-4 pb-3 w-full text-center text-[#E2B59A]">
                Crafted with ❤️ by{" "}
                <span className="font-medium text-[#B77466]">Um-e-Amara</span> | © 2025
                AuthenX
            </footer>
        </div>
    );
}
