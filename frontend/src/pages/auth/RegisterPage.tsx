import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { Input } from "../../components/ui/loginInput";
import { Button } from "../../components/ui/loginButton";
import { PasswordStrength } from "../../components/ui/PasswordStrength";
import { authService } from "../../services/auth";
import { formatPhoneWithMask, formatPhoneE164, extractPhoneDigits } from "../../utils/phoneMask";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    root?: string;
  }>({});

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneWithMask(e.target.value);
    setPhone(formatted);
    if (errors.phone) setErrors({ ...errors, phone: undefined });
    if (errors.root) setErrors({ ...errors, root: undefined });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Digite um email válido";
      isValid = false;
    }

    if (!phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
      isValid = false;
    } else {
      const digitsOnly = extractPhoneDigits(phone);
      if (digitsOnly.length < 10 || digitsOnly.length > 11) {
        newErrors.phone = "Digite um telefone válido com DDD";
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneE164: formatPhoneE164(phone),
        password,
      });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ root: error.message || "Falha ao registrar. Tente novamente." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-[440px] bg-background rounded-2xl border border-border shadow-xl relative z-10 overflow-hidden">
        {/* Header panel */}
        <div className="px-8 md:px-10 pt-8 pb-6 bg-gradient-to-br from-primary to-primary/80">
          <div className="flex flex-col items-center">
            <img src="/assets/participadf-branca.svg" alt="Logo Participa DF" className="h-12 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">Criar conta</h1>
            <p className="text-sm text-primary-foreground/80 mt-2 text-center">Cadastre-se para participar</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Error Alert */}
          {errors.root && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
              {errors.root}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                if (errors.root) setErrors({ ...errors, root: undefined });
              }}
              icon={<User className="h-4 w-4" />}
              error={errors.fullName}
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
                if (errors.root) setErrors({ ...errors, root: undefined });
              }}
              icon={<Mail className="h-4 w-4" />}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Telefone"
              type="tel"
              placeholder="(61) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              icon={<Phone className="h-4 w-4" />}
              error={errors.phone}
              disabled={isLoading}
              inputMode="numeric"
            />

            <div>
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  if (errors.root) setErrors({ ...errors, root: undefined });
                }}
                icon={<Lock className="h-4 w-4" />}
                endIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                onEndIconClick={() => setShowPassword(!showPassword)}
                error={errors.password}
                disabled={isLoading}
              />
              <PasswordStrength password={password} />
            </div>

            <Input
              label="Confirmar senha"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                if (errors.root) setErrors({ ...errors, root: undefined });
              }}
              icon={<Lock className="h-4 w-4" />}
              endIcon={showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              onEndIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
              Criar conta
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link to="/termos-de-uso" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/politica-de-privacidade" className="font-medium text-primary hover:text-primary/90 hover:underline transition-colors">
                Política de Privacidade
              </Link>
              .
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className={`font-semibold text-primary hover:text-primary/90 transition-colors focus:outline-none focus:underline ${isLoading ? "pointer-events-none opacity-50" : ""}`}
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
