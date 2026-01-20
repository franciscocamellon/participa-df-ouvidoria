import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { Input } from "../../components/ui/loginInput";
import { Button } from "../../components/ui/loginButton";
import { authService } from "../../services/auth";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Algo deu errado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="w-full max-w-[440px] bg-background rounded-2xl border border-border shadow-xl relative z-10 overflow-hidden">
        {/* Header panel */}
        <div className="px-8 md:px-10 pt-8 pb-6 bg-gradient-to-br from-primary to-primary/80">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center mb-3">
              <KeyRound className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">Esqueceu a senha?</h1>
            <p className="text-sm text-primary-foreground/80 mt-2 text-center">Enviaremos instruções para redefinir</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <Link
            to="/login"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Voltar ao login
          </Link>

          {!isSubmitted ? (
            <>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  icon={<Mail className="h-4 w-4" />}
                  required
                  disabled={isLoading}
                />

                <Button type="submit" fullWidth isLoading={isLoading}>
                  Enviar instruções
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Verifique seu email</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Enviamos um link de redefinição para <span className="font-medium text-foreground">{email}</span>
              </p>
              <div className="space-y-4">
                <div className="block w-full">
                  <Link to="/login">
                    <Button fullWidth variant="outline">
                      Voltar ao login
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Para fins de demonstração:</p>
                  <button
                    type="button"
                    onClick={() => navigate("/reset-password?token=demo-token")}
                    className="text-xs text-primary hover:text-primary/90 hover:underline font-medium"
                  >
                    Clique aqui para simular a abertura do link do email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
