import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Input } from "../../components/ui/loginInput";
import { Button } from "../../components/ui/loginButton";
import { PasswordStrength } from "../../components/ui/PasswordStrength";
import { authService } from "../../services/auth";

const NewPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    root?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

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

    if (!token) {
      newErrors.root = "Token de redefinição inválido ou ausente.";
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
      await authService.resetPassword({ token, password });
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Password reset failed:", error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ root: error.message || "Falha ao redefinir senha." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="w-full max-w-[440px] bg-background rounded-2xl border border-border shadow-xl relative z-10 p-8 md:p-10 text-center">
          <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Senha redefinida</h2>
          <p className="text-muted-foreground mb-8">
            Sua senha foi redefinida com sucesso. Você já pode entrar com a nova senha.
          </p>
          <Link to="/login">
            <Button fullWidth>Voltar ao login</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <div className="h-12 w-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center mb-3">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">Nova senha</h1>
            <p className="text-sm text-primary-foreground/80 mt-2 text-center">
              Crie uma senha diferente das anteriores
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Error Alert */}
          {errors.root && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
              {errors.root}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Nova senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
              placeholder="••••••••"
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
              Redefinir senha
            </Button>
          </form>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className={`text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none ${isLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
