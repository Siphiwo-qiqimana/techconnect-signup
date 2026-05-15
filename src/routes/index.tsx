import { createFileRoute } from "@tanstack/react-router";
import { useState, FormEvent, ChangeEvent } from "react";
import { User, AtSign, IdCard, Lock, GraduationCap, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Sign Up — TechConnect Academy" },
      { name: "description", content: "Join TechConnect Academy and master coding and digital skills with hands-on courses built for the modern web." },
    ],
  }),
});

type FormData = {
  name: string;
  surname: string;
  email: string;
  idNumber: string;
  password: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const initial: FormData = { name: "", surname: "", email: "", idNumber: "", password: "" };

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.surname.trim()) errors.surname = "Surname is required.";

  if (!data.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address.";

  if (!data.idNumber.trim()) errors.idNumber = "South African ID number is required.";
  else if (!/^\d{13}$/.test(data.idNumber)) errors.idNumber = "ID number must be exactly 13 digits.";

  if (!data.password) errors.password = "Password is required.";
  else {
    const issues: string[] = [];
    if (data.password.length < 8) issues.push("at least 8 characters");
    if (!/[A-Z]/.test(data.password)) issues.push("one uppercase letter");
    if (!/\d/.test(data.password)) issues.push("one number");
    if (issues.length) errors.password = `Password must contain ${issues.join(", ")}.`;
  }

  return errors;
}

function SignupPage() {
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (key: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setData((d) => ({ ...d, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setSuccess(true);
      setData(initial);
    }
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left — branding */}
        <section className="hidden lg:block text-white space-y-6 px-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium">
            <GraduationCap className="w-4 h-4" /> TechConnect Academy
          </div>
          <h1 className="font-[var(--font-display)] text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
            Build the skills that build the future.
          </h1>
          <p className="text-lg text-white/85 max-w-md">
            Join thousands of learners mastering coding, design, and digital fluency through hands-on,
            project-driven courses.
          </p>
          <ul className="space-y-3 text-white/90">
            {["Live mentorship & community", "Industry-recognised certificates", "Learn at your own pace"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Right — card */}
        <section
          className="bg-card rounded-2xl p-6 sm:p-10"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {success ? (
            <SuccessMessage onReset={() => setSuccess(false)} />
          ) : (
            <>
              <header className="mb-8 text-center lg:text-left">
                <div className="lg:hidden inline-flex items-center gap-2 mb-3 text-primary font-semibold">
                  <GraduationCap className="w-5 h-5" /> TechConnect Academy
                </div>
                <h2 className="font-[var(--font-display)] text-3xl font-bold text-foreground">
                  Create your account
                </h2>
                <p className="text-muted-foreground mt-2">Start learning in minutes — it's free to join.</p>
              </header>

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={<User className="w-4 h-4" />} label="Name" id="name"
                    value={data.name} onChange={onChange("name")} error={errors.name} placeholder="Thandi" />
                  <Field icon={<User className="w-4 h-4" />} label="Surname" id="surname"
                    value={data.surname} onChange={onChange("surname")} error={errors.surname} placeholder="Mokoena" />
                </div>

                <Field icon={<AtSign className="w-4 h-4" />} label="Email address" id="email" type="email"
                  value={data.email} onChange={onChange("email")} error={errors.email} placeholder="you@example.com" />

                <Field icon={<IdCard className="w-4 h-4" />} label="South African ID number" id="idNumber"
                  value={data.idNumber} onChange={onChange("idNumber")} error={errors.idNumber}
                  placeholder="13-digit ID" inputMode="numeric" maxLength={13} />

                <Field icon={<Lock className="w-4 h-4" />} label="Password" id="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password} onChange={onChange("password")} error={errors.password}
                  placeholder="Min 8 chars, 1 uppercase, 1 number" />

                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-4 h-4 accent-[var(--primary)]"
                  />
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Show password
                </label>

                <button
                  type="submit"
                  className="group w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:translate-y-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Create account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <p className="text-center text-sm text-muted-foreground pt-2">
                  Already have an account? <a href="#" className="text-primary font-medium hover:underline">Sign in</a>
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  icon, label, id, error, ...props
}: {
  icon: React.ReactNode;
  label: string;
  id: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className={`relative flex items-center rounded-xl border bg-background transition-all
        ${error ? "border-destructive ring-2 ring-destructive/20" : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"}`}>
        <span className="pl-3.5 text-muted-foreground">{icon}</span>
        <input
          id={id}
          {...props}
          className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none rounded-xl"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
      <div
        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
      </div>
      <h2 className="font-[var(--font-display)] text-3xl font-bold text-foreground mb-2">
        Welcome aboard! 🎉
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Your TechConnect Academy account has been created. Check your inbox to verify your email and start learning.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        Register another account
      </button>
    </div>
  );
}
