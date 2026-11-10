import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField } from "@/components/shared/FormField";
import { Alert } from "@/components/ui/alert/Alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { toast } from "@/components/ui/toast/Toaster";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels, roles } from "@/lib/permissions";
import type { Role } from "@/types/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Use at least 6 characters"),
  role: z.enum(["super_admin", "admin", "manager", "staff"]),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "alex@travel.test", password: "", role: "super_admin" },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // pretend to call the API
    login(values.role as Role);
    toast.success("Signed in");
  };

  // Already signed in (or just signed in): continue to where the user was headed.
  if (user) return <Navigate to={from} replace />;

  return (
    <AuthLayout>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-foreground-muted">Sign in to manage bookings, tours and customers.</p>
      </div>

      <Alert variant="info" title="Demo sign-in">
        Any valid email and a password of 6+ characters works. Pick a role to test what each one can see. Real
        authentication arrives in Phase 10.
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField id="login-email" label="Email" required error={errors.email?.message}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            leadingIcon={<Mail />}
            invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
        </FormField>

        <FormField id="login-password" label="Password" required error={errors.password?.message}>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            leadingIcon={<Lock />}
            invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
          />
        </FormField>

        <FormField id="login-role" label="Demo role">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                id="login-role"
                value={field.value}
                onValueChange={field.onChange}
                options={roles.map((r) => ({ value: r, label: roleLabels[r] }))}
              />
            )}
          />
        </FormField>

        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}