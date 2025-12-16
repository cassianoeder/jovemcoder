import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  Star,
} from "lucide-react";

/**
 * Landing Page – Mobile First
 * - Layout pensado primeiro para dispositivos pequenos
 * - CTA principal priorizado no mobile
 * - Terminal responsivo sem overflow
 * - Mantém lógica, estrutura e identidade visual
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-background dark">

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-border/50 bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 64 64"
                className="w-5 h-5 text-primary-foreground fill-current"
              >
                <path d="M32 4c6 0 11 5 11 11s-5 11-11 11S21 21 21 15 26 4 32 4zm0 26c-9 0-18 4-18 12v6h36v-6c0-8-9-12-18-12z" />
              </svg>
            </div>
            <span className="font-display text-base sm:text-lg font-bold text-foreground">
              Jovem<span className="text-primary">Coder</span>
            </span>
          </Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Link to="/auth" className="hidden md:block">
              <Button
                variant="ghost"
                className="border border-border text-foreground hover:bg-muted"
              >
                Entrar
              </Button>
            </Link>

            <Link to="/auth?mode=register">
              <Button className="px-4 py-2 text-sm sm:px-6 sm:text-base">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">

          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Aprenda programação
            <br />
            <span className="text-primary">com prática e propósito</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Python, lógica e sistemas reais em uma plataforma gamificada,
            objetiva e focada em evolução contínua.
          </p>

          {/* CTA */}
          <div className="flex justify-center mb-14 px-2">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 py-5 text-base sm:text-lg"
              >
                Começar agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* TERMINAL */}
          <div className="max-w-full sm:max-w-2xl mx-auto text-left p-4 sm:p-6 rounded-xl bg-muted border border-border font-mono text-xs sm:text-sm text-muted-foreground overflow-x-auto">
            <pre className="whitespace-pre-wrap break-words">{`def start():
    student = "Aluno"
    level = 1
    print(f"Bem-vindo, {student}")
    print(f"Nível atual: {level}")

start()`}</pre>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-20 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl text-center">
          {[
            { icon: Users, value: "10+", label: "Alunos" },
            { icon: BookOpen, value: "50+", label: "Exercícios" },
            { icon: Trophy, value: "50+", label: "Conquistas" },
            { icon: Star, value: "4.9", label: "Avaliação" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-border p-4 sm:p-6 bg-background"
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center border border-border rounded-2xl p-8 sm:p-12 bg-background">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Comece hoje
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Uma plataforma simples, direta e feita para quem quer evoluir.
          </p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="px-8 py-5 text-base sm:text-lg">
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          © 2026 JovemCoder — Ederson Wermeier
        </div>
      </footer>
    </div>
  );
};

export default Landing;
