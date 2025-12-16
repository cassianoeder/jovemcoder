import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Zap, Target, BookOpen, ArrowRight, Star } from "lucide-react";

/**
 * Landing Page – versão clean e discreta
 * - Mantém a mesma lógica e estrutura
 * - Reduz excesso de gradientes, sombras e animações agressivas
 * - Prioriza tipografia, espaçamento e contraste
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-background dark">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-border/50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-5 h-5 text-primary-foreground fill-current">
                <path d="M32 4c6 0 11 5 11 11s-5 11-11 11S21 21 21 15 26 4 32 4zm0 26c-9 0-18 4-18 12v6h36v-6c0-8-9-12-18-12z"/>
              </svg>
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Jovem<span className="text-primary">Coder</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/auth?mode=register">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">

          <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Aprenda programação
            <br />
            <span className="text-primary">com prática e propósito</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Python, lógica e sistemas reais em uma plataforma gamificada, objetiva e focada em evolução contínua.
          </p>

          <div className="flex justify-center mb-16">
            <Link to="/auth?mode=register">
              <Button size="lg" className="px-10 py-6 text-lg">
                Começar agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Terminal */}
          <div className="max-w-2xl mx-auto text-left p-6 rounded-xl bg-muted border border-border font-mono text-sm text-muted-foreground">
            <pre className="whitespace-pre">{`def start():
    student = "Aluno"
    level = 1
    print(f"Bem-vindo, {student}")
    print(f"Nível atual: {level}")

start()`}</pre>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-24 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl text-center">
          {[{ icon: Users, value: "10+", label: "Alunos" },{ icon: BookOpen, value: "50+", label: "Exercícios" },{ icon: Trophy, value: "50+", label: "Conquistas" },{ icon: Star, value: "4.9", label: "Avaliação" }].map((stat, i) => (
            <div key={i} className="rounded-xl border border-border p-6 bg-background">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Por que JovemCoder?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Aprendizado progressivo, gamificado e focado em prática real.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ icon: Zap, title: "XP e níveis", desc: "Progresso visível" },{ icon: Target, title: "Missões", desc: "Objetivos claros" },{ icon: Trophy, title: "Conquistas", desc: "Motivação contínua" },{ icon: Users, title: "Ranking", desc: "Competição saudável" },{ icon: BookOpen, title: "Prática real", desc: "Código de verdade" }].map((f, i) => (
              <div key={i} className="rounded-xl border border-border p-6 bg-background">
                <f.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center border border-border rounded-2xl p-12 bg-background">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Comece hoje</h2>
          <p className="text-muted-foreground mb-8">Uma plataforma simples, direta e feita para quem quer evoluir.</p>
          <Link to="/auth?mode=register">
            <Button size="lg" className="px-10 py-6 text-lg">Criar conta grátis</Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2026 JovemCoder — Ederson Wermeier
        </div>
      </footer>
    </div>
  );
};

export default Landing;
