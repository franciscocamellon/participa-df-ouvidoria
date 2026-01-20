import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Check, Eye, EyeOff } from "lucide-react";
import { Input } from "../../components/ui/loginInput";
import { Button } from "../../components/ui/loginButton";
import { authService } from "@/services/auth.ts";

const AgentLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("joao@softkit.local");
  const [password, setPassword] = useState("Joao@123!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; root?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Digite um email válido";

    if (!password) newErrors.password = "Senha é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({ email, password, rememberMe });

      // Verify if user has AGENT role
      if (response.user.role !== "AGENT" && response.user.role !== "ADMIN") {
        setErrors({ root: "Acesso restrito a agentes públicos." });
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.errors) setErrors(error.errors);
      else setErrors({ root: error.message || "Falha ao entrar. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full max-w-[440px] bg-background rounded-2xl border border-border shadow-xl relative z-10 overflow-hidden">
        {/* Header panel */}
        <div className="px-8 md:px-10 pt-8 pb-6 bg-gradient-to-br from-primary to-primary/80">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <img src="/assets/participadf-branca.svg" alt="Logo" className="h-9 w-auto mb-3 drop-shadow-sm"/>
            </div>
            <h1 className="text-2xl font-bold text-accent-foreground tracking-tight">Portal do Agente</h1>
            <p className="text-sm text-accent-foreground/80 mt-2 text-center">Acesso restrito a servidores públicos</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Error Alert */}
          {errors.root && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
              {errors.root}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email institucional"
              type="email"
              placeholder="servidor@gdf.gov.br"
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
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
                if (errors.root) setErrors({ ...errors, root: undefined });
              }}
              icon={<Lock className="h-4 w-4" />}
              endIcon={showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              onEndIconClick={() => setShowPassword(!showPassword)}
              error={errors.password}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <div
                    className={`
                      w-5 h-5 border-2 rounded transition-all duration-200
                      ${
                        rememberMe
                          ? "bg-accent border-accent"
                          : "bg-background border-border group-hover:border-accent/60"
                      }
                    `}
                  >
                    <Check
                      className={`
                        h-3.5 w-3.5 text-accent-foreground absolute top-0.5 left-0.5 transition-transform duration-200
                        ${rememberMe ? "scale-100" : "scale-0"}
                      `}
                    />
                  </div>
                </div>
                <span className="ml-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Lembre-me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className={`text-sm font-medium text-accent hover:text-accent/90 hover:underline focus:outline-none ${
                  isLoading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 bg-accent hover:bg-accent/90">
              Entrar como Agente
            </Button>
          </form>

          {/* Citizen Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              É cidadão?{" "}
              <Link
                to="/login"
                className={`font-semibold text-primary hover:text-primary/90 transition-colors focus:outline-none focus:underline ${
                  isLoading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Acessar portal do cidadão
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLoginPage;
