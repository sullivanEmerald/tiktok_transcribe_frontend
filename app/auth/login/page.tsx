"use client"
import Input from "@/components/genreral/Input";
import Button from "@/components/genreral/Button";
import Link from "next/link";
import { useState } from "react";
import { emailPattern } from "@/data/constants";
import { useRouter } from "next/navigation";
import { showToaster } from "@/lib/utils";
import LineLoader from "@/components/genreral/lineLoader";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/services/auth";
import { useStore } from "@/stores/store";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { userlogin } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const refreshUser = useStore(
        (state) => state.refreshUser
    );

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'email') {
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!emailPattern.test(value.trim())) {
                error = 'Please enter a valid email address';
            }
        } else if (name === 'password') {
            if (!value.trim()) {
                error = 'Password is required';
            }
        };
        return error;
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    // Validate all fields
    const validateAll = () => {
        const newErrors: typeof errors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((e) => !e);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitting(true);
        try {
            if (validateAll()) {
                await login({ ...formData })
                await refreshUser();
                showToaster("Login successful", "success");
                router.push('/dashboard')

            }
        } catch (error: any) {
            console.error(error || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full py-12 px-4 flex flex-col items-center justify-center">
            <h2 className="text-2xl text-foreground font-bold text-black mb-2">Welcome Back</h2>
            <p className="text-muted-foreground mb-6">Please enter your credentials to continue</p>
            <form className="space-y-6 w-full md:w-[80%]" onSubmit={handleSubmit}>
                <div className="relative ">
                    <Input
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                </div>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        className=""
                        required
                        placeholder="Enter your password"
                    />

                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-12 transform -translate-y-1/2 text-muted-foreground focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>

                    <Link href="/auth/forgot-password" className="text-sm text-primary absolute right-0 top-0 mt-1 hover:underline">
                        Forgot Password?
                    </Link>
                    {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password}</span>}
                </div>
                <div className="">
                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? <div className="flex items-center justify-center gap-2"><LineLoader /> <span>Logging in...</span></div> : "Login"}
                    </Button>
                </div>
                {/* Google Authentication here */}
                <div className="flex items-center justify-center gap-2 my-4 w-full ">
                    <div className="w-full border-t border-gray-600" />
                    <span className="text-muted-foreground text-lg">or</span>
                    <div className="w-full border-t border-gray-600" />
                </div>

                <Button
                    type="button"
                    className="w-full bg-white text-black hover:bg-gray-100 border border-gray-300 flex items-center justify-center gap-2"
                    onClick={userlogin}
                >
                    Continue with Google
                </Button>
            </form>
            <p className="text-center text-muted-foreground pt-2">Don't have an account? <Link href="/auth/register" className="text-primary text-bold">Create one</Link></p>
        </div>
    );
}