import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Code2,
  Plus,
  ArrowLeft,
  FileCode,
  Pencil,
  Trash2,
  Zap,
  LogOut,
  ListChecks,
  Brain,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

interface Lesson {
  id: string;
  title: string;
  module_id: string | null;
  modules?: { title: string; courses?: { title: string } | null } | null;
}

interface Exercise {
  id: string;
  title: string;
  description: string | null;
  type: string;
  language: string | null;
  difficulty: number;
  xp_reward: number;
  starter_code: string | null;
  solution_code: string | null;
  lesson_id: string | null;
  lessons?: { title: string; modules?: { title: string; courses?: { title: string } | null } | null } | null;
}

const ManageExercises = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Filters
  const [filterCourseId, setFilterCourseId] = useState("");
  const [filterModuleId, setFilterModuleId] = useState("");
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("multiple_choice");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [xpReward, setXpReward] = useState(20);
  const [lessonId, setLessonId] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [solutionCode, setSolutionCode] = useState("");

  // Form filters
  const [formCourseId, setFormCourseId] = useState("");
  const [formModuleId, setFormModuleId] = useState("");
  const [formFilteredModules, setFormFilteredModules] = useState<Module[]>([]);
  const [formFilteredLessons, setFormFilteredLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  // Filter modules based on selected course
  useEffect(() => {
    if (filterCourseId) {
      setFilteredModules(modules.filter(m => m.course_id === filterCourseId));
    } else {
      setFilteredModules([]);
    }
    setFilterModuleId("");
  }, [filterCourseId, modules]);

  // Filter lessons based on selected module
  useEffect(() => {
    if (filterModuleId) {
      setFilteredLessons(lessons.filter(l => l.module_id === filterModuleId));
    } else {
      setFilteredLessons([]);
    }
  }, [filterModuleId, lessons]);

  // Form: Filter modules based on selected course
  useEffect(() => {
    if (formCourseId) {
      setFormFilteredModules(modules.filter(m => m.course_id === formCourseId));
    } else {
      setFormFilteredModules([]);
    }
    setFormModuleId("");
    setLessonId("");
  }, [formCourseId, modules]);

  // Form: Filter lessons based on selected module
  useEffect(() => {
    if (formModuleId) {
      setFormFilteredLessons(lessons.filter(l => l.module_id === formModuleId));
    } else {
      setFormFilteredLessons([]);
    }
    setLessonId("");
  }, [formModuleId, lessons]);

  const fetchData = async () => {
    try {
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title')
        .order('order_index');
      setCourses(coursesData || []);

      const { data: modulesData } = await supabase
        .from('modules')
        .select('id, title, course_id')
        .eq('is_active', true)
        .order('order_index');
      setModules(modulesData || []);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id, title, module_id, modules(title, courses(title))')
        .order('order_index');
      setLessons(lessonsData as Lesson[] || []);

      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*, lessons(title, modules(title, courses(title)))')
        .order('created_at', { ascending: false });
      setExercises(exercisesData as Exercise[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("multiple_choice");
    setLanguage("");
    setDifficulty(1);
    setXpReward(20);
    setLessonId("");
    setStarterCode("");
    setSolutionCode("");
    setFormCourseId("");
    setFormModuleId("");
    setEditingExercise(null);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setTitle(exercise.title);
    setDescription(exercise.description || "");
    setType(exercise.type);
    setLanguage(exercise.language || "");
    setDifficulty(exercise.difficulty);
    setXpReward(exercise.xp_reward);
    setLessonId(exercise.lesson_id || "");
    setStarterCode(exercise.starter_code || "");
    setSolutionCode(exercise.solution_code || "");

    // Find the lesson to get course and module
    const lesson = lessons.find(l => l.id === exercise.lesson_id);
    if (lesson) {
      const module = modules.find(m => m.id === lesson.module_id);
      if (module) {
        setFormCourseId(module.course_id);
        setFormFilteredModules(modules.filter(m => m.course_id === module.course_id));
        setFormModuleId(module.id);
        setFormFilteredLessons(lessons.filter(l => l.module_id === module.id));
      }
    }

    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lessonId) {
      toast({ title: "Erro", description: "Selecione uma aula", variant: "destructive" });
      return;
    }

    const exerciseData = {
      title,
      description,
      type,
      language: type === 'code' ? language : null,
      difficulty,
      xp_reward: xpReward,
      lesson_id: lessonId,
      starter_code: type === 'code' ? starterCode : null,
      solution_code: type === 'code' ? solutionCode : null,
    };

    try {
      if (editingExercise) {
        const { error } = await supabase
          .from('exercises')
          .update(exerciseData)
          .eq('id', editingExercise.id);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Exercício atualizado!" });
      } else {
        const { error } = await supabase
          .from('exercises')
          .insert(exerciseData);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Exercício criado!" });
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este exercício?")) return;

    try {
      const { error } = await supabase.from('exercises').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Sucesso", description: "Exercício excluído!" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  };

  const getTypeIcon = (exerciseType: string) => {
    switch (exerciseType) {
      case 'code': return <FileCode className="w-6 h-6 text-white" />;
      case 'logic': return <Brain className="w-6 h-6 text-white" />;
      default: return <ListChecks className="w-6 h-6 text-white" />;
    }
  };

  const getTypeLabel = (exerciseType: string) => {
    switch (exerciseType) {
      case 'code': return 'Código';
      case 'logic': return 'Lógica';
      default: return 'Múltipla Escolha';
    }
  };

  // Group exercises by lesson
  const exercisesByLesson = exercises.reduce((acc, exercise) => {
    const lessonTitle = exercise.lessons?.title || "Sem Aula";
    const moduleTitle = exercise.lessons?.modules?.title || "";
    const courseTitle = exercise.lessons?.modules?.courses?.title || "";
    const key = courseTitle && moduleTitle 
      ? `${courseTitle} > ${moduleTitle} > ${lessonTitle}` 
      : lessonTitle;
    if (!acc[key]) acc[key] = [];
    acc[key].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/teacher" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">Gerenciar Exercícios</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Exercícios</h1>
            <p className="text-muted-foreground">{exercises.length} exercícios cadastrados</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Exercício
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingExercise ? "Editar Exercício" : "Novo Exercício"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hierarchy Selection: Course > Module > Lesson */}
                <div className="p-4 rounded-lg bg-muted/30 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Vincular a uma Aula *</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Curso</Label>
                      <Select value={formCourseId} onValueChange={setFormCourseId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Módulo</Label>
                      <Select value={formModuleId} onValueChange={setFormModuleId} disabled={!formCourseId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Módulo" />
                        </SelectTrigger>
                        <SelectContent>
                          {formFilteredModules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>{module.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Aula *</Label>
                      <Select value={lessonId} onValueChange={setLessonId} disabled={!formModuleId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Aula" />
                        </SelectTrigger>
                        <SelectContent>
                          {formFilteredLessons.map((lesson) => (
                            <SelectItem key={lesson.id} value={lesson.id}>{lesson.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {formModuleId && formFilteredLessons.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Nenhuma aula neste módulo. <Link to="/teacher/lessons" className="text-primary underline">Crie uma aula primeiro.</Link>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                        <SelectItem value="code">Código</SelectItem>
                        <SelectItem value="logic">Lógica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    rows={3}
                    placeholder="Descreva o exercício..."
                  />
                </div>

                {type === 'code' && (
                  <>
                    <div className="space-y-2">
                      <Label>Linguagem</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a linguagem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="sql">SQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Código Inicial (Starter)</Label>
                      <Textarea 
                        value={starterCode} 
                        onChange={(e) => setStarterCode(e.target.value)} 
                        rows={4}
                        className="font-mono text-sm"
                        placeholder="# Código inicial para o aluno..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Solução</Label>
                      <Textarea 
                        value={solutionCode} 
                        onChange={(e) => setSolutionCode(e.target.value)} 
                        rows={4}
                        className="font-mono text-sm"
                        placeholder="# Solução correta..."
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dificuldade (1-5)</Label>
                    <Input 
                      type="number" 
                      value={difficulty} 
                      onChange={(e) => setDifficulty(Number(e.target.value))}
                      min={1}
                      max={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>XP de Recompensa</Label>
                    <Input 
                      type="number" 
                      value={xpReward} 
                      onChange={(e) => setXpReward(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-primary">
                    {editingExercise ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {Object.keys(exercisesByLesson).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(exercisesByLesson).map(([groupName, groupExercises]) => (
              <div key={groupName}>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">{groupName}</h2>
                  <Badge variant="secondary">{groupExercises.length}</Badge>
                </div>
                <div className="grid gap-3">
                  {groupExercises.map((exercise) => (
                    <Card key={exercise.id} className="glass border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                              {getTypeIcon(exercise.type)}
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{exercise.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {exercise.lessons?.title || "Sem aula vinculada"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{getTypeLabel(exercise.type)}</Badge>
                              {exercise.language && (
                                <Badge variant="secondary" className="bg-accent/10 text-accent">
                                  {exercise.language}
                                </Badge>
                              )}
                              <Badge variant="secondary" className="bg-xp/10 text-xp">
                                <Zap className="w-3 h-3 mr-1" />
                                {exercise.xp_reward} XP
                              </Badge>
                              <Badge variant="secondary">
                                Nível {exercise.difficulty}
                              </Badge>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(exercise)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(exercise.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="glass border-border/50">
            <CardContent className="p-8 text-center">
              <FileCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum exercício cadastrado. Clique em "Novo Exercício" para começar.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ManageExercises;