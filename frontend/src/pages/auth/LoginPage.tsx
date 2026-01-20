import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Check, Eye, EyeOff } from "lucide-react";
import { Input } from "../../components/ui/loginInput";
import { Button } from "../../components/ui/loginButton";
import { Tooltip } from "../../components/ui/loginTooltip";
import { authService } from "../../services/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("maria@softkit.local");
  const [password, setPassword] = useState("Maria@123!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isGovBrLoading, setIsGovBrLoading] = useState(false);

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

  const handleSocialLogin = async (provider: "google" | "github" | "govbr") => {
    const setLoading =
      provider === "google" ? setIsGoogleLoading : provider === "github" ? setIsGithubLoading : setIsGovBrLoading;

    setLoading(true);

    try {
      const { url } = await authService.getSocialLoginUrl(provider as any);
      window.location.href = url;
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      setErrors({ root: `Falha ao iniciar login com ${provider}. Tente novamente.` });
      setLoading(false);
    }
  };

  const disableAll = isLoading || isGoogleLoading || isGithubLoading || isGovBrLoading;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background kept subtle (same bg as page) */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Main Card Container (same bg as page) */}
      <div className="w-full max-w-[440px] bg-background rounded-2xl border border-border shadow-xl relative z-10 overflow-hidden">
        {/* Dark header panel to highlight white logo */}
        <div className="px-8 md:px-10 pt-8 pb-6 bg-gradient-to-br from-primary to-primary/80">
          <div className="flex flex-col items-center">
            <img src="/assets/participadf-branca.svg" alt="Logo" className="h-9 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">Bem vindo Cidadão</h1>
            <p className="text-sm text-primary-foreground/80 mt-2 text-center">Digite suas credenciais para entrar</p>
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
              label="Email"
              type="email"
              placeholder="email@empresa.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
                if (errors.root) setErrors({ ...errors, root: undefined });
              }}
              icon={<Mail className="h-4 w-4" />}
              error={errors.email}
              disabled={disableAll}
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
              disabled={disableAll}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={disableAll}
                  />
                  <div
                    className={`
                      w-5 h-5 border-2 rounded transition-all duration-200
                      ${
                        rememberMe
                          ? "bg-primary border-primary"
                          : "bg-background border-border group-hover:border-primary/60"
                      }
                    `}
                  >
                    <Check
                      className={`
                        h-3.5 w-3.5 text-primary-foreground absolute top-0.5 left-0.5 transition-transform duration-200
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
                className={`text-sm font-medium text-primary hover:text-primary/90 hover:underline focus:outline-none ${
                  disableAll ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={isGoogleLoading || isGithubLoading || isGovBrLoading}
              className="mt-2"
            >
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground text-xs uppercase tracking-wider font-medium">
                Ou
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <Tooltip content="Entrar com sua conta gov.br">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => handleSocialLogin("govbr")}
                isLoading={isGovBrLoading}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
              >
                <span className="inline-flex items-center">
                  Entrar com
                  {!isGovBrLoading && (
                    <img
                      src="https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png"
                      alt="gov.br"
                      className="h-4 w-auto ml-2"
                    />
                  )}
                </span>
              </Button>
            </Tooltip>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="mb-1 text-sm text-muted-foreground">
              <Link
                to="/"
                className={`font-semibold text-primary hover:text-primary/90 transition-colors focus:outline-none focus:underline ${
                  disableAll ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Seguir sem se logar
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className={`font-semibold text-primary hover:text-primary/90 transition-colors focus:outline-none focus:underline ${
                  disableAll ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Registrar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
