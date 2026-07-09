"use client"
import Input from "@/components/genreral/Input";
import Button from "@/components/genreral/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { phonePattern, validNamePattern, emailPattern, validatePassword } from "@/data/constants";
import { register } from "@/services/auth";
import LineLoader from "@/components/genreral/lineLoader";
import { showToaster } from "@/lib/utils";


export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [submitting, setSubmitting] = useState(false);


    // Validate a single field
    const validateField = (name: string, value: string) => {
        let error = '';
        if (name === 'firstName') {
            if (!value.trim()) {
                error = 'First name is required';
            } else if (!validNamePattern.test(value.trim())) {
                error = 'First name cannot contain special characters';
            }
        } else if (name === 'lastName') {
            if (!value.trim()) {
                error = 'Last name is required';
            } else if (!validNamePattern.test(value.trim())) {
                error = 'Last name cannot contain special characters';
            }
        } else if (name === 'email') {
            if (!value) {
                error = 'Email is required';
            } else if (!emailPattern.test(value)) {
                error = 'Please enter a valid email address';
            }
        } else if (name === 'phoneNumber') {
            if (!value) {
                error = 'Phone number is required';
            } else if (!phonePattern.test(value)) {
                error = 'Please enter a valid phone number';
            }
        } else if (name === 'password') {
            error = validatePassword(value);
        } else if (name === 'confirmPassword') {
            if (value !== form.password) {
                error = 'Passwords do not match';
            }
        }
        return error;
    };

    // Validate all fields
    const validateAll = () => {
        const newErrors: typeof errors = {
            firstName: validateField('firstName', form.firstName),
            lastName: validateField('lastName', form.lastName),
            email: validateField('businessEmail', form.email),
            phoneNumber: validateField('phoneNumber', form.phoneNumber),
            password: validateField('password', form.password),
            confirmPassword: validateField('confirmPassword', form.confirmPassword || ''),
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((e) => !e);
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (validateAll()) {
                const { confirmPassword, ...registerData } = form;
                const response = await register({ ...registerData });
                setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    confirmPassword: "",
                });
                console.log(response)
                showToaster('Registration successful. Continue with email verification')
                router.replace(`/auth/verify`);
                console.log('Registration successful:',);
            } else {
                setSubmitting(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="w-full mx-auto md:w-[90%]">
            <div className="mb-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-background">
                    Welcome to Clip Script.
                </h2>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                    <Input
                        id="firstName"
                        name="firstName"
                        label="first Name"
                        type="text"
                        autoComplete="given-name"
                        required
                        placeholder="Enter your first name"
                        value={form.firstName}
                        onChange={handleChange}
                        aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName}</span>}
                </div>
                <div>
                    <Input
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        autoComplete="family-name"
                        required
                        placeholder="Enter your last name"
                        value={form.lastName}
                        onChange={handleChange}
                        aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName}</span>}
                </div>
                <div>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        label="Email"
                        required
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                </div>
                <div>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        autoComplete="family-name"
                        required
                        placeholder="Enter your phone number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        aria-invalid={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && <span className="text-xs text-red-500 mt-1 block">{errors.phoneNumber}</span>}
                </div>
                <div>
                    <Input
                        id="password"
                        name="password"
                        label="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        aria-invalid={!!errors.password}
                    />
                    {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password}</span>}
                </div>
                <div>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="Confirm your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        aria-invalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword}</span>}
                </div>
                <div className="w-full flex">
                    <Button type="submit" disabled={submitting} className="w-full mx-auto self-end">
                        {submitting ? <LineLoader /> : 'Create Account'}
                    </Button>
                </div>
            </form>
            <p className="text-center text-muted-foreground pt-2 mb-6">Already have an account? <Link href="/auth/login" className="text-red-500 underline">Login</Link></p>
        </div>
    );
}